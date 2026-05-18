const userService = require('./user.service');

const getProfile = async (req, res, next) => {
  try {
    const user = await userService.getProfile(req.user._id);
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const user = await userService.updateProfile(req.user._id, req.body);
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

const updateAvatar = async (req, res, next) => {
  try {
    const { avatarUrl } = req.body;
    const user = await userService.updateAvatar(req.user._id, avatarUrl);
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

module.exports = { getProfile, updateProfile, updateAvatar };
