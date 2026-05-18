const express = require('express');
const router = express.Router();
const controller = require('./project.controller');
const { protect } = require('../../middleware/auth.middleware');
const validate = require('../../middleware/validate.middleware');
const {
  createProjectSchema,
  updateProjectSchema,
  inviteMemberSchema,
} = require('./project.validation');

router.get('/', protect, controller.getProjects);
router.post('/', protect, validate(createProjectSchema), controller.createProject);
router.get('/:id', protect, controller.getProject);
router.put('/:id', protect, validate(updateProjectSchema), controller.updateProject);
router.delete('/:id', protect, controller.deleteProject);
router.post('/:id/members', protect, validate(inviteMemberSchema), controller.inviteMember);
router.delete('/:id/members/:userId', protect, controller.removeMember);
router.post('/:id/cover', protect, controller.updateCover);

module.exports = router;
