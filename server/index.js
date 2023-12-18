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
import profileRoute from "./routes/profile.js";
import postRoute from "./routes/post.js";
import userRoute from "./routes/user.js";

import {
  addComment,
  addReply,
  createPost,
  getFeedPosts,
} from "./controllers/post.js";
import { verifyToken } from "./middleware/auth.js";
import { renameFile } from "./utils/renameFile.js";
import { setProfile } from "./controllers/profile.js";
import { verifyId } from "./middleware/check.js";
import { getPostData, uploadSingleFile } from "./middleware/post.js";
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
app.use("/storage", express.static(path.join(__dirname, "public/storage")));
app.use("/assets", express.static(path.join(__dirname, "public/assets")));
app.use(cookieParser(process.env.JWT_SECRET));
/*FILE STORAGE*/
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/storage");
  },
  filename: function (req, file, cb) {
    cb(null, renameFile(file.originalname));
  },
});
const upload = multer({ storage });
/* Email configurations*/

/*ROUTES WITH FILES*/
app.patch("/set_profile", verifyToken, upload.single("picture"), setProfile);
app.post(
  "/posts/create_post",
  verifyToken,
  upload.fields([{ name: "media", maxCount: 5 }]),
  createPost
);
app.post(
  "/posts/add_comment/:userId/:postId/",
  verifyId,
  verifyToken,
  upload.single("media"),
  uploadSingleFile,
  getPostData,
  addComment
);
app.post(
  "/posts/add_reply/:userId/:postId/:commentId",
  verifyId,
  verifyToken,
  upload.single("media"),
  uploadSingleFile,
  getPostData,
  addReply
);
/*ROUTES*/
app.use("/", userRoute);
app.use("/", authRoute);
app.use("/home", getFeedPosts);
app.use("/profile", profileRoute);
app.use("/posts", postRoute);
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
