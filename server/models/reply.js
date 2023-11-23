import { Schema, model } from "mongoose";
export const ReplySchema = new Schema({
  creatorId: String,
  rootCommentId: String,
  content: {
    type: String,
    required: true,
  },
  likes: [],
  createdAt: Number,
});
const Reply = model("reply", ReplySchema);
export default Reply;
