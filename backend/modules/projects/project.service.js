const Project = require('./project.model');
const User = require('../users/user.model');
const Task = require('../tasks/task.model');
const { AppError } = require('../../middleware/error.middleware');

const populateProject = (query) =>
  query
    .populate('owner', 'fullName email avatar')
    .populate('members', 'fullName email avatar');

const assertMember = (project, userId) => {
  const isMember = project.members.some((m) => m._id.toString() === userId.toString());
  const isOwner = project.owner._id
    ? project.owner._id.toString() === userId.toString()
    : project.owner.toString() === userId.toString();
  if (!isMember && !isOwner) throw new AppError('Access denied', 403);
};

const assertOwner = (project, userId) => {
  const ownerId = project.owner._id
    ? project.owner._id.toString()
    : project.owner.toString();
  if (ownerId !== userId.toString()) throw new AppError('Only the project owner can do this', 403);
};

const getProjects = async (userId) => {
  const projects = await populateProject(
    Project.find({ $or: [{ owner: userId }, { members: userId }] }).sort({ createdAt: -1 })
  );
  return projects;
};

const getProject = async (projectId, userId) => {
  const project = await populateProject(Project.findById(projectId));
  if (!project) throw new AppError('Project not found', 404);
  assertMember(project, userId);
  return project;
};

const createProject = async (userId, { title, description }) => {
  const project = await Project.create({ title, description, owner: userId, members: [userId] });
  await User.findByIdAndUpdate(userId, { $addToSet: { projects: project._id } });
  return populateProject(Project.findById(project._id));
};

const updateProject = async (projectId, userId, data) => {
  const project = await Project.findById(projectId);
  if (!project) throw new AppError('Project not found', 404);
  assertOwner(project, userId);

  Object.assign(project, data);
  await project.save();
  return populateProject(Project.findById(project._id));
};

const deleteProject = async (projectId, userId) => {
  const project = await Project.findById(projectId);
  if (!project) throw new AppError('Project not found', 404);
  assertOwner(project, userId);

  await Task.deleteMany({ project: projectId });
  await User.updateMany({ projects: projectId }, { $pull: { projects: projectId } });
  await project.deleteOne();
};

const inviteMember = async (projectId, userId, email) => {
  const project = await populateProject(Project.findById(projectId));
  if (!project) throw new AppError('Project not found', 404);
  assertOwner(project, userId);

  const invitee = await User.findOne({ email });
  if (!invitee) throw new AppError('User not found with that email', 404);

  const alreadyMember = project.members.some((m) => m._id.toString() === invitee._id.toString());
  if (alreadyMember) throw new AppError('User is already a member', 400);

  project.members.push(invitee._id);
  await project.save();
  await User.findByIdAndUpdate(invitee._id, { $addToSet: { projects: projectId } });

  return populateProject(Project.findById(projectId));
};

const removeMember = async (projectId, userId, memberId) => {
  const project = await Project.findById(projectId);
  if (!project) throw new AppError('Project not found', 404);
  assertOwner(project, userId);

  if (project.owner.toString() === memberId) {
    throw new AppError('Cannot remove the project owner', 400);
  }

  project.members = project.members.filter((m) => m.toString() !== memberId);
  await project.save();
  await User.findByIdAndUpdate(memberId, { $pull: { projects: projectId } });

  return populateProject(Project.findById(projectId));
};

const updateCover = async (projectId, userId, coverUrl) => {
  const project = await Project.findById(projectId);
  if (!project) throw new AppError('Project not found', 404);
  assertOwner(project, userId);

  project.coverImage = coverUrl;
  await project.save();
  return populateProject(Project.findById(projectId));
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
