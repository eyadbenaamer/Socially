import express from "express";
import {
  get,
  getLikes,
  edit,
  deletePost,
  likeToggle,
  setViewed,
  toggleComments,
} from "../controllers/post.js";
import { getUserInfo, verifyToken } from "../middleware/auth.js";
import { verifyId } from "../middleware/check.js";
import { getPostsInfo } from "../middleware/post.js";

const router = express.Router();
//root path: /post

router.get("/", verifyId, getUserInfo, getPostsInfo, get);

router.get("/likes", verifyId, getUserInfo, getLikes);

router.patch("/edit", verifyId, verifyToken, getPostsInfo, edit);

router.patch("/like-toggle", verifyId, verifyToken, getPostsInfo, likeToggle);

router.patch("/set-viewed", verifyId, verifyToken, getPostsInfo, setViewed);

router.patch(
  "/toggle_comments",
  verifyId,
  verifyToken,
  getPostsInfo,
  toggleComments
);

router.delete("/delete", verifyId, verifyToken, getPostsInfo, deletePost);

export default router;
