import { Router } from "express";

import { search, autocomplete } from "../controllers/search.js";

import { verifyToken } from "../middleware/auth.js";

const router = Router();

router.get("/", verifyToken, search);
router.get("/suggest", verifyToken, autocomplete);

export default router;
