import express from "express";
import { login, signup } from "../controllers/auth.js";
import cookieParser from "cookie-parser";

const router = express.Router();

router.post("/login", cookieParser("s"), login);
// router.post("/signup", signup);

export default router;
