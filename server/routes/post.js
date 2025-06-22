import express from "express";
import {
  getPost,
  edit,
  deletePost,
  likeToggle,
  toggleComments,
} from "../controllers/post.js";
import { verifyToken } from "../middleware/auth.js";
import { verifyId } from "../middleware/check.js";
import { getPostsInfo } from "../middleware/post.js";
const router = express.Router();
//root path: /post

router.get("/", verifyId, getPostsInfo, getPost);

router.patch("/edit", verifyId, verifyToken, getPostsInfo, edit);

router.patch("/like-toggle", verifyId, verifyToken, getPostsInfo, likeToggle);

router.patch(
  "/toggle_comments",
  verifyId,
  verifyToken,
  getPostsInfo,
  toggleComments
);

router.delete("/delete", verifyId, verifyToken, getPostsInfo, deletePost);

export default router;
