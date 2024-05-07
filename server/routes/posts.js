import express from "express";
import { getFeedPosts, getUserPosts } from "../controllers/posts.js";
import { verifyId } from "../middleware/check.js";
import { getPostData, paginatePosts } from "../middleware/post.js";
const router = express.Router();
//root path: /posts

/*READ*/

router.get("/", verifyId, getFeedPosts); // get feed posts
router.get("/user/", verifyId, getPostData, paginatePosts, getUserPosts); // get all user's posts

export default router;
