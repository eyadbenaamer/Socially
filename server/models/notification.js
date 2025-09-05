import { Schema, model, Types } from "mongoose";

const { ObjectId } = Types;

const NotificationSchema = new Schema({
  // a reference to the user who will receive the notification
  userId: ObjectId,
  // the ID of the engaged user in the notification
  engagedUserId: ObjectId,
  type: { type: String, default: "" }, // follow, share, comment, reply, PostLike, commentLike, replyLike
  // the url reffered to when the notification is clicked
  path: { type: String, default: "" },
  isRead: { type: Boolean, default: false },
  createdAt: Number,
});

NotificationSchema.index({ userId: 1 });

const Notification = model("Notification", NotificationSchema);
export default Notification;
