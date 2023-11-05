import { Schema, model } from "mongoose";

const UserSchema = new Schema(
  {
    creadentials: {
      username: { type: String, uniqe: true, max: 50, default: "" },
      email: [{ type: String, uniqe: true, max: 50 }],
      phoneNubmer: [{ type: Number, uniqe: true, max: 15 }],
    },
    password: {
      type: String,
      required: true,
      min: 8,
      max: 50,
    },
  },
  { timestamps: true }
);
const User = model("Users", UserSchema);
export default User;
