const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  message: { type: String, required: true, trim: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  task: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true },
  edited: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

commentSchema.index({ task: 1 });

module.exports = mongoose.model('Comment', commentSchema);
