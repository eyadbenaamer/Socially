import { Router } from "express";
import { verifyId } from "../middleware/check.js";
import { verifyToken } from "../middleware/auth.js";
import { getPostData } from "../middleware/post.js";
import {
  getSavedIds,
  getSavedPosts,
  toggleSavePost,
} from "../controllers/user.js";

const router = Router();

router.get("/saved_posts/", verifyId, verifyToken, getSavedPosts);
router.get("/saved_posts_ids/", verifyId, verifyToken, getSavedIds);

router.post(
  "/toggle_save_post/:userId/:postId",
  verifyId,
  verifyToken,
  getPostData,
  toggleSavePost
);
export default router;
