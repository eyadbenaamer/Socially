import { Router } from "express";
import { verifyId } from "../middleware/check.js";
import { verifyToken } from "../middleware/auth.js";
import { getUser } from "../controllers/user.js";

const router = Router();

router.get("/user/", verifyId, verifyToken, getUser);

export default router;
