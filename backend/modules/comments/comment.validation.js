const Joi = require('joi');

const createCommentSchema = Joi.object({
  message: Joi.string().min(1).max(5000).required(),
});

const updateCommentSchema = Joi.object({
  message: Joi.string().min(1).max(5000).required(),
});

module.exports = { createCommentSchema, updateCommentSchema };
