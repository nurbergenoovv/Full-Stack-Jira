process.env.JWT_SECRET = 'test_secret_for_utils';
const { generateToken, verifyToken } = require('../utils/jwt.utils');
const mongoose = require('mongoose');

describe('JWT Utils', () => {
  const userId = new mongoose.Types.ObjectId().toString();

  it('should generate a valid JWT token', () => {
    const token = generateToken(userId);
    expect(typeof token).toBe('string');
    expect(token.split('.')).toHaveLength(3);
  });

  it('should verify a valid token and return the userId', () => {
    const token = generateToken(userId);
    const decoded = verifyToken(token);
    expect(decoded.id).toBe(userId);
  });

  it('should throw on invalid token', () => {
    expect(() => verifyToken('invalid.token.here')).toThrow();
  });

  it('should throw on tampered token', () => {
    const token = generateToken(userId);
    const tampered = token.slice(0, -5) + 'XXXXX';
    expect(() => verifyToken(tampered)).toThrow();
  });
});
