const express = require('express');
const router = express.Router();
const controller = require('./notification.controller');
const { protect } = require('../../middleware/auth.middleware');

router.get('/', protect, controller.getNotifications);
router.patch('/read-all', protect, controller.markAllRead);
router.patch('/:id/read', protect, controller.markRead);

module.exports = router;
