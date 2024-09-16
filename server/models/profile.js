import { Schema, model, Types } from "mongoose";
const { ObjectId } = Types;
import { config } from "dotenv";
config();
const ProfileSchema = new Schema({
  _id: {
    type: ObjectId,
  },
  firstName: {
    type: String,
    required: true,
    min: 2,
    max: 20,
  },
  lastName: {
    type: String,
    required: true,
    min: 2,
    max: 20,
  },
  username: {
    type: String,
    unique: true,
    min: 1,
    max: 20,
  },
  profilePicPath: {
    type: String,
    default: `${process.env.API_URL}/assets/blank_user.jpg`,
  },
  coverPicPath: { type: String, default: "" },
  bio: { type: String, default: "" },
  birthDate: String,
  gender: String,
  followers: {
    type: [{ _id: ObjectId, notificationId: String }],
    default: [],
  },
  following: {
    type: [{ _id: ObjectId }],
    default: [],
  },
  location: {
    type: String,
    min: 2,
    max: 20,
  },
  lastSeenAt: Number,
  joinedAt: { type: Number, default: Date.now() },
});
const Profile = model("Profiles", ProfileSchema);
export default Profile;
