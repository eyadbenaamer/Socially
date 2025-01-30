import Profile from "../models/profile.js";
import User from "../models/user.js";

import { getOnlineUsers } from "../socket/onlineUsers.js";
import { getServerSocketInstance } from "../socket/socketServer.js";

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
    return res.status(200).json(followers);
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
    return res.status(200).json(following);
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
    const myProfile = await Profile.findById(myId);
    const profileToFollow = await Profile.findById(userId);
    if (!profileToFollow) {
      return res.status(400).send("bad request");
    }
    if (myProfile.following.id(userId)) {
      return res.status(409).json({ error: "already followed" });
    }
    // creating a following notification
    const userToFollow = await User.findById(userId);
    const newNotification = {
      content: `${myProfile.firstName} started following you.`,
      userId: myProfile._id,
      type: "follow",
      path: `/profile/${myProfile.username}`,
      createdAt: Date.now(),
      isRead: false,
    };
    userToFollow.notifications.unshift(newNotification);
    userToFollow.unreadNotificationsCount += 1;
    await userToFollow.save();

    const notification = userToFollow.notifications[0];

    // sending the following notification to the followed user
    const socketIdsList = getOnlineUsers().get(userId);
    if (socketIdsList) {
      socketIdsList.map((socketId) => {
        getServerSocketInstance()
          .to(socketId)
          .emit("push-notification", notification);
      });
    }

    myProfile.following.addToSet({ _id: userId });
    profileToFollow.followers.addToSet({
      _id: myId,
      notificationId: notification.id,
    });

    await myProfile.save();
    await profileToFollow.save();
    return res.status(200).json(myProfile);
  } catch {
    return res
      .status(500)
      .json({ message: "An error occurred. Plaese try again later." });
  }
};

export const unfollow = async (req, res) => {
  try {
    const { id: myId } = req.user;
    const { userId } = req.query;
    if (myId == userId) {
      return res.status(409).json({ error: "cannot unfollow yourself" });
    }
    const myProfile = await Profile.findById(myId);
    const accountToUnfollow = await Profile.findById(userId);

    if (!(myProfile && accountToUnfollow)) {
      return res.status(400).send("bad request");
    }

    if (!myProfile.following.id(userId)) {
      return res.status(409).json({ error: "not followed" });
    }
    // removing the notification from database and from the client
    const { notificationId } = accountToUnfollow.followers.id(myId);
    const userToUnfollow = await User.findById(userId);
    const notification = userToUnfollow.notifications.id(notificationId);
    if (notification) {
      const socketIdsList = getOnlineUsers().get(userId);
      if (socketIdsList) {
        socketIdsList.map((socketId) => {
          getServerSocketInstance()
            .to(socketId)
            .emit("remove-notification", notification.id);
        });
      }
      if (!notification.isRead) {
        userToUnfollow.unreadNotificationsCount--;
      }
      notification.deleteOne();
      await userToUnfollow.save();
    }

    accountToUnfollow.followers.id(myId).deleteOne();
    myProfile.following.id(userId).deleteOne();
    await myProfile.save();
    await accountToUnfollow.save();
    return res.status(200).json(myProfile);
  } catch {
    return res
      .status(500)
      .json({ message: "An error occurred. Plaese try again later." });
  }
};

export const removeFollower = async (req, res) => {
  try {
    const { id: myId } = req.user;
    const { userId } = req.query;
    if (myId == userId) {
      return res.status(400).send("bad request");
    }
    const myProfile = await Profile.findById(myId);
    const followerToRemove = await Profile.findById(userId);
    if (!(myProfile && followerToRemove)) {
      return res.status(400).send("bad request");
    }
    if (!myProfile.followers.id(userId)) {
      return res.status(409).json({ error: "not following" });
    }

    const { notificationId } = myProfile.followers.id(userId);
    const user = await User.findById(myId);

    const notification = user.notifications.id(notificationId);
    if (notification) {
      const socketIdsList = getOnlineUsers().get(myId);
      if (socketIdsList) {
        socketIdsList.map((socketId) => {
          getServerSocketInstance()
            .to(socketId)
            .emit("remove-notification", notification.id);
        });
      }
      if (!notification.isRead) {
        user.unreadNotificationsCount--;
      }
      notification.deleteOne();
      await user.save();
    }

    myProfile.followers.id(userId).deleteOne();
    followerToRemove.following.id(myId).deleteOne();
    await myProfile.save();
    await followerToRemove.save();
    return res.status(200).json(myProfile);
  } catch {
    return res
      .status(500)
      .json({ message: "An error occurred. Plaese try again later." });
  }
};
