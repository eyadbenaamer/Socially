import { model, Schema, Types } from "mongoose";

const { ObjectId } = Types;

const ViewSchema = new Schema({
  userId: ObjectId,
  postId: ObjectId,
  createdAt: Number,
});

ViewSchema.index({ postId: 1 });

const View = model("View", ViewSchema);
export default View;
