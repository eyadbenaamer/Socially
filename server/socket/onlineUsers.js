const connectedUsers = new Map();

export const addConnectedUser = (userId, socketId) => {
  if (connectedUsers.has(userId)) {
    const sessions = connectedUsers.get(userId);
    sessions.push(socketId);
  } else {
    connectedUsers.set(userId, [socketId]);
  }
};

export const removeConnectedUser = (userId, socketId) => {
  let sessions = connectedUsers.get(userId);
  if (!sessions) {
    return;
  }
  if (sessions.length <= 1) {
    connectedUsers.delete(userId);
  } else {
    sessions = sessions.filter((session) => session !== socketId);
    connectedUsers.set(userId, sessions);
  }
};

export const getOnlineUsers = () => connectedUsers;
