const Comment = require('./comment.model');
const Task = require('../tasks/task.model');
const Project = require('../projects/project.model');
const Notification = require('../notifications/notification.model');
const { AppError } = require('../../middleware/error.middleware');
const { broadcastToProject, sendToUser } = require('../../websocket/websocket.manager');
const EVENTS = require('../../websocket/websocket.events');

const populateComment = (query) =>
  query.populate('author', 'fullName email avatar');

const assertProjectMember = async (projectId, userId) => {
  const project = await Project.findById(projectId);
  if (!project) throw new AppError('Project not found', 404);
  const isMember =
    project.members.some((m) => m.toString() === userId.toString()) ||
    project.owner.toString() === userId.toString();
  if (!isMember) throw new AppError('Access denied', 403);
  return project;
};

const getComments = async (taskId, userId) => {
  const task = await Task.findById(taskId);
  if (!task) throw new AppError('Task not found', 404);
  await assertProjectMember(task.project, userId);

  const comments = await populateComment(
    Comment.find({ task: taskId }).sort({ createdAt: 1 })
  );
  return comments;
};

const addComment = async (taskId, userId, message) => {
  const task = await Task.findById(taskId);
  if (!task) throw new AppError('Task not found', 404);
  const project = await assertProjectMember(task.project, userId);

  const comment = await Comment.create({ message, author: userId, task: taskId });
  const populated = await populateComment(Comment.findById(comment._id));

  broadcastToProject(task.project.toString(), EVENTS.COMMENT_ADDED, {
    comment: populated,
    taskId,
  });

  if (task.assignee && task.assignee.toString() !== userId.toString()) {
    const notification = await Notification.create({
      user: task.assignee,
      type: 'comment_added',
      text: `New comment on task: ${task.title}`,
      relatedTask: task._id,
    });
    const populatedNotif = await Notification.findById(notification._id).populate(
      'relatedTask',
      'title'
    );
    sendToUser(task.assignee.toString(), EVENTS.NOTIFICATION_NEW, { notification: populatedNotif });
  }

  return populated;
};

const updateComment = async (commentId, userId, message) => {
  const comment = await Comment.findById(commentId);
  if (!comment) throw new AppError('Comment not found', 404);
  if (comment.author.toString() !== userId.toString()) {
    throw new AppError('You can only edit your own comments', 403);
  }

  comment.message = message;
  comment.edited = true;
  await comment.save();

  const populated = await populateComment(Comment.findById(comment._id));
  const task = await Task.findById(comment.task);

  broadcastToProject(task.project.toString(), EVENTS.COMMENT_UPDATED, {
    comment: populated,
    taskId: comment.task,
  });

  return populated;
};

const deleteComment = async (commentId, userId) => {
  const comment = await Comment.findById(commentId);
  if (!comment) throw new AppError('Comment not found', 404);
  if (comment.author.toString() !== userId.toString()) {
    throw new AppError('You can only delete your own comments', 403);
  }

  const task = await Task.findById(comment.task);
  await comment.deleteOne();

  if (task) {
    broadcastToProject(task.project.toString(), EVENTS.COMMENT_DELETED, {
      commentId,
      taskId: comment.task,
    });
  }
};

module.exports = { getComments, addComment, updateComment, deleteComment };
