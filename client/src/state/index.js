import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  settings: { theme: "light" },
  token: null,
  profile: null,
  authStatus: {
    email: null,
    isLoggedIn: false,
    isVerified: false,
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
    setToken: (state, action) => {
      state.token = action.payload;
    },
    setProfile: (state, action) => {
      state.profile = action.payload;
    },
    setAuthStatus: (state, action) => {
      if (action.payload === null) state.authStatus = null;
      state.authStatus = { ...state.authStatus, ...action.payload };
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
    logout: (state) => {
      sessionStorage.clear();
      state.token = null;
      state.profile = null;
      state.authStatus.email = null;
      state.authStatus.isLoggedIn = false;
      state.authStatus.isVerified = false;
      state.settings.mode = "light";
      state.infoMessage = "";
    },
  },
});
export const {
  setToken,
  setProfile,
  setSettings,
  setIsVerified,
  setAuthStatus,
  toggleTheme,
  setShowMessage,
  logout,
} = slice.actions;
export default slice.reducer;
