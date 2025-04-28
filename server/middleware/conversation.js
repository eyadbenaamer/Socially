import { Types } from "mongoose";

import Conversation from "../models/conversation.js";
import User from "../models/user.js";

import { getOnlineUsers } from "../socket/onlineUsers.js";
import { getServerSocketInstance } from "../socket/socketServer.js";

const { ObjectId } = Types;

export const newConversationByFollow = async (req, res, next) => {
  try {
    const { user } = req;
    const myId = user.id;
    const { userId: accountToMessageId } = req.query;

    // check if the conversation is already existing
    let conversation = await Conversation.findOne({
      participants: {
        $all: [
          { $elemMatch: { _id: new ObjectId(myId) } },
          { $elemMatch: { _id: new ObjectId(accountToMessageId) } },
        ],
      },
    });

    if (conversation) {
      return next();
    }

    conversation = await Conversation.create({
      participants: [
        { _id: new ObjectId(myId) },
        { _id: new ObjectId(accountToMessageId) },
      ],
      updatedAt: new Date(),
    });
    await conversation.save();
    user.contacts.addToSet({
      _id: accountToMessageId,
      conversationId: conversation.id,
    });
    user.conversations.addToSet(conversation);
    await user.save();

    const userToMessage = await User.findById(accountToMessageId);
    userToMessage.contacts.addToSet({
      _id: myId,
      conversationId: conversation.id,
    });
    userToMessage.conversations.addToSet(conversation);
    await userToMessage.save();

    conversation.participants.map(async (participant) => {
      const otherParticipant = conversation.participants.find(
        (par) => par.id !== participant.id
      );
      const socketIdsList = getOnlineUsers().get(participant.id);
      const otherParticipantSocketIdsList = getOnlineUsers().get(
        otherParticipant.id
      );

      if (socketIdsList) {
        /*
        if the user is online send a the new conversation 
        with the new contact by socket
        */
        socketIdsList.map((socketId) => {
          getServerSocketInstance()
            .to(socketId)
            .emit("add-new-conversation", {
              conversation,
              contact: {
                _id: otherParticipant.id,
                conversationId: conversation.id,
                isOnline: otherParticipantSocketIdsList ? true : false,
              },
            });
        });
      }
    });

    next();
  } catch {
    return res
      .status(500)
      .json({ message: "An error occurred. Plaese try again later." });
  }
};

export const newConversationByMessaging = async (req, res, next) => {
  try {
    const { user } = req;
    const myId = user.id;
    const { userId: accountToMessageId } = req.query;

    // check if the conversation is already existing
    let conversation = await Conversation.findOne({
      participants: {
        $all: [
          { $elemMatch: { _id: new ObjectId(myId) } },
          { $elemMatch: { _id: new ObjectId(accountToMessageId) } },
        ],
      },
    });

    console.log(new ObjectId(myId));
    console.log(new ObjectId(accountToMessageId));
    console.log(conversation);
    if (conversation) {
      return res.status(409).json({ message: "Conversation is alrady exist." });
    }

    conversation = await Conversation.create({
      participants: [
        { _id: new ObjectId(myId) },
        { _id: new ObjectId(accountToMessageId) },
      ],
      updatedAt: new Date(),
    });
    await conversation.save();
    user.contacts.addToSet({
      _id: accountToMessageId,
      conversationId: conversation.id,
    });
    user.conversations.addToSet(conversation);
    await user.save();

    const userToMessage = await User.findById(accountToMessageId);
    userToMessage.contacts.addToSet({
      _id: myId,
      conversationId: conversation.id,
    });
    userToMessage.conversations.addToSet(conversation);
    await userToMessage.save();
    req.conversation = conversation;

    conversation.participants.map(async (participant) => {
      const otherParticipant = conversation.participants.find(
        (par) => par.id !== participant.id
      );
      const socketIdsList = getOnlineUsers().get(participant.id);
      const otherParticipantSocketIdsList = getOnlineUsers().get(
        otherParticipant.id
      );
      if (socketIdsList) {
        /*
        if the user is online send a the new conversation 
        with the new contact by socket
        */
        socketIdsList.map((socketId) => {
          getServerSocketInstance()
            .to(socketId)
            .emit("add-new-conversation", {
              conversation,
              contact: {
                _id: otherParticipant.id,
                conversationId: conversation.id,
                isOnline: otherParticipantSocketIdsList ? true : false,
              },
            });
        });
      }
    });

    next();
  } catch {
    return res
      .status(500)
      .json({ message: "An error occurred. Plaese try again later." });
  }
};

export const getConversationInfo = async (req, res, next) => {
  try {
    const { conversationId, messageId } = req.query;
    if (!conversationId) {
      return res.status(400).json({ message: "Bad request." });
    }
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found." });
    }

    req.conversation = conversation;

    if (messageId) {
      const message = conversation.messages.id(messageId);
      if (!message) {
        return res.status(404).json({ message: "Message not found." });
      }
      req.message = message;
    }
    next();
  } catch {
    return res
      .status(500)
      .json({ message: "An error occurred. Plaese try again later." });
  }
};

export const isInChat = (req, res, next) => {
  try {
    const { user, conversation } = req;
    if (conversation.participants.id(user.id)) {
      next();
    } else {
      return res.status(403).json({ message: "You're not in this chat." });
    }
  } catch {
    return res
      .status(500)
      .json({ message: "An error occurred. Plaese try again later." });
  }
};
