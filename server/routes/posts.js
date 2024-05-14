import { Router } from "express";
import { getFeedPosts, getUserPosts } from "../controllers/posts.js";
import { verifyId } from "../middleware/check.js";
import { getPostsInfo } from "../middleware/post.js";
import { verifyToken } from "../middleware/auth.js";
const router = Router();
//root path: /posts

/*READ*/

router.get("/", verifyId, verifyToken, getFeedPosts); // get feed posts
router.get("/user/", verifyId, getPostsInfo, getUserPosts); // get all user's posts by page

export default router;
