process.env.JWT_SECRET = 'test_secret_controller';

jest.mock('../modules/auth/auth.service');
const authService = require('../modules/auth/auth.service');
const { register, login, getMe, logout } = require('../modules/auth/auth.controller');

describe('Auth Controller (unit — mocked service)', () => {
  let req, res, next;

  beforeEach(() => {
    jest.clearAllMocks();
    req = { body: {}, user: null };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  describe('register', () => {
    it('should respond 201 with data when service resolves', async () => {
      const mockData = { token: 'jwt-token', user: { email: 'a@b.com' } };
      authService.register.mockResolvedValue(mockData);
      req.body = { fullName: 'Test', email: 'a@b.com', password: '123456' };

      await register(req, res, next);

      expect(authService.register).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ success: true, data: mockData });
      expect(next).not.toHaveBeenCalled();
    });

    it('should forward error to next() when service throws', async () => {
      const error = new Error('Email already in use');
      authService.register.mockRejectedValue(error);

      await register(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
      expect(res.json).not.toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('should respond 200 with data when credentials are valid', async () => {
      const mockData = { token: 'jwt-token', user: { email: 'a@b.com' } };
      authService.login.mockResolvedValue(mockData);
      req.body = { email: 'a@b.com', password: '123456' };

      await login(req, res, next);

      expect(authService.login).toHaveBeenCalledWith(req.body);
      expect(res.json).toHaveBeenCalledWith({ success: true, data: mockData });
      expect(next).not.toHaveBeenCalled();
    });

    it('should forward error to next() when credentials are invalid', async () => {
      const error = new Error('Invalid credentials');
      authService.login.mockRejectedValue(error);
      req.body = { email: 'a@b.com', password: 'wrong' };

      await login(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
      expect(res.json).not.toHaveBeenCalled();
    });
  });

  describe('getMe', () => {
    it('should return current user when service resolves', async () => {
      const mockUser = { _id: 'user123', email: 'a@b.com' };
      authService.getMe.mockResolvedValue(mockUser);
      req.user = { _id: 'user123' };

      await getMe(req, res, next);

      expect(authService.getMe).toHaveBeenCalledWith('user123');
      expect(res.json).toHaveBeenCalledWith({ success: true, data: mockUser });
      expect(next).not.toHaveBeenCalled();
    });

    it('should call next() when user is not found', async () => {
      const error = new Error('User not found');
      authService.getMe.mockRejectedValue(error);
      req.user = { _id: 'nonexistent' };

      await getMe(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('logout', () => {
    it('should return success message immediately (no async)', () => {
      logout(req, res);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: { message: 'Logged out successfully' },
      });
      expect(next).not.toHaveBeenCalled();
    });
  });
});
