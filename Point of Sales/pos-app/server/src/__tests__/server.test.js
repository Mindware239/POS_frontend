const request = require('supertest');
const { app } = require('../server');

describe('Server Health Check', () => {
  test('GET /health should return 200 and server status', async () => {
    const response = await request(app)
      .get('/health')
      .expect(200);

    expect(response.body).toHaveProperty('status', 'OK');
    expect(response.body).toHaveProperty('timestamp');
    expect(response.body).toHaveProperty('uptime');
  });
});

describe('Authentication Endpoints', () => {
  test('POST /api/auth/login should authenticate valid user', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'admin',
        password: 'admin123'
      })
      .expect(200);

    expect(response.body).toHaveProperty('token');
    expect(response.body).toHaveProperty('user');
    expect(response.body.user).toHaveProperty('username', 'admin');
    expect(response.body.user).toHaveProperty('role', 'ADMIN');
  });

  test('POST /api/auth/login should reject invalid credentials', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'admin',
        password: 'wrongpassword'
      })
      .expect(401);

    expect(response.body).toHaveProperty('error');
  });

  test('GET /api/auth/profile should require authentication', async () => {
    const response = await request(app)
      .get('/api/auth/profile')
      .expect(401);

    expect(response.body).toHaveProperty('error');
  });
});

describe('Protected Routes', () => {
  let authToken;

  beforeAll(async () => {
    // Get auth token for testing
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'admin',
        password: 'admin123'
      });
    authToken = response.body.token;
  });

  test('GET /api/products should require authentication', async () => {
    const response = await request(app)
      .get('/api/products')
      .expect(401);

    expect(response.body).toHaveProperty('error');
  });

  test('GET /api/products should work with valid token', async () => {
    const response = await request(app)
      .get('/api/products')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    expect(Array.isArray(response.body.products)).toBe(true);
    expect(response.body).toHaveProperty('pagination');
  });

  test('GET /api/inventory should require authentication', async () => {
    const response = await request(app)
      .get('/api/inventory')
      .expect(401);

    expect(response.body).toHaveProperty('error');
  });

  test('GET /api/inventory should work with valid token', async () => {
    const response = await request(app)
      .get('/api/inventory')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    expect(response.body).toHaveProperty('overview');
    expect(response.body).toHaveProperty('lowStockCount');
  });
});

describe('404 Handler', () => {
  test('should return 404 for non-existent routes', async () => {
    const response = await request(app)
      .get('/api/nonexistent')
      .expect(404);

    expect(response.body).toHaveProperty('error', 'Route not found');
    expect(response.body).toHaveProperty('path');
  });
});
