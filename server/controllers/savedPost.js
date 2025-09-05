import { Types } from "mongoose";
import Post from "../models/post.js";
import SavedPost from "../models/savedpost.js";

import { handleError } from "../utils/errorHandler.js";

export const toggleSavePost = async (req, res) => {
  const { id } = req.query;
  const { user } = req;
  try {
    if (!id) {
      return res.status(400).send("Bad Request");
    }
    const savedpost = await SavedPost.findOne({ userId: user._id, postId: id });
    if (savedpost) {
      await savedpost.deleteOne();
      return res.status(200).json({ message: "Post unsaved." });
    }
    const post = await Post.exists({ _id: id });

    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }
    await SavedPost.create({
      userId: user._id,
      postId: id,
      createdAt: Date.now(),
    });
    return res.status(200).json({ message: "Post saved." });
  } catch (err) {
    return handleError(err, res);
  }
};

export const get = async (req, res) => {
  try {
    let { user, page: cursor } = req;
    // Treat page as a cursor timestamp (ms). If absent start from 0 (beginning)
    cursor = parseInt(cursor);
    const hasCursor = !isNaN(cursor) && cursor > 0;
    const cursorDate = hasCursor ? new Date(cursor) : Date.now();
    const limit = 10;

    // Single aggregation on Post to retrieve only posts saved by the user.
    // We join with savedposts first, filter by userId, then apply cursor+limit.
    const pipeline = [
      {
        $lookup: {
          from: "savedposts",
          let: { postId: "$_id", uId: user._id },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$postId", "$$postId"] },
                    { $eq: ["$userId", "$$uId"] },
                  ],
                },
              },
            },
            { $project: { _id: 0, createdAt: 1 } },
          ],
          as: "savedMeta",
        },
      },
      { $match: { savedMeta: { $ne: [] } } },
      {
        $addFields: { savedAt: { $arrayElemAt: ["$savedMeta.createdAt", 0] } },
      },
      ...(hasCursor ? [{ $match: { savedAt: { $lt: cursorDate } } }] : []),
      { $sort: { savedAt: -1 } },
      { $limit: limit },
      {
        $lookup: {
          from: "posts",
          let: { sharedPostId: "$sharedPost._id" },
          pipeline: [
            { $match: { $expr: { $eq: ["$_id", "$$sharedPostId"] } } },
            {
              $lookup: {
                from: "profiles",
                let: { creatorId: "$creatorId" },
                pipeline: [
                  {
                    $match: {
                      $expr: { $eq: ["$_id", "$$creatorId"] },
                    },
                  },
                  {
                    $project: {
                      _id: 1,
                      firstName: 1,
                      lastName: 1,
                      username: 1,
                      profilePicPath: 1,
                      followersCount: 1,
                      followingCount: 1,
                      bio: 1,
                      location: 1,
                      gender: 1,
                      lastSeenAt: 1,
                    },
                  },
                ],
                as: "profileArr",
              },
            },
            {
              $addFields: {
                profile: { $arrayElemAt: ["$profileArr", 0] },
              },
            },
            // follow state for shared post creator (relative to current user)
            {
              $lookup: {
                from: "follows",
                let: { targetId: "$creatorId", currentUserId: user._id },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [
                          { $eq: ["$followedId", "$$targetId"] },
                          { $eq: ["$followerId", "$$currentUserId"] },
                        ],
                      },
                    },
                  },
                  { $limit: 1 },
                ],
                as: "sharedFollowArr",
              },
            },
            {
              $addFields: {
                profile: {
                  $mergeObjects: [
                    { $ifNull: ["$profile", {}] },
                    {
                      isFollowing: { $gt: [{ $size: "$sharedFollowArr" }, 0] },
                    },
                  ],
                },
              },
            },
            {
              $project: {
                profileArr: 0,
                sharedFollowArr: 0,
              },
            },
          ],
          as: "sharedPostArr",
        },
      },
      {
        $lookup: {
          from: "views",
          let: { postId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$postId", "$$postId"] },
              },
            },
            { $count: "count" },
          ],
          as: "viewsCountArr",
        },
      },
      {
        $addFields: {
          isSharedNull: { $eq: ["$sharedPost", null] },
        },
      },
      {
        $lookup: {
          from: "postlikes",
          let: { postId: "$_id", userId: user._id },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$postId", "$$postId"] },
                    { $eq: ["$userId", "$$userId"] },
                  ],
                },
              },
            },
          ],
          as: "userLikeArr",
        },
      },
      {
        $lookup: {
          from: "postlikes",
          let: { postId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$postId", "$$postId"] },
              },
            },
            { $count: "count" },
          ],
          as: "likesCountArr",
        },
      },
      {
        $lookup: {
          from: "comments",
          let: { postId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$postId", "$$postId"] },
              },
            },
            { $count: "count" },
          ],
          as: "commentsCountArr",
        },
      },
      {
        $lookup: {
          from: "views",
          let: { postId: "$_id", userId: user._id },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$postId", "$$postId"] },
                    { $eq: ["$userId", "$$userId"] },
                  ],
                },
              },
            },
          ],
          as: "userViewsArr",
        },
      },
      {
        $lookup: {
          from: "profiles",
          let: { creatorId: "$creatorId" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$_id", "$$creatorId"] },
              },
            },
            {
              $project: {
                _id: 1,
                firstName: 1,
                lastName: 1,
                username: 1,
                profilePicPath: 1,
                followersCount: 1,
                followingCount: 1,
                bio: 1,
                location: 1,
                gender: 1,
                lastSeenAt: 1,
              },
            },
          ],
          as: "profileArr",
        },
      },
      // follow state for main post creator
      {
        $lookup: {
          from: "follows",
          let: { creatorId: "$creatorId", currentUserId: user._id },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$followedId", "$$creatorId"] },
                    { $eq: ["$followerId", "$$currentUserId"] },
                  ],
                },
              },
            },
            { $limit: 1 },
          ],
          as: "followArr",
        },
      },
      {
        $addFields: {
          profile: { $arrayElemAt: ["$profileArr", 0] },
          isLiked: { $gt: [{ $size: "$userLikeArr" }, 0] },
          isViewed: { $gt: [{ $size: "$userViewsArr" }, 0] },
          likesCount: {
            $cond: [
              { $gt: [{ $size: "$likesCountArr" }, 0] },
              { $arrayElemAt: ["$likesCountArr.count", 0] },
              0,
            ],
          },
          commentsCount: {
            $cond: [
              { $gt: [{ $size: "$commentsCountArr" }, 0] },
              { $arrayElemAt: ["$commentsCountArr.count", 0] },
              0,
            ],
          },
          views: {
            $cond: [
              { $gt: [{ $size: "$viewsCountArr" }, 0] },
              { $arrayElemAt: ["$viewsCountArr.count", 0] },
              0,
            ],
          },
          sharedPost: {
            $cond: [
              { $gt: [{ $size: "$sharedPostArr" }, 0] },
              { $arrayElemAt: ["$sharedPostArr", 0] },
              null,
            ],
          },
          // we already know these are saved posts
          isSaved: true,
          // embed following info into profile
          profile: {
            $mergeObjects: [
              { $ifNull: ["$profile", {}] },
              { isFollowing: { $gt: [{ $size: "$followArr" }, 0] } },
              { $arrayElemAt: ["$profileArr", 0] },
            ],
          },
        },
      },
      {
        $project: {
          commentsCountArr: 0,
          likesCountArr: 0,
          userLikeArr: 0,
          userViewsArr: 0,
          viewsCountArr: 0,
          sharedPostArr: 0,
          keywords: 0,
          profileArr: 0,
          savedMeta: 0,
          followArr: 0,
        },
      },
    ];

    const result = await Post.aggregate(pipeline);

    return res.status(200).json(result);
  } catch (err) {
    return handleError(err, res);
  }
};
