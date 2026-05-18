const Notification = require('./notification.model');
const { AppError } = require('../../middleware/error.middleware');

const getNotifications = async (userId) => {
  return Notification.find({ user: userId })
    .populate('relatedTask', 'title')
    .sort({ createdAt: -1 })
    .limit(50);
};

const markRead = async (notificationId, userId) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: notificationId, user: userId },
    { isRead: true },
    { new: true }
  );
  if (!notification) throw new AppError('Notification not found', 404);
  return notification;
};

const markAllRead = async (userId) => {
  await Notification.updateMany({ user: userId, isRead: false }, { isRead: true });
  return { message: 'All notifications marked as read' };
};

module.exports = { getNotifications, markRead, markAllRead };
