import { io } from "socket.io-client";
import { useDispatch } from "react-redux";

import {
  addMessage,
  deleteMessage,
  messageLikeToggle,
  updateActivityStatus,
  updateConversationStatus,
} from "state";
import { useEffect } from "react";

let socket;

export const connectToSocketServer = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    return;
  }
  socket = io(process.env.REACT_APP_API_URL, { auth: { token } });
};

const useHandleSocket = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!socket) {
      return;
    }
    socket.on("contact-connected", (data) => {
      dispatch(updateActivityStatus({ id: data.id, isOnline: true }));
    });
    socket.on("contact-disconnected", (data) => {
      dispatch(updateActivityStatus({ id: data.id, isOnline: false }));
    });
    socket.on("update-conversation", (data) => {
      dispatch(updateConversationStatus(data));
    });
    socket.on("send-message", (data) => {
      dispatch(addMessage(data));
    });
    socket.on("message-like-toggle", (data) => {
      dispatch(messageLikeToggle(data));
    });
    socket.on("delete-message", (data) => {
      dispatch(deleteMessage(data));
    });
  }, [socket]);
};

export const disconnectFromSocketServer = () => {
  socket.close();
};
export default useHandleSocket;
