export const directChatHistoryHandler = async (socket, receiverUserId) => {
  try {
    const senderUserId = socket.user.userId;
  } catch {
    return res
      .status(500)
      .json({ message: "An error occurred. Plaese try again later." });
  }
};

export const notifyTypingHandler = (socket, io, data) => {
  const { receiverUserId, typing } = data;
};
