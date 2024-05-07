/*CREATE*/

export const add = async (req, res) => {
  try {
    const { text } = req.body;
    const { user, postList, post, comment } = req;
    const { fileInfo } = req;

    if (text || fileInfo) {
      comment.replies.addToSet({
        creatorId: user.id,
        rootCommentId: comment.id,
        file: fileInfo ? fileInfo : null,
        createdAt: Date.now(),
        text: text,
      });
      await postList.save();
      return res.status(200).json(post);
    } else {
      return res.status(409).json({ message: "reply cannot be empty" });
    }
  } catch {
    return res
      .status(500)
      .json({ message: "An error occurred. Plaese try again later." });
  }
};

/*READ*/
export const get = async (req, res) => {
  try {
    return res.status(200).json(req.reply);
  } catch {
    return res
      .status(500)
      .json({ message: "An error occurred. Plaese try again later." });
  }
};

/*UPDATE*/

export const edit = async (req, res) => {
  try {
    let { postList, post, comment, reply } = req;
    if (req.user.id === reply.creatorId) {
      const { text } = req.body;
      if (text) {
        comment.replies.id(reply.id).text = text;
        await postList.save();
        return res.status(200).json(reply);
      } else {
        return res.status(409).json({ message: "reply cannot be empty" });
      }
    } else {
      return res.status(401).json("Unauthorized");
    }
  } catch {
    return res
      .status(500)
      .json({ message: "An error occurred. Plaese try again later." });
  }
};

export const like = async (req, res) => {
  try {
    let { postList, reply, user } = req;

    if (reply.likes.includes(user.id)) {
      reply.likes = reply.likes.filter((item) => item !== user.id);
    } else {
      reply.likes.push(user.id);
    }
    await postList.save();
    res.status(200).json({ likes: reply.likes });
  } catch {
    return res
      .status(500)
      .json({ message: "An error occurred. Plaese try again later." });
  }
};

/*DELETE*/

export const deleteReply = async (req, res) => {
  try {
    let { postList, post, comment, reply } = req;
    if (req.user.id === reply.creatorId) {
      comment.replies.id(reply.id).deleteOne();
      await postList.save();
      res.status(200).json(post);
    } else {
      return res.status(401).json("Unauthorized");
    }
  } catch {
    return res
      .status(500)
      .json({ message: "An error occurred. Plaese try again later." });
  }
};
