import { Schema, Types, model } from "mongoose";
const { ObjectId } = Types;

const MessageSchema = new Schema({
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

const ConversationSchema = new Schema({
  participants: {
    type: [
      {
        _id: ObjectId,
        unreadMessagesCount: { type: Number, default: 0 },
      },
    ],
    default: [],
  },
  messages: { type: [MessageSchema], default: [] },
  updatedAt: Number,
});

const Conversation = model("Conversation", ConversationSchema);

export default Conversation;
