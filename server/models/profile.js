import { Schema, model, Types } from "mongoose";
import { client } from "../services/elasticsearch.js";
const { ObjectId } = Types;

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
    default: `/assets/blank_user.jpg`,
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

// indexing the profile in elasticsearch
ProfileSchema.post("save", async function (doc) {
  try {
    await client.index({
      index: "profiles",
      id: doc._id.toString(),
      document: {
        firstName: doc.firstName,
        lastName: doc.lastName,
        username: doc.username,
        suggest: {
          input: [doc.username, doc.firstName, doc.lastName],
        },
      },
    });
  } catch (error) {
    console.error("Error indexing document in Elasticsearch:", error);
  }
});

const Profile = model("Profiles", ProfileSchema);

export default Profile;
