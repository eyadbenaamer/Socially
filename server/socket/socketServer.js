import { Server } from "socket.io";
import { verifySocketToken } from "../middleware/auth.js";

import {
  connectHandler,
  disconnectHandler,
} from "../socketControllers/status.js";

let io;

const createSocketServer = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.APP_URL,
      methods: ["GET", "POST", "PATCH", "DELETE"],
    },
  });

  // verifies the token with every websocket connection
  io.use(verifySocketToken);

  io.on("connection", async (socket) => {
    connectHandler(socket, io);

    socket.on("notify-typing", (data) => {
      notifyTypingHandler(socket, io, data);
    });

    socket.on("call-request", (data) => {
      callRequestHandler(socket, data);
    });

    socket.on("call-response", (data) => {
      callResponseHandler(socket, data);
    });

    socket.on("disconnect", () => disconnectHandler(socket, io));
  });
};

export const getServerSocketInstance = () => io;

export default createSocketServer;
