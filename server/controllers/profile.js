import Profile from "../models/profile.js";
import User from "../models/user.js";

/*READ*/

export const getProfile = async (req, res) => {
  try {
    const { id } = req.query;
    const profile = await Profile.findById(id);
    if (!profile) {
      return res.status(404).json({ message: "user not found" });
    }
    return res.status(200).json(profile);
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
/*UPDATE*/

export const setProfile = async (req, res) => {
  try {
    const { id } = req.user;
    const { avatar, cover } = req.files;
    const { bio, birthDate, location } = req.body;
    const profile = await Profile.findById(id);
    if (avatar) {
      profile.avatarPath = `${process.env.API_URL}/storage/${avatar.filename}`;
    }
    if (cover) {
      profile.coverPath = `${process.env.API_URL}/storage/${cover.filename}`;
    }
    if (bio) {
      profile.bio = bio;
    }
    if (birthDate) {
      profile.birthDate = birthDate;
    }
    if (location) {
      profile.location = location;
    }

    await profile.save();
    return res.status(200).json({ token: req.user.token, ...profile._doc });
  } catch {
    return res
      .status(500)
      .json({ message: "An error occurred. Plaese try again later." });
  }
};
export const follow = async (req, res) => {
  try {
    const { id } = req.user;
    const { userId } = req.query;
    if (id == userId) {
      return res.status(409).json({ error: "cannot follow yourself" });
    }
    const profile = await Profile.findById(id);
    const accountToFollow = await Profile.findById(userId);
    if (!accountToFollow) {
      return res.status(400).send("bad request");
    }
    if (profile.following.includes(userId)) {
      return res.status(409).json({ error: "already followed" });
    }
    profile.following.push(userId);
    accountToFollow.followers.push(id);
    await profile.save();
    await accountToFollow.save();
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
