const Joi = require('joi');

const createProjectSchema = Joi.object({
  title: Joi.string().min(1).max(200).required(),
  description: Joi.string().max(2000).allow('').optional(),
});

const updateProjectSchema = Joi.object({
  title: Joi.string().min(1).max(200).optional(),
  description: Joi.string().max(2000).allow('').optional(),
  status: Joi.string().valid('active', 'archived').optional(),
});

const inviteMemberSchema = Joi.object({
  email: Joi.string().email().required(),
});

module.exports = { createProjectSchema, updateProjectSchema, inviteMemberSchema };
