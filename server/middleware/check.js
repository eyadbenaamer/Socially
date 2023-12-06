export const verifyId = async (req, res, next) => {
  try {
    const { userId, postId, commentId, accountId, replyId } = req.params;
    if (userId) {
      if (userId.length != 24) {
        return res.status(400).send("invalid ID");
      }
    }
    if (accountId) {
      if (accountId.length != 24) {
        return res.status(400).send("invalid ID");
      }
    }
    if (postId) {
      if (postId.length != 24) {
        return res.status(400).send("invalid ID");
      }
    }
    if (replyId) {
      if (replyId.length != 24) {
        return res.status(400).send("invalid ID");
      }
    }
    if (commentId) {
      if (commentId.length != 24) {
        return res.status(400).send("invalid ID");
      }
    }

    next();
  } catch (error) {
    return res
      .status(500)
      .json({ message: "An error occurred. Plaese try again later." });
  }
};
