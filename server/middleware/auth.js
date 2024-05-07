import jwt from "jsonwebtoken";
import User from "../models/user.js";
export const verifyToken = async (req, res, next) => {
  try {
    let token = req.header("Authorization");
    if (!token) {
      return res.status(403).json("login first");
    }
    if (token.startsWith("Bearer ")) {
      token = token.slice(7).trimStart();
    }
    const userInfo = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(userInfo.id);
    if (user) {
      if (user.verificationStatus.isVerified) {
        req.user = user;
        next();
      } else {
        return res.status(401).json("verify your account first");
      }
    } else {
      return res.status(403).json("invalid token or user doesn't exist");
    }
  } catch {
    return res
      .status(500)
      .json({ message: "An error occurred. Plaese try again later." });
  }
};
