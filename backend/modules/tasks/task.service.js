const Task = require('./task.model');
const Project = require('../projects/project.model');
const Notification = require('../notifications/notification.model');
const { AppError } = require('../../middleware/error.middleware');
const { broadcastToProject, sendToUser } = require('../../websocket/websocket.manager');
const EVENTS = require('../../websocket/websocket.events');

const populateTask = (query) =>
  query
    .populate('assignee', 'fullName email avatar')
    .populate('createdBy', 'fullName email avatar');

const assertProjectMember = async (projectId, userId) => {
  const project = await Project.findById(projectId);
  if (!project) throw new AppError('Project not found', 404);
  const isMember =
    project.members.some((m) => m.toString() === userId.toString()) ||
    project.owner.toString() === userId.toString();
  if (!isMember) throw new AppError('Access denied', 403);
  return project;
};

const getTasks = async (projectId, userId, filters = {}) => {
  await assertProjectMember(projectId, userId);

  const query = { project: projectId };

  if (filters.status) query.status = filters.status;
  if (filters.priority) query.priority = filters.priority;
  if (filters.assignee) query.assignee = filters.assignee;
  if (filters.search) query.title = { $regex: filters.search, $options: 'i' };

  const tasks = await populateTask(Task.find(query).sort({ createdAt: -1 }));
  return tasks;
};

const getTask = async (taskId, userId) => {
  const task = await populateTask(Task.findById(taskId));
  if (!task) throw new AppError('Task not found', 404);
  await assertProjectMember(task.project, userId);
  return task;
};

const createTask = async (projectId, userId, data) => {
  await assertProjectMember(projectId, userId);

  const task = await Task.create({ ...data, project: projectId, createdBy: userId });
  const populated = await populateTask(Task.findById(task._id));

  broadcastToProject(projectId, EVENTS.TASK_CREATED, { task: populated, projectId });

  if (data.assignee && data.assignee.toString() !== userId.toString()) {
    const notification = await Notification.create({
      user: data.assignee,
      type: 'task_assigned',
      text: `You have been assigned to task: ${task.title}`,
      relatedTask: task._id,
    });
    const populatedNotif = await Notification.findById(notification._id).populate(
      'relatedTask',
      'title'
    );
    sendToUser(data.assignee.toString(), EVENTS.NOTIFICATION_NEW, { notification: populatedNotif });
  }

  return populated;
};

const updateTask = async (taskId, userId, data) => {
  const task = await Task.findById(taskId);
  if (!task) throw new AppError('Task not found', 404);
  await assertProjectMember(task.project, userId);

  const prevAssignee = task.assignee ? task.assignee.toString() : null;
  Object.assign(task, data);
  await task.save();

  const populated = await populateTask(Task.findById(task._id));
  broadcastToProject(task.project.toString(), EVENTS.TASK_UPDATED, {
    task: populated,
    projectId: task.project.toString(),
  });

  const newAssignee = data.assignee ? data.assignee.toString() : null;
  if (newAssignee && newAssignee !== prevAssignee && newAssignee !== userId.toString()) {
    const notification = await Notification.create({
      user: data.assignee,
      type: 'task_assigned',
      text: `You have been assigned to task: ${task.title}`,
      relatedTask: task._id,
    });
    const populatedNotif = await Notification.findById(notification._id).populate(
      'relatedTask',
      'title'
    );
    sendToUser(newAssignee, EVENTS.NOTIFICATION_NEW, { notification: populatedNotif });
  }

  return populated;
};

const deleteTask = async (taskId, userId) => {
  const task = await Task.findById(taskId);
  if (!task) throw new AppError('Task not found', 404);
  await assertProjectMember(task.project, userId);

  const projectId = task.project.toString();
  await task.deleteOne();

  broadcastToProject(projectId, EVENTS.TASK_DELETED, { taskId, projectId });
};

const moveTask = async (taskId, userId, status) => {
  const task = await Task.findById(taskId);
  if (!task) throw new AppError('Task not found', 404);
  await assertProjectMember(task.project, userId);

  task.status = status;
  await task.save();

  const projectId = task.project.toString();
  broadcastToProject(projectId, EVENTS.TASK_MOVED, { taskId, status, projectId });

  if (task.assignee && task.assignee.toString() !== userId.toString()) {
    const notification = await Notification.create({
      user: task.assignee,
      type: 'task_updated',
      text: `Task "${task.title}" was moved to ${status}`,
      relatedTask: task._id,
    });
    const populatedNotif = await Notification.findById(notification._id).populate(
      'relatedTask',
      'title'
    );
    sendToUser(task.assignee.toString(), EVENTS.NOTIFICATION_NEW, { notification: populatedNotif });
  }

  const populated = await populateTask(Task.findById(task._id));
  return populated;
};

const addAttachment = async (taskId, userId, attachment) => {
  const task = await Task.findById(taskId);
  if (!task) throw new AppError('Task not found', 404);
  await assertProjectMember(task.project, userId);

  task.attachments.push(attachment);
  await task.save();

  const populated = await populateTask(Task.findById(task._id));
  broadcastToProject(task.project.toString(), EVENTS.TASK_UPDATED, {
    task: populated,
    projectId: task.project.toString(),
  });
  return populated;
};

module.exports = { getTasks, getTask, createTask, updateTask, deleteTask, moveTask, addAttachment };
