const projectService = require('./project.service');

const getProjects = async (req, res, next) => {
  try {
    const projects = await projectService.getProjects(req.user._id);
    res.json({ success: true, data: projects });
  } catch (err) {
    next(err);
  }
};

const getProject = async (req, res, next) => {
  try {
    const project = await projectService.getProject(req.params.id, req.user._id);
    res.json({ success: true, data: project });
  } catch (err) {
    next(err);
  }
};

const createProject = async (req, res, next) => {
  try {
    const project = await projectService.createProject(req.user._id, req.body);
    res.status(201).json({ success: true, data: project });
  } catch (err) {
    next(err);
  }
};

const updateProject = async (req, res, next) => {
  try {
    const project = await projectService.updateProject(req.params.id, req.user._id, req.body);
    res.json({ success: true, data: project });
  } catch (err) {
    next(err);
  }
};

const deleteProject = async (req, res, next) => {
  try {
    await projectService.deleteProject(req.params.id, req.user._id);
    res.json({ success: true, data: { message: 'Project deleted' } });
  } catch (err) {
    next(err);
  }
};

const inviteMember = async (req, res, next) => {
  try {
    const project = await projectService.inviteMember(
      req.params.id,
      req.user._id,
      req.body.email
    );
    res.json({ success: true, data: project });
  } catch (err) {
    next(err);
  }
};

const removeMember = async (req, res, next) => {
  try {
    const project = await projectService.removeMember(
      req.params.id,
      req.user._id,
      req.params.userId
    );
    res.json({ success: true, data: project });
  } catch (err) {
    next(err);
  }
};

const updateCover = async (req, res, next) => {
  try {
    const project = await projectService.updateCover(
      req.params.id,
      req.user._id,
      req.body.coverUrl
    );
    res.json({ success: true, data: project });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  inviteMember,
  removeMember,
  updateCover,
};
