import { Schema, model } from "mongoose";
import { CommentSchema } from "./comment.js";

export const PostSchema = new Schema({
  creatorId: String,
  location: String,
  text: String,
  isCommentsDisabled: { type: Boolean, default: false },
  files: [
    {
      name: String,
      order: Number,
      fileType: String,
    },
  ],
  likes: {
    type: Array,
    default: [],
  },
  comments: [CommentSchema],
  createdAt: {
    type: Number,
    default: Date.now(),
  },
});
const Post = model("Post", PostSchema);
export default Post;
