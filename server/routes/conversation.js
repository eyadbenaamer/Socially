import express from "express";

import {
  clear,
  deleteConversation,
  getAll,
  getOne,
  setRead,
} from "../controllers/conversation.js";

import { verifyId } from "../middleware/check.js";
import { verifyToken } from "../middleware/auth.js";
import { getConversationInfo, isInChat } from "../middleware/conversation.js";

const router = express.Router();

//root path: /conversation

router.get("/all", verifyId, verifyToken, getAll);
router.get("/", verifyId, verifyToken, getOne);
router.patch(
  "/set_read",
  verifyId,
  verifyToken,
  getConversationInfo,
  isInChat,
  setRead
);
router.delete(
  "/delete",
  verifyId,
  verifyToken,
  getConversationInfo,
  isInChat,
  deleteConversation
);
router.patch(
  "/clear",
  verifyId,
  verifyToken,
  getConversationInfo,
  isInChat,
  clear
);

export default router;
