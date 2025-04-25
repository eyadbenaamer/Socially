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
  unreadNotificationsCount: 0,
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
    setConversations: (state, action) => {
      state.conversations = action.payload;
    },
    setConversation: (state, action) => {
      const {
        _id: id,
        messages,
        unreadMessagesCount,
        updatedAt,
      } = action.payload;
      let conversation = state.conversations.find((conv) => conv._id === id);
      conversation.unreadMessagesCount = unreadMessagesCount;
      conversation.messages = messages;
      conversation.updatedAt = updatedAt;
    },
    setConversationRead: (state, action) => {
      const conversation = state.conversations.find(
        (conversation) => conversation._id === action.payload
      );
      conversation.unreadMessagesCount = 0;
    },
    addMessages(state, action) {
      const { id, messages } = action.payload;
      let conversation = state.conversations.find((conv) => conv._id === id);
      messages.map((newMessage) => {
        const existingMessage = conversation.messages.find(
          (message) => message._id === newMessage._id
        );
        if (!existingMessage) {
          conversation.messages.push(newMessage);
        }
      });
    },
    /*
    this function receives the new established conversation and adds
    in the conversations array
    */
    addNewConversation: (state, action) => {
      const { conversation, contact } = action.payload;
      state.contacts.unshift(contact);
      state.conversations.unshift(conversation);
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
      if (!conversation) {
        return;
      }
      messagesInfo?.map((newMessage) => {
        let message = conversation.messages.find(
          (item) => item._id === newMessage._id
        );
        if (message) {
          message.info = newMessage.info;
        }
      });
    },
    // clears a conversation's messages but the conversation remains
    clearConversation: (state, action) => {
      const conversation = state.conversations.find(
        (conv) => conv._id === action.payload.conversationId
      );
      if (!conversation) return;

      const unreadMessagesCount = conversation.unreadMessagesCount;

      state.unreadMessagesCount -= unreadMessagesCount;
      conversation.unreadMessagesCount = 0;
      conversation.messages = [];
      conversation.updatedAt = null;
    },
    //
    deleteConversation: (state, action) => {
      const { conversationId, contactId } = action.payload;
      state.conversations = state.conversations.filter(
        (conversation) => conversation._id !== conversationId
      );
      state.contacts = state.contacts.filter(
        (contact) => contact._id !== contactId
      );
    },
    // adds the new recieved message to its conversation
    addMessage: (state, action) => {
      const {
        conversationId,
        message: newMessage,
        updatedAt,
        unreadMessagesCount,
      } = action.payload;
      if (newMessage?.senderId !== state.profile._id) {
        state.unreadMessagesCount += 1;
      }
      const updatedConversation = state.conversations.find(
        (conv) => conv._id === conversationId
      );

      // if the conversation is not exist or has been cleared, create a new one
      if (!updatedConversation || !updatedConversation.messages) {
        state.conversations.unshift({
          _id: conversationId,
          messages: newMessage ? [newMessage] : [],
          updatedAt,
          unreadMessagesCount,
        });
      } else {
        const message = updatedConversation.messages.find(
          (message) => message._id === newMessage._id
        );
        /*
        if the message is already existing then the new message
        won't be added to the list 
        */
        if (message) {
          return;
        }

        updatedConversation.messages.unshift(newMessage);
        updatedConversation.updatedAt = updatedAt;
        updatedConversation.unreadMessagesCount = unreadMessagesCount;

        const updatedConversationsList = state.conversations.filter(
          (conversation) => conversation._id !== conversationId
        );
        updatedConversationsList.unshift(updatedConversation);
        state.conversations = updatedConversationsList;
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
      const { conversationId, messageId, unreadMessagesCount, updatedAt } =
        action.payload;
      let conversation = state.conversations.find(
        (conv) => conv._id === conversationId
      );
      conversation.unreadMessagesCount = unreadMessagesCount;
      if (state.unreadMessagesCount > 0) {
        state.unreadMessagesCount--;
      }
      conversation.messages = conversation.messages.filter(
        (message) => message._id !== messageId
      );
      // set the new value of updatedAt
      conversation.updatedAt = updatedAt;
      // sort the conversations according to the new value of updatedAt
      state.conversations = state.conversations.sort(
        (a, b) => b.updatedAt - a.updatedAt
      );
    },
    setNotifyTyping: (state, action) => {
      const { conversationId, isTyping } = action.payload;
      const conversation = state.conversations.find(
        (conversation) => conversation._id === conversationId
      );
      if (conversation) {
        conversation.isTyping = isTyping;
      }
    },
    // sets the notifications when once login
    setNotifications: (state, action) => {
      state.notifications = action.payload;
    },
    setUnreadNotificationsCount: (state, action) => {
      state.unreadNotificationsCount = action.payload;
    },
    // adds the new recieved notification to notifications array
    addNotification: (state, action) => {
      state.notifications.unshift(action.payload);
      state.unreadNotificationsCount += 1;
    },
    // removes a notification from notifications array
    removeNotification: (state, action) => {
      const notificationToBeRemoved = state.notifications.find(
        (notification) => notification._id === action.payload
      );
      state.notifications = state.notifications.filter(
        (notification) => notification._id !== notificationToBeRemoved._id
      );
      /*
      if the notification to be removed is not read then
      decrease unreadNotificationsCount by 1.
      */
      if (!notificationToBeRemoved?.isRead) {
        state.unreadNotificationsCount--;
      }
    },
    // updates a notification status(isRead)
    setNotificationIsRead: (state, action) => {
      let notification = state.notifications.find(
        (notification) => notification._id === action.payload
      );
      notification.isRead = true;
    },
    // sets (isRead) true for all notifications
    setNotificationsAllRead: (state) => {
      state.notifications.map((notification) => (notification.isRead = true));
    },
    clearNotifications: (state) => {
      state.notifications = [];
      state.unreadNotificationsCount = 0;
    },
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
      state.conversations = [];
      state.notifications = [];
      state.unreadMessagesCount = 0;
      state.unreadNotificationsCount = 0;
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
  setConversationRead,
  addMessages,
  addNewConversation,
  updateConversationStatus,
  clearConversation,
  deleteConversation,
  addMessage,
  messageLikeToggle,
  deleteMessage,
  setNotifyTyping,
  setNotifications,
  setUnreadNotificationsCount,
  addNotification,
  removeNotification,
  setNotificationIsRead,
  setNotificationsAllRead,
  clearNotifications,
  setShowMessage,
  clearSessionStorage,
  logout,
} = slice.actions;
export default slice.reducer;
