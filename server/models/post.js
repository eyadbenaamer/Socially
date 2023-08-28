import { Schema, model, Types } from "mongoose";
const ObjectId = Types.ObjectId;
const PostSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    location: String,
    description: String,
    picturePath: String,
    likes: {
      type: Array,
      default: [],
    },
    comments: [
      {
        _id: {
          type: ObjectId,
          default: new ObjectId(),
        },
        userId: String,
        body: {
          type: String,
          required: true,
        },
        likes: {
          type: Array,
          default: [],
        },
      },
    ],
  },
  { timestamps: true }
);
const Post = model("Post", PostSchema);
export default Post;
