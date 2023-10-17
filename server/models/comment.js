import { Schema, model } from "mongoose";
import { ReplySchema } from "./reply.js";
export const CommentSchema = new Schema(
  {
    userId: String,
    content: {
      type: String,
      required: true,
    },
    likes: [],

    replies: [ReplySchema],
  },
  { timestamps: true }
);
const Comment = model("comment", CommentSchema);
export default Comment;
