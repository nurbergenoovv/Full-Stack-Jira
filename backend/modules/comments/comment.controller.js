const commentService = require('./comment.service');

const getComments = async (req, res, next) => {
  try {
    const comments = await commentService.getComments(req.params.taskId, req.user._id);
    res.json({ success: true, data: comments });
  } catch (err) {
    next(err);
  }
};

const addComment = async (req, res, next) => {
  try {
    const comment = await commentService.addComment(
      req.params.taskId,
      req.user._id,
      req.body.message
    );
    res.status(201).json({ success: true, data: comment });
  } catch (err) {
    next(err);
  }
};

const updateComment = async (req, res, next) => {
  try {
    const comment = await commentService.updateComment(
      req.params.id,
      req.user._id,
      req.body.message
    );
    res.json({ success: true, data: comment });
  } catch (err) {
    next(err);
  }
};

const deleteComment = async (req, res, next) => {
  try {
    await commentService.deleteComment(req.params.id, req.user._id);
    res.json({ success: true, data: { message: 'Comment deleted' } });
  } catch (err) {
    next(err);
  }
};

module.exports = { getComments, addComment, updateComment, deleteComment };
