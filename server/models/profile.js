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
  coverPath: { type: String, default: "" },
  avatarPath: {
    type: String,
    default: `${process.env.API_URL}/assets/blank_user.jpg`,
  },
  bio: { type: String, default: "" },
  birthDate: String,
  gender: String,
  followers: {
    type: Array,
    default: [],
  },
  following: {
    type: Array,
    default: [],
  },
  location: String,
  joinedAt: { type: Number, default: Date.now() },
});
const Profile = model("Profiles", ProfileSchema);
export default Profile;
