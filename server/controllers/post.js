import fs from "fs";
import { fork } from "child_process";

import User from "../models/user.js";
import Profile from "../models/profile.js";
import Post from "../models/post.js";

import { getOnlineUsers } from "../socket/onlineUsers.js";
import { getServerSocketInstance } from "../socket/socketServer.js";
import { handleError } from "../utils/errorHandler.js";

/*CREATE*/

export const create = async (req, res) => {
  try {
    const { id } = req.user;
    const { text, location } = req.body;
    const { filesInfo } = req;

    const post = await Post.create({
      creatorId: id.trim(),
      text: text?.trim(),
      files: filesInfo,
      createdAt: Date.now(),
      location: location?.trim(),
    });

    /*
    Run the classification and analysis of the post's text
    in a separate process
    */
    const child = fork("./workers/classifyText.js");
    child.send({ postId: post._id, text });

    return res.status(201).json(post);
  } catch {
    return res
      .status(500)
      .json({ message: "An error occurred. Please try again later." });
  }
};

export const share = async (req, res) => {
  const uploadsFolder = `${process.env.API_URL}/storage/`;
  try {
    const { user } = req;
    const profile = await Profile.findById(user.id);
    let { text, location } = req.body;
    let { postId } = req.query;
    const { media } = req.files;
    let filesInfo = [];
    if (media) {
      media.map((file) => {
        if (file.mimetype.startsWith("image")) {
          filesInfo.push({
            path: `${uploadsFolder}${file.filename}`,
            fileType: "photo",
          });
        } else if (file.mimetype.startsWith("video")) {
          filesInfo.push({
            path: `${uploadsFolder}${file.filename}`,
            fileType: "vedio",
          });
        }
      });
    }
    const sharedPost = await Post.findById(postId);
    if (!sharedPost) {
      return res.status(404).json({ message: "Post not found." });
    }
    /*
    if who shared the post is NOT the same as the post creator 
    then a notification will be created.
    */
    if (user.id !== sharedPost.creatorId) {
      const newNotification = {
        content: `${profile.firstName} shared your post.`,
        type: "share",
        userId: profile._id,
        createdAt: Date.now(),
        isRead: false,
      };
      const postCreator = await User.findById(sharedPost.creatorId);
      if (postCreator) {
        postCreator.notifications.unshift(newNotification);
        postCreator.unreadNotificationsCount += 1;
        await postCreator.save();

        const notification = postCreator.notifications[0];

        const post = await Post.create({
          creatorId: user.id,
          text: text.trim(),
          createdAt: Date.now(),
          comments: [],
          views: [],
          location: location.trim(),
          sharedPost: {
            _id: sharedPost._id,
            creatorId: sharedPost.creatorId,
            notificationId: notification.id,
          },
        });
        await post.save();
        notification.path = `/post?_id=${post.id}`;
        await postCreator.save();
        // sending the notification by web socket
        const socketIdsList = getOnlineUsers().get(sharedPost.creatorId);
        if (socketIdsList) {
          socketIdsList.map((socketId) => {
            getServerSocketInstance()
              .to(socketId)
              .emit("push-notification", notification);
          });
        }
        return res.status(201).json(post);
      }
    }
    const post = await Post.create({
      creatorId: user.id,
      text: text.trim(),
      createdAt: Date.now(),
      comments: [],
      views: [],
      location: location.trim(),
      sharedPost: {
        _id: sharedPost._id,
        creatorId: sharedPost.creatorId,
      },
    });
    await post.save();

    // adding the post's category to the user's favorite topics
    const updateObj = {};
    sharedPost.keywords.forEach((keyword) => {
      updateObj[`favoriteTopics.${keyword}.count`] = 1;
    });

    await user.updateOne({ $inc: updateObj }, { new: true });
    return res.status(201).json(post);
  } catch (err) {
    return handleError(err, res);
  }
};

/*READ*/

export const getPost = async (req, res) => {
  try {
    const { post } = req;
    return res.status(200).json(post);
  } catch (err) {
    return handleError(err, res);
  }
};

/*UPDATE*/

export const edit = async (req, res) => {
  try {
    const { user, post } = req;
    const { text, location } = req.body;
    if (post.creatorId !== user.id) {
      return res.status(401).send("Unauthorized");
    }

    text ? (post.text = text) : null;
    location ? (post.location = location) : null;
    await post.save();
    return res.status(200).json(post);
  } catch (err) {
    return handleError(err, res);
  }
};

