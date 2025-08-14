const request = require('supertest');
const { app } = require('../server');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

describe('Users API', () => {
  let adminToken, managerToken, cashierToken;
  let testUser;

  beforeAll(async () => {
    // Get auth tokens for different roles
    const adminResponse = await request(app)
      .post('/api/auth/login')
      .send({ username: 'admin', password: 'admin123' });
    adminToken = adminResponse.body.token;

    const managerResponse = await request(app)
      .post('/api/auth/login')
      .send({ username: 'manager', password: 'manager123' });
    managerToken = managerResponse.body.token;

    const cashierResponse = await request(app)
      .post('/api/auth/login')
      .send({ username: 'cashier', password: 'cashier123' });
    cashierToken = cashierResponse.body.token;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('GET /api/users', () => {
    test('should return all users (ADMIN only)', async () => {
      const response = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      
      // Verify user structure
      response.body.forEach(user => {
        expect(user).toHaveProperty('id');
        expect(user).toHaveProperty('username');
        expect(user).toHaveProperty('email');
        expect(user).toHaveProperty('firstName');
        expect(user).toHaveProperty('lastName');
        expect(user).toHaveProperty('role');
        expect(user).toHaveProperty('isActive');
        expect(user).toHaveProperty('createdAt');
        expect(user).toHaveProperty('updatedAt');
        // Password hash should not be exposed
        expect(user).not.toHaveProperty('passwordHash');
      });
    });

    test('should reject access by non-admin roles', async () => {
      const response = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${managerToken}`)
        .expect(403);

      expect(response.body).toHaveProperty('error');
    });

    test('should require authentication', async () => {
      const response = await request(app)
        .get('/api/users')
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /api/users/:id', () => {
    test('should return user by ID (ADMIN can view all)', async () => {
      // Get a test user
      const user = await prisma.user.findFirst();

      const response = await request(app)
        .get(`/api/users/${user.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('id', user.id);
      expect(response.body).toHaveProperty('username', user.username);
      expect(response.body).toHaveProperty('email', user.email);
      expect(response.body).toHaveProperty('firstName', user.firstName);
      expect(response.body).toHaveProperty('lastName', user.lastName);
      expect(response.body).toHaveProperty('role', user.role);
      expect(response.body).not.toHaveProperty('passwordHash');
    });

    test('should allow user to view own profile', async () => {
      // Get current user profile
      const profileResponse = await request(app)
        .get('/api/users/profile/me')
        .set('Authorization', `Bearer ${cashierToken}`)
        .expect(200);

      const userId = profileResponse.body.id;

      const response = await request(app)
        .get(`/api/users/${userId}`)
        .set('Authorization', `Bearer ${cashierToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('id', userId);
      expect(response.body).toHaveProperty('username', profileResponse.body.username);
    });

    test('should reject user viewing other profiles', async () => {
      // Get a different user
      const otherUser = await prisma.user.findFirst({
        where: { username: { not: 'cashier' } }
      });

      const response = await request(app)
        .get(`/api/users/${otherUser.id}`)
        .set('Authorization', `Bearer ${cashierToken}`)
        .expect(403);

      expect(response.body).toHaveProperty('error');
    });

    test('should return 404 for non-existent user', async () => {
      const response = await request(app)
        .get('/api/users/nonexistent-id')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /api/users', () => {
    test('should create user with valid data (ADMIN only)', async () => {
      const userData = {
        username: 'testuser',
        email: 'testuser@example.com',
        password: 'testpass123',
        firstName: 'Test',
        lastName: 'User',
        role: 'CASHIER'
      };

      const response = await request(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(userData)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.username).toBe(userData.username);
      expect(response.body.email).toBe(userData.email);
      expect(response.body.firstName).toBe(userData.firstName);
      expect(response.body.lastName).toBe(userData.lastName);
      expect(response.body.role).toBe(userData.role);
      expect(response.body.isActive).toBe(true);
      expect(response.body).not.toHaveProperty('passwordHash');

      // Store for cleanup
      testUser = response.body;
    });

    test('should hash password correctly', async () => {
      // Verify password was hashed by checking the database directly
      const createdUser = await prisma.user.findUnique({
        where: { id: testUser.id }
      });

      expect(createdUser.passwordHash).not.toBe('testpass123');
      expect(createdUser.passwordHash).toMatch(/^\$2[aby]\$\d{1,2}\$[./A-Za-z0-9]{53}$/); // bcrypt hash pattern
    });

    test('should reject user creation by non-admin roles', async () => {
      const userData = {
        username: 'unauthorizeduser',
        email: 'unauthorized@example.com',
        password: 'testpass123',
        firstName: 'Unauthorized',
        lastName: 'User',
        role: 'CASHIER'
      };

      const response = await request(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${managerToken}`)
        .send(userData)
        .expect(403);

      expect(response.body).toHaveProperty('error');
    });

    test('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ username: 'incomplete' })
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    test('should enforce unique username constraint', async () => {
      const userData = {
        username: 'testuser', // Same username as previous test
        email: 'different@example.com',
        password: 'testpass123',
        firstName: 'Different',
        lastName: 'User',
        role: 'CASHIER'
      };

      const response = await request(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(userData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    test('should enforce unique email constraint', async () => {
      const userData = {
        username: 'differentuser',
        email: 'testuser@example.com', // Same email as previous test
        password: 'testpass123',
        firstName: 'Different',
        lastName: 'User',
        role: 'CASHIER'
      };

      const response = await request(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(userData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    test('should validate email format', async () => {
      const userData = {
        username: 'invalidemail',
        email: 'invalid-email-format',
        password: 'testpass123',
        firstName: 'Invalid',
        lastName: 'Email',
        role: 'CASHIER'
      };

      const response = await request(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(userData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    test('should validate password strength', async () => {
      const userData = {
        username: 'weakpassword',
        email: 'weak@example.com',
        password: '123', // Too short
        firstName: 'Weak',
        lastName: 'Password',
        role: 'CASHIER'
      };

      const response = await request(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(userData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('PUT /api/users/:id', () => {
    test('should update user with valid data (ADMIN can update all)', async () => {
      const updateData = {
        firstName: 'Updated',
        lastName: 'Name',
        email: 'updated@example.com'
      };

      const response = await request(app)
        .put(`/api/users/${testUser.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.firstName).toBe(updateData.firstName);
      expect(response.body.lastName).toBe(updateData.lastName);
      expect(response.body.email).toBe(updateData.email);
    });

    test('should allow user to update own profile', async () => {
      const updateData = {
        firstName: 'Self',
        lastName: 'Updated'
      };

      const response = await request(app)
        .put(`/api/users/${testUser.id}`)
        .set('Authorization', `Bearer ${cashierToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.firstName).toBe(updateData.firstName);
      expect(response.body.lastName).toBe(updateData.lastName);
    });

    test('should reject user updating other profiles', async () => {
      // Get a different user
      const otherUser = await prisma.user.findFirst({
        where: { username: { not: 'testuser' } }
      });

      const updateData = {
        firstName: 'Unauthorized',
        lastName: 'Update'
      };

      const response = await request(app)
        .put(`/api/users/${otherUser.id}`)
        .set('Authorization', `Bearer ${cashierToken}`)
        .send(updateData)
        .expect(403);

      expect(response.body).toHaveProperty('error');
    });

    test('should validate email format on update', async () => {
      const updateData = {
        email: 'invalid-email-format'
      };

      const response = await request(app)
        .put(`/api/users/${testUser.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    test('should return 404 for non-existent user', async () => {
      const response = await request(app)
        .put('/api/users/nonexistent-id')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ firstName: 'Updated' })
        .expect(404);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('DELETE /api/users/:id', () => {
    test('should soft delete user (ADMIN only)', async () => {
      const response = await request(app)
        .delete(`/api/users/${testUser.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('message');
      
      // Verify user is soft deleted
      const deletedUser = await prisma.user.findUnique({
        where: { id: testUser.id }
      });
      expect(deletedUser.isActive).toBe(false);
    });

    test('should reject deletion by non-admin role', async () => {
      // Create another test user
      const userData = {
        username: 'deletetest',
        email: 'deletetest@example.com',
        password: 'testpass123',
        firstName: 'Delete',
        lastName: 'Test',
        role: 'CASHIER'
      };

      const createResponse = await request(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(userData);

      const response = await request(app)
        .delete(`/api/users/${createResponse.body.id}`)
        .set('Authorization', `Bearer ${managerToken}`)
        .expect(403);

      expect(response.body).toHaveProperty('error');
    });

    test('should not allow self-deletion', async () => {
      // Admin trying to delete themselves
      const adminUser = await prisma.user.findFirst({
        where: { username: 'admin' }
      });

      const response = await request(app)
        .delete(`/api/users/${adminUser.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('PATCH /api/users/:id/password', () => {
    test('should allow user to change own password', async () => {
      const passwordData = {
        currentPassword: 'testpass123',
        newPassword: 'newpass123'
      };

      const response = await request(app)
        .patch(`/api/users/${testUser.id}`)
        .set('Authorization', `Bearer ${cashierToken}`)
        .send(passwordData)
        .expect(200);

      expect(response.body).toHaveProperty('message');
    });

    test('should reject password change with wrong current password', async () => {
      const passwordData = {
        currentPassword: 'wrongpassword',
        newPassword: 'newpass456'
      };

      const response = await request(app)
        .patch(`/api/users/${testUser.id}`)
        .set('Authorization', `Bearer ${cashierToken}`)
        .send(passwordData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    test('should reject user changing other user password', async () => {
      // Get a different user
      const otherUser = await prisma.user.findFirst({
        where: { username: { not: 'testuser' } }
      });

      const passwordData = {
        currentPassword: 'admin123',
        newPassword: 'newpass789'
      };

      const response = await request(app)
        .patch(`/api/users/${otherUser.id}`)
        .set('Authorization', `Bearer ${cashierToken}`)
        .send(passwordData)
        .expect(403);

      expect(response.body).toHaveProperty('error');
    });

    test('should validate new password strength', async () => {
      const passwordData = {
        currentPassword: 'testpass123',
        newPassword: '123' // Too short
      };

      const response = await request(app)
        .patch(`/api/users/${testUser.id}`)
        .set('Authorization', `Bearer ${cashierToken}`)
        .send(passwordData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('PATCH /api/users/:id/status', () => {
    test('should toggle user status (ADMIN only)', async () => {
      // First, reactivate the user
      await prisma.user.update({
        where: { id: testUser.id },
        data: { isActive: true }
      });

      const response = await request(app)
        .patch(`/api/users/${testUser.id}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('message');
      expect(response.body.user.isActive).toBe(false);
    });

    test('should reject status toggle by non-admin role', async () => {
      const response = await request(app)
        .patch(`/api/users/${testUser.id}/status`)
        .set('Authorization', `Bearer ${managerToken}`)
        .expect(403);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('Profile Management', () => {
    test('should get current user profile', async () => {
      const response = await request(app)
        .get('/api/users/profile/me')
        .set('Authorization', `Bearer ${cashierToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('username');
      expect(response.body).toHaveProperty('email');
      expect(response.body).toHaveProperty('firstName');
      expect(response.body).toHaveProperty('lastName');
      expect(response.body).toHaveProperty('role');
      expect(response.body).not.toHaveProperty('passwordHash');
    });

    test('should update current user profile', async () => {
      const profileData = {
        firstName: 'Profile',
        lastName: 'Updated',
        phone: '+1234567890'
      };

      const response = await request(app)
        .put('/api/users/profile/me')
        .set('Authorization', `Bearer ${cashierToken}`)
        .send(profileData)
        .expect(200);

      expect(response.body.firstName).toBe(profileData.firstName);
      expect(response.body.lastName).toBe(profileData.lastName);
    });

    test('should require authentication for profile access', async () => {
      const response = await request(app)
        .get('/api/users/profile/me')
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('User Activity', () => {
    test('should get user activity (ADMIN only)', async () => {
      const response = await request(app)
        .get('/api/users/activity')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      
      // Verify activity structure
      if (response.body.length > 0) {
        response.body.forEach(activity => {
          expect(activity).toHaveProperty('id');
          expect(activity).toHaveProperty('userId');
          expect(activity).toHaveProperty('action');
          expect(activity).toHaveProperty('timestamp');
        });
      }
    });

    test('should reject activity access by non-admin role', async () => {
      const response = await request(app)
        .get('/api/users/activity')
        .set('Authorization', `Bearer ${managerToken}`)
        .expect(403);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('Role-Based Access Control', () => {
    test('should enforce role restrictions correctly', async () => {
      // Test that different roles have appropriate access levels
      const testCases = [
        { role: 'ADMIN', canCreateUsers: true, canDeleteUsers: true, canViewAllUsers: true },
        { role: 'MANAGER', canCreateUsers: false, canDeleteUsers: false, canViewAllUsers: false },
        { role: 'CASHIER', canCreateUsers: false, canDeleteUsers: false, canViewAllUsers: false }
      ];

      for (const testCase of testCases) {
        let token;
        switch (testCase.role) {
          case 'ADMIN':
            token = adminToken;
            break;
          case 'MANAGER':
            token = managerToken;
            break;
          case 'CASHIER':
            token = cashierToken;
            break;
        }

        // Test user creation
        if (testCase.canCreateUsers) {
          const userData = {
            username: `test${Date.now()}`,
            email: `test${Date.now()}@example.com`,
            password: 'testpass123',
            firstName: 'Test',
            lastName: 'User',
            role: 'CASHIER'
          };

          const response = await request(app)
            .post('/api/users')
            .set('Authorization', `Bearer ${token}`)
            .send(userData);

          expect(response.status).toBe(201);
        } else {
          const userData = {
            username: `test${Date.now()}`,
            email: `test${Date.now()}@example.com`,
            password: 'testpass123',
            firstName: 'Test',
            lastName: 'User',
            role: 'CASHIER'
          };

          const response = await request(app)
            .post('/api/users')
            .set('Authorization', `Bearer ${token}`)
            .send(userData);

          expect(response.status).toBe(403);
        }
      }
    });
  });
});
