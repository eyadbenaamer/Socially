import { Schema, model } from "mongoose";
import { CommentSchema } from "./comment.js";

const PostSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  location: String,
  text: String,
  files: {
    photos: [String],
    videos: [String],
  },
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
