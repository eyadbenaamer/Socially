import { model, Schema, Types } from "mongoose";

const ObjectId = Types.ObjectId;

const CommentSchema = new Schema({
  creatorId: ObjectId,
  postId: ObjectId,
  notificationId: ObjectId,
  text: String,
  file: { fileType: String, path: String },
  createdAt: Number,
});

CommentSchema.index({ postId: 1 });

const Comment = model("Comment", CommentSchema);
export default Comment;
