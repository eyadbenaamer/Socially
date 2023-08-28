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
    const userInfo = jwt.verify(token, process.env.TOKEN);
    req.user = userInfo;
    next();
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
