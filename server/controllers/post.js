import fs from "fs";
import Posts from "../models/posts.js";

/*CREATE*/

export const create = async (req, res) => {
  try {
    const { id } = req.user;
    let { text, location } = req.body;
    const { filesInfo } = req;

    const newPost = {
      creatorId: id.trim(),
      text: text?.trim(),
      files: filesInfo,
      createdAt: Date.now(),
      location: location?.trim(),
    };
    const postList = await Posts.findById(id);
    postList.posts.unshift(newPost);
    await postList.save();
    return res.status(201).json(postList.posts[0]);
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
    if (!sharedPost) {
      return res.status(404).json({ message: "Post not found." });
    }
    const newPost = {
      creatorId: id.trim(),
      text: text.trim(),
      createdAt: Date.now(),
      comments: [],
      views: [],
      location: location.trim(),
      sharedPost: {
        _id: sharedPost._id,
        creatorId: sharedPost.creatorId,
      },
    };
    const postList = await Posts.findById(id);
    postList.posts.unshift(newPost);
    await postList.save();
    return res.status(201).json(postList.posts[0]);
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
    return res
      .status(500)
      .json({ message: "An error occurred. Plaese try again later." });
  }
};

export const setViewed = async (req, res) => {
  try {
    const { user } = req;
    const { userId, postId } = req.query;
    const postList = await Posts.findById(userId);
    const post = postList.posts.id(postId);
    if (post.views.id(user.id)) {
      return res.status(409).json({ message: "Already viewed." });
    }
    post.views.addToSet(user.id);
    await postList.updateOne(postList);
    return res.status(200).json(post);
  } catch (err) {
    console.log(err);
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
      postList.posts = postList.posts.filter((item) => item.id != post.id);
      await postList.save();
      // delete the attached files from the storage
      post.files?.map((file) => {
        const filename = `./public/storage/${file.path.split("/").at(-1)}`;
        fs.unlinkSync(filename);
      });

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
