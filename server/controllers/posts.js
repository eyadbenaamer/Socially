import { Types } from "mongoose";

import Post from "../models/post.js";
import Profile from "../models/profile.js";

import { handleError } from "../utils/errorHandler.js";

export const getFeedPosts = async (req, res) => {
  try {
    const { user } = req;
    const profile = await Profile.findById(user.id);

    const userId = req.user._id;
    const limit = 3;
    // Prepare aggregation pipelines
    const followingIds = profile.following.map((f) => f.id);
    const followedUsersPipeline = [
      {
        $match: {
          creatorId: {
            $in: followingIds, // Extract just the _id values
          },
          "views._id": { $ne: userId }, // Not viewed yet
        },
      },
      { $sort: { createdAt: -1 } },
      { $limit: 1 },
    ];
    const favoriteTopicsPipeline = [
      {
        $match: {
          keywords: { $in: user.favoriteTopics.keys().toArray() },
          "views._id": { $ne: userId }, // Not viewed yet
          creatorId: { $nin: followingIds }, // Don't duplicate followed content
        },
      },

      { $sort: { topicScore: -1, createdAt: -1 } },
      { $limit: 2 },
    ];

    // 3. Execute parallel queries
    const [followedPosts, topicPosts] = await Promise.all([
      Post.aggregate(followedUsersPipeline),
      Post.aggregate(favoriteTopicsPipeline),
    ]);

    // 6. Shuffle to avoid obvious patterns
    const combinedPosts = [...followedPosts, ...topicPosts];
    const shuffledPosts = combinedPosts
      .sort(() => 0.5 - Math.random())
      .slice(0, limit);

    // 7. Mark posts as viewed (optimistic update)
    await Post.updateMany(
      {
        _id: { $in: shuffledPosts.map((p) => new Types.ObjectId(p._id)) },
        "views._id": { $ne: userId },
      },
      { $addToSet: { views: { _id: userId } } }
    );
    shuffledPosts.map((p) => {
      p.views.push({ _id: userId });
    });

    return res.json(shuffledPosts);
  } catch (err) {
    return handleError(err, res);
  }
};

export const getUserPosts = async (req, res) => {
  try {
    let { userId, cursor: cursorDate } = req.query;

    cursorDate = parseInt(cursorDate);
    cursorDate = cursorDate ? cursorDate : Date.now();

    const posts = await Post.find({
      creatorId: userId,
      createdAt: { $lt: cursorDate },
    })
      .sort({ createdAt: -1 })
      .limit(10);

    return res.status(200).json(posts);
  } catch (err) {
    return handleError(err, res);
  }
};
