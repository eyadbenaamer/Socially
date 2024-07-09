import Profile from "../models/profile.js";
import User from "../models/user.js";

/*READ*/

export const getProfile = async (req, res) => {
  try {
    const { id, username } = req.query;
    /*
    a profile can be retrieved ether with a username or an ID
    just one method should be used, if ID and username both exist or they both
    not exist then return bad request.
   */
    if (id && !username) {
      const profile = await Profile.findById(id);
      if (!profile) {
        return res.status(404).json({ message: "user not found" });
      }
      return res.status(200).json(profile);
    }
    if (username && !id) {
      const profile = await Profile.findOne({ username });
      if (!profile) {
        return res.status(404).json({ message: "user not found" });
      }
      return res.status(200).json(profile);
    }
    if ((!id && !username) || (id && username)) {
      return res.status(400).send("bad request");
    }
  } catch {
    return res
      .status(500)
      .json({ message: "An error occurred. Plaese try again later." });
  }
};

export const getFollowers = async (req, res) => {
  try {
    const { id } = req.query;
    const user = await User.findById(id);
    const followers = user.followers;
    if (followers) {
      return res.status(200).json(followers);
    } else {
      return res.status(404).json({ error: "No followers found" });
    }
  } catch {
    return res
      .status(500)
      .json({ message: "An error occurred. Plaese try again later." });
  }
};

export const getFollowing = async (req, res) => {
  try {
    const { id } = req.query;
    const user = await User.findById(id);
    const following = user.following;
    if (following) {
      return res.status(200).json(following);
    } else {
      return res.status(404).json({ error: "No following found" });
    }
  } catch {
    return res
      .status(500)
      .json({ message: "An error occurred. Plaese try again later." });
  }
};

export const checkUsernameAvailability = async (req, res) => {
  try {
    const { username } = req.body;
    const profile = await Profile.findOne({ username });
    if (profile) {
      return res.status(409).json({ message: "This username is taken." });
    }
    return res.status(200).json({ message: "username is available." });
  } catch {
    return res
      .status(500)
      .json({ message: "An error occurred. Plaese try again later." });
  }
};

/*UPDATE*/

export const setProfile = async (req, res) => {
  try {
    const { id } = req.user;
    const coverPic = req.files.coverPic ? req.files.coverPic[0] : null;
    const profilePic = req.files.profilePic ? req.files.profilePic[0] : null;
    const { username, bio, location } = req.body;
    const profile = await Profile.findById(id);
    // setting user name is optional because is has a default value.
    if (username) {
      /*
      if the user chose to set it, then we need to check if it't taken or not, if so 
      the response will return an error that the username must be unique.
      */
      if (await Profile.findOne({ username })) {
        return res.status(409).json({ message: "This username is taken." });
      }
      profile.username = username;
    }
    if (profilePic) {
      profile.profilePicPath = `${process.env.API_URL}/storage/${profilePic.filename}`;
    }
    if (coverPic) {
      profile.coverPicPath = `${process.env.API_URL}/storage/${coverPic.filename}`;
    }
    if (bio) {
      profile.bio = bio;
    }

    if (location) {
      profile.location = location;
    }
    await profile.save();
    return res.status(200).json(profile);
  } catch {
    return res
      .status(500)
      .json({ message: "An error occurred. Plaese try again later." });
  }
};

export const follow = async (req, res) => {
  try {
    const { user } = req;
    const myId = user.id;
    const { userId } = req.query;
    if (myId == userId) {
      return res.status(409).json({ error: "cannot follow yourself" });
    }
    const profile = await Profile.findById(myId);
    const profileToFollow = await Profile.findById(userId);
    if (!profileToFollow) {
      return res.status(400).send("bad request");
    }
    if (profile.following.includes(userId)) {
      return res.status(409).json({ error: "already followed" });
    }
    profile.following.push(userId);
    profileToFollow.followers.push(myId);

    await profile.save();
    await profileToFollow.save();
    return res.status(200).json(profile);
  } catch {
    return res
      .status(500)
      .json({ message: "An error occurred. Plaese try again later." });
  }
};

export const unfollow = async (req, res) => {
  try {
    const { id } = req.user;
    const { userId } = req.query;
    if (id == userId) {
      return res.status(409).json({ error: "cannot unfollow yourself" });
    }
    const profile = await Profile.findById(id);
    const accountToUnfollow = await Profile.findById(userId);

    if (!(profile && accountToUnfollow)) {
      return res.status(400).send("bad request");
    }

    if (profile.following.includes(userId)) {
      profile.following = profile.following.filter((item) => item != userId);
      accountToUnfollow.followers = accountToUnfollow.followers.filter(
        (item) => item != id
      );
    } else {
      return res.status(409).json({ error: "not followed" });
    }
    await profile.save();
    await accountToUnfollow.save();
    return res.status(200).json(profile);
  } catch {
    return res
      .status(500)
      .json({ message: "An error occurred. Plaese try again later." });
  }
};

export const removeFollower = async (req, res) => {
  try {
    const { id } = req.user;
    const { userId } = req.query;
    if (id == userId) {
      return res.status(400).send("bad request");
    }
    const profile = await Profile.findById(id);
    const accountToRemove = await Profile.findById(userId);
    if (!(profile && accountToRemove)) {
      return res.status(400).send("bad request");
    }
    if (profile.followers.includes(userId)) {
      profile.followers = profile.followers.filter((item) => item != userId);
      accountToRemove.following = accountToRemove.following.filter(
        (item) => item != id
      );
    } else {
      return res.status(409).json({ error: "not following" });
    }
    await profile.save();
    await accountToRemove.save();
    return res.status(200).json(profile);
  } catch {
    return res
      .status(500)
      .json({ message: "An error occurred. Plaese try again later." });
  }
};
