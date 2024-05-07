import Posts from "../models/posts.js";
//TODO: find a way to send comments on patches

export const getFeedPosts = async (req, res) => {
  try {
    const postList = await Posts.find();
    if (!postList) {
      return res.status(404).json({ error: error.message });
    } else {
      let posts = [];
      postList.map((item) => {
        let list = item.posts.map((post) => post);
        posts.push(...list);
      });
      return res.status(200).json(posts.reverse());
    }
  } catch {
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
        sharedPost: post.sharedPost,
      };
    });
    return res.status(200).json(result);
  } catch {
    return res
      .status(500)
      .json({ message: "An error occurred. Plaese try again later." });
  }
};
