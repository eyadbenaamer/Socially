import express from "express";
import { createServer } from "http";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";

import createSocketServer from "./socket/socketServer.js";

import authRoute from "./routes/auth.js";
import profileRoute from "./routes/profile.js";
import userRoute from "./routes/user.js";
import postsRoute from "./routes/posts.js";
import postRoute from "./routes/post.js";
import commentRoute from "./routes/comment.js";
import replyRoute from "./routes/reply.js";
import conversationRoute from "./routes/conversation.js";
import notificationRoute from "./routes/notification.js";
import messageRoute from "./routes/message.js";

import { setProfile } from "./controllers/profile.js";
import { getFeedPosts } from "./controllers/posts.js";
import {
  create as createPost,
  share as sharePost,
} from "./controllers/post.js";
import { add as addComment } from "./controllers/comment.js";
import { add as addReply } from "./controllers/reply.js";
import { sendMessage } from "./controllers/message.js";

import { verifyToken } from "./middleware/auth.js";
import { verifyId } from "./middleware/check.js";
import { compressImages } from "./middleware/media.js";
import { getPostsInfo } from "./middleware/post.js";
import { uploadSingleFile } from "./middleware/media.js";
import { getConversationInfo, isInChat } from "./middleware/conversation.js";
import { getOnlineUsers } from "./socket/onlineUsers.js";

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
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

/*ROUTES WITH FILES*/
app.patch(
  "/profile/set",
  verifyToken,
  upload.fields([
    { name: "profilePic", maxCount: 1 },
    { name: "coverPic", maxCount: 1 },
  ]),
  compressImages,
  setProfile
);
app.post(
  "/post/create",
  verifyId,
  verifyToken,
  upload.fields([{ name: "media", maxCount: 5 }]),
  compressImages,
  createPost
);
app.post(
  "/post/share/",
  verifyId,
  verifyToken,
  upload.fields([{ name: "media", maxCount: 5 }]),
  compressImages,
  sharePost
);
app.post(
  "/message/send",
  verifyId,
  verifyToken,
  upload.fields([{ name: "media", maxCount: 10 }]),
  compressImages,
  getConversationInfo,
  isInChat,
  sendMessage
);
app.post(
  "/message/reply",
  verifyId,
  verifyToken,
  upload.fields([{ name: "media", maxCount: 5 }]),
  compressImages,
  getConversationInfo,
  isInChat,
  sendMessage
);
app.post(
  "/comment/add",
  verifyId,
  verifyToken,
  upload.single("media"),
  uploadSingleFile,
  getPostsInfo,
  addComment
);
app.post(
  "/reply/add",
  verifyId,
  verifyToken,
  upload.single("media"),
  uploadSingleFile,
  getPostsInfo,
  addReply
);
/*ROUTES*/
app.use("/", userRoute);
app.use("/", authRoute);
app.use("/home", getFeedPosts);
app.use("/profile", profileRoute);
app.use("/posts", postsRoute);
app.use("/post", postRoute);
app.use("/comment", commentRoute);
app.use("/reply", replyRoute);
app.use("/notifications", notificationRoute);
app.use("/conversation", conversationRoute);
app.use("/message", messageRoute);
/*MONGOOSE SETUP*/
const PORT = process.env.PORT;
mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const server = createServer(app);
createSocketServer(server);

try {
  server.listen(PORT, () => console.log(`Server Connected on Port: ${PORT}`));
} catch (error) {
  console.error(error);
}
