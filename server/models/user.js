import { Schema, model, Types } from "mongoose";
const { ObjectId } = Types;

const NotificationSchema = new Schema({
  content: String,
  picture: String,
  type: String, // following, like, comment or reply
  // the url reffered to when the notification is clicked
  url: String,
  cratedAt: Number,
  isRead: { type: Boolean, default: false },
});

const UserSchema = new Schema(
  {
    email: { type: String, uniqe: true, max: 50 },
    password: {
      type: String,
      required: true,
      min: 8,
      max: 50,
    },
    contacts: {
      type: [{ _id: ObjectId, conversationId: String }],
      rel: "User",
      default: [],
    },
    notifications: [NotificationSchema],
    conversations: {
      type: [
        {
          _id: { type: ObjectId, rel: "User" },
        },
      ],
      rel: "Conversation",
      default: [],
    },
    unreadMessagesCount: { type: Number, default: 0, min: 0 },
    unreadNotificationsCount: { type: Number, default: 0, min: 0 },
    /*
    this is where all undelivered messages are stored, each one will 
    be deliverdTo set once the user is connected
    */
    undeliveredConversations: {
      type: [
        {
          _id: ObjectId,
          participants: {
            type: [{ default: { _id: ObjectId } }],
            default: [],
          },
          messages: {
            type: [{ _id: ObjectId }],
            default: [],
          },
        },
      ],
      default: [],
    },
    verificationStatus: {
      isVerified: { type: Boolean, default: false },
      verificationToken: String,
    },
    resetPasswordToken: String,
    savedPosts: [
      new Schema({
        userId: String,
        postId: String,
      }),
    ],
  },
  { timestamps: true }
);
const User = model("Users", UserSchema);
export default User;
