import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  settings: { theme: "light" },
  profile: null,
  authStatus: {
    email: null,
    isLoggedin: false,
    isVerified: false,
  },
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
    setShowMessage: (state, action) => {
      state.infoMessage = action.payload;
    },
    clearSignupFields: () => {
      sessionStorage.clear();
      // set the isLoaded again after clearing sessionStorage
      sessionStorage.setItem("isLoaded", true);
    },
    logout: (state) => {
      localStorage.clear();
      slice.actions.clearSignupFields();
      state.token = null;
      state.profile = null;
      state.authStatus.email = null;
      state.authStatus.isLoggedin = false;
      state.authStatus.isVerified = false;
      state.settings.mode = "light";
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
  setShowMessage,
  clearSignupFields,
  logout,
} = slice.actions;
export default slice.reducer;
