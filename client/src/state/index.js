import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  settings: { mode: "light" },
  user: null,
  loginStatus: {
    email: null,
  },
  isVerified: null,
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
    setIsVerified: (state, action) => {
      state.isVerified = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload.user;
      state.isVerified = action.payload.isVerified;
    },
    setLoginStatus: (state, action) => {
      state.loginStatus = { ...state.loginStatus, ...action.payload };
    },
    logout: (state) => {
      delete state.user;
      state.settings.mode = "light";
    },
  },
});
export const { setUser, setSettings, setIsVerified, setLoginStatus, logout } =
  slice.actions;
export default slice.reducer;
