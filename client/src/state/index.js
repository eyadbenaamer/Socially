import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  settings: {},
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
        [action.payload]: action.payload,
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
  },
});
export const { setLogin, setPost, setSettings, setUser } = slice.actions;
export default slice.reducer;
