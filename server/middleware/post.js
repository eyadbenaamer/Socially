import Comment from "../models/comment.js";
import Post from "../models/post.js";
import Reply from "../models/reply.js";

import { handleError } from "../utils/errorHandler.js";

export const getPostsInfo = async (req, res, next) => {
  try {
    const { postId, commentId, replyId } = req.query;
    let post, comment, reply;

    if (postId) {
      post = await Post.findById(postId).select(
        "_id creatorId location text isCommentsDisabled files sharedPost keywords createdAt"
      );
      if (post) {
        req.post = post;
      } else {
        return res.status(404).json({ message: "Post doesn't exist." });
      }
    }
    if (commentId) {
      comment = await Comment.findById(commentId);
      if (comment) {
        req.comment = comment;
      } else {
        return res.status(404).json({ message: "Comment doesn't exist." });
      }
    }
    if (replyId) {
      reply = await Reply.findById(replyId);
      if (reply) {
        req.reply = reply;
      } else {
        return res.status(404).json({ message: "Reply doesn't exist." });
      }
    }
    next();
  } catch (err) {
    return handleError(err, res);
  }
};
