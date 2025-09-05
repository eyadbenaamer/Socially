import express from "express";
import {
  deleteReply,
  edit,
  get,
  getLikes,
  getPage,
  likeToggle,
} from "../controllers/reply.js";
import { getUserInfo, verifyToken } from "../middleware/auth.js";
import { verifyId } from "../middleware/check.js";
import { getPostsInfo } from "../middleware/post.js";
const router = express.Router();
//root path: /reply

router.get("/", verifyId, getUserInfo, getPostsInfo, get);

router.get("/likes", verifyId, getUserInfo, getLikes);

router.get("/page", verifyId, getUserInfo, getPostsInfo, getPage);

router.patch("/edit", verifyId, verifyToken, getPostsInfo, edit);

router.patch("/like-toggle", verifyId, verifyToken, getPostsInfo, likeToggle);

router.delete("/delete", verifyId, verifyToken, getPostsInfo, deleteReply);

export default router;
