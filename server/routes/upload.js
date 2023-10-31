import express from "express";
import { signup } from "../controllers/auth.js";
import multer from "multer";
import { verifyToken } from "../middleware/auth.js";
import { createPost } from "../controllers/posts.js";

const router = express.Router();
const accountPictureFolder = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/assets/account-pictue");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const postPhotoFolder = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/assets/post/photo/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const postVideoFolder = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/assets/post/video");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const uploadAccountPicture = multer({ accountPictureFolder });
const uploadPostPhoto = multer({ postPhotoFolder });
const uploadPostVideo = multer({ postVideoFolder });

router.post("/signup", uploadAccountPicture.single("picture"), signup);
router.post(
  "/posts/create_post",
  verifyToken,
  uploadPostPhoto.single("picture"),
  uploadPostVideo.single("video"),
  createPost
);

export default router;
