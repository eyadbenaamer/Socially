import { Schema, model } from "mongoose";
const CommentSchema = new Schema({
  userId: String,
  body: {
    type: String,
    required: true,
  },
  likes: {
    type: Array,
    default: [],
  },
});
const Comment = model("comment", CommentSchema);
export default Comment;
