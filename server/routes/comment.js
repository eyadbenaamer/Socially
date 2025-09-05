import express from "express";
import {
  getOne,
  getPage,
  edit,
  deleteComment,
  likeToggle,
  getLikes,
} from "../controllers/comment.js";
import { getUserInfo, verifyToken } from "../middleware/auth.js";
import { verifyId } from "../middleware/check.js";
import { getPostsInfo } from "../middleware/post.js";

//root path: /comment

const router = express.Router();

router.get("/", verifyId, getUserInfo, getPostsInfo, getOne);

router.get("/likes", verifyId, getUserInfo, getLikes);

router.get("/page", verifyId, getUserInfo, getPostsInfo, getPage);

router.patch("/like-toggle", verifyId, verifyToken, getPostsInfo, likeToggle);

router.patch("/edit", verifyId, verifyToken, getPostsInfo, edit);

router.delete("/delete", verifyId, verifyToken, getPostsInfo, deleteComment);

export default router;
