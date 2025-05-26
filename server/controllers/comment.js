import Profile from "../models/profile.js";
import User from "../models/user.js";

import { getOnlineUsers } from "../socket/onlineUsers.js";
import { getServerSocketInstance } from "../socket/socketServer.js";
//TODO: find a way to send comments on patches

/*READ*/

export const get = async (req, res) => {
  try {
    return res.status(200).json(req.comment);
  } catch {
    return res
      .status(500)
      .json({ message: "An error occurred. Plaese try again later." });
  }
};

/*CREAT*/
export const add = async (req, res) => {
  try {
    const { user, post } = req;
    const { text } = req.body;
    const { fileInfo } = req;
    const profile = await Profile.findById(user.id);
    // if the comment disabled then only the post author can comment
    if (post.isCommentsDisabled && user.id !== post.creatorId) {
      return res.status(409).json({ error: "comments are disabled" });
    }
    if (!(text || fileInfo)) {
      return res.status(400).json({ error: "comment cannot be empty" });
    }
    /*
    if who commented is NOT the same as the post creator 
    then a notification will be created.
    */
    if (user.id !== post.creatorId) {
      const newNotification = {
        content: `${profile.firstName} commented on your post.`,
        type: "comment",
        userId: profile._id,
        createdAt: Date.now(),
        isRead: false,
      };
      const postCreator = await User.findById(post.creatorId);
      if (!postCreator) {
        return res
          .status(500)
          .json({ message: "An error occurred. Plaese try again later." });
      }
      postCreator.notifications.unshift(newNotification);
      postCreator.unreadNotificationsCount += 1;
      await postCreator.save();

      const notification = postCreator.notifications[0];

      post.comments.addToSet({
        creatorId: user.id,
        text: text.trim(),
        notificationId: notification?.id,
        file: fileInfo ? fileInfo : null,
        createdAt: Date.now(),
      });
      await post.save();
      const comment = post.comments[post.comments?.length - 1];
      notification.path = `/post?_id=${post.id}&commentId=${comment.id}`;
      await postCreator.save();
      // sending the notification by web socket
      const socketIdsList = getOnlineUsers().get(post.creatorId);
      if (socketIdsList) {
        socketIdsList.map((socketId) => {
          getServerSocketInstance()
            .to(socketId)
            .emit("push-notification", notification);
        });
      }

      // adding the post's category to the user's favorite topics
      const updateObj = {};
      post.keywords.forEach((keyword) => {
        updateObj[`favoriteTopics.${keyword}.count`] = 1;
      });
      await user.updateOne({ $inc: updateObj }, { new: true });
      return res.status(200).json(post);
    }
    /*
    if who commented is the same as the post creator 
    then no notification will be created.
    */
    post.comments.addToSet({
      creatorId: user.id,
      text: text.trim(),
      file: fileInfo ? fileInfo : null,
      createdAt: Date.now(),
    });
    await post.save();

    return res.status(200).json(post);
  } catch {
    return res
      .status(500)
      .json({ message: "An error occurred. Plaese try again later." });
  }
};

/*UPDATE*/

export const edit = async (req, res) => {
  try {
    const { text } = req.body;
    const { user, post, comment } = req;
    if (text) {
      if (comment.creatorId === user.id) {
        comment.text = text;
        await post.save();
        return res.status(200).json(comment);
      } else {
        return res.status(401).send("Unauthorized");
      }
    } else {
      return res.status(409).json({ error: "comment cannot be empty" });
    }
  } catch {
    return res
      .status(500)
      .json({ message: "An error occurred. Plaese try again later." });
  }
};

export const likeToggle = async (req, res) => {
  try {
    const { post, user, comment } = req;
    const profile = await Profile.findById(user.id);
    const { creatorId } = comment;
    const commentCreator = await User.findById(comment.creatorId);

    /*
    if the comment's likes includes the user id, then
    it means that the user liked the comment, therefore 
    the user id will be removed from the comment's likes  
    */
    const like = comment.likes.id(user.id);
    if (like) {
      /*
    if who unliked the comment is the same as the comment creator 
    then no notification will be removed.
    */
      if (user.id !== comment.creatorId) {
        // romving the like's notification
        const notification = commentCreator.notifications.id(
          like.notificationId
        );
        if (notification) {
          const socketIdsList = getOnlineUsers().get(creatorId);
          if (socketIdsList) {
            socketIdsList.map((socketId) => {
              getServerSocketInstance()
                .to(socketId)
                .emit("remove-notification", notification.id);
            });
          }

          if (!notification.isRead) {
            commentCreator.unreadNotificationsCount--;
          }
          notification.deleteOne();
          await commentCreator.save();
        }
      }
      like.deleteOne();
      await post.save();

      return res.status(200).json({ likes: comment.likes });
    }

    /*
    if who liked the comment is the same as the comment creator 
    then no notification will be created.
    */
    if (user.id !== comment.creatorId) {
      const newNotification = {
        content: `${profile.firstName} liked your comment.`,
        userId: profile.id,
        type: "like",
        path: `/post?_id=${post.id}&commentId${comment.id}`,
        createdAt: Date.now(),
        isRead: false,
      };
      if (commentCreator) {
        commentCreator.notifications.unshift(newNotification);
        commentCreator.unreadNotificationsCount += 1;
        await commentCreator.save();

        const notification = commentCreator.notifications[0];
        comment.likes.addToSet({
          _id: user.id,
          notificationId: notification.id,
        });
        await post.save();

        const socketIdsList = getOnlineUsers().get(creatorId);
        if (socketIdsList) {
          socketIdsList.map((socketId) => {
            getServerSocketInstance()
              .to(socketId)
              .emit("push-notification", notification);
          });
        }
      }
      return res.status(200).json({ likes: comment.likes });
    }
    comment.likes.addToSet({ _id: user.id });
    await post.save();

    return res.status(200).json({ likes: comment.likes });
  } catch {
    return res
      .status(500)
      .json({ message: "An error occurred. Plaese try again later." });
  }
};

/*DELETE*/

export const deleteComment = async (req, res) => {
  try {
    const { user, post, comment } = req;
    /*
    the comment can be deleted ether by the comment
    creator or the post creator
    */
    if (!(user.id === comment.creatorId || user.id === post.creatorId)) {
      return res.status(401).send("Unauthorized");
    }

    const postCreator = await User.findById(post.creatorId);
    const notification = postCreator.notifications.id(comment.notificationId);
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
    comment.deleteOne();
    await post.save();
    return res.status(200).json(post);
  } catch {
    return res
      .status(500)
      .json({ message: "An error occurred. Plaese try again later." });
  }
};
