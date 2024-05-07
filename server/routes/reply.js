import express from "express";
import { deleteReply, edit, get, like } from "../controllers/reply.js";
import { verifyToken } from "../middleware/auth.js";
import { verifyId } from "../middleware/check.js";
import { getPostData } from "../middleware/post.js";
const router = express.Router();
//root path: /reply

/*READ*/

router.get("/", verifyId, getPostData, get);

/*UPDATE*/

router.patch("/edit", verifyId, verifyToken, getPostData, edit);
router.patch("/like", verifyId, verifyToken, getPostData, like);

/*DELETE*/

router.delete("/delete", verifyId, verifyToken, getPostData, deleteReply);
export default router;
