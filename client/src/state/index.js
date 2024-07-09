import { createSlice } from "@reduxjs/toolkit";
import { disconnectFromSocketServer } from "hooks/useHandleSocket";

const initialState = {
  settings: { theme: "light" },
  profile: null,
  authStatus: {
    email: null,
    isLoggedin: false,
    isVerified: false,
  },
  contacts: [],
  conversations: [],
  notifications: [],
  resetPasswordInfo: {
    email: null,
    token: null,
    message: "",
    isCodeSent: false,
    isPasswordReset: false,
  },
  infoMessage: "",
};

export const slice = createSlice({
  name: "state",
  initialState,
  reducers: {
    setSettings: (state, action) => {
      state.settings = {
        ...state.settings,
        [action.payload.property]: action.payload.value,
      };
    },
    setProfile: (state, action) => {
      state.profile = action.payload;
    },
    setAuthStatus: (state, action) => {
      if (action.payload === null) state.authStatus = null;
      state.authStatus = { ...state.authStatus, ...action.payload };
    },
    setResetPasswordInfo: (state, action) => {
      if (action.payload === null) state.resetPasswordInfo = null;
      state.resetPasswordInfo = {
        ...state.resetPasswordInfo,
        ...action.payload,
      };
    },
    toggleTheme: (state) => {
      if (state.settings.theme === "dark") {
        state.settings.theme = "light";
      } else {
        state.settings.theme = "dark";
      }
    },
    setContacts: (state, action) => {
      state.contacts = action.payload;
    },
    updateActivityStatus: (state, action) => {
      const { id, isOnline } = action.payload;
      state.contacts.map((item) => {
        if (item._id === id) {
          item.isOnline = isOnline;
        }
      });
    },
    setShowMessage: (state, action) => {
      state.infoMessage = action.payload;
    },
    // sets the conversations when once login
    setConversations: (state, action) => {
      state.conversations = action.payload;
    },
    /*
    this fucntion called when a certain conversation's messages status 
    are updated such as (seenBy, deliveredTo)
    */
    updateConversationStatus: (state, action) => {
      const { conversationId, messages } = action.payload;
      const conversation = state.conversations.find(
        (conv) => conv._id === conversationId
      );

      messages.map((newMessage) => {
        let message = conversation.messages.find(
          (item) => item._id === newMessage._id
        );
        message.info = newMessage.info;
      });
    },
    // adds the new recieved message to its conversation
    addMessage: (state, action) => {
      const { conversationId, message, updatedAt } = action.payload;
      const newConversation = state.conversations.find(
        (conv) => conv._id === conversationId
      );

      // if the conversation is not exist or has been cleared, create a new one
      if (!newConversation) {
        state.conversations.push({ _id: conversationId, message, updatedAt });
      } else {
        newConversation.messages.push(message);
        newConversation.updatedAt = updatedAt;
      }
    },
    messageLikeToggle: (state, action) => {
      const { conversationId, message: newMessage, updatedAt } = action.payload;
      const conversation = state.conversations.find(
        (conv) => conv._id === conversationId
      );
      let message = conversation.messages.find(
        (item) => item._id === newMessage._id
      );
      message.info = newMessage.info;
      conversation.updatedAt = updatedAt;
    },
    deleteMessage: (state, action) => {
      const { conversationId, messageId } = action.payload;
      const conversation = state.conversations.find(
        (conv) => conv._id === conversationId
      );
      conversation.messages = conversation.messages.filter(
        (message) => message._id !== messageId
      );
    },
    // sets the notifications when once login
    setNotifications: (state, action) => {},
    // adds the new recieved notification to notifications array
    addNotification: (state, action) => {},
    // updates a notification status(isRead)
    updateNotificationStatus: (state, action) => {},
    clearSessionStorage: () => {
      sessionStorage.clear();
      // set the isLoaded(reponsible for loading effect) again after clearing sessionStorage
      sessionStorage.setItem("isLoaded", true);
    },
    logout: (state) => {
      // disconnect socket connection when logging out
      disconnectFromSocketServer();

      //clear localStorage and sessionStorage to start a new session
      localStorage.clear();
      slice.actions.clearSessionStorage();

      // set the state back to the initial state
      state.token = null;
      state.profile = null;
      state.conversations = null;
      state.authStatus.email = null;
      state.authStatus.isLoggedin = false;
      state.authStatus.isVerified = false;
      state.settings.theme = "light";
      state.infoMessage = "";
    },
  },
});
export const {
  setProfile,
  setSettings,
  setIsVerified,
  setAuthStatus,
  setResetPasswordInfo,
  toggleTheme,
  setContacts,
  updateActivityStatus,
  setConversations,
  updateConversationStatus,
  addMessage,
  messageLikeToggle,
  deleteMessage,
  setShowMessage,
  clearSessionStorage,
  logout,
} = slice.actions;
export default slice.reducer;
