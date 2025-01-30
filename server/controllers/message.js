import User from "../models/user.js";

import { getOnlineUsers } from "../socket/onlineUsers.js";
import { getServerSocketInstance } from "../socket/socketServer.js";

export const sendMessage = async (req, res) => {
  try {
    const { filesInfo, user, conversation } = req;
    const { replyTo } = req.query;
    const { text } = req.body;

    const newMessage = {
      senderId: user.id,
      to: conversation.participants,
      text,
      files: filesInfo,
      info: {
        readBy: [{ _id: user.id }],
      },
      replyTo: replyTo ? replyTo : null,
      createdAt: Date.now(),
    };
    // conversation.updatedAt is only updated when a new message is sent or when messages is liked
    conversation.messages.unshift(newMessage);
    const message = conversation.messages[0];
    conversation.updatedAt = message.createdAt;

    // if recipient is online then add user's ID to deliveredTo array.
    conversation.participants.map(async (participant) => {
      const socketIdsList = getOnlineUsers().get(participant.id);
      if (socketIdsList) {
        message.info.deliveredTo.addToSet({ _id: participant._id });
      }
    });
    await conversation.save();

    conversation.participants.map(async (participant) => {
      if (participant.id !== user.id) {
        participant.unreadMessagesCount += 1;
        await conversation.updateOne(conversation);
      }
    });
    conversation.participants.map(async (participant) => {
      const participantDoc = await User.findById(participant._id);
      if (participant.id !== user.id) {
        participantDoc.unreadMessagesCount += 1;
      }
      const socketIdsList = getOnlineUsers().get(participant.id);
      if (socketIdsList) {
        //  if the user is online send a message by socket and
        socketIdsList.map((socketId) => {
          getServerSocketInstance().to(socketId).emit("send-message", {
            conversationId: conversation.id,
            message: message,
            unreadMessagesCount: participant.unreadMessagesCount,
            updatedAt: conversation.updatedAt,
          });
        });
      } else {
        // only for receivers
        if (participantDoc.id !== user.id) {
          /*
          if recipient is not online then add the the conversation 
          id with undelivered messages to user.undeliveredConversations
          */
          const undeliveredConversation =
            participantDoc.undeliveredConversations.id(conversation.id);
          /*
          if the conversation is already exist, add the message to it otherwise 
          create a new conversation and then add the message to it 
          */
          if (undeliveredConversation) {
            undeliveredConversation.messages.unshift({ _id: message._id });
          } else {
            participantDoc.undeliveredConversations.addToSet({
              _id: conversation._id,
              participants: conversation.participants,
              messages: [{ _id: message._id }],
            });
          }
        }
      }
      await participantDoc.save();
    });
    await conversation.save();
    //
    return res.status(201).json({ message: "success" });
  } catch {
    return res
      .status(500)
      .json({ message: "An error occurred. Plaese try again later." });
  }
};

export const likeToggle = async (req, res) => {
  try {
    const { user, conversation, message } = req;

    // if the message is deleted for the user or for everyone or it's not exist return not found.
    if (!message?.to.id(user._id) || !message) {
      return res.status(404).json({ message: "message not found" });
    }

    // if the message is liked by the user then remove their id from likedBy array.
    if (message.info.likedBy.id(user._id)) {
      message.info.likedBy.id(user._id).deleteOne();
    } else {
      // otherwise add their id to likedBy array.
      message.info.likedBy.addToSet(user._id);
    }

    // conversation.updatedAt is only updated when a new message is sent or when messages is liked
    conversation.updatedAt = Date.now();

    // if user is online then send the message update by socket
    conversation.participants.map((participant) => {
      const socketIdsList = getOnlineUsers().get(participant.id);
      if (socketIdsList) {
        socketIdsList.map((socketId) => {
          getServerSocketInstance().to(socketId).emit("message-like-toggle", {
            conversationId: conversation.id,
            message,
            updatedAt: conversation.updatedAt,
          });
        });
      }
    });

    await conversation.save();
    return res.status(200).json(message);
  } catch {
    return res
      .status(500)
      .json({ message: "An error occurred. Plaese try again later." });
  }
};

export const deleteMessage = async (req, res) => {
  try {
    const { forEveryone } = req.query;
    const { user, conversation, message } = req;

    const participantId = conversation.participants.find(
      (participant) => participant.id !== user.id
    );
    const participantProfile = await User.findById(participantId);
    /*
    if the message is not read by the other participant then decrease
    unreadMessagesCount by one.
    */
    if (message.info.readBy.length === 1) {
      conversation.participants.id(participantId).unreadMessagesCount -= 1;
      participantProfile.unreadMessagesCount -= 1;
    }
    /*
    if the message is not delivered to the other participant then delete
    the message from undeliveredConversations for the other participant.
    */
    if (message.info.deliveredTo.length === 1) {
      const undeliveredConversation =
        participantProfile.undeliveredConversations.id(conversation.id);
      /*
      if the conversation has only one message delete the entire
      conversation, otherwise delete the message from
      "undeliveredConversations.messages".
      */
      if (undeliveredConversation?.messages?.length === 1) {
        undeliveredConversation.deleteOne();
      } else {
        undeliveredConversation.messages.id(message.id).deleteOne();
      }
    }
    await participantProfile.save();
    /*
    if the message is deleted for the other user or deletion option
    is for everyone , then delete the entire message instead of just deleting
    the user's ID from "to" property.
    */
    if (forEveryone === "true" || message.to.length === 1) {
      message.deleteOne();
    } else {
      message.to.id(user._id).deleteOne();
    }
    if (conversation.messages[0]) {
      conversation.updatedAt = conversation.messages[0].createdAt;
    } else {
      conversation.updatedAt = null;
    }
    await conversation.save();
    /*
    if the deletion is for everyone and the user is
    online then send the message update by socket
    */
    if (forEveryone === "true") {
      conversation.participants.map((participant) => {
        const socketIdsList = getOnlineUsers().get(participant.id);
        if (socketIdsList) {
          socketIdsList.map((socketId) => {
            const { unreadMessagesCount } = participant;
            let data;
            if (participant.id !== user.id) {
              data = {
                conversationId: conversation.id,
                messageId: message.id,
                unreadMessagesCount,
                updatedAt: conversation.updatedAt,
              };
            } else {
              data = {
                conversationId: conversation.id,
                messageId: message.id,
                updatedAt: conversation.updatedAt,
              };
            }
            getServerSocketInstance().to(socketId).emit("delete-message", data);
          });
        }
      });
    }
    /*
    if the deletion is not for everyone then send the message
    update by socket to the user
    */
    if (forEveryone === "false") {
      const socketIdsList = getOnlineUsers().get(user.id);
      if (socketIdsList) {
        socketIdsList.map((socketId) => {
          let data;
          data = {
            conversationId: conversation.id,
            messageId: message.id,
            updatedAt: conversation.updatedAt,
          };
          getServerSocketInstance().to(socketId).emit("delete-message", data);
        });
      }
    }

    return res.status(200).send("success");
  } catch {
    return res
      .status(500)
      .json({ message: "An error occurred. Plaese try again later." });
  }
};
