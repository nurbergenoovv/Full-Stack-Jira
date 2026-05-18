require('./setup');
process.env.JWT_SECRET = 'test_secret_tasks';
process.env.CLIENT_URL = 'http://localhost:3000';

const request = require('supertest');
const app = require('../app');

describe('Tasks API', () => {
  let token;
  let projectId;

  beforeEach(async () => {
    const regRes = await request(app)
      .post('/api/auth/register')
      .send({ fullName: 'Task User', email: 'tasks@test.com', password: 'password123' });
    token = regRes.body.data.token;

    const projRes = await request(app)
      .post('/api/projects')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Task Project' });
    projectId = projRes.body.data._id;
  });

  it('should create a task in a project', async () => {
    const res = await request(app)
      .post(`/api/tasks/project/${projectId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'My Task', description: 'Task description', priority: 'High' });
    expect(res.status).toBe(201);
    expect(res.body.data.title).toBe('My Task');
    expect(res.body.data.priority).toBe('High');
  });

  it('should get tasks for a project', async () => {
    await request(app)
      .post(`/api/tasks/project/${projectId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Task A' });
    await request(app)
      .post(`/api/tasks/project/${projectId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Task B' });

    const res = await request(app)
      .get(`/api/tasks/project/${projectId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(2);
  });

  it('should search tasks by title', async () => {
    await request(app)
      .post(`/api/tasks/project/${projectId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Fix login bug' });
    await request(app)
      .post(`/api/tasks/project/${projectId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Add dashboard feature' });

    const res = await request(app)
      .get(`/api/tasks/project/${projectId}?search=login`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0].title).toBe('Fix login bug');
  });

  it('should move a task to a new status', async () => {
    const createRes = await request(app)
      .post(`/api/tasks/project/${projectId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Move Me' });
    const taskId = createRes.body.data._id;

    const res = await request(app)
      .patch(`/api/tasks/${taskId}/status`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'In Progress' });
    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe('In Progress');
  });

  it('should delete a task', async () => {
    const createRes = await request(app)
      .post(`/api/tasks/project/${projectId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Delete Me' });
    const taskId = createRes.body.data._id;

    const res = await request(app)
      .delete(`/api/tasks/${taskId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
  });
});
