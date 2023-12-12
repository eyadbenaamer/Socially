import Posts from "../models/posts.js";
// import Post from "../models/post.js";
//TODO: find a way to send comments on patches
/*CREATE*/
export const createPost = async (req, res) => {
  const uploadsFolder = `${process.env.API_URL}/storage/`;
  try {
    const { id } = req.user;
    let { text, location } = req.body;
    const { media } = req.files;
    let filesPaths = [];
    if (id) {
      if (media) {
        media.map((file, index) => {
          if (file.mimetype.startsWith("image")) {
            filesPaths.push({
              path: `${uploadsFolder}${file.filename}`,
              order: index,
              fileType: "photo",
            });
          } else if (file.mimetype.startsWith("video")) {
            filesPaths.push({
              path: `${uploadsFolder}${file.filename}`,
              order: index,
              fileType: "vedio",
            });
          }
        });
      }
      const newPost = {
        creatorId: id,
        text,
        files: media ? filesPaths : null,
        createdAt: Date.now(),
        location,
      };
      const postList = await Posts.findById(id);
      postList.posts.addToSet(newPost);
      await postList.save();
      return res.status(201).json(newPost);
    } else {
      return res.status(409).json({ error: error.message });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "An error occurred. Plaese try again later." });
  }
};

/*READ*/
export const getFeedPosts = async (req, res) => {
  try {
    const postList = await Posts.find();
    if (!postList) {
      return res.status(404).json({ error: error.message });
    } else {
      let posts = [];
      postList.map((item) => {
        let list = item.posts.map((post) => {
          return {
            _id: post._id,
            creatorId: post.creatorId,
            files: post.files,
            text: post.text,
            createdAt: post.createdAt,
            location: post.location,
            likes: post.likes,
            commentsCount: post.comments.length,
          };
        });
        posts.push(...list);
      });
      return res.status(200).json(posts.reverse());
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "An error occurred. Plaese try again later." });
  }
};
export const getComment = async (req, res) => {
  try {
    return res.status(200).json(req.comment);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "An error occurred. Plaese try again later." });
  }
};
export const getUserPosts = async (req, res) => {
  try {
    const { postList } = req;
    postList.posts = postList.posts.reverse();
    const result = postList.posts.map((post) => {
      return {
        _id: post._id,
        creatorId: post.creatorId,
        files: post.files,
        text: post.text,
        createdAt: post.createdAt,
        location: post.location,
        likes: post.likes,
        commentsCount: post.comments.length,
      };
    });
    return res.status(200).json(result);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "An error occurred. Plaese try again later." });
  }
};
export const getPost = async (req, res) => {
  try {
    const { post } = req;
    return res.status(200).json(post);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "An error occurred. Plaese try again later." });
  }
};
export const getPostPreview = async (req, res) => {
  try {
    const { post } = req;
    const {
      _id,
      creatorId,
      files,
      text,
      createdAt,
      location,
      likes,
      comments,
    } = post;
    return res.status(200).json({
      _id,
      creatorId,
      files,
      text,
      createdAt,
      location,
      likes,
      commentsCount: comments.length,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "An error occurred. Plaese try again later." });
  }
};
export const getReactionInfo = async (req, res) => {
  try {
    const { post } = req;
    return res
      .status(200)
      .json({ commentsCount: post.comments.length, likes: post.likes });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "An error occurred. Plaese try again later." });
  }
};
export const toggleComments = async (req, res) => {
  try {
    const { postList, post } = req;
    post.isCommentsDisabled = !post.isCommentsDisabled;
    await postList.save();
    const message = post.isCommentsDisabled
      ? "comments disabled"
      : "comments enabled";
    return res.status(200).json({ message });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "An error occurred. Plaese try again later." });
  }
};

/*UPDATE*/
export const addComment = async (req, res) => {
  try {
    const { text } = req.body;
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
      return res.status(409).json({ error: "comment cannot be empty" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "An error occurred. Plaese try again later." });
  }
};
export const addReply = async (req, res) => {
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
  } catch (error) {
    return res
      .status(500)
      .json({ message: "An error occurred. Plaese try again later." });
  }
};
export const editComment = async (req, res) => {
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
  } catch (error) {
    return res
      .status(500)
      .json({ message: "An error occurred. Plaese try again later." });
  }
};
//TODO:
export const likePostToggle = async (req, res) => {
  try {
    const { user, postList, post } = req;
    if (post.likes.includes(user.id)) {
      post.likes = post.likes.filter((id) => id !== user.id);
    } else {
      post.likes.push(user.id);
    }
    await postList.save();
    return res.status(200).json({ likes: post.likes });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "An error occurred. Plaese try again later." });
  }
};
export const likeComment = async (req, res) => {
  try {
    const { postList, user, comment } = req;
    if (comment.likes.includes(user.id)) {
      comment.likes = comment.likes.filter((id) => id !== user.id);
    } else {
      comment.likes.push(user.id);
    }
    await postList.save();
    return res.status(200).json({ likes: comment.likes });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "An error occurred. Plaese try again later." });
  }
};
export const editPost = async (req, res) => {
  try {
    const { user, postList, post } = req;
    const { text, location } = req.body;
    if (post.creatorId === user.id) {
      text ? (post.text = text) : null;
      location ? (post.location = location) : null;
      await postList.save();
      return res.status(200).json(post);
    } else {
      return res.status(401).send("Unauthorized");
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "An error occurred. Plaese try again later." });
  }
};

/*DELETE*/

export const deletePost = async (req, res) => {
  try {
    const { user, postList, post } = req;
    if (post.creatorId === user.id) {
      postList.posts.id(post.id).deleteOne();
      await postList.save();
      return res.status(200).json({ message: "post deleted successfully" });
    } else {
      return res.status(401).send("Unauthorized");
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "An error occurred. Plaese try again later." });
  }
};

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
  } catch (error) {
    return res
      .status(500)
      .json({ message: "An error occurred. Plaese try again later." });
  }
};
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
  } catch (error) {
    return res
      .status(500)
      .json({ message: "An error occurred. Plaese try again later." });
  }
};
export const editReply = async (req, res) => {
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
  } catch (error) {
    return res
      .status(500)
      .json({ message: "An error occurred. Plaese try again later." });
  }
};
export const likeReply = async (req, res) => {
  try {
    let { postList, reply, user } = req;

    if (reply.likes.includes(user.id)) {
      reply.likes = reply.likes.filter((item) => item !== user.id);
    } else {
      reply.likes.push(user.id);
    }
    await postList.save();
    res.status(200).json({ likes: reply.likes });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "An error occurred. Plaese try again later." });
  }
};
