import Posts from "../models/posts.js";
import Profile from "../models/profile.js";

export const getFeedPosts = async (req, res) => {
  try {
    const { user } = req;
    const profile = await Profile.findById(user?.id);
    const finalPostsCollection = [];
    // if there the requester is a logged in user, then the feed will be customized
    if (profile) {
      profile.following.map((id) => {
        Posts.findById(id).then((account) => {
          // including one post for each following account
          account.posts.map((post) => {
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
          if (!post.views.includes(profile.id)) {
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
    const { postList } = req;
    const page = req.query.page ?? 1;
    if (!postList.posts) {
      return res
        .status(500)
        .json({ message: "An error occurred. Plaese try again later." });
    }
    const pagesCount = Math.ceil(postList.posts.length / 10);
    const startingPost = (page - 1) * 10;
    const endingPost = (page - 1) * 10 + 10;
    const result = [];
    for (let i = startingPost; i < endingPost; i++) {
      if (postList.posts[i]) {
        result.push(postList.posts[i]);
      }
    }
    return res.status(200).json({ posts: result, totalPages: pagesCount });
  } catch {
    return res
      .status(500)
      .json({ message: "An error occurred. Plaese try again later." });
  }
};
