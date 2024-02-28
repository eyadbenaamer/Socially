import Profile from "../models/profile.js";
import User from "../models/user.js";

/*READ*/

export const getProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const profile = await Profile.findById(id);
    if (profile) {
      return res.status(200).json(profile);
    } else {
      return res.status(404).json({ message: "user not found" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "An error occurred. Plaese try again later." });
  }
};
export const getFollowers = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    const followers = user.followers;
    if (followers) {
      return res.status(200).json(followers);
    } else {
      return res.status(404).json({ error: "No followers found" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "An error occurred. Plaese try again later." });
  }
};
export const getFollowing = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    const following = user.following;
    if (following) {
      return res.status(200).json(following);
    } else {
      return res.status(404).json({ error: "No following found" });
    }
  } catch (error) {
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
    const { bio, birthDate, location, occupation } = req.body;
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
  } catch (error) {
    return res.status(404).json({ error: error.message });
  }
};
export const follow = async (req, res) => {
  try {
    const { id } = req.user;
    const { accountId } = req.params;
    if (id == accountId) {
      return res.status(409).json({ error: "cannot follow yourself" });
    }
    const user = await User.findById(id);
    const account = await User.findById(accountId);
    if (user && account) {
      if (user.following.includes(accountId)) {
        return res.status(409).json({ error: "already followed" });
      } else {
        user.following.push(accountId);
        account.followers.push(id);
      }
      await user.save();
      await account.save();
      return res.status(200).json(user.following);
    } else {
      return res.status(400).send("bad request");
    }
  } catch (error) {
    return res.status(404).json({ error: error.message });
  }
};
export const unFollow = async (req, res) => {
  try {
    const { id } = req.user;
    const { accountId } = req.params;
    if (id == accountId) {
      return res.status(409).json({ error: "cannot unfollow yourself" });
    }
    const user = await User.findById(id);
    const account = await User.findById(accountId);
    if (user && account) {
      if (user.following.includes(accountId)) {
        user.following = user.following.filter((item) => item != accountId);
        account.followers = account.followers.filter((item) => item != id);
      } else {
        return res.status(409).json({ error: "not followed" });
      }
      await user.save();
      await account.save();
      return res.status(200).json(user.following);
    } else {
      return res.status(400).send("bad request");
    }
  } catch (error) {
    return res.status(404).json({ error: error.message });
  }
};
export const removeFollower = async (req, res) => {
  try {
    const { id } = req.user;
    const { accountId } = req.params;
    if (id == accountId) {
      return res.status(409).json({ error: "not applicable" });
    }
    const user = await User.findById(id);
    const account = await User.findById(accountId);
    if (user && account) {
      if (user.followers.includes(accountId)) {
        user.followers = user.followers.filter((item) => item != accountId);
        account.following = account.following.filter((item) => item != id);
      } else {
        return res.status(409).json({ error: "not following" });
      }
      await user.save();
      await account.save();
      return res.status(200).json(user.followers);
    } else {
      return res.status(400).send("bad request");
    }
  } catch (error) {
    return res.status(404).json({ error: error.message });
  }
};
