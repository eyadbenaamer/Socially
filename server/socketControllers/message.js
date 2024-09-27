import Conversation from "../models/conversation.js";
import { getOnlineUsers } from "../socket/onlineUsers.js";

export const directChatHistoryHandler = async (socket, receiverUserId) => {
  try {
    const senderUserId = socket.user.userId;
  } catch {
    return res
      .status(500)
      .json({ message: "An error occurred. Plaese try again later." });
  }
};

export const notifyTypingHandler = async (socket, io, data) => {
  const { conversationId, isTyping } = data;
  const conversation = await Conversation.findById(conversationId);
  const participants = conversation.participants.filter(
    (participant) => participant.id !== socket.user.id
  );
  participants?.map((participant) => {
    const socketList = getOnlineUsers().get(participant.id);
    socketList?.map((id) => {
      io.to(id).emit("notify-typing", {
        conversationId,
        isTyping,
      });
    });
  });
};
