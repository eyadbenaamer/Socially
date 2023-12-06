import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import Profile from "../models/profile.js";
import { generateCode } from "../utils/generateCode.js";
import Posts from "../models/posts.js";
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
      return res.status(409).json({ message: "This email is used." });
    }
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      email,
      password: hashedPassword,
    });
    const verificationCode = generateCode(6);
    console.log(verificationCode);
    const verificationToken = jwt.sign(
      { id: newUser._id, verificationCode },
      process.env.JWT_SECRET,
      {
        expiresIn: "10m",
      }
    );
    newUser.verificationStatus.verificationToken = verificationToken;

    await newUser.save();
    const newProfile = new Profile({
      _id: newUser.id,
      firstName,
      lastName,
      birthDate,
      gender,
    });
    const newPostList = new Posts({ id: newUser.id });
    await newPostList.save();
    await newProfile.save();
    return res.status(201).send("user created.");
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "An error occured. please try again later." });
  }
};
/*LOGIN USER*/
export const login = async (req, res) => {
  try {
    const { email, userName, password } = req.body;
    if (!password && (userName || email)) {
      return res.status(400).json({ message: "Invalid credentials." });
    }
    let user;
    if (userName && !email) {
      user = await User.findOne({ userName });
    } else {
      user = await User.findOne({ email });
    }
    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Incorrect password." });
      }
      const isVerified = user.verificationStatus.isVerified;
      if (!isVerified) {
        const verificationCode = generateCode(6);
        console.log(verificationCode);
        const verificationToken = jwt.sign(
          { id: user.id, verificationCode },
          process.env.JWT_SECRET,
          {
            expiresIn: "10m",
          }
        );
        user.verificationStatus.verificationToken = verificationToken;
        await user.save();
        return res.status(401).json({
          isVerified,
          message: "Verify your account first.",
        });
      } else {
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
          expiresIn: process.env.TOKEN_EXPIRATION,
        });
        res.cookie("token", token, { maxAge: 500000, signed: true });

        const profile = await Profile.findById(user.id);
        return res
          .status(200)
          .json({ isVerified, user: { token, ...profile._doc } });
      }
    } else {
      return res.status(404).json({ message: "The user doesn't exist." });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "An error occurred. try again later." });
  }
};

export const verifyAccount = async (req, res) => {
  try {
    console.log(req.body);
    const { email, code } = req.body;
    const { verificationToken } = req.params;

    if (code && email) {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }
      if (user.verificationStatus.isVerified) {
        return res.status(400).send("already verified");
      }
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
        return res
          .status(200)
          .json({ isVerified: true, user: { token, ...profile._doc } });
      } else {
        return res.status(401).json({ message: "Invalid code." });
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
        await user.save();
        return res.status(200).send("Verified");
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
  } catch (error) {
    return res.status(500).json({ message: error.message });
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
    } catch (error) {
      console.log(error);
      return res.status(401).json({ message: "Link expired." });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const sendVerificationCode = async (req, res) => {
  try {
    const { type, email } = req.body;
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
      await user.save();
      return res
        .status(200)
        .json({ message: "We have sent a verification code to your email." });
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
      await user.save();
      return res.status(200).json({ message: "Code sent." });
    } else {
      return res.status(400).send("Bad request");
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "An error occurred. try again later." });
  }
};
export const verifyResetPasswordCode = async (req, res) => {
  try {
    const { code, email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json("Bad Request");
    }
    const tokenInfo = jwt.verify(
      user.resetPasswordToken,
      process.env.JWT_SECRET
    );
    if (tokenInfo.verificationCode === code) {
      res.status(200).json({ token: user.resetPasswordToken });
    } else {
      return res.status(401).json({ message: "Invalid code." });
    }
  } catch (error) {
    console.log(error);
  }
};
