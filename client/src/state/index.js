import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  settings: { mode: "light" },
  posts: [],
  user: null,
  token: null,
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
    setPosts: (state, action) => {
      state.posts = action.payload.posts;
    },
    setLogin: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    setUser: (state, action) => {
      state.user = action.payload.user;
    },
    logout: (state) => {
      delete state.posts;
      delete state.user;
      delete state.token;
      delete state.user;
      state.settings.mode = "light";
    },
  },
});
export const { setLogin, setPost, setSettings, setUser, logout } =
  slice.actions;
export default slice.reducer;
