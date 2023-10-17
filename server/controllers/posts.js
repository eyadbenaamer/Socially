import Post from "../models/post.js";
import Comment from "../models/comment.js";
import Reply from "../models/reply.js";
//TODO: find a way to send comments on patches
/*CREATE*/
export const createPost = async (req, res) => {
  try {
    const userId = req.user.id;
    const { description, picturePath, location } = req.body;
    if (userId) {
      const newPost = new Post({
        userId,
        description,
        picturePath,
        location,
      });
      await newPost.save();
      return res.status(201).json(newPost);
    } else {
      return res.status(409).json({ error: error.message });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

/*READ*/
export const getFeedPosts = async (req, res) => {
  try {
    const posts = await Post.find();
    if (!posts) {
      return res.status(404).json({ error: error.message });
    } else {
      return res.status(200).json(posts);
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
export const getComment = async (req, res) => {
  try {
    return res.status(200).json(req.comment);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const postList = await Post.find({ userId });
    if (postList.length > 0) {
      return res.status(200).json(postList);
    } else {
      return res.status(404).json({ message: "no posts found" });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
export const getReactionDetails = async (req, res) => {
  try {
    const { post } = req;
    return res
      .status(200)
      .json({ commentsCount: post.comments.length, likes: post.likes });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
/*UPDATE*/
export const addComment = async (req, res) => {
  try {
    const { comment } = req.body;
    const { user, post } = req;
    if (comment) {
      post.comments.addToSet({
        userId: user.id,
        content: comment,
      });
      await post.save();
      return res.status(200).json(post);
    } else {
      return res.status(409).json({ error: "comment cannot be empty" });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
export const addReply = async (req, res) => {
  try {
    const { reply } = req.body;
    const { post, comment } = req;
    if (reply) {
      comment.replies.addToSet({
        userId: req.user.id,
        rootCommentId: comment.id,
        content: reply,
      });
      await post.save();
      return res.status(200).json(post);
    } else {
      return res.status(409).json({ message: "reply cannot be empty" });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
export const editComment = async (req, res) => {
  try {
    const { comment: newComment } = req.body;
    const { user, post, comment } = req;
    if (newComment) {
      if (comment.userId === user.id) {
        comment.content = newComment;
        await post.save();
        return res.status(200).json(post);
      } else {
        return res.status(401).send("Unauthorized");
      }
    } else {
      return res.status(409).json({ error: "comment cannot be empty" });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const likePost = async (req, res) => {
  try {
    const { user, post } = req;
    if (post.likes.includes(user.id)) {
      post.likes = post.likes.filter((id) => id !== user.id);
    } else {
      post.likes.push(user.id);
    }
    await post.save();
    const likesCount = post.likes.length;
    return res.status(200).json({ likesCount });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
export const likeComment = async (req, res) => {
  try {
    const { user, post, comment } = req;
    if (comment.likes.includes(user.id)) {
      comment.likes = comment.likes.filter((id) => id !== user.id);
    } else {
      comment.likes.push(user.id);
    }
    await post.save();
    const likesCount = comment.likes.length;
    return res.status(200).json({ likes: comment.likes, likesCount });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
export const editPost = async (req, res) => {
  try {
    const { user, post } = req;
    const { description, location } = req.body;
    if (post.userId === user.id) {
      post.description = description;
      post.location = location;
      await post.save();
      return res.status(200).json(post);
    } else {
      return res.status(401).send("Unauthorized");
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

/*DELETE*/

export const deletePost = async (req, res) => {
  try {
    const { user, post } = req;
    if (post.userId === user.id) {
      await Post.findByIdAndDelete(post.id);
      return res.status(200).json({ message: "post deleted successfully" });
    } else {
      return res.status(401).send("Unauthorized");
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const { user, post, comment } = req;
    if (user.id === comment.userId || user.id === post.userId) {
      post.comments.id(comment.id).deleteOne();
      await post.save();
      return res.status(200).json(post);
    } else {
      return res.status(401).send("Unauthorized");
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
export const deleteReply = async (req, res) => {
  try {
    let { post, comment, reply } = req;
    if (req.user.id === reply.userId) {
      comment.replies.id(reply.id).deleteOne();
      await post.save();
      res.status(200).json(post);
    } else {
      return res.status(401).json("Unauthorized");
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
export const editReply = async (req, res) => {
  try {
    let { post, comment, reply } = req;
    if (req.user.id === reply.userId) {
      let { reply: newReply } = req.body;
      if (newReply) {
        comment.replies.id(reply.id).content = newReply;
        await post.save();
        return res.status(200).json(post);
      } else {
        return res.status(409).json({ message: "reply cannot be empty" });
      }
    } else {
      return res.status(401).json("Unauthorized");
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
export const likeReply = async (req, res) => {
  try {
    let { post, reply, user } = req;

    if (reply.likes.includes(user.id)) {
      reply.likes = reply.likes.filter((item) => item !== user.id);
    } else {
      reply.likes.push(user.id);
    }
    await post.save();
    res.status(200).json(post);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
