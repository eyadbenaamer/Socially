import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";

import authRoute from "./routes/auth.js";
import usersRoute from "./routes/user.js";
import postsRoute from "./routes/post.js";

import { signup } from "./controllers/auth.js";

import { createPost, getFeedPosts } from "./controllers/post.js";
import { verifyToken } from "./middleware/auth.js";
import { renameFile } from "./utils/renameFile.js";
import { setProfile } from "./controllers/user.js";
import cookieParser from "cookie-parser";
/*CONFIGURATIONS*/
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("short"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "public/assets")));
// app.use(cookieParser(process.env.JWT_SECRET));
/*FILE STORAGE*/
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/assets");
  },
  filename: function (req, file, cb) {
    cb(null, renameFile(file.originalname));
  },
});
const upload = multer({ storage });

/*ROUTES WITH FILES*/
app.patch("/set_profile_picture", upload.single("picture"), setProfile);
app.post(
  "/posts/create_post",
  verifyToken,
  upload.fields([{ name: "media", maxCount: 5 }]),
  createPost
);

/*ROUTES*/
app.use("/", authRoute);
app.use("/home", getFeedPosts);
app.post("/user", usersRoute);
app.use("/posts", postsRoute);
/*MONGOOSE SETUP*/
const PORT = process.env.PORT;
mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

try {
  app.listen(PORT, () => console.log(`Server Connected on Port: ${PORT}`));
} catch (error) {
  console.error(error);
}
