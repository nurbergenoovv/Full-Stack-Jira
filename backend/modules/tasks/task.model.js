const mongoose = require('mongoose');

const attachmentSchema = new mongoose.Schema({
  url: { type: String, required: true },
  name: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now },
});

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  status: {
    type: String,
    enum: ['Backlog', 'Todo', 'In Progress', 'Review', 'Done'],
    default: 'Backlog',
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Medium',
  },
  dueDate: { type: Date, default: null },
  assignee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  attachments: [attachmentSchema],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
});

taskSchema.index({ project: 1 });
taskSchema.index({ project: 1, status: 1 });
taskSchema.index({ title: 'text' });

module.exports = mongoose.model('Task', taskSchema);
