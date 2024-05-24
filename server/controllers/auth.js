import { createTransport } from "nodemailer";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import Profile from "../models/profile.js";
import { generateCode } from "../utils/generateCode.js";
import Posts from "../models/posts.js";

import { sendCodeEmail } from "../utils/sendEmail.js";

/*REGISTER USER*/

export const signup = async (req, res) => {
  //TODO: set validatior for this route
  try {
    const { firstName, lastName, email, password, birthDate, gender } =
      req.body;
    if (!(firstName && lastName && email && password && birthDate && gender)) {
      return res.status(400).json({ message: "Required fields missing." });
    }
    const isEmailUsed = (await User.findOne({ email })) ? true : false;
    if (isEmailUsed) {
      return res.status(409).json({ message: "This email is registered." });
    }
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      email: email.trim().toLowerCase(),
      password: hashedPassword,
    });
    const verificationCode = generateCode(6);
    try {
      const transporter = createTransport({
        service: "gmail",
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_PASSWORD,
        },
      });
      transporter.sendMail({
        subject: "Code verification",
        to: email,
        html: `${verificationCode}`,
      });
      console.log(verificationCode);
    } catch (error) {
      console.log(error);
    }
    const verificationToken = jwt.sign(
      { id: newUser._id, verificationCode },
      process.env.JWT_SECRET,
      {
        expiresIn: "10m",
      }
    );
    newUser.verificationStatus.verificationToken = verificationToken;
    newUser.save();
    const newProfile = new Profile({
      _id: newUser.id,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      birthDate,
      gender: firstName.trim(),
    });
    const newPostList = new Posts({ id: newUser.id });
    newPostList.save();
    newProfile.save();
    return res.status(201).send("user created.");
  } catch {
    return res
      .status(500)
      .json({ message: "An error occurred. please try again later." });
  }
};
export const checkEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const user = await User.findOne({ email });
    if (user) {
      res.status(409).json({ message: "This email address is registered." });
    } else {
      res.status(200).send("available");
    }
  } catch {
    return res
      .status(500)
      .json({ message: "An error occurred. please try again later." });
  }
};
/*LOGIN USER*/
export const login = async (req, res) => {
  try {
    let { email, userName, password } = req.body;
    email = email.trim().toLowerCase();
    if (!password && (userName || email)) {
      return res.status(400).json({ message: "Invalid credentials." });
    }
    let user;
    if (userName && !email) {
      user = await User.findOne({ userName });
    } else {
      user = await User.findOne({ email });
    }
    if (!user) {
      return res.status(404).json({ message: "The user doesn't exist." });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password." });
    }
    const isVerified = user.verificationStatus.isVerified;
    if (!isVerified) {
      const verificationCode = generateCode(6);
      // send email with verification code
      const verificationToken = jwt.sign(
        { id: user.id, verificationCode },
        process.env.JWT_SECRET,
        {
          expiresIn: "10m",
        }
      );
      sendCodeEmail(email, verificationCode, verificationToken);
      console.log(verificationCode);
      user.verificationStatus.verificationToken = verificationToken;
      await user.save();
      return res.status(401).json({
        isVerified,
        message: "Verify your account first.",
      });
    }
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.TOKEN_EXPIRATION,
    });
    res.cookie("token", token, { maxAge: 500000, signed: true });

    const profile = await Profile.findById(user.id);
    return res.status(200).json({ isVerified, token, profile });
  } catch {
    return res
      .status(500)
      .json({ message: "An error occurred. try again later." });
  }
};
export const loginWithToken = async (req, res) => {
  try {
    if (req.header("Authorization")) {
      let token = req.header("Authorization");
      if (token.startsWith("Bearer ")) {
        token = token.trimStart().slice(7);
      }
      const userInfo = jwt.verify(token, process.env.JWT_SECRET);
      const profile = await Profile.findById(userInfo.id);
      if (profile) {
        return res.status(200).json(profile);
      }
    }
  } catch {
    return res
      .status(500)
      .json({ message: "An error occurred. try again later." });
  }
};
export const verifyAccount = async (req, res) => {
  try {
    const { email, code } = req.body;
    const { token: verificationToken } = req.query;

    if (code && email) {
      const user = await User.findOne({ email: email.trim().toLowerCase() });
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }
      if (user.verificationStatus.isVerified) {
        return res.status(400).send("already verified");
      }
      try {
        const userInfo = jwt.verify(
          user.verificationStatus.verificationToken,
          process.env.JWT_SECRET
        );
        if (userInfo.verificationCode == code) {
          user.verificationStatus.isVerified = true;
          user.verificationStatus.verificationToken = null;
          await user.save();
          const profile = await Profile.findById(user.id);
          const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
            expiresIn: process.env.TOKEN_EXPIRATION,
          });
          return res.status(200).json({ profile, isVerified: true, token });
        } else {
          return res.status(401).json({ message: "Invalid code." });
        }
      } catch {
        return res.status(500).json({ message: "jwt expired" });
      }
    } else if (verificationToken) {
      const userInfo = jwt.verify(verificationToken, process.env.JWT_SECRET);
      const user = await User.findById(userInfo.id);
      if (!user) {
        return res.status(400).send("Bad Request");
      }
      if (user.verificationStatus.isVerified) {
        return res.status(400).send("already verified");
      }
      if (userInfo.id === user.id) {
        user.verificationStatus.isVerified = true;
        user.verificationStatus.verificationToken = null;
        const profile = await Profile.findById(user.id);
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
          expiresIn: process.env.TOKEN_EXPIRATION,
        });
        await user.save();
        return res.status(200).json({ profile, token, isVerified: true });
      } else {
        return res.status(400).send("Bad Request");
      }
    } else {
      if (!code) {
        return res.status(400).json({ message: "Code cannot be empty." });
      } else if (!email) {
        return res.status(400).json({ message: "Email cannot be empty." });
      }
    }
  } catch {
    return res
      .status(500)
      .json({ message: "An error occurred. try again later." });
  }
};
export const resetPassword = async (req, res) => {
  try {
    const { password } = req.body;
    const { token } = req.params;
    if (!token) {
      return res.status(400).send("Bad request");
    }
    if (!password) {
      return res.status(400).json({ message: "Password is required." });
    }
    try {
      const tokenInfo = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(tokenInfo.id);
      if (!user) {
        return res.status(401).json({ message: "Invalid token" });
      }
      if (user.resetPasswordToken === null) {
        return res.status(400).send("Bad Request.");
      }
      if (user.resetPasswordToken !== token) {
        return res.status(401).json({ message: "Invalid token." });
      }
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);
      user.password = hashedPassword;
      user.resetPasswordToken = null;
      user.verificationStatus.isVerified = true;
      delete user.resetPasswordToken;
      await user.save();
      const profile = await Profile.findById(user.id);
      const loginToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: process.env.TOKEN_EXPIRATION,
      });
      return res.status(200).json({
        isVerified: true,
        user: { token: loginToken, ...profile._doc },
      });
    } catch {
      return res.status(401).json({ message: "Link expired." });
    }
  } catch {
    return res
      .status(500)
      .json({ message: "An error occurred. try again later." });
  }
};

