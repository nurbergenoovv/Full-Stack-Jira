require('./setup');
const User = require('../modules/users/user.model');
const Task = require('../modules/tasks/task.model');
const Comment = require('../modules/comments/comment.model');
const mongoose = require('mongoose');

describe('Mongoose Model Validation', () => {
  describe('User Model', () => {
    it('should require email', async () => {
      const user = new User({ fullName: 'Test', password: 'password123' });
      await expect(user.validate()).rejects.toThrow();
    });

    it('should require password', async () => {
      const user = new User({ fullName: 'Test', email: 'test@test.com' });
      await expect(user.validate()).rejects.toThrow();
    });

    it('should hash password before save', async () => {
      const user = await User.create({
        fullName: 'Test User',
        email: 'hash@test.com',
        password: 'plainpassword',
      });
      expect(user.password).not.toBe('plainpassword');
      expect(user.password).toMatch(/^\$2[ab]\$/);
    });

    it('should have default role of user', async () => {
      const user = await User.create({
        fullName: 'Test User',
        email: 'role@test.com',
        password: 'password123',
      });
      expect(user.role).toBe('user');
    });
  });

  describe('Task Model', () => {
    it('should require title', async () => {
      const task = new Task({
        project: new mongoose.Types.ObjectId(),
        createdBy: new mongoose.Types.ObjectId(),
      });
      await expect(task.validate()).rejects.toThrow();
    });

    it('should require project', async () => {
      const task = new Task({
        title: 'Test Task',
        createdBy: new mongoose.Types.ObjectId(),
      });
      await expect(task.validate()).rejects.toThrow();
    });

    it('should have default status of Backlog', async () => {
      const task = new Task({
        title: 'Test',
        project: new mongoose.Types.ObjectId(),
        createdBy: new mongoose.Types.ObjectId(),
      });
      expect(task.status).toBe('Backlog');
    });

    it('should have default priority of Medium', async () => {
      const task = new Task({
        title: 'Test',
        project: new mongoose.Types.ObjectId(),
        createdBy: new mongoose.Types.ObjectId(),
      });
      expect(task.priority).toBe('Medium');
    });
  });

  describe('Comment Model', () => {
    it('should require message', async () => {
      const comment = new Comment({
        author: new mongoose.Types.ObjectId(),
        task: new mongoose.Types.ObjectId(),
      });
      await expect(comment.validate()).rejects.toThrow();
    });

    it('should require author', async () => {
      const comment = new Comment({
        message: 'Hello',
        task: new mongoose.Types.ObjectId(),
      });
      await expect(comment.validate()).rejects.toThrow();
    });

    it('should have default edited of false', () => {
      const comment = new Comment({
        message: 'Test',
        author: new mongoose.Types.ObjectId(),
        task: new mongoose.Types.ObjectId(),
      });
      expect(comment.edited).toBe(false);
    });
  });
});
