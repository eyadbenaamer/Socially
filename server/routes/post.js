import express from "express";
import {
  getFeedPosts,
  getUserPosts,
  getPost,
  getComment,
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
  getReactionInfo,
  likePostToggle,
  toggleComments,
  getPostPreview,
} from "../controllers/post.js";
import { verifyToken } from "../middleware/auth.js";
import { verifyId } from "../middleware/check.js";
import { getPostData } from "../middleware/post.js";
const router = express.Router();
//root path: /posts

router.post("/create_post", verifyToken, createPost);

/*READ*/
router.get("/", verifyId, getFeedPosts); // get feed posts
router.get("/:userId", verifyId, getPostData, getUserPosts); // get all user's posts
router.get("/:userId/:postId", verifyId, getPostData, getPost); // get a pirticular post
router.get(
  "/post_preview/:userId/:postId",
  verifyId,
  getPostData,
  getPostPreview
); // get a pirticular post
router.get("/userId/:postId/:commentId", verifyId, getPostData, getComment);
router.get(
  "/reaction_details/:userId/:postId",
  verifyId,
  getPostData,
  getReactionInfo
);
/*UPDATE*/
router.patch(
  "/like_post_toggle/:userId/:postId",
  verifyId,
  verifyToken,
  getPostData,
  likePostToggle
);
router.patch(
  "/toggle_comments/:userId/:postId",
  verifyId,
  verifyToken,
  getPostData,
  toggleComments
);
router.patch(
  "/like_comment_toggle/:userId/:postId/:commentId",
  verifyId,
  verifyToken,
  getPostData,
  likeComment
);
router.patch(
  "/edit_post/:userId/:postId",
  verifyId,
  verifyToken,
  getPostData,
  editPost
);

router.patch(
  "/edit_comment/:userId/:postId/:commentId",
  verifyId,
  verifyToken,
  getPostData,
  editComment
);
router.patch(
  "/edit_reply/:userId/:postId/:commentId/:replyId",
  verifyId,
  verifyToken,
  getPostData,
  editReply
);
router.delete(
  "/delete_comment/:userId/:postId/:commentId",
  verifyId,
  verifyToken,
  getPostData,
  deleteComment
);
router.delete(
  "/delete_reply/:userId/:postId/:commentId/:replyId",
  verifyId,
  verifyToken,
  getPostData,
  deleteReply
);
router.patch(
  "/like_reply_toggle/:userId/:postId/:commentId/:replyId",
  verifyId,
  verifyToken,
  getPostData,
  likeReply
);

/*DELETE*/
router.delete(
  "/delete_post/:userId/:postId",
  verifyId,
  verifyToken,
  getPostData,
  deletePost
);

export default router;
