import { Types } from "mongoose";
import Conversation from "../models/conversation.js";
import Profile from "../models/profile.js";
import User from "../models/user.js";

const { ObjectId } = Types;

export const establishNewConversation = async (req, res, next) => {
  try {
    const { user } = req;
    const myId = user.id;
    const { userId: accountToFollowId } = req.query;
    const profileToFollow = await Profile.findById(accountToFollowId);

    /*
    if there is no mutual follow then conversation will not be created
    it will be no contact between both users.
    */
    if (!profileToFollow.following.id(myId)) {
      return next();
    }
    /*
    if following is mutual then the account to follow will be within the contacts.
    note that conversations are created by two ways:
    the first way: with contacts (mutual following)
    the second way: with non-contact accounts that had replied to a conversation request
    */

    // check if the conversation is already existing
    let conversation = await Conversation.findOne({
      participants: {
        $in: [{ _id: myId }, { _id: accountToFollowId }],
      },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [
          { _id: new ObjectId(myId) },
          { _id: new ObjectId(accountToFollowId) },
        ],
        updatedAt: new Date(),
      });
      await conversation.save();
    }
    user.contacts.addToSet({
      _id: accountToFollowId,
      conversationId: conversation.id,
    });
    user.conversations.addToSet(conversation);
    await user.save();

    const userToFollow = await User.findById(accountToFollowId);
    userToFollow.contacts.addToSet({
      _id: myId,
      conversationId: conversation.id,
    });
    userToFollow.conversations.addToSet(conversation);
    await userToFollow.save();
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
    if (conversationId) {
      const conversation = await Conversation.findById(conversationId);
      if (!conversation) {
        return res.status(404).json({ message: "Conversation not found" });
      } else {
        req.conversation = conversation;

        if (messageId) {
          const message = conversation.messages.id(messageId);
          if (!message) {
            return res.status(404).json({ message: "Message not found" });
          }
          req.message = message;
        }
      }
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
