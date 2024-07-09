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
        seenBy: [{ _id: user.id }],
      },
      replyTo,
      createdAt: Date.now(),
    };
    // conversation.updatedAt is only updated when a new message is sent or when messages is liked
    conversation.updatedAt = Date.now();

    const messages = conversation.messages.addToSet(newMessage);
    const message = messages[0];
    conversation.participants.map(async (participant) => {
      const socketIdsList = getOnlineUsers().get(participant.id);
      if (socketIdsList) {
        // if user is online then send a message by socket and add user's ID to deliveredTo array
        message.info.deliveredTo.push({ _id: participant._id });
        // if recipient is online then add user's ID to deliveredTo array.
        socketIdsList.map((socketId) => {
          getServerSocketInstance().to(socketId).emit("send-message", {
            conversationId: conversation.id,
            message: message,
            updatedAt: conversation.updatedAt,
          });
        });
      } else {
        /*
        if recipient is not online then add the the conversation 
        id with undelivered messages to user.undeliveredMessage
        */
        const user = await User.findById(participant._id);
        const undeliveredConversation = user.undeliveredConversations.id(
          conversation.id
        );
        if (undeliveredConversation) {
          undeliveredConversation.messages.addToSet({ _id: message._id });
        } else {
          user.undeliveredConversations.addToSet({
            _id: conversation._id,
            participants: conversation.participants,
            messages: [{ _id: message._id }],
          });
        }
        await user.save();
      }
    });
    //
    await conversation.save();
    return res.status(201).json({ message: "success" });
  } catch (error) {
    console.log(error);
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
    const { forEveryOne } = req.query;
    const { user, conversation, message } = req;

    // if user is online then send the message update by socket
    conversation.participants.map((participant) => {
      const socketIdsList = getOnlineUsers().get(participant.id);
      if (socketIdsList) {
        socketIdsList.map((socketId) => {
          getServerSocketInstance().to(socketId).emit("delete-message", {
            conversationId: conversation.id,
            messageId: message.id,
          });
        });
      }
    });
    /*
    if the message is deleted for the other user or deletion option
    is for everyone , then delete the entire message instead of just deleting
    the user's ID from "to" property.
    */
    if (forEveryOne === "true" || message.to.length === 1) {
      message.deleteOne();
    } else {
      message.to.id(user._id).deleteOne();
    }

    await conversation.save();
    return res.status(200).send("success");
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "An error occurred. Plaese try again later." });
  }
};
