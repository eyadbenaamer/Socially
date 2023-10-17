import { Schema, model, Types } from "mongoose";
import { CommentSchema } from "./comment.js";

// const ObjectId = Types.ObjectId;
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
      CommentSchema,
      // {
      //   _id: {
      //     type: ObjectId,
      //     default: new ObjectId(),
      //   },
      //   userId: String,
      //   content: {
      //     type: String,
      //     required: true,
      //   },
      //   likes: {
      //     type: Array,
      //     default: [],
      //   },
      //   replies: [
      //     {
      //       _id: {
      //         type: ObjectId,
      //         default: new ObjectId(),
      //       },
      //       userId: String,
      //       rootCommentId: String,
      //       content: {
      //         type: String,
      //         required: true,
      //       },
      //       likes: {
      //         type: Array,
      //         default: [],
      //       },
      //     },
      //   ],
      // },
    ],
  },
  { timestamps: true }
);
const Post = model("Post", PostSchema);
export default Post;
