import express from "express";

import { deleteMessage, likeToggle } from "../controllers/message.js";

import { verifyId } from "../middleware/check.js";
import { verifyToken } from "../middleware/auth.js";
import { getConversationInfo } from "../middleware/conversation.js";

const router = express.Router();
//root path: /message

/*UPDATE*/
router.patch(
  "/like-toggle",
  verifyId,
  verifyToken,
  getConversationInfo,
  likeToggle
);

/*DELETE*/
router.delete(
  "/delete",
  verifyId,
  verifyToken,
  getConversationInfo,
  deleteMessage
);

export default router;
