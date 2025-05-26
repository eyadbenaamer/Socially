import Profile from "../models/profile.js";
import User from "../models/user.js";

import { getOnlineUsers } from "../socket/onlineUsers.js";
import { getServerSocketInstance } from "../socket/socketServer.js";

export const add = async (req, res) => {
  try {
    const { user, post, comment } = req;
    const { text } = req.body;
    const profile = await Profile.findById(user.id);
    const { fileInfo } = req;

    // if the comment disabled then only the post author can reply to a comment
    if (post.isCommentsDisabled && user.id !== post.creatorId) {
      return res.status(409).json({ error: "comments are disabled" });
    }
    if (!(text || fileInfo)) {
      return res.status(409).json({ message: "reply cannot be empty" });
    }

    // adding the post's category to the user's favorite topics
    const updateObj = {};
    post.keywords.forEach((keyword) => {
      updateObj[`favoriteTopics.${keyword}.count`] = 1;
    });

    await user.updateOne({ $inc: updateObj }, { new: true });
    /*
    if who replied is NOT the same as the comment creator 
    then a notification will be created.
    */
    if (user.id !== comment.creatorId) {
      const newNotification = {
        content: `${profile.firstName} replied to your comment.`,
        type: "comment",
        userId: profile._id,
        createdAt: Date.now(),
        isRead: false,
      };
      const commentCreator = await User.findById(comment.creatorId);
      if (!commentCreator) {
        return res
          .status(500)
          .json({ message: "An error occurred. Plaese try again later." });
      }
      commentCreator.notifications.unshift(newNotification);
      commentCreator.unreadNotificationsCount += 1;
      await commentCreator.save();

      const notification = commentCreator.notifications[0];

      comment.replies.addToSet({
        creatorId: user.id,
        rootCommentId: comment.id,
        text: text.trim(),
        notificationId: notification?.id,
        file: fileInfo ? fileInfo : null,
        createdAt: Date.now(),
      });
      await post.save();
      const reply = comment.replies[comment.replies?.length - 1];
      notification.path = `/post?_id=${post.id}&commentId${comment.id}&replyId${reply.id}`;
      await commentCreator.save();
      // sending the notification by web socket
      const socketIdsList = getOnlineUsers().get(comment.creatorId);
      if (socketIdsList) {
        socketIdsList.map((socketId) => {
          getServerSocketInstance()
            .to(socketId)
            .emit("push-notification", notification);
        });
      }
      return res.status(200).json(post);
    }
    /*
    if who commented is the same as the post creator 
    then no notification will be created.
    */
    comment.replies.addToSet({
      creatorId: user.id,
      rootCommentId: comment.id,
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

export const get = async (req, res) => {
  try {
    return res.status(200).json(req.reply);
  } catch {
    return res
      .status(500)
      .json({ message: "An error occurred. Plaese try again later." });
  }
};

export const edit = async (req, res) => {
  try {
    const { user, post, reply } = req;
    const { text } = req.body;

    if (user.id === reply.creatorId) {
      return res.status(401).json("Unauthorized");
    }

    if (!text) {
      return res.status(409).json({ message: "reply cannot be empty" });
    }

    reply.text = text;
    await post.save();
    return res.status(200).json(reply);
  } catch {
    return res
      .status(500)
      .json({ message: "An error occurred. Plaese try again later." });
  }
};

export const likeToggle = async (req, res) => {
  try {
    const { post, comment, reply, user } = req;
    const profile = await Profile.findById(user.id);
    const replyCreator = await User.findById(reply.creatorId);

    /*
    if the reply's likes includes the user id, then
    it means that the user liked the reply, therefore 
    the user id will be removed from the reply's likes  
    */
    const like = reply.likes.id(user.id);
    if (like) {
      /*
    if who unliked the reply is the same as the reply creator 
    then no notification will be removed.
    */
      if (user.id !== reply.creatorId) {
        // romving the like's notification
        const notification = replyCreator.notifications.id(like.notificationId);
        if (notification) {
          const socketIdsList = getOnlineUsers().get(reply.creatorId);
          if (socketIdsList) {
            socketIdsList.map((socketId) => {
              getServerSocketInstance()
                .to(socketId)
                .emit("remove-notification", notification.id);
            });
          }

          if (!notification.isRead) {
            replyCreator.unreadNotificationsCount--;
          }
          notification.deleteOne();
          await replyCreator.save();
        }
      }
      like.deleteOne();
      await post.save();
      return res.status(200).json({ likes: reply.likes });
    }
    /*
    if who liked the reply is the same as the reply creator 
    then no notification will be created.
    */
    if (user.id !== reply.creatorId) {
      const newNotification = {
        content: `${profile.firstName} liked your reply.`,
        userId: profile.id,
        type: "like",
        path: `/post?_id=${post.id}&commentId${comment.id}&replyId${reply.id}`,
        createdAt: Date.now(),
        isRead: false,
      };
      if (replyCreator) {
        replyCreator.notifications.unshift(newNotification);
        replyCreator.unreadNotificationsCount += 1;
        await replyCreator.save();

        const notification = replyCreator.notifications[0];
        reply.likes.addToSet({
          _id: user.id,
          notificationId: notification.id,
        });
        await post.save();

        const socketIdsList = getOnlineUsers().get(reply.creatorId);
        if (socketIdsList) {
          socketIdsList.map((socketId) => {
            getServerSocketInstance()
              .to(socketId)
              .emit("push-notification", notification);
          });
        }
      }
      return res.status(200).json({ likes: reply.likes });
    }
    reply.likes.addToSet({ _id: user.id });
    await post.save();
    return res.status(200).json({ likes: reply.likes });
  } catch {
    return res
      .status(500)
      .json({ message: "An error occurred. Plaese try again later." });
  }
};

export const deleteReply = async (req, res) => {
  try {
    const { user, post, comment, reply } = req;
    /*
    the reply can be deleted ether by the reply
    creator or the post creator
    */
    if (!(user.id === reply.creatorId)) {
      return res.status(401).json("Unauthorized");
    }

    const commentCreator = await User.findById(comment.creatorId);
    const notification = commentCreator.notifications.id(reply.notificationId);
    if (notification) {
      const socketIdsList = getOnlineUsers().get(comment.creatorId);
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

    reply.deleteOne();
    await post.save();
    return res.status(200).json(post);
  } catch {
    return res
      .status(500)
      .json({ message: "An error occurred. Plaese try again later." });
  }
};
