import { handleError } from "../utils/errorHandler.js";

export const getAll = async (req, res) => {
  try {
    const { user } = req;
    let { page } = req.query;

    page = parseInt(page);
    page = page ? page : 1;

    const notifications = user.notifications.slice((page - 1) * 10, page * 10);
    return res.status(200).json(notifications);
  } catch (err) {
    return handleError(err, res);
  }
};

export const setRead = async (req, res) => {
  try {
    const { id } = req.params;
    const { user } = req;
    const notification = user.notifications.id(id);
    if (!notification) {
      return res.status(404).json({ message: "notification not found" });
    }
    if (notification.isRead) {
      return res.status(409).json({ message: "notification is already read" });
    }
    notification.isRead = true;
    user.unreadNotificationsCount--;
    await user.save();
    return res.status(200).json(notification);
  } catch (err) {
    return handleError(err, res);
  }
};

export const setAllRead = async (req, res) => {
  try {
    const { user } = req;
    const notifications = user.notifications;
    notifications.map((notification) => {
      notification.isRead = true;
    });
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
    const notification = user.notifications.id(id);

    if (!notification) {
      return res.status(404).json({ message: "notification not found." });
    }

    if (!notification.isRead) {
      user.unreadNotificationsCount--;
    }
    notification.deleteOne();
    await user.save();
    return res.status(200).send("success");
  } catch (err) {
    return handleError(err, res);
  }
};

export const clear = async (req, res) => {
  try {
    const { user } = req;
    user.notifications = [];
    user.unreadNotificationsCount = 0;
    await user.save();
    return res.status(200).send("success");
  } catch (err) {
    return handleError(err, res);
  }
};
