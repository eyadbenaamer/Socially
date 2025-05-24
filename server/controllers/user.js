import Post from "../models/post.js";
import User from "../models/user.js";

export const getUser = async (req, res) => {
  const { user } = req;
  res.json(user.token);
};

export const toggleSavePost = async (req, res) => {
  const { _id } = req.query;
  const { user } = req;
  try {
    if (!_id) {
      return res.status(400).send("Bad Request");
    }
    const savedPostId = user.savedPosts.id(_id);
    if (savedPostId) {
      savedPostId.deleteOne();
      await user.save();
      return res.status(200).send("Post unsaved.");
    }
    const post = await Post.findById(_id);

    if (!post) {
      return res.status(400).send("Bad Request");
    }

    user.savedPosts.push(_id);
    await user.save();
    return res.status(200).send("post saved.");
  } catch {
    return res
      .status(500)
      .json({ message: "An error occurred. Please try again later." });
  }
};

export const getSavedPosts = async (req, res) => {
  try {
    let { user, page } = req;

    page = parseInt(page);
    page = page ? page : 1;

    const limit = 10;
    const skip = (page - 1) * limit;

    const result = await User.aggregate([
      { $match: { _id: user._id } },

      // Slice the savedPosts array based on pagination
      {
        $project: {
          savedPosts: { $slice: ["$savedPosts", skip, limit] },
        },
      },

      // Unwind the sliced savedPosts to perform $lookup on each
      { $unwind: "$savedPosts" },

      // Join with Post collection using the _id inside savedPosts
      {
        $lookup: {
          from: "posts",
          localField: "savedPosts._id",
          foreignField: "_id",
          as: "post",
        },
      },

      // Flatten the post array (since $lookup returns an array)
      { $unwind: "$post" },

      // Replace root with post (you now get pure post documents)
      { $replaceRoot: { newRoot: "$post" } },
    ]);

    return res.status(200).json(result);
  } catch {
    return res
      .status(500)
      .json({ message: "An error occurred. Please try again later." });
  }
};

export const getSavedIds = async (req, res) => {
  try {
    const { user } = req;
    let savedPosts = user.savedPosts.map((item) => item.id);
    return res.status(200).json(savedPosts);
  } catch {
    return res
      .status(500)
      .json({ message: "An error occurred. Please try again later." });
  }
};
