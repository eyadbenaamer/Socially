import { model, Schema, Types } from "mongoose";

const { ObjectId } = Types;

export const PostSchema = new Schema({
  creatorId: ObjectId,
  location: String,
  text: String,
  keywords: { type: [String], default: [] },
  isCommentsDisabled: { type: Boolean, default: false },
  files: [
    {
      path: String,
      fileType: String,
    },
  ],
  sharedPost: {
    type: {
      _id: ObjectId,
      creatorId: ObjectId,
      notificationId: ObjectId,
    },
    default: null,
  },
  createdAt: {
    type: Number,
    default: Date.now(),
  },
});

PostSchema.index({ creatorId: 1, createdAt: -1 });
PostSchema.index({ keywords: 1 });

const Post = model("post", PostSchema);
export default Post;
