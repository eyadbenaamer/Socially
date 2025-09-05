import { Schema, Types, model } from "mongoose";

const { ObjectId } = Types;

const ConversationSchema = new Schema({
  participants: {
    type: [
      {
        _id: ObjectId,
        unreadMessagesCount: { type: Number, default: 0 },
        lastReadMessageId: { type: ObjectId, default: null, ref: "Message" },
      },
    ],
    default: [],
  },
  updatedAt: Number,
});

const Conversation = model("Conversation", ConversationSchema);

export default Conversation;
