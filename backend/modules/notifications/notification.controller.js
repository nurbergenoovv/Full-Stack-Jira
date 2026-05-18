const notificationService = require('./notification.service');

const getNotifications = async (req, res, next) => {
  try {
    const notifications = await notificationService.getNotifications(req.user._id);
    res.json({ success: true, data: notifications });
  } catch (err) {
    next(err);
  }
};

const markRead = async (req, res, next) => {
  try {
    const notification = await notificationService.markRead(req.params.id, req.user._id);
    res.json({ success: true, data: notification });
  } catch (err) {
    next(err);
  }
};

const markAllRead = async (req, res, next) => {
  try {
    const result = await notificationService.markAllRead(req.user._id);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

module.exports = { getNotifications, markRead, markAllRead };
