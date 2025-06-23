import Conversation from "../models/conversation.js";
import { getOnlineUsers } from "../socket/onlineUsers.js";

import { handleError } from "../utils/errorHandler.js";

export const directChatHistoryHandler = async (socket, receiverUserId) => {
  try {
    const senderUserId = socket.user.userId;
  } catch (err) {
    return handleError(err, res);
  }
};

export const notifyTypingHandler = async (socket, io, data) => {
  try {
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
  } catch (err) {
    console.error(err);
  }
};
