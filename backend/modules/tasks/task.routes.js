const express = require('express');
const router = express.Router();
const controller = require('./task.controller');
const { protect } = require('../../middleware/auth.middleware');
const validate = require('../../middleware/validate.middleware');
const { createTaskSchema, updateTaskSchema, moveTaskSchema } = require('./task.validation');

router.get('/project/:projectId', protect, controller.getTasks);
router.post('/project/:projectId', protect, validate(createTaskSchema), controller.createTask);
router.get('/:id', protect, controller.getTask);
router.put('/:id', protect, validate(updateTaskSchema), controller.updateTask);
router.delete('/:id', protect, controller.deleteTask);
router.patch('/:id/status', protect, validate(moveTaskSchema), controller.moveTask);
router.post('/:id/attachments', protect, controller.addAttachment);

module.exports = router;
