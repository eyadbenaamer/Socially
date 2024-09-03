import express from "express";

import { deleteMessage, likeToggle } from "../controllers/message.js";

import { verifyId } from "../middleware/check.js";
import { verifyToken } from "../middleware/auth.js";
import { getConversationInfo, isInChat } from "../middleware/conversation.js";

const router = express.Router();
//root path: /message

/*UPDATE*/
router.patch(
  "/like-toggle",
  verifyId,
  verifyToken,
  getConversationInfo,
  isInChat,
  likeToggle
);

/*DELETE*/
router.delete(
  "/delete",
  verifyId,
  verifyToken,
  getConversationInfo,
  isInChat,
  deleteMessage
);

export default router;
