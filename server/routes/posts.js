import express from "express";
import {
  getFeedPosts,
  getUserPosts,
  getComment,
  likePost,
  createPost,
  addComment,
  editComment,
  editPost,
  deletePost,
  deleteComment,
  likeComment,
  getReactionDetails,
} from "../controllers/posts.js";
import { verifyToken } from "../middleware/auth.js";
import { isPropperId } from "../middleware/check.js";

const router = express.Router();
//root path: /posts

/*READ*/
router.get("/reaction_details/:postId", isPropperId, getReactionDetails);
router.get("/:userId", isPropperId, getUserPosts); // get user's posts
router.get("/:postId/:commentId", isPropperId, getComment);
/*UPDATE*/
router.patch("/like_post/:postId", isPropperId, verifyToken, likePost);
router.patch(
  "/like_comment/:postId/:commentId",
  isPropperId,
  verifyToken,
  likeComment
);
router.patch("/edit_post/:postId", isPropperId, verifyToken, editPost);
router.patch("/add_comment/:postId", isPropperId, verifyToken, addComment);
router.patch(
  "/edit_comment/:postId/:commentId",
  isPropperId,
  verifyToken,
  editComment
);
router.patch(
  "/delete_comment/:postId/:commentId",
  isPropperId,
  verifyToken,
  deleteComment
);

/*CREATE*/
router.post("/create_post", verifyToken, createPost);

/*DELETE*/
router.delete("/delete_post/:postId", isPropperId, verifyToken, deletePost);

export default router;