export const sendVerificationCode = async (req, res) => {
  try {
    let { type, email } = req.body;
    email = email.trim().toLowerCase();
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    if (type === "reset_password") {
      const verificationCode = generateCode(6);
      console.log(verificationCode);
      const token = jwt.sign(
        { id: user.id, verificationCode },
        process.env.JWT_SECRET,
        {
          expiresIn: "10m",
        }
      );
      user.resetPasswordToken = token;
      user.save();
      return res
        .status(200)
        .json({ message: `We have sent a verification code to ${email}.` });
    } else if (type === "verify_account") {
      if (user.verificationStatus.isVerified) {
        return res.status(400).send("already verified");
      }
      user.verificationStatus.verificationToken = jwt.sign(
        { id: user.id, verificationCode: generateCode(6) },
        process.env.JWT_SECRET,
        {
          expiresIn: "10m",
        }
      );
      user.save();
      return res.status(200).json({ message: "Code sent." });
    } else {
      return res.status(400).send("Bad request");
    }
  } catch {
    return res
      .status(500)
      .json({ message: "An error occurred. try again later." });
  }
};
export const verifyResetPasswordCode = async (req, res) => {
  try {
    let { code, email } = req.body;
    email = email.trim().toLowerCase();
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json("Bad Request");
    }
    const tokenInfo = jwt.verify(
      user.resetPasswordToken,
      process.env.JWT_SECRET
    );
    if (tokenInfo.verificationCode !== code) {
      return res.status(401).json({ message: "Invalid code." });
    }
    return res.status(200).json({ token: user.resetPasswordToken });
  } catch {
    return res
      .status(500)
      .json({ message: "An error occurred. Plaese try again later." });
  }
};
