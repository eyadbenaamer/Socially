import { Schema, model, Types } from "mongoose";
const ObjectId = Types.ObjectId;
const PostListSchema = new Schema({
  _id: {
    type: ObjectId,
    required: true,
  },
  entries: {
    type: Array,
    default: [],
    comments: {
      type: Array,
      default: [],
    },
    // max: 5,
  },
});
const PostList = model("post list", PostListSchema);
export default PostList;
