import { Router } from "express";
import { verifyId } from "../middleware/check.js";
import { verifyToken } from "../middleware/auth.js";
import { getPostsInfo } from "../middleware/post.js";
import {
  getUser,
  getSavedIds,
  getSavedPosts,
  toggleSavePost,
} from "../controllers/user.js";

const router = Router();

router.get("/user/", verifyId, verifyToken, getUser);
router.get("/saved_posts/", verifyId, verifyToken, getSavedPosts);
router.get("/saved_posts_ids/", verifyId, verifyToken, getSavedIds);

router.get(
  "/toggle_save_post/:userId/:postId",
  verifyId,
  verifyToken,
  getPostsInfo,
  toggleSavePost
);
export default router;
