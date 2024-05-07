import { Schema, Types, model } from "mongoose";
import { PostSchema } from "./post.js";

const PostsSchema = new Schema({
  _id: Types.ObjectId,
  posts: [PostSchema],
});
const Posts = model("posts", PostsSchema);
export default Posts;
