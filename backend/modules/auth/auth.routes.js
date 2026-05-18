const express = require('express');
const router = express.Router();
const controller = require('./auth.controller');
const validate = require('../../middleware/validate.middleware');
const { protect } = require('../../middleware/auth.middleware');
const { registerSchema, loginSchema } = require('./auth.validation');

router.post('/register', validate(registerSchema), controller.register);
router.post('/login', validate(loginSchema), controller.login);
router.get('/me', protect, controller.getMe);
router.post('/logout', protect, controller.logout);

module.exports = router;
