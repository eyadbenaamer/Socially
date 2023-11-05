import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import Profile from "../models/profile.js";
/*REGISTER USER*/
export const signup = async (req, res) => {
  //TODO: set validatior for this route
  try {
    const { firstName, lastName, email, phone, password, birthDate, gender } =
      req.body;
    console.log(req.body);
    if (
      !(
        firstName &&
        lastName &&
        (email || phone) &&
        password &&
        birthDate &&
        gender
      )
    ) {
      return res
        .status(400)
        .json({ message: "some of information are missing" });
    }
    if (email && !phone) {
      const isEmailUsed = await User.findOne({
        "creadentials.email": `${email}`,
      });
      if (isEmailUsed) {
        return res.status(409).json({ message: "this email is used" });
      }
    } else if (phone && !email) {
      const isPhoneUsed = (await User.find({
        creadentials: { phoneNubmer: phone },
      }))
        ? true
        : false;
      if (isPhoneUsed) {
        return res.status(409).json({ message: "this phone number is used" });
      }
    } else {
      return res.status(400).send("bad request");
    }
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = await new User({
      password: hashedPassword,
    }).save();
    if (email) {
      newUser.creadentials.email.push(email);
    } else if (phone) {
      newUser.creadentials.phoneNubmer = phone;
    }
    await newUser.save();
    const newProfile = new Profile({
      _id: newUser.id,
      firstName,
      lastName,
      birthDate,
      gender,
    });
    await newProfile.save();
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.TOKEN_EXPIRATION,
    });
    return res.status(201).json({ token, ...newProfile._doc });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};
/*LOGIN USER*/
export const login = async (req, res) => {
  try {
    const { email, phone, userName, password } = req.body;
    if (!password && (userName || email || phone)) {
      return res.status(400).json("bad request");
    }
    let user;
    if (userName && !(email || phone)) {
      user = await User.findOne({ userName });
    } else if (email && !(phone || userName)) {
      user = await User.findOne({
        "creadentials.email": `${email}`,
      });
    } else if (phone && !(userName || email)) {
      user = await User.findOne({
        "creadentials.email": `${phone}`,
      });
    }
    if (!user) {
      return res.status(404).json({ message: "user doesn't exist" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.TOKEN_EXPIRATION,
    });
    res.cookie("token", token, { maxAge: 500000, signed: true });
    const profile = await Profile.findById(user.id);

    return res.status(200).json({
      token,
      id: user.id,
      ...profile._doc,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
