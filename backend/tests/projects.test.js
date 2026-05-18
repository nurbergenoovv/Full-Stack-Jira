require('./setup');
process.env.JWT_SECRET = 'test_secret_projects';
process.env.CLIENT_URL = 'http://localhost:3000';

const request = require('supertest');
const app = require('../app');

describe('Projects API', () => {
  let token;
  let token2;

  const user1 = { fullName: 'Owner', email: 'owner@test.com', password: 'password123' };
  const user2 = { fullName: 'Other', email: 'other@test.com', password: 'password123' };

  beforeEach(async () => {
    const r1 = await request(app).post('/api/auth/register').send(user1);
    token = r1.body.data.token;
    const r2 = await request(app).post('/api/auth/register').send(user2);
    token2 = r2.body.data.token;
  });

  it('should create a project', async () => {
    const res = await request(app)
      .post('/api/projects')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'My Project', description: 'A test project' });
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.title).toBe('My Project');
  });

  it('should list projects for authenticated user', async () => {
    await request(app)
      .post('/api/projects')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Proj 1' });
    await request(app)
      .post('/api/projects')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Proj 2' });

    const res = await request(app)
      .get('/api/projects')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(2);
  });

  it('should deny access to non-member', async () => {
    const createRes = await request(app)
      .post('/api/projects')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Secret Project' });
    const projectId = createRes.body.data._id;

    const res = await request(app)
      .get(`/api/projects/${projectId}`)
      .set('Authorization', `Bearer ${token2}`);
    expect(res.status).toBe(403);
  });

  it('should allow owner to delete project', async () => {
    const createRes = await request(app)
      .post('/api/projects')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Delete Me' });
    const projectId = createRes.body.data._id;

    const res = await request(app)
      .delete(`/api/projects/${projectId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
  });

  it('should deny non-owner from deleting project', async () => {
    const createRes = await request(app)
      .post('/api/projects')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Protected Project' });
    const projectId = createRes.body.data._id;

    const res = await request(app)
      .delete(`/api/projects/${projectId}`)
      .set('Authorization', `Bearer ${token2}`);
    expect(res.status).toBe(403);
  });
});
