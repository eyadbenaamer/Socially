import express from "express";
import {
  login,
  resetPassword,
  sendVerificationCode,
  signup,
  verifyAccount,
  verifyResetPasswordCode,
} from "../controllers/auth.js";
import cookieParser from "cookie-parser";
import { verifyToken } from "../middleware/auth.js";
import { verifyFields } from "../middleware/check.js";

const router = express.Router();

router.post("/signup", verifyFields, signup);
router.post("/login", cookieParser(process.env.COOKIE_SECRET), login);

//sends the verification code whenever the user resets the password or verifies the account
router.post("/send_verification_code/", sendVerificationCode);

//to verify the account by the verification code
router.post("/verify_account", verifyAccount);

//to verify the account by the token that has been sent to the user's email
router.get("/verify_account/:verificationToken", verifyAccount);

//this route recieves the verification code and returns the token
router.post("/reset_password/verify_code/", verifyResetPasswordCode);

//this route recieves the verification token that has been sent to the user's email
router.post("/reset_password/:token", resetPassword);

export default router;
