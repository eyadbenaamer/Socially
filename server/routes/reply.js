import express from "express";
import { deleteReply, edit, get, likeToggle } from "../controllers/reply.js";
import { verifyToken } from "../middleware/auth.js";
import { verifyId } from "../middleware/check.js";
import { getPostsInfo } from "../middleware/post.js";
const router = express.Router();
//root path: /reply

/*READ*/

router.get("/", verifyId, getPostsInfo, get);

/*UPDATE*/

router.patch("/edit", verifyId, verifyToken, getPostsInfo, edit);
router.patch("/like-toggle", verifyId, verifyToken, getPostsInfo, likeToggle);

/*DELETE*/

router.delete("/delete", verifyId, verifyToken, getPostsInfo, deleteReply);
export default router;
