import { Schema, model } from "mongoose";
export const ReplySchema = new Schema({
  userId: String,
  rootCommentId: String,
  content: {
    type: String,
    required: true,
  },
  likes: [],
  createdAt: {
    type: Number,
    default: Date.now(),
  },
});
const Reply = model("reply", ReplySchema);
export default Reply;
