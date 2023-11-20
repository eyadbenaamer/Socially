import { Schema, model } from "mongoose";
import { PostSchema } from "./post.js";

const PostListSchema = new Schema({
  posts: [PostSchema],
});
const PostList = model("post_list", PostListSchema);
export default PostList;
