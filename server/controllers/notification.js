import { Types } from "mongoose";
import Notification from "../models/notification.js";
import { handleError } from "../utils/errorHandler.js";

const { ObjectId } = Types;

export const get = async (id) => {
  try {
    const notifications = await Notification.aggregate([
      {
        $match: { _id: new ObjectId(id) },
      },
      {
        $lookup: {
          from: "profiles",
          localField: "engagedUserId",
          foreignField: "_id",
          as: "engagedUser",
        },
      },
      { $unwind: "$engagedUser" },
      {
        $project: {
          type: 1,
          isRead: 1,
          path: 1,
          createdAt: 1,
          engagedUser: {
            firstName: 1,
            lastName: 1,
            username: 1,
            gender: 1,
            profilePicPath: 1,
          },
        },
      },
    ]);
    return notifications?.at(0);
  } catch (err) {
    return handleError(err);
  }
};

export const getAll = async (req, res) => {
  try {
    const { user } = req;
    let { page } = req.query;

    page = parseInt(page);
    page = page ? page : 1;

    const notifications = await Notification.aggregate([
      {
        $match: { userId: user._id },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $skip: (page - 1) * 10,
      },
      {
        $limit: 10,
      },
      {
        $lookup: {
          from: "profiles",
          localField: "engagedUserId",
          foreignField: "_id",
          as: "engagedUser",
        },
      },
      { $unwind: "$engagedUser" },
      {
        $project: {
          type: 1,
          isRead: 1,
          path: 1,
          createdAt: 1,
          engagedUser: {
            firstName: 1,
            lastName: 1,
            username: 1,
            gender: 1,
            profilePicPath: 1,
          },
        },
      },
    ]);
    return res.status(200).json(notifications);
  } catch (err) {
    return handleError(err, res);
  }
};

export const setRead = async (req, res) => {
  try {
    const { id } = req.params;
    const { user } = req;
    const notification = await Notification.findById(id);
    if (!notification) {
      return res.status(404).json({ message: "notification not found" });
    }
    if (notification.isRead) {
      return res.status(409).json({ message: "notification is already read" });
    }
    notification.isRead = true;
    user.unreadNotificationsCount--;
    await user.save();
    await notification.save();
    return res.status(200).json(notification);
  } catch (err) {
    return handleError(err, res);
  }
};

export const setAllRead = async (req, res) => {
  try {
    const { user } = req;
    await Notification.updateMany({ userId: user._id }, { isRead: true });
    user.unreadNotificationsCount = 0;
    await user.save();
    return res.status(200).send("success");
  } catch (err) {
    return handleError(err, res);
  }
};

export const deleteOne = async (req, res) => {
  try {
    const { user } = req;
    const { id } = req.params;
    const notification = await Notification.findById(id);

    if (!notification) {
      return res.status(404).json({ message: "Notification not found." });
    }

    if (!notification.isRead) {
      user.unreadNotificationsCount--;
      await user.save();
    }
    await notification.deleteOne();
    return res.status(200).send("success");
  } catch (err) {
    return handleError(err, res);
  }
};

export const clear = async (req, res) => {
  try {
    const { user } = req;
    await Notification.deleteMany({ userId: user._id });
    user.unreadNotificationsCount = 0;
    await user.save();
    return res.status(200).send("success");
  } catch (err) {
    return handleError(err, res);
  }
};
