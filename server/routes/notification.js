import express from "express";

import {
  clear,
  getAll,
  setRead,
  setAllRead,
  deleteOne,
} from "../controllers/notification.js";

import { verifyId } from "../middleware/check.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

//root path: /notification

/*READ*/

router.get("/", verifyId, verifyToken, getAll);

/*UPDATE*/

router.patch("/set_read/:id", verifyId, verifyToken, setRead);
router.patch("/set_read", verifyId, verifyToken, setAllRead);

/*DELETE*/

router.delete("/delete/:id", verifyId, verifyToken, deleteOne);
router.delete("/clear", verifyId, verifyToken, clear);

export default router;
