const request = require('supertest');
const { app } = require('../server');

describe('Server Health Check', () => {
  test('GET /health should return 200', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status', 'OK');
    expect(response.body).toHaveProperty('timestamp');
    expect(response.body).toHaveProperty('uptime');
  });
});

describe('Authentication Endpoints', () => {
  test('POST /api/auth/login should require username and password', async () => {
    const response = await request(app).post('/api/auth/login');
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
    expect(response.body).toHaveProperty('code', 'MISSING_CREDENTIALS');
  });

  test('GET /api/auth/profile should require authentication', async () => {
    const response = await request(app).get('/api/auth/profile');
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('error');
    expect(response.body).toHaveProperty('code', 'TOKEN_MISSING');
  });
});

describe('Protected Routes', () => {
  test('GET /api/products should require authentication', async () => {
    const response = await request(app).get('/api/products');
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('error');
    expect(response.body).toHaveProperty('code', 'TOKEN_MISSING');
  });

  test('GET /api/sales should require authentication', async () => {
    const response = await request(app).get('/api/sales');
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('error');
    expect(response.body).toHaveProperty('code', 'TOKEN_MISSING');
  });
});

describe('404 Handler', () => {
  test('GET /nonexistent should return 404', async () => {
    const response = await request(app).get('/nonexistent');
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error', 'Route not found');
    expect(response.body).toHaveProperty('path', '/nonexistent');
  });
});
