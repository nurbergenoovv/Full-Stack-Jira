require('./setup');
process.env.JWT_SECRET = 'test_secret_auth';
process.env.CLIENT_URL = 'http://localhost:3000';

const request = require('supertest');
const app = require('../app');

describe('Auth API', () => {
  const userData = {
    fullName: 'Test User',
    email: 'test@example.com',
    password: 'password123',
  };

  describe('POST /api/auth/register', () => {
    it('should register a new user and return token', async () => {
      const res = await request(app).post('/api/auth/register').send(userData);
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.token).toBeDefined();
      expect(res.body.data.user.email).toBe(userData.email);
      expect(res.body.data.user.password).toBeUndefined();
    });

    it('should fail with duplicate email', async () => {
      await request(app).post('/api/auth/register').send(userData);
      const res = await request(app).post('/api/auth/register').send(userData);
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should fail with invalid email', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ ...userData, email: 'not-an-email' });
      expect(res.status).toBe(400);
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      await request(app).post('/api/auth/register').send(userData);
    });

    it('should login with correct credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: userData.email, password: userData.password });
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.token).toBeDefined();
    });

    it('should fail with wrong password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: userData.email, password: 'wrongpassword' });
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should fail with non-existent email', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'nobody@nowhere.com', password: 'password123' });
      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/auth/me', () => {
    let token;
    beforeEach(async () => {
      const res = await request(app).post('/api/auth/register').send(userData);
      token = res.body.data.token;
    });

    it('should return current user with valid token', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body.data.email).toBe(userData.email);
    });

    it('should fail without token', async () => {
      const res = await request(app).get('/api/auth/me');
      expect(res.status).toBe(401);
    });

    it('should fail with invalid token', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid.token.here');
      expect(res.status).toBe(401);
    });
  });
});
