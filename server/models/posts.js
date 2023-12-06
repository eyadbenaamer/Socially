import { Schema, model } from "mongoose";
import { PostSchema } from "./post.js";

const PostsSchema = new Schema({
  posts: [PostSchema],
});
const Posts = model("posts", PostsSchema);
export default Posts;
