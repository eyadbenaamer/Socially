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
    seenBy: {
      type: [{ default: { _id: ObjectId } }],
      default: [],
    },
    likedBy: {
      type: [{ default: { _id: ObjectId } }],
      default: [],
    },
  },

  text: String,
  files: { fileType: String, path: String },
  replyTo: { type: ObjectId, rel: "Message" }, // message ID
  createdAt: Number,
});

const ConversationSchema = new Schema({
  participants: {
    type: [{ default: { _id: ObjectId } }],
    default: [],
  },
  messages: { type: [MessageSchema], default: [] },
  updatedAt: Number,
});

const Conversation = model("Conversation", ConversationSchema);

export default Conversation;
