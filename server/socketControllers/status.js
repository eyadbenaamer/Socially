import {
  addConnectedUser,
  getOnlineUsers,
  removeConnectedUser,
} from "../socket/onlineUsers.js";
import User from "../models/user.js";
import Conversation from "../models/conversation.js";

export const connectHandler = async (socket, io) => {
  console.log(`New socket connection connected: ${socket.id}`);
  console.log(`user ${socket.user?.id}`);

  const user = await User.findById(socket.user?.id);
  if (user) {
    addConnectedUser(user.id, socket.id);
    // send activity status to all user's contacts once the user is online
    const { contacts } = user;
    contacts.map((contact) => {
      const socketIdsList = getOnlineUsers().get(contact.id);
      socketIdsList?.map((socketId) => {
        io.to(socketId).emit("contact-connected", { id: user.id });
      });
    });

    //set all undelivered messages to delivered when the user connects
    user.undeliveredConversations.map(async (undeliveredConversation) => {
      const conversation = await Conversation.findById(
        undeliveredConversation.id
      );
      const updatedMessages = [];
      undeliveredConversation.messages.map((item) => {
        const message = conversation.messages.id(item._id);
        message.info.deliveredTo.addToSet({ _id: user._id });
        updatedMessages.push(message);
      });

      await conversation.save();

      // delete this undelivered conversation from undeliveredConversation array
      undeliveredConversation.deleteOne();
      await user.save();

      // after setting deliverdTo to all messages, send them to the user
      io.to(socket.id).emit("update-conversation", {
        conversationId: conversation._id,
        messages: updatedMessages,
      });
    });
  }
};

export const disconnectHandler = async (socket, io) => {
  console.log(`socket connection disconnected: ${socket.id}`);
  const user = await User.findById(socket.user?.id);
  if (user) {
    // send activity status to all user's contacts once the user is disconnected
    const { contacts } = user;
    contacts.map((contact) => {
      const socketIdsList = getOnlineUsers().get(contact.id);
      socketIdsList?.map((socketId) => {
        io.to(socketId).emit("contact-disconnected", { id: user.id });
      });
    });
    removeConnectedUser(user.id, socket.id);
  }
};
