import { Schema, model, Types } from "mongoose";

const { ObjectId } = Types;

const SavedPostSchema = new Schema({
  userId: { type: ObjectId, ref: "User", required: true },
  postId: { type: ObjectId, ref: "Post", required: true },
  createdAt: { type: Number, required: true },
});

SavedPostSchema.index({ userId: 1 });

const SavedPost = model("SavedPost", SavedPostSchema);
export default SavedPost;
