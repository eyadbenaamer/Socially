import express from "express";
import {
  getFeedPosts,
  getUserPosts,
  getComment,
  likePost,
  createPost,
  addComment,
  editComment,
  addReply,
  editReply,
  editPost,
  deletePost,
  deleteComment,
  deleteReply,
  likeComment,
  likeReply,
  getReactionDetails,
} from "../controllers/posts.js";
import { verifyToken } from "../middleware/auth.js";
import { verifyId } from "../middleware/check.js";
import { getPostData } from "../middleware/post.js";
const router = express.Router();
//root path: /posts

/*CREATE*/
// router.post("/create_post", verifyToken, createPost);

/*READ*/
router.get(
  "/reaction_details/:postId",
  verifyId,
  getPostData,
  getReactionDetails
);
router.get("/:userId", verifyId, getUserPosts); // get user's posts
router.get("/:postId/:commentId", verifyId, getPostData, getComment);
/*UPDATE*/
router.patch(
  "/like_post/:postId",
  verifyId,
  verifyToken,
  getPostData,
  likePost
);
router.patch(
  "/like_comment/:postId/:commentId",
  verifyId,
  verifyToken,
  getPostData,
  likeComment
);
router.patch(
  "/edit_post/:postId",
  verifyId,
  verifyToken,
  getPostData,
  editPost
);
router.patch(
  "/add_comment/:postId",
  verifyId,
  verifyToken,
  getPostData,
  addComment
);
router.patch(
  "/add_reply/:postId/:commentId",
  verifyId,
  verifyToken,
  getPostData,
  addReply
);
router.patch(
  "/edit_comment/:postId/:commentId",
  verifyId,
  verifyToken,
  getPostData,
  editComment
);
router.patch(
  "/edit_reply/:postId/:commentId/:replyId",
  verifyId,
  verifyToken,
  getPostData,
  editReply
);
router.patch(
  "/delete_comment/:postId/:commentId",
  verifyId,
  verifyToken,
  getPostData,
  deleteComment
);
router.patch(
  "/delete_reply/:postId/:commentId/:replyId",
  verifyId,
  verifyToken,
  getPostData,
  deleteReply
);
router.patch(
  "/like_reply/:postId/:commentId/:replyId",
  verifyId,
  verifyToken,
  getPostData,
  likeReply
);

/*DELETE*/
router.delete(
  "/delete_post/:postId",
  verifyId,
  verifyToken,
  getPostData,
  deletePost
);

export default router;
