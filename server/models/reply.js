import { model, Schema } from "mongoose";

const { ObjectId } = Schema.Types;

const ReplySchema = new Schema({
  creatorId: { type: ObjectId, ref: "user" },
  postId: { type: ObjectId, ref: "post" },
  commentId: { type: ObjectId, ref: "comment" },
  notificationId: { type: ObjectId, ref: "notification" },
  text: String,
  file: { fileType: String, path: String },
  createdAt: { type: Number, default: Date.now },
});

ReplySchema.index({ postId: 1 });
ReplySchema.index({ commentId: 1 });

const Reply = model("Reply", ReplySchema);
export default Reply;
