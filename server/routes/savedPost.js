import { Router } from "express";

import { get, toggleSavePost } from "../controllers/savedPost.js";

import { verifyId } from "../middleware/check.js";
import { verifyToken } from "../middleware/auth.js";
import { getPostsInfo } from "../middleware/post.js";

const router = Router();

router.get("/saved_posts/", verifyId, verifyToken, get);

router.patch(
  "/toggle_save_post",
  verifyId,
  verifyToken,
  getPostsInfo,
  toggleSavePost
);

export default router;
