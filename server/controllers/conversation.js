import { Types } from "mongoose";
import Conversation from "../models/conversation.js";
import { getOnlineUsers } from "../socket/onlineUsers.js";
import { getServerSocketInstance } from "../socket/socketServer.js";

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
          messages: {
            $elemMatch: {
              to: {
                $elemMatch: {
                  _id: user._id,
                },
              },
            },
          },
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
  } catch {
    return res
      .status(500)
      .json({ message: "An error occurred. Plaese try again later." });
  }
};

export const getOne = async (req, res) => {
  try {
    let { page, conversationId } = req.query;
    const { user } = req;
    if (!page) {
      page = 1;
    }

    const conversation = await Conversation.aggregate([
      {
        $match: {
          _id: new ObjectId(conversationId),
          participants: { $elemMatch: { _id: user._id } },
          "messages.info.readBy": { $in: [{ _id: new ObjectId(user._id) }] },
        },
      },
      {
        $project: {
          _id: 1,
          participants: 1,
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
  } catch {
    return res
      .status(500)
      .json({ message: "An error occurred. Plaese try again later." });
  }
};

export const setRead = async (req, res) => {
  try {
    const { conversationId } = req.query;
    const { user } = req;
    const conversation = await Conversation.findById(conversationId);
    let index = 0;
    const messagesInfo = [];
    while (true) {
      const message = conversation.messages[index];
      if (!message) {
      }
      const isRead = Boolean(message?.info.readBy.id(user.id));
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
      if (socketIdsList) {
        socketIdsList.map((socketId) => {
          getServerSocketInstance().to(socketId).emit("update-conversation", {
            conversationId: conversation.id,
            messagesInfo,
          });
        });
      }
    });
    return res.status(200).json(conversation[0]?.messages);
  } catch {
    return res
      .status(500)
      .json({ message: "An error occurred. Plaese try again later." });
  }
};

export const getUnreadMessages = async (req, res) => {
  try {
    const { conversationId } = req.query;
    const { user } = req;
    const conversation = await Conversation.aggregate([
      {
        $match: {
          _id: new ObjectId(conversationId),
        },
      },
      { $unwind: "$messages" },
      {
        $match: {
          "messages.to": { $in: [{ _id: new ObjectId(user._id) }] },
          "messages.info.readBy": { $nin: [{ _id: new ObjectId(user._id) }] },
        },
      },
      {
        $group: {
          _id: "$_id",
          messages: { $push: "$messages" },
        },
      },
      { $project: { _id: 0, messages: 1 } },
    ]);
    return res.status(200).json(conversation[0]?.messages);
  } catch {
    return res
      .status(500)
      .json({ message: "An error occurred. Plaese try again later." });
  }
};

export const clear = async (req, res) => {
  try {
    const { forEveryOne } = req.query;
    const { user, conversation } = req;

    if (forEveryOne === "true") {
      conversation.messages = [];
      await conversation.save();
      return res.status(200).send("success");
    }
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
    return res.status(200).send("success");
  } catch {
    return res
      .status(500)
      .json({ message: "An error occurred. Plaese try again later." });
  }
};
