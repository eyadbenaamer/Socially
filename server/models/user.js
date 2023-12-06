import { Schema, model, Types } from "mongoose";
const UserSchema = new Schema(
  {
    username: { type: String, uniqe: true, max: 50, default: "" },
    email: { type: String, uniqe: true, max: 50 },
    password: {
      type: String,
      required: true,
      min: 8,
      max: 50,
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

    // ArraySubdocument: { type:  },
  },
  { timestamps: true }
);
const User = model("Users", UserSchema);
export default User;
