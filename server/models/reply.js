import { Schema, model } from "mongoose";
export const ReplySchema = new Schema(
  {
    userId: String,
    rootCommentId: String,
    content: {
      type: String,
      required: true,
    },
    likes: [],
  },
  { timestamps: true }
);
const Reply = model("reply", ReplySchema);
export default Reply;
