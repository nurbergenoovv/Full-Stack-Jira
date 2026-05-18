const authService = require('./auth.service');

const register = async (req, res, next) => {
  try {
    const data = await authService.register(req.body);
    res.status(201).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const data = await authService.login(req.body);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

const getMe = async (req, res, next) => {
  try {
    const user = await authService.getMe(req.user._id);
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

const logout = (req, res) => {
  res.json({ success: true, data: { message: 'Logged out successfully' } });
};

module.exports = { register, login, getMe, logout };
