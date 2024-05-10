import express from "express";
import { getFeedPosts, getUserPosts } from "../controllers/posts.js";
import { verifyId } from "../middleware/check.js";
import { getPostsInfo } from "../middleware/post.js";
const router = express.Router();
//root path: /posts

/*READ*/

router.get("/", verifyId, getFeedPosts); // get feed posts
router.get("/user/", verifyId, getPostsInfo, getUserPosts); // get all user's posts by page

export default router;
