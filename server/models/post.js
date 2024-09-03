import { Schema, Types } from "mongoose";

const { ObjectId } = Types;

const ReplySchema = new Schema({
  creatorId: String,
  rootCommentId: String,
  text: String,
  file: { fileType: String, path: String },
  likes: [],
  createdAt: Number,
});

const CommentSchema = new Schema({
  creatorId: String,
  text: String,
  likes: [],
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
  likes: { type: [String], default: [] },
  views: { type: [{ _id: ObjectId }], default: [] },
  comments: { type: [CommentSchema], default: [] },
  sharedPost: {
    _id: ObjectId,
    creatorId: String,
  },
  createdAt: {
    type: Number,
    default: Date.now(),
  },
});
