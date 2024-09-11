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
  unreadMessagesCount: 0,
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
    setUnreadMessagesCount: (state, action) => {
      state.unreadMessagesCount = action.payload;
    },
    updateActivityStatus: (state, action) => {
      const { id, isOnline, lastSeenAt } = action.payload;
      state.contacts.map((item) => {
        if (item._id === id) {
          item.isOnline = isOnline;
          item.lastSeenAt = lastSeenAt;
        }
      });
    },
    setShowMessage: (state, action) => {
      state.infoMessage = action.payload;
    },
    // sets and sorts the conversations
    setConversations: (state, action) => {
      const { conversations } = state;
      if (action.payload == null) {
        state.conversations = null;
        return;
      }
      /*
      if there are no conversations stored then all conversations 
      in the payload will be stored in state.conversations
      */
      if (!conversations) {
        state.conversations = action.payload;
        return;
      }
      action.payload.map((newConversation) => {
        const conversation = conversations.find(
          (c) => c._id === newConversation._id
        );
        if (!conversation) {
          conversations.push(newConversation);
        } else {
          conversation.unreadMessagesCount =
            newConversation.unreadMessagesCount;
          conversation.messages = newConversation.messages;
          conversation.updatedAt = newConversation.updatedAt;
        }
      });
      // state.conversations = conversations.sort(
      //   (conversation) => conversation.updatedAt
      // );
    },
    /*
    this function replaces a whole conversation's messages 
    with the passed messages array
    */
    setConversation(state, action) {
      const newConversation = action.payload;
      let conversation = state.conversations.find(
        (conv) => conv._id === newConversation._id
      );
      if (newConversation.messages) {
        conversation.messages = newConversation.messages;
      }
      if (newConversation.unreadMessagesCount >= 0) {
        conversation.unreadMessagesCount = newConversation.unreadMessagesCount;
      }
    },
    /*
    this fucntion called when a certain conversation's messages status 
    are updated such as (readBy, deliveredTo)
    */
    updateConversationStatus: (state, action) => {
      const { conversationId, messagesInfo } = action.payload;
      const conversation = state.conversations.find(
        (conv) => conv._id === conversationId
      );
      messagesInfo?.map((newMessage) => {
        let message = conversation.messages.find(
          (item) => item._id === newMessage._id
        );
        if (message) {
          message.info = newMessage.info;
        }
      });
    },
    // adds the new recieved message to its conversation
    addMessage: (state, action) => {
      const { conversationId, message, updatedAt, unreadMessagesCount } =
        action.payload;
      if (message.senderId !== state.profile._id) {
        state.unreadMessagesCount += 1;
      }
      const newConversation = state.conversations.find(
        (conv) => conv._id === conversationId
      );

      // if the conversation is not exist or has been cleared, create a new one
      if (!newConversation || !newConversation.messages) {
        state.conversations.unshift({
          _id: conversationId,
          messages: [message],
          updatedAt,
          unreadMessagesCount,
        });
      } else {
        newConversation.messages.unshift(message);
        newConversation.updatedAt = updatedAt;
        newConversation.unreadMessagesCount = unreadMessagesCount;
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
      const { conversationId, messageId, unreadMessagesCount } = action.payload;
      let conversation = state.conversations.find(
        (conv) => conv._id === conversationId
      );
      conversation.unreadMessagesCount = unreadMessagesCount;
      if (state.unreadMessagesCount > 0) {
        state.unreadMessagesCount -= 1;
      }
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
      // sessionStorage.setItem("isLoaded", true);
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
  setUnreadMessagesCount,
  updateActivityStatus,
  setConversations,
  setConversation,
  updateConversationStatus,
  addMessage,
  messageLikeToggle,
  deleteMessage,
  setShowMessage,
  clearSessionStorage,
  logout,
} = slice.actions;
export default slice.reducer;
