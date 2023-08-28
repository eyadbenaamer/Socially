import Post from "../models/post.js";
import Comment from "../models/comment.js";
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
    const { postId, commentId } = req.params;
    const post = await Post.findById(postId);
    let comment;
    post.comments.map((item) => {
      if (item.id == commentId) comment = item;
    });
    if (post) {
      if (comment) {
        return res.status(200).json(comment);
      } else {
        return res.status(404).json({ error: "the comment doesn't exist" });
      }
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const postList = await Post.find({ userId });
    if (postList) {
      return res.status(200).json(postList);
    } else {
      return res.status(404).json({ error: error.message });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
export const getReactionDetails = async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await Post.findById(postId);
    if (post) {
      res
        .status(200)
        .json({ commentsCount: post.comments.length, likes: post.likes });
    } else {
      return res.status(404).json({ error: "post doesn't exist" });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
/*UPDATE*/
export const addComment = async (req, res) => {
  try {
    const { comment } = req.body;
    const { postId } = req.params;
    const post = await Post.findById(postId);
    if (post) {
      if (comment) {
        const newComment = new Comment({ userId: req.user.id, body: comment });
        post.comments.push(newComment);
        await post.save();
        return res.status(200).json(post);
      } else {
        return res.status(409).json({ error: "comment cannot be empty" });
      }
    } else {
      return res.status(404).json({ error: "post doesn't exist" });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
export const editComment = async (req, res) => {
  try {
    const { comment } = req.body;
    const { postId, commentId } = req.params;
    const post = await Post.findById(postId);
    if (post) {
      let commentToEdit;
      post.comments.map((item) => {
        if (item.id == commentId) commentToEdit = item;
      });
      if (commentToEdit) {
        if (commentToEdit.userId == req.user.id) {
          if (comment) {
            post.comments.map((item) => {
              if (item.id == commentId) {
                item.body = comment;
                post.save();
                return res.status(200).json(post);
              }
            });
          }
        } else {
          return res.status(403).send("forbidden");
        }
      } else {
        return res.status(409).json({ error: "comment cannot be empty" });
      }
    } else {
      return res.status(404).json({ error: "post doesn't exist" });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const likePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { id } = req.user;
    const post = await Post.findById(postId);
    if (post) {
      if (post.likes.includes(id)) {
        post.likes.pop(id);
      } else {
        post.likes.push(id);
      }
      await post.save();
      const likesCount = post.likes.length;
      return res.status(200).json({ likesCount });
    } else {
      return res.status(404).json({ error: "the post doesn't exist" });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
export const likeComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const { id } = req.user;
    const post = await Post.findById(postId);
    let comment;
    post.comments.map((item) => {
      if (item.id == commentId) comment = item;
    });
    if (post) {
      if (comment) {
        if (comment.likes.includes(id)) {
          comment.likes.pop(id);
        } else {
          comment.likes.push(id);
        }
        await post.save();
        const likesCount = comment.likes.length;
        return res.status(200).json({ likes: comment.likes, likesCount });
      } else {
        return res.status(404).json({ error: "the comment doesn't exist" });
      }
    } else {
      return res.status(404).json({ error: "the post doesn't exist" });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
export const editPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { description, location } = req.body;
    const post = await Post.findById(postId);
    if (post) {
      if (post.userId == req.user.id) {
        if (typeof description == "string") {
          post.description = description;
        } else {
          return res.status(400).send("bad request");
        }
        if (typeof location == "string") {
          post.description = description;
        } else {
          return res.status(400).send("bad request");
        }
        await post.save();
        return res.status(200).json(post);
      } else {
        return res.status(403).send("forbidden");
      }
    } else {
      return res.status(404).json({ error: "the post doesn't exist" });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

/*DELETE*/

export const deletePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await Post.findById(postId);
    if (post) {
      if (post.userId == req.user.id) {
        await Post.findByIdAndDelete(postId);
        return res.status(200).json({ message: "post deleted successfully" });
      } else {
        return res.status(403).send("forbidden");
      }
    } else {
      return res.status(404).json({ message: "the post doesn't exist" });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const post = await Post.findOne({ _id: postId });
    if (post) {
      let commentToDeleted;
      post.comments.map((comment) => {
        if (comment.id == commentId) commentToDeleted = comment;
      });
      if (commentToDeleted) {
        if (
          req.user.id == commentToDeleted.userId ||
          req.user.id == post.userId
        ) {
          post.comments = post.comments.filter((comment) => {
            if (comment.id !== commentId) {
              return comment;
            }
          });
          await post.save();
          return res.status(200).json(post);
        } else {
          return res.status(403).send("forbidden");
        }
      } else {
        return res.status(404).json({ error: "the comment doesn't exist" });
      }
    } else {
      return res.status(404).json({ error: "the post doesn't exist" });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
