import {
  addConnectedUser,
  getOnlineUsers,
  removeConnectedUser,
} from "../socket/onlineUsers.js";

import User from "../models/user.js";
import Conversation from "../models/conversation.js";
import Profile from "../models/profile.js";
import Message from "../models/message.js";

export const connectHandler = async (socket, io) => {
  console.log(`New socket connection connected: ${socket.id}`);
  console.log(`user ${socket.user?.id}`);

  const user = await User.findById(socket.user?.id);
  const profile = await Profile.findById(socket.user?.id);

  if (!(user && profile)) return;

  addConnectedUser(user.id, socket.id);
  // once the user is connected the lastSeenAt will be null
  profile.lastSeenAt = null;
  await profile.save();

  // send activity status to all user's contacts once the user is online
  const { contacts } = user;
  contacts.map((contact) => {
    const socketIdsList = getOnlineUsers().get(contact.id);
    socketIdsList?.map((socketId) => {
      io.to(socketId).emit("contact-connected", { id: user.id });
    });
  });

  //set all undelivered messages to delivered when the user connects
  for (const undeliveredConversation of user.undeliveredConversations.slice()) {
    const conversation = await Conversation.findById(
      undeliveredConversation.id
    );
    if (!conversation) {
      user.undeliveredConversations.pull(undeliveredConversation._id);
      continue;
    }
    const messagesInfo = [];
    for (const item of undeliveredConversation.messages) {
      const message = await Message.findById(item._id);

      if (!message) continue;

      if (!message.info.deliveredTo.id(user._id)) {
        message.info.deliveredTo.push({ _id: user._id });
      }
      await message.save();
      messagesInfo.push({ _id: message.id, info: message.info });
    }

    await conversation.save();

    // delete this undelivered conversation from undeliveredConversations array
    user.undeliveredConversations.pull(undeliveredConversation._id);

    // after setting deliverdTo to all messages, send them to the participants
    conversation.participants.map((participant) => {
      const socketIdsList = getOnlineUsers().get(participant.id);
      socketIdsList?.map((socketId) => {
        io.to(socketId).emit("update-conversation", {
          conversationId: conversation.id,
          messagesInfo,
        });
      });
    });
  }
  await user.save();
};

export const disconnectHandler = async (socket, io) => {
  const user = await User.findById(socket.user?.id);
  const profile = await Profile.findById(socket.user?.id);
  if (!user) {
    return;
  }
  const sessions = getOnlineUsers().get(user.id);
  if (sessions) {
    /*
    if the disconnected user has other sessions then delete this session
    and return without sending disconnection alert to thier contacts
    or changing the lastSeenAt property.
    */
    if (sessions.length > 1) {
      removeConnectedUser(user.id, socket.id);
      return;
    }
  }
  // once the user is disconnected the lastSeenAt will be the current time
  profile.lastSeenAt = Date.now();
  await profile.save();

  await user.save();
  console.log(`socket connection disconnected: ${socket.id}`);

  const { contacts } = user;
  removeConnectedUser(user.id, socket.id);
  /*
  send activity status to all user's contacts once the user is disconnected
  refreshing the app also causes socket disconnection, so sending the disconnection
  alert to the contacts has to be by a timeout by 2 seconds to determine if the user 
  is realy disconnected or just refreshed the page.
  */
  setTimeout(() => {
    const sessions = getOnlineUsers().get(user.id);
    if (sessions) {
      return;
    }
    contacts.map((contact) => {
      const socketIdsList = getOnlineUsers().get(contact.id);
      socketIdsList?.map((socketId) => {
        io.to(socketId).emit("contact-disconnected", {
          id: user.id,
          lastSeenAt: Date.now(),
        });
      });
    });
  }, 2000);
};
