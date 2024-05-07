import express from "express";
import {
  get,
  edit,
  deleteComment,
  likeToggle,
} from "../controllers/comment.js";
import { verifyToken } from "../middleware/auth.js";
import { verifyId } from "../middleware/check.js";
import { getPostData } from "../middleware/post.js";
const router = express.Router();
//root path: /comment

/*READ*/

// get a pirticular comment
router.get("/", verifyId, getPostData, get);

/*UPDATE*/
router.patch("/like", verifyId, verifyToken, getPostData, likeToggle);

router.patch("/edit", verifyId, verifyToken, getPostData, edit);

/*DELETE*/
router.delete("/delete", verifyId, verifyToken, getPostData, deleteComment);

export default router;
