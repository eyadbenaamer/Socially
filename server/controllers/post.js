import Posts from "../models/posts.js";

/*CREATE*/

export const create = async (req, res) => {
  const uploadsFolder = `${process.env.API_URL}/storage/`;
  try {
    const { id } = req.user;
    let { text, location } = req.body;
    const { media } = req.files;
    let filesInfo = [];
    if (id) {
      if (media) {
        media.map((file) => {
          if (file.mimetype.startsWith("image")) {
            filesInfo.push({
              path: `${uploadsFolder}${file.filename}`,
              fileType: "photo",
            });
          } else if (file.mimetype.startsWith("video")) {
            filesInfo.push({
              path: `${uploadsFolder}${file.filename}`,
              fileType: "vedio",
            });
          }
        });
      }
      const newPost = {
        creatorId: id.trim(),
        text: text.trim(),
        files: media ? filesInfo : null,
        createdAt: Date.now(),
        location: location.trim(),
        sharedPost: null,
      };
      const postList = await Posts.findById(id);
      postList.posts.addToSet(newPost);
      await postList.save();
      return res.status(201).json(newPost);
    } else {
      return res.status(409).json({ error: error.message });
    }
  } catch {
    return res
      .status(500)
      .json({ message: "An error occurred. Plaese try again later." });
  }
};

export const share = async (req, res) => {
  const uploadsFolder = `${process.env.API_URL}/storage/`;
  try {
    const { id } = req.user;
    let { text, location } = req.body;
    let { userId, postId } = req.query;
    const { media } = req.files;
    let filesInfo = [];
    if (id) {
      if (media) {
        media.map((file) => {
          if (file.mimetype.startsWith("image")) {
            filesInfo.push({
              path: `${uploadsFolder}${file.filename}`,
              fileType: "photo",
            });
          } else if (file.mimetype.startsWith("video")) {
            filesInfo.push({
              path: `${uploadsFolder}${file.filename}`,
              fileType: "vedio",
            });
          }
        });
      }
      const sharedPost = await Posts.findById(userId).then((user) => {
        const post = user.posts.id(postId);
        return post;
      });
      if (!share) {
        return res.status(404).json({ message: "Post not found." });
      }
      const newPost = {
        creatorId: id.trim(),
        text: text.trim(),
        createdAt: Date.now(),
        location: location.trim(),
        sharedPost: {
          _id: sharedPost._id,
          creatorId: sharedPost.creatorId,
        },
      };
      const postList = await Posts.findById(id);
      postList.posts.addToSet(newPost);
      console.log(postList.posts);
      await postList.save();
      return res.status(201).json(newPost);
    } else {
      return res.status(409).json({ error: error.message });
    }
  } catch {
    return res
      .status(500)
      .json({ message: "An error occurred. Plaese try again later." });
  }
};

/*READ*/

export const getPost = async (req, res) => {
  try {
    const { post } = req;
    return res.status(200).json(post);
  } catch {
    return res
      .status(500)
      .json({ message: "An error occurred. Plaese try again later." });
  }
};

/*UPDATE*/

export const edit = async (req, res) => {
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
  } catch {
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
  } catch {
    return res
      .status(500)
      .json({ message: "An error occurred. Plaese try again later." });
  }
};
export const likeToggle = async (req, res) => {
  try {
    const { user, postList, post } = req;
    if (post.likes.includes(user.id)) {
      post.likes = post.likes.filter((id) => id !== user.id);
    } else {
      post.likes.push(user.id);
    }
    await postList.save();
    return res.status(200).json({ likes: post.likes });
  } catch {
    return res.status(500).json({ message: error });
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
  } catch {
    return res
      .status(500)
      .json({ message: "An error occurred. Plaese try again later." });
  }
};
