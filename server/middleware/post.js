import PostList from "../models/postList.js";

export const getPostData = async (req, res, next) => {
  try {
    const { userId, postId, commentId, replyId } = req.params;
    let postList, post, comment, reply;
    postList = await PostList.findById(userId);
    if (postId) {
      post = postList.posts.id(postId);
      console.log(post);
      if (post) {
        req.post = post;
        req.postList = postList;
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
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
