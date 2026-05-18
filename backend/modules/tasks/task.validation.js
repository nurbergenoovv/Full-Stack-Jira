const Joi = require('joi');

const createTaskSchema = Joi.object({
  title: Joi.string().min(1).max(500).required(),
  description: Joi.string().max(5000).allow('').optional(),
  status: Joi.string().valid('Backlog', 'Todo', 'In Progress', 'Review', 'Done').optional(),
  priority: Joi.string().valid('Low', 'Medium', 'High', 'Critical').optional(),
  dueDate: Joi.date().allow(null).optional(),
  assignee: Joi.string().hex().length(24).allow(null, '').optional(),
});

const updateTaskSchema = Joi.object({
  title: Joi.string().min(1).max(500).optional(),
  description: Joi.string().max(5000).allow('').optional(),
  status: Joi.string().valid('Backlog', 'Todo', 'In Progress', 'Review', 'Done').optional(),
  priority: Joi.string().valid('Low', 'Medium', 'High', 'Critical').optional(),
  dueDate: Joi.date().allow(null).optional(),
  assignee: Joi.string().hex().length(24).allow(null, '').optional(),
});

const moveTaskSchema = Joi.object({
  status: Joi.string().valid('Backlog', 'Todo', 'In Progress', 'Review', 'Done').required(),
});

module.exports = { createTaskSchema, updateTaskSchema, moveTaskSchema };
