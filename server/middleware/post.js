import Post from "../models/post.js";

export const getPostsInfo = async (req, res, next) => {
  try {
    const { postId, commentId, replyId } = req.query;
    let post, comment, reply;

    if (postId) {
      post = await Post.findById(postId);
      if (post) {
        req.post = post;
      } else {
        return res.status(404).json({ message: "post doesn't exist" });
      }
    }
    if (commentId) {
      comment = post.comments.id(commentId);
      if (comment) {
        req.comment = comment;
      } else {
        return res.status(404).json({ message: "comment doesn't exist" });
      }
    }
    if (replyId) {
      reply = comment.replies.id(replyId);
      if (reply) {
        req.reply = reply;
      } else {
        return res.status(404).json({ message: "reply doesn't exist" });
      }
    }
    next();
  } catch {
    return res
      .status(500)
      .json({ message: "An error occurred. Plaese try again later." });
  }
};
