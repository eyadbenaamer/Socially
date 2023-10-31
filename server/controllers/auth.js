import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
/*REGISTER USER*/
export const signup = async (req, res) => {
  //TODO: set validatior for this route
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      pictureName,
      birthDate,
      gender,
    } = req.body;
    if (!(firstName && lastName && email && password && birthDate && gender)) {
      return res
        .status(400)
        .json({ message: "some of information are missing" });
    }
    const isEmailUsed = (await User.findOne({ email })) ? true : false;
    if (isEmailUsed) {
      return res.status(409).json({ message: "this email is used" });
    } else {
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);
      const newUser = new User({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        picturePath: `${process.env.API_URL}/assets/${pictureName}`,
      });
      const savedUser = await newUser.save();
      return res.status(201).json(savedUser);
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
/*LOGIN USER*/
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!(email && password)) {
      return res.status(400).json("bad request");
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "user doesn't exist" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "14d",
    });
    res.cookie("token", token, { maxAge: 500000, signed: true });
    return res.status(200).json({
      _id: user._id,
      token,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      picturePath: user.picturePath,
      occupation: user.occupation,
      createdAt: user.createdAt,
      updatedA: user.updatedAt,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
