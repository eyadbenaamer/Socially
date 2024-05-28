import express from "express";
import {
  checkEmailForRegister,
  checkEmailForResetPassword,
  login,
  loginWithToken,
  resetPassword,
  sendVerificationCode,
  signup,
  verifyAccountByToken,
  verifyAccountByCode,
  verifyResetPasswordCode,
  verifyResetPasswordToken,
} from "../controllers/auth.js";
import cookieParser from "cookie-parser";
import { verifyFields } from "../middleware/check.js";

const router = express.Router();

router.post("/signup", verifyFields, signup);

// checks if the concerned email is already registered for registration
router.get("/check_email_availability/register/:email", checkEmailForRegister);

// checks if the concerned email is registered or not for password reset
router.get(
  "/check_email_availability/reset_password/:email",
  checkEmailForResetPassword
);

// login with email and password
router.post("/login", cookieParser(process.env.COOKIE_SECRET), login);

// this endpoint is used to check if the stored token is valid, if not then the user has to login again.
router.get("/login", loginWithToken);

//sends the verification code whenever the user resets the password or verifies the account
router.post("/send_verification_code/", sendVerificationCode);

//to verify the account by the verification code
router.post("/verify_account", verifyAccountByCode);

//to verify the account by the token that has been sent to the user's email
router.get("/verify_account", verifyAccountByToken);

//this route recieves the verification code and returns a token that entities the user to reset the password
router.post("/verify_reset_password/", verifyResetPasswordCode);

//this route recieves the verification token and returns a token that entities the user to reset the password
router.get("/verify_reset_password/", verifyResetPasswordToken);

//this route recieves the new password to be set by token that entiltels the user to reset the password
router.post("/reset_password/:token", resetPassword);

export default router;
