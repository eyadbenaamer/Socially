import { Types } from "mongoose";
import Conversation from "../models/conversation.js";
import User from "../models/user.js";

import { getServerSocketInstance } from "../socket/socketServer.js";
import { getOnlineUsers } from "../socket/onlineUsers.js";
import { handleError } from "../utils/errorHandler.js";

const { ObjectId } = Types;

export const getAll = async (req, res) => {
  try {
    const { user } = req;
    let { page } = req.query;
    if (!page) {
      page = 1;
    }

    let conversations = await Conversation.aggregate([
      {
        $match: {
          participants: { $elemMatch: { _id: user._id } },
        },
      },
      {
        $addFields: {
          unreadMessagesCount: {
            $arrayElemAt: [
              {
                $filter: {
                  input: "$participants",
                  as: "participant",
                  cond: { $eq: ["$$participant._id", user._id] },
                },
              },
              0,
            ],
          },
        },
      },
      {
        $project: {
          _id: 1,
          participants: { _id: 1 },
          unreadMessagesCount: {
            $ifNull: ["$unreadMessagesCount.unreadMessagesCount", 0],
          },
          messages: {
            $slice: [
              {
                $filter: {
                  input: "$messages",
                  as: "message",
                  cond: {
                    $anyElementTrue: {
                      $map: {
                        input: "$$message.to",
                        as: "to",
                        in: {
                          $eq: ["$$to._id", user._id],
                        },
                      },
                    },
                  },
                },
              },
              1,
            ],
          },
          updatedAt: 1,
        },
      },
      {
        $sort: {
          updatedAt: -1,
        },
      },
    ]);

    conversations = conversations.slice((page - 1) * 10, page * 10);
    return res.status(200).json(conversations);
  } catch (err) {
    return handleError(err, res);
  }
};

export const getOne = async (req, res) => {
  try {
    let { page, conversationId } = req.query;
    const { user } = req;

    page = parseInt(page);
    page = page ? page : 1;

    const conversation = await Conversation.aggregate([
      {
        $match: {
          _id: new ObjectId(conversationId),
          participants: { $elemMatch: { _id: user._id } },
        },
      },
      {
        $project: {
          _id: 1,
          participants: 1,
          updatedAt: 1,
          messages: {
            $slice: [
              {
                $filter: {
                  input: "$messages",
                  as: "message",
                  cond: {
                    $anyElementTrue: {
                      $map: {
                        input: "$$message.to",
                        as: "to",
                        in: {
                          $eq: ["$$to._id", user._id],
                        },
                      },
                    },
                  },
                },
              },
              (page - 1) * 10,
              10,
            ],
          },
        },
      },
      {
        $sort: {
          updatedAt: -1,
        },
      },
    ]);
    return res.status(200).json(...conversation);
  } catch (err) {
    return handleError(err, res);
  }
};

export const setRead = async (req, res) => {
  try {
    const { user, conversation } = req;

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found." });
    }

    let index = 0;
    const messagesInfo = [];
    while (true) {
      const message = conversation.messages[index];
      if (!message) {
        user.unreadMessagesCount -= index;
        await user.save();
        break;
      }
      const isRead = Boolean(message.info.readBy.id(user.id));
      if (!isRead) {
        message.info.readBy.addToSet(user.id);
        conversation.participants.id(user.id).unreadMessagesCount -= 1;
        messagesInfo.push({ _id: message.id, info: message.info });
        index++;
      } else {
        user.unreadMessagesCount -= index;
        await user.save();
        break;
      }
    }
    await conversation.save();
    conversation.participants.map((participant) => {
      const socketIdsList = getOnlineUsers().get(participant.id);
      if (!socketIdsList) return;

      socketIdsList.map((socketId) => {
        getServerSocketInstance().to(socketId).emit("update-conversation", {
          conversationId: conversation.id,
          messagesInfo,
        });
      });
    });
    return res.status(200).json(conversation[0]?.messages);
  } catch (err) {
    return handleError(err, res);
  }
};

export const deleteConversation = async (req, res) => {
  try {
    const { conversation } = req;

    // subtract the unread messages count of the conversation from the overall count
    conversation.participants.map((participant) => {
      const otherParticipant = conversation.participants.find(
        (par) => par.id !== participant.id
      );

      const unreadMessagesCount = participant.unreadMessagesCount;
      User.findById(participant.id).then((doc) => {
        doc.unreadMessagesCount -= unreadMessagesCount;
        doc.contacts.id(otherParticipant.id).deleteOne();
        doc.save();
      });

      //send the clearance of the conversations to all participants
      const socketIdsList = getOnlineUsers().get(participant.id);
      if (!socketIdsList) return;

      socketIdsList.map((socketId) => {
        getServerSocketInstance().to(socketId).emit("delete-conversation", {
          conversationId: conversation.id,
          contactId: otherParticipant.id,
        });
      });
    });

    conversation.deleteOne();

    return res.status(200).send("success");
  } catch (err) {
    return handleError(err, res);
  }
};

export const clear = async (req, res) => {
  try {
    const { forEveryone } = req.query;
    const { user, conversation } = req;

    if (forEveryone === "true") {
      conversation.updatedAt = null;

      // subtract the unread messages count of the conversation from the overall count
      conversation.participants.map((participant) => {
        const unreadMessagesCount = participant.unreadMessagesCount;
        User.findById(participant.id).then((doc) => {
          doc.unreadMessagesCount -= unreadMessagesCount;
          doc.save();
        });
        participant.unreadMessagesCount = 0;
      });
      // clrear all messages
      conversation.messages = [];
      await conversation.save();

      //send the clearance of the conversations to all participants
      conversation.participants.map((participant) => {
        const socketIdsList = getOnlineUsers().get(participant.id);
        if (!socketIdsList) return;

        socketIdsList.map((socketId) => {
          getServerSocketInstance().to(socketId).emit("clear-conversation", {
            conversationId: conversation.id,
          });
        });
      });

      return res.status(200).send("success");
    }

    conversation.participants.id(user.id).unreadMessagesCount = 0;

    conversation.messages.map((message) => {
      /*
      if the message is deleted for everyone except this user, then delete the entire 
      message instead of just deleting the user's ID from "to property
       */
      if (message.to.length === 1) {
        message.deleteOne();
      } else {
        message.to.id(user._id).deleteOne();
      }
    });
    await conversation.save();

    /*
    send the clearance of the conversations only to 
    the participant who cleared the conversation for themselfe
    */
    const otherParticipant = conversation.participants.find(
      (par) => par.id !== user.id
    );

    const socketIdsList = getOnlineUsers().get(user.id);
    if (!socketIdsList) return;

    socketIdsList.map((socketId) => {
      getServerSocketInstance().to(socketId).emit("clear-conversation", {
        conversationId: conversation.id,
        contactId: otherParticipant.id,
      });
    });

    return res.status(200).send("success");
  } catch (err) {
    return handleError(err, res);
  }
};
