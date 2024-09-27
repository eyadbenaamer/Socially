import { io } from "socket.io-client";
import { useDispatch } from "react-redux";
import { useEffect } from "react";

import {
  addMessage,
  addNotification,
  deleteMessage,
  messageLikeToggle,
  removeNotification,
  setNotifyTyping,
  updateActivityStatus,
  updateConversationStatus,
} from "state";

export let socket;

export const connectToSocketServer = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    return;
  }
  // if socket object is undefined then establish a socket connection
  if (!socket) {
    socket = io(process.env.REACT_APP_API_URL, { auth: { token } });
    return;
  }
  /*
  if socket object is defined but socket.connected is false
  then close the existing one and establish a new connection
  */
  if (!socket.connected) {
    socket.close();
    socket = io(process.env.REACT_APP_API_URL, { auth: { token } });
  }
};

const useHandleSocket = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!socket) {
      return;
    }
    socket.on("contact-connected", (data) => {
      dispatch(
        updateActivityStatus({ id: data.id, isOnline: true, lastSeenAt: null })
      );
    });
    socket.on("contact-disconnected", (data) => {
      dispatch(
        updateActivityStatus({
          id: data.id,
          isOnline: false,
          lastSeenAt: Date.now(),
        })
      );
    });
    socket.on("send-message", (data) => {
      dispatch(addMessage(data));
    });
    socket.on("update-conversation", (data) => {
      dispatch(updateConversationStatus(data));
    });
    socket.on("message-like-toggle", (data) => {
      dispatch(messageLikeToggle(data));
    });
    socket.on("delete-message", (data) => {
      dispatch(deleteMessage(data));
    });

    socket.on("notify-typing", (data) => {
      dispatch(setNotifyTyping(data));
    });
    socket.on("push-notification", (data) => {
      dispatch(addNotification(data));
    });

    socket.on("remove-notification", (data) => {
      dispatch(removeNotification(data));
    });
  }, [socket]);
};

export const disconnectFromSocketServer = () => {
  socket?.close();
};
export default useHandleSocket;
