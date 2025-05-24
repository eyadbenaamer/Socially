import { model, Schema, Types } from "mongoose";

const { ObjectId } = Types;

const ReplySchema = new Schema({
  creatorId: String,
  rootCommentId: String,
  text: String,
  file: { fileType: String, path: String },
  likes: { type: [{ _id: ObjectId, notificationId: String }], default: [] },
  notificationId: String,
  createdAt: Number,
});

const CommentSchema = new Schema({
  creatorId: String,
  text: String,
  likes: { type: [{ _id: ObjectId, notificationId: String }], default: [] },
  notificationId: String,
  file: { fileType: String, path: String },
  replies: [ReplySchema],
  createdAt: Number,
});

export const PostSchema = new Schema({
  creatorId: String,
  location: String,
  text: String,
  isCommentsDisabled: { type: Boolean, default: false },
  files: [
    {
      path: String,
      fileType: String,
    },
  ],
  likes: { type: [{ _id: ObjectId, notificationId: String }], default: [] },
  notificationId: String,
  views: { type: [{ _id: ObjectId }], default: [] },
  comments: { type: [CommentSchema], default: [] },
  sharedPost: {
    type: {
      _id: ObjectId,
      creatorId: String,
      notificationId: String,
    },
    default: null,
  },
  createdAt: {
    type: Number,
    default: Date.now(),
  },
});

PostSchema.index({ creatorId: 1 });
PostSchema.index({ creatorId: 1, createdAt: -1 });

const Post = model("posts", PostSchema);
export default Post;
