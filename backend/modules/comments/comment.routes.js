const express = require('express');
const router = express.Router();
const controller = require('./comment.controller');
const { protect } = require('../../middleware/auth.middleware');
const validate = require('../../middleware/validate.middleware');
const { createCommentSchema, updateCommentSchema } = require('./comment.validation');

router.get('/task/:taskId', protect, controller.getComments);
router.post('/task/:taskId', protect, validate(createCommentSchema), controller.addComment);
router.put('/:id', protect, validate(updateCommentSchema), controller.updateComment);
router.delete('/:id', protect, controller.deleteComment);

module.exports = router;
