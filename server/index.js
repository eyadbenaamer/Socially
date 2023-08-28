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
import usersRoute from "./routes/users.js";
import postsRoute from "./routes/posts.js";

import { register } from "./controllers/auth.js";

import { createPost, getFeedPosts } from "./controllers/posts.js";
// import MongoStore from "connect-mongo";
// import session from "express-session";

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
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "public/assets")));
// app.use(
//   session({
//     cookie: { secure: true, httpOnly: false },
//     name: "sid",
//     store: MongoStore.create({
//       mongoUrl: process.env.DATABASE_URL,
//     }),
//     secret: process.env.SESSION_SECRET,
//     resave: false,
//     saveUninitialized: true,
//   })
// );
/*FILE STORAGE*/
const storage = multer.diskStorage({
  destination: function (req, res, cb) {
    cb(null, "public/assets");
  },
  filename: function (req, res, cb) {
    cb(null, file.originalName);
  },
});
const upload = multer({ storage });

/*ROUTES WITH FILES*/
app.post("/auth/register", upload.single("picture"), register);
app.post("/posts/create_post", upload.single("picture"), createPost);

/*ROUTES*/
app.use("/", authRoute);
app.use("/home", getFeedPosts);
app.use("/users", usersRoute);
app.use("/posts", postsRoute);
/*MONGOOSE SETUP*/
const PORT = process.env.PORT || 3001;
mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

try {
  app.listen(PORT, () => console.log(`Server Connected on Port: ${PORT}`));
} catch (error) {
  console.error(error);
}
