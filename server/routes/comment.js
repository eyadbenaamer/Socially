import express from "express";
import {
  get,
  edit,
  deleteComment,
  likeToggle,
} from "../controllers/comment.js";
import { verifyToken } from "../middleware/auth.js";
import { verifyId } from "../middleware/check.js";
import { getPostsInfo } from "../middleware/post.js";
const router = express.Router();
//root path: /comment

/*READ*/

// get a pirticular comment
router.get("/", verifyId, getPostsInfo, get);

/*UPDATE*/
router.patch("/like", verifyId, verifyToken, getPostsInfo, likeToggle);

router.patch("/edit", verifyId, verifyToken, getPostsInfo, edit);

/*DELETE*/
router.delete("/delete", verifyId, verifyToken, getPostsInfo, deleteComment);

export default router;
