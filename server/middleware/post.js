import Posts from "../models/posts.js";

export const getPostsInfo = async (req, res, next) => {
  try {
    const { userId, postId, commentId, replyId } = req.query;
    let postList, post, comment, reply;
    if (userId) {
      postList = await Posts.findById(userId);
      if (postList) {
        req.postList = postList;
      } else {
        return res.status(404).json({ message: "user doesn't exist" });
      }
    }
    if (postId) {
      post = postList.posts.id(postId);
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

export const uploadSingleFile = (req, res, next) => {
  try {
    const uploadsFolder = `${process.env.API_URL}/storage/`;

    const { file } = req;
    if (file) {
      if (file.mimetype.startsWith("image")) {
        req.fileInfo = {
          path: `${uploadsFolder}${file.filename}`,
          fileType: "photo",
        };
      } else if (file.mimetype.startsWith("video")) {
        req.fileInfo = {
          path: `${uploadsFolder}${file.filename}`,
          fileType: "video",
        };
      }
    }
    next();
  } catch {
    return res
      .status(500)
      .json({ message: "An error occurred. Plaese try again later." });
  }
};
