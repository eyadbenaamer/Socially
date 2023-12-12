import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  settings: { mode: "light" },
  user: null,
  authStatus: {
    email: null,
    isLoggedIn: false,
    isVerified: false,
  },
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

    setUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    },
    setAuthStatus: (state, action) => {
      if (action.payload === null) state.authStatus = null;
      state.authStatus = { ...state.authStatus, ...action.payload };
    },

    logout: (state) => {
      delete state.user;
      sessionStorage.clear();
      state.authStatus.email = null;
      state.authStatus.isLoggedIn = false;
      state.authStatus.isVerified = false;
      state.settings.mode = "light";
    },
  },
});
export const { setUser, setSettings, setIsVerified, setAuthStatus, logout } =
  slice.actions;
export default slice.reducer;
