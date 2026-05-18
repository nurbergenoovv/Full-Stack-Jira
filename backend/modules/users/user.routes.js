const express = require('express');
const router = express.Router();
const controller = require('./user.controller');
const { protect } = require('../../middleware/auth.middleware');

router.get('/profile', protect, controller.getProfile);
router.put('/profile', protect, controller.updateProfile);
router.post('/avatar', protect, controller.updateAvatar);

module.exports = router;
