import {
  getServerSocketInstance,
  getActiveConnections,
} from "../socket/onlineUsers";

export const callRequestHandler = (socket, data) => {
  const { receiverUserId, callerName, audioOnly, signal } = data;
  const callerUserId = socket.user.userId;

  // active connections of the receiver user
  const activeConnections = getActiveConnections(receiverUserId);

  // send call request to all the active connections of the receiver user
  const io = getServerSocketInstance();

  activeConnections.forEach((socketId) => {
    io.to(socketId).emit("call-request", {
      callerName,
      callerUserId,
      audioOnly,
      signal,
    });
  });
};

export const callResponseHandler = (socket, data) => {
  const { receiverUserId, accepted, signal } = data;
  const { userId } = socket.user;

  // const userId = socket.user.userId; // user id who accepted/rejected the call

  // active connections of the receiver user
  const activeConnections = getActiveConnections(receiverUserId);

  // send call response(accepted or rejected) to all the active connections of the receiver user
  const io = getServerSocketInstance();

  activeConnections.forEach((socketId) => {
    io.to(socketId).emit("call-response", {
      otherUserId: userId, // user id who accepted/rejected the call
      accepted,
      signal,
    });
  });
};
