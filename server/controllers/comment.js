import Posts from "../models/posts.js";
// import Post from "../models/post.js";
//TODO: find a way to send comments on patches

/*READ*/

export const get = async (req, res) => {
  try {
    return res.status(200).json(req.comment);
  } catch {
    return res
      .status(500)
      .json({ message: "An error occurred. Plaese try again later." });
  }
};

/*CREAT*/
export const add = async (req, res) => {
  try {
    let { text } = req.body;
    text = text.trim();
    const { user, postList, post } = req;
    if (post.isCommentsDisabled) {
      return res.status(409).json({ error: "comments are disabled" });
    }
    const { fileInfo } = req;
    if (text || fileInfo) {
      post.comments.addToSet({
        creatorId: user.id,
        text,
        file: fileInfo ? fileInfo : null,
        createdAt: Date.now(),
      });
      await postList.save();
      return res.status(200).json(post);
    } else {
      return res.status(400).json({ error: "comment cannot be empty" });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "An error occurred. Plaese try again later." });
  }
};

/*UPDATE*/

export const edit = async (req, res) => {
  try {
    const { text } = req.body;
    const { user, postList, post, comment } = req;
    if (text) {
      if (comment.creatorId === user.id) {
        comment.text = text;
        await postList.save();
        return res.status(200).json(comment);
      } else {
        return res.status(401).send("Unauthorized");
      }
    } else {
      return res.status(409).json({ error: "comment cannot be empty" });
    }
  } catch {
    return res
      .status(500)
      .json({ message: "An error occurred. Plaese try again later." });
  }
};

export const likeToggle = async (req, res) => {
  try {
    const { postList, user, comment } = req;
    if (comment.likes.includes(user.id)) {
      comment.likes = comment.likes.filter((id) => id !== user.id);
    } else {
      comment.likes.push(user.id);
    }
    await postList.save();
    return res.status(200).json({ likes: comment.likes });
  } catch {
    return res
      .status(500)
      .json({ message: "An error occurred. Plaese try again later." });
  }
};

/*DELETE*/

export const deleteComment = async (req, res) => {
  try {
    const { user, postList, post, comment } = req;
    if (user.id === comment.creatorId || user.id === post.creatorId) {
      post.comments.id(comment.id).deleteOne();
      await postList.save();
      return res.status(200).json(post);
    } else {
      return res.status(401).send("Unauthorized");
    }
  } catch {
    return res
      .status(500)
      .json({ message: "An error occurred. Plaese try again later." });
  }
};
