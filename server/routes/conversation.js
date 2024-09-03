import express from "express";

import {
  clear,
  getAll,
  getOne,
  getUnreadMessages,
  setRead,
} from "../controllers/conversation.js";

import { verifyId } from "../middleware/check.js";
import { verifyToken } from "../middleware/auth.js";
import { getConversationInfo, isInChat } from "../middleware/conversation.js";

const router = express.Router();

//root path: /conversation

/*READ*/

router.get("/all", verifyId, verifyToken, getAll);
router.get("/", verifyId, verifyToken, getOne);
router.get("/unread_messages", verifyId, verifyToken, getUnreadMessages);
router.get("/set_read", verifyId, verifyToken, setRead);

/*DELETE*/

router.delete(
  "/clear",
  verifyId,
  verifyToken,
  getConversationInfo,
  isInChat,
  clear
);

export default router;
