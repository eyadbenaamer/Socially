export const isPropperId = async (req, res, next) => {
  try {
    const { userId, postId, commentId } = req.params;
    if (userId) {
      if (userId.length != 24) {
        return res.status(400).send("invalid ID");
      }
    }
    if (postId) {
      if (postId.length != 24) {
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
    return res.status(500).json({ error: error.message });
  }
};
