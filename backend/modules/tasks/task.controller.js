const taskService = require('./task.service');

const getTasks = async (req, res, next) => {
  try {
    const tasks = await taskService.getTasks(req.params.projectId, req.user._id, req.query);
    res.json({ success: true, data: tasks });
  } catch (err) {
    next(err);
  }
};

const getTask = async (req, res, next) => {
  try {
    const task = await taskService.getTask(req.params.id, req.user._id);
    res.json({ success: true, data: task });
  } catch (err) {
    next(err);
  }
};

const createTask = async (req, res, next) => {
  try {
    const task = await taskService.createTask(req.params.projectId, req.user._id, req.body);
    res.status(201).json({ success: true, data: task });
  } catch (err) {
    next(err);
  }
};

const updateTask = async (req, res, next) => {
  try {
    const task = await taskService.updateTask(req.params.id, req.user._id, req.body);
    res.json({ success: true, data: task });
  } catch (err) {
    next(err);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    await taskService.deleteTask(req.params.id, req.user._id);
    res.json({ success: true, data: { message: 'Task deleted' } });
  } catch (err) {
    next(err);
  }
};

const moveTask = async (req, res, next) => {
  try {
    const task = await taskService.moveTask(req.params.id, req.user._id, req.body.status);
    res.json({ success: true, data: task });
  } catch (err) {
    next(err);
  }
};

const addAttachment = async (req, res, next) => {
  try {
    const task = await taskService.addAttachment(req.params.id, req.user._id, req.body);
    res.json({ success: true, data: task });
  } catch (err) {
    next(err);
  }
};

module.exports = { getTasks, getTask, createTask, updateTask, deleteTask, moveTask, addAttachment };
