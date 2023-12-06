import { Schema, model } from "mongoose";

const ReplySchema = new Schema({
  creatorId: String,
  rootCommentId: String,
  content: {
    type: String,
    required: true,
  },
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
      order: Number,
      fileType: String,
    },
  ],
  likes: [],
  comments: [CommentSchema],
  createdAt: {
    type: Number,
    default: Date.now(),
  },
});
