const User = require('../users/user.model');
const { generateToken } = require('../../utils/jwt.utils');
const { AppError } = require('../../middleware/error.middleware');

const register = async ({ fullName, email, password }) => {
  const existing = await User.findOne({ email });
  if (existing) throw new AppError('Email already in use', 400);

  const user = await User.create({ fullName, email, password });
  const token = generateToken(user._id);

  return { token, user: user.toSafeObject() };
};

const login = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) throw new AppError('Invalid credentials', 401);

  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new AppError('Invalid credentials', 401);

  const token = generateToken(user._id);
  return { token, user: user.toSafeObject() };
};

const getMe = async (userId) => {
  const user = await User.findById(userId).select('-password').populate('projects', 'title');
  if (!user) throw new AppError('User not found', 404);
  return user;
};

module.exports = { register, login, getMe };
