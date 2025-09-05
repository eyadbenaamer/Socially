import { model, Schema, Types } from "mongoose";

const ObjectId = Types.ObjectId;

const CommentLikeSchema = new Schema({
  userId: ObjectId,
  postId: ObjectId,
  commentId: ObjectId,
  notificationId: ObjectId,
  createdAt: Number,
});

CommentLikeSchema.index({ postId: 1 });
CommentLikeSchema.index({ commentId: 1 });

const CommentLike = model("CommentLike", CommentLikeSchema);
export default CommentLike;
