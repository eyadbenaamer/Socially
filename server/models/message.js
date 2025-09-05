import { Schema, Types, model } from "mongoose";
const { ObjectId } = Types;

const MessageSchema = new Schema({
  conversationId: ObjectId,
  senderId: {
    type: ObjectId,
    rel: "User",
  },
  to: { type: [{ default: { _id: ObjectId } }], default: [] },
  info: {
    deliveredTo: {
      type: [{ default: { _id: ObjectId } }],
      default: [],
    },
    readBy: {
      type: [{ default: { _id: ObjectId } }],
      default: [],
    },
    likedBy: {
      type: [{ default: { _id: ObjectId } }],
      default: [],
    },
  },
  text: { type: String, default: "" },
  files: { fileType: String, path: String },
  replyTo: { type: ObjectId, rel: "Message" }, // message ID
  createdAt: Number,
});

MessageSchema.index({ conversationId: 1, createdAt: -1 });

const Message = model("Message", MessageSchema);

export default Message;
