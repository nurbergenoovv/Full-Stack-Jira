const User = require('./user.model');
const { AppError } = require('../../middleware/error.middleware');

const getProfile = async (userId) => {
  const user = await User.findById(userId).select('-password');
  if (!user) throw new AppError('User not found', 404);
  return user;
};

const updateProfile = async (userId, { fullName }) => {
  const user = await User.findByIdAndUpdate(
    userId,
    { fullName },
    { new: true, runValidators: true }
  ).select('-password');
  if (!user) throw new AppError('User not found', 404);
  return user;
};

const updateAvatar = async (userId, avatarUrl) => {
  const user = await User.findByIdAndUpdate(userId, { avatar: avatarUrl }, { new: true }).select(
    '-password'
  );
  if (!user) throw new AppError('User not found', 404);
  return user;
};

module.exports = { getProfile, updateProfile, updateAvatar };
