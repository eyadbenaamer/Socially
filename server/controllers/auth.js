import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

/*REGISTER USER*/
export const register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      picturePath,
      friends,
      location,
      occupation,
    } = req.body;
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
        picturePath,
        friends,
        location,
        occupation,
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
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "user doesn't exist" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password" });
    }
    const token = jwt.sign({ id: user._id }, process.env.TOKEN);
    delete user.password; //not working
    return res.status(200).json({ token, user });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
};
