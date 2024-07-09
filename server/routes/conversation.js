import express from "express";

import { clear, getAll, getOne } from "../controllers/conversation.js";

import { verifyId } from "../middleware/check.js";
import { verifyToken } from "../middleware/auth.js";
import { getConversationInfo } from "../middleware/conversation.js";

const router = express.Router();

//root path: /conversation

/*READ*/

router.get("/all", verifyId, verifyToken, getAll);
router.get("/", verifyId, verifyToken, getOne);

/*DELETE*/

router.delete("/clear", verifyId, verifyToken, getConversationInfo, clear);

export default router;
