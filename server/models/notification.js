import { Schema, model } from "mongoose";
const NotificationSchema = new Schema(
  {
    userId: String,
    content: String,
  },
  { timestamps: true }
);
const Notification = model("notification", NotificationSchema);
export default Notification;
