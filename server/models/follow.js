import { Schema, model, Types } from "mongoose";

const { ObjectId } = Types;

const FollowSchema = new Schema({
  followedId: { type: ObjectId, ref: "User", required: true },
  followerId: { type: ObjectId, ref: "User", required: true },
  notificationId: { type: ObjectId, ref: "Notification", required: true },
});

FollowSchema.index({ followedId: 1 });
FollowSchema.index({ followerId: 1 });

const Follow = model("Follow", FollowSchema);

export default Follow;
