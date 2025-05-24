import Post from "../models/post.js";
import Profile from "../models/profile.js";

export const getFeedPosts = async (req, res) => {
  try {
    const { user } = req;
    const posts = await Post.find().limit(10);
    return res.status(200).json(posts);
    const profile = await Profile.findById(user?.id);
    const finalPostsCollection = [];
    // if there the requester is a logged in user, then the feed will be customized
    if (profile) {
      profile.following.map((id) => {
        Posts.findById(id).then((account) => {
          // including one post for each following account
          account.posts?.map((post) => {
            // if the user haven't seen the post it will be included in the feed
            // otherwise it will be moved to the next post to check if it's not seen
            if (!post.views.includes(profile.id)) {
              finalPostsCollection.push(post);
              return;
            }
          });
        });
      });
    }
    let usersPostsCollection;
    // while (finalPostsCollection.length < 10) {
    usersPostsCollection = await Posts.aggregate([{ $sample: { size: 10 } }]);
    // and for logged in users fill the feed to reach 10 posts
    usersPostsCollection.map((account) => {
      if (profile) {
        account.posts.map((post) => {
          /*
            if the user haven't seen the post it will be included in the feed
            otherwise it will be moved to the next post to check if it's not seen
            */
          if (!post.views.find((view) => view._id.toString() == profile.id)) {
            finalPostsCollection.push(post);
            return;
          }
        });
      }
    });
    // }
    return res.status(200).json({ posts: finalPostsCollection });
  } catch {
    return res
      .status(500)
      .json({ message: "An error occurred. Plaese try again later." });
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
  } catch {
    return res
      .status(500)
      .json({ message: "An error occurred. Plaese try again later." });
  }
};