export const toggleComments = async (req, res) => {
  try {
    const { post } = req;
    post.isCommentsDisabled = !post.isCommentsDisabled;
    await post.save();
    const message = post.isCommentsDisabled
      ? "comments disabled"
      : "comments enabled";
    return res.status(200).json({ message });
  } catch (err) {
    return handleError(err, res);
  }
};
export const likeToggle = async (req, res) => {
  try {
    const { user, post } = req;
    const profile = await Profile.findById(user.id);
    const postCreator = await User.findById(post.creatorId);
    const like = post.likes.id(user.id);
    /*
    if the user liked the post then
    add thier id to the post's likes
    */
    if (like) {
      /*
      if who unliked the post is the same as the post creator 
      then no notification will be removed.
      */
      if (user.id !== post.creatorId) {
        // romving the like's notification
        const notification = postCreator.notifications.id(like.notificationId);
        if (notification) {
          const socketIdsList = getOnlineUsers().get(post.creatorId);
          if (socketIdsList) {
            socketIdsList.map((socketId) => {
              getServerSocketInstance()
                .to(socketId)
                .emit("remove-notification", notification.id);
            });
          }

          if (!notification.isRead) {
            postCreator.unreadNotificationsCount--;
          }
          notification.deleteOne();
          await postCreator.save();
        }
      }
      like.deleteOne();
      await post.save();
      return res.status(200).json({ likes: post.likes });
    }
    /*
    if the user haven't like the post then
    add thier id to the post's likes
    */

    /*
    if who liked the post is the same as the post creator 
    then no notification will be created.
    */
    if (user.id !== post.creatorId) {
      const newNotification = {
        userId: profile._id,
        content: `${profile.firstName} liked your post.`,
        type: "like",
        path: `/post?_id=${post.id}`,
        createdAt: Date.now(),
        isRead: false,
      };
      if (postCreator) {
        postCreator.notifications.unshift(newNotification);
        postCreator.unreadNotificationsCount += 1;
        await postCreator.save();
        const notification = postCreator.notifications[0];
        post.likes.addToSet({ _id: user.id, notificationId: notification.id });
        await post.save();

        const socketIdsList = getOnlineUsers().get(post.creatorId);
        if (socketIdsList) {
          socketIdsList.map((socketId) => {
            getServerSocketInstance()
              .to(socketId)
              .emit("push-notification", notification);
          });
        }
      }

      // adding the post's category to the user's favorite topics
      const updateObj = {};
      post.keywords.forEach((keyword) => {
        updateObj[`favoriteTopics.${keyword}.count`] = 1;
      });

      await user.updateOne({ $inc: updateObj }, { new: true });
      return res.status(200).json({ likes: post.likes });
    }
    post.likes.addToSet({ _id: user.id });
    await post.save();
    return res.status(200).json({ likes: post.likes });
  } catch (err) {
    return handleError(err, res);
  }
};

export const setViewed = async (req, res) => {
  try {
    const { user, post } = req;

    if (post.views.id(user.id)) {
      return res.status(409).json({ message: "Already viewed." });
    }

    post.views.addToSet(user.id);
    await post.updateOne(post);
    return res.status(200).json(post);
  } catch (err) {
    return handleError(err, res);
  }
};

/*DELETE*/

export const deletePost = async (req, res) => {
  try {
    const { user, post } = req;

    if (post.creatorId !== user.id) {
      return res.status(401).send("Unauthorized");
    }

    // delete the attached files from the storage
    post.files?.map((file) => {
      const filename = `./public/storage/${file.path.split("/").at(-1)}`;
      try {
        fs.unlinkSync(filename);
      } catch {}
    });

    // if the post is a shared post then the share notification should be deleted
    if (post.sharedPost) {
      /*
    if who shared the post is the same as the post creator 
    then no notification will be removed.
    */
      if (user.id !== post.sharedPost.creatorId) {
        const sharedPostCreator = await User.findById(
          post.sharedPost.creatorId
        );
        // romving the like's notification
        const notification = sharedPostCreator.notifications.id(
          post.sharedPost.notificationId
        );
        if (notification) {
          const socketIdsList = getOnlineUsers().get(sharedPostCreator.id);
          if (socketIdsList) {
            socketIdsList.map((socketId) => {
              getServerSocketInstance()
                .to(socketId)
                .emit("remove-notification", notification.id);
            });
          }

          if (!notification.isRead) {
            sharedPostCreator.unreadNotificationsCount--;
          }
          notification.deleteOne();
          await sharedPostCreator.save();
        }
      }
    }
    await post.deleteOne();
    return res.status(200).json({ message: "post deleted successfully" });
  } catch (err) {
    return handleError(err, res);
  }
};
