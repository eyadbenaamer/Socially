import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

/*REGISTER USER*/
export const register = async (req, res) => {
  try {
    const {
      firstName,
      lasttName,
      email,
      password,
      pictuePath,
      friends,
      location,
      occupation,
    } = req.body;
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      firstName,
      lasttName,
      email,
      password: hashedPassword,
      pictuePath,
      friends,
      location,
      occupation,
      viewedProfile: 10000,
      impressions: 10000,
    });
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const login = async (req, res) => {
  try {
    const { email, passwod } = req.body;
    const user = await User.findOne({ email });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
