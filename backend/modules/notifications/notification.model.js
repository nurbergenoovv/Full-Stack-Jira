const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: {
    type: String,
    enum: ['task_assigned', 'comment_added', 'task_updated', 'project_invitation'],
    required: true,
  },
  text: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  relatedTask: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', default: null },
  createdAt: { type: Date, default: Date.now },
});

notificationSchema.index({ user: 1 });
notificationSchema.index({ user: 1, isRead: 1 });

module.exports = mongoose.model('Notification', notificationSchema);
