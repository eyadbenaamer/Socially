import { model, Schema, Types } from "mongoose";

const ObjectId = Types.ObjectId;

const PostLikeSchema = new Schema({
  userId: ObjectId,
  postId: ObjectId,
  notificationId: ObjectId,
  createdAt: Number,
});

PostLikeSchema.index({ postId: 1, createdAt: -1 });

const PostLike = model("PostLike", PostLikeSchema);
export default PostLike;
