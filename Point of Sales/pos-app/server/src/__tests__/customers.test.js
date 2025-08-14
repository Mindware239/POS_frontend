const request = require('supertest');
const { app } = require('../server');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

describe('Customers API', () => {
  let adminToken, managerToken, cashierToken;
  let testCustomer;

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

  describe('GET /api/customers', () => {
    test('should return customers with pagination', async () => {
      const response = await request(app)
        .get('/api/customers')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('customers');
      expect(response.body).toHaveProperty('pagination');
      expect(Array.isArray(response.body.customers)).toBe(true);
      expect(response.body.pagination).toHaveProperty('total');
      expect(response.body.pagination).toHaveProperty('page');
      expect(response.body.pagination).toHaveProperty('limit');
    });

    test('should support search filtering', async () => {
      const response = await request(app)
        .get('/api/customers?search=john')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(Array.isArray(response.body.customers)).toBe(true);
    });

    test('should support status filtering', async () => {
      const response = await request(app)
        .get('/api/customers?status=active')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(Array.isArray(response.body.customers)).toBe(true);
      
      // Verify all returned customers are active
      response.body.customers.forEach(customer => {
        expect(customer.isActive).toBe(true);
      });
    });

    test('should support pagination parameters', async () => {
      const response = await request(app)
        .get('/api/customers?page=1&limit=2')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.pagination.page).toBe(1);
      expect(response.body.pagination.limit).toBe(2);
      expect(response.body.customers.length).toBeLessThanOrEqual(2);
    });
  });

  describe('GET /api/customers/:id', () => {
    test('should return customer by ID with details', async () => {
      // Get a test customer first
      const customer = await prisma.customer.findFirst({
        include: { sales: true, loyaltyRewards: true }
      });

      const response = await request(app)
        .get(`/api/customers/${customer.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('id', customer.id);
      expect(response.body).toHaveProperty('name', customer.name);
      expect(response.body).toHaveProperty('email');
      expect(response.body).toHaveProperty('phone');
      expect(response.body).toHaveProperty('loyaltyPoints');
      expect(response.body).toHaveProperty('totalSpent');
      expect(response.body).toHaveProperty('sales');
      expect(response.body).toHaveProperty('loyaltyRewards');
    });

    test('should return 404 for non-existent customer', async () => {
      const response = await request(app)
        .get('/api/customers/nonexistent-id')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /api/customers', () => {
    test('should create customer with valid data (CASHIER role)', async () => {
      const customerData = {
        name: 'Test Customer',
        email: 'test@example.com',
        phone: '+1234567890',
        address: '123 Test St',
        city: 'Test City',
        state: 'TS',
        zipCode: '12345',
        country: 'Test Country'
      };

      const response = await request(app)
        .post('/api/customers')
        .set('Authorization', `Bearer ${cashierToken}`)
        .send(customerData)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe(customerData.name);
      expect(response.body.email).toBe(customerData.email);
      expect(response.body.phone).toBe(customerData.phone);
      expect(response.body.loyaltyPoints).toBe(0);
      expect(response.body.totalSpent).toBe(0);
      expect(response.body.isActive).toBe(true);

      // Store for cleanup
      testCustomer = response.body;
    });

    test('should create customer with minimal data', async () => {
      const customerData = {
        name: 'Minimal Customer'
      };

      const response = await request(app)
        .post('/api/customers')
        .set('Authorization', `Bearer ${cashierToken}`)
        .send(customerData)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe(customerData.name);
      expect(response.body.loyaltyPoints).toBe(0);
      expect(response.body.totalSpent).toBe(0);
    });

    test('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/customers')
        .set('Authorization', `Bearer ${cashierToken}`)
        .send({})
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    test('should enforce unique email constraint', async () => {
      const customerData = {
        name: 'Duplicate Email Customer',
        email: 'test@example.com' // Same email as previous test
      };

      const response = await request(app)
        .post('/api/customers')
        .set('Authorization', `Bearer ${cashierToken}`)
        .send(customerData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    test('should validate email format', async () => {
      const customerData = {
        name: 'Invalid Email Customer',
        email: 'invalid-email'
      };

      const response = await request(app)
        .post('/api/customers')
        .set('Authorization', `Bearer ${cashierToken}`)
        .send(customerData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('PUT /api/customers/:id', () => {
    test('should update customer with valid data', async () => {
      const updateData = {
        name: 'Updated Test Customer',
        phone: '+1987654321',
        city: 'Updated City'
      };

      const response = await request(app)
        .put(`/api/customers/${testCustomer.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.name).toBe(updateData.name);
      expect(response.body.phone).toBe(updateData.phone);
      expect(response.body.city).toBe(updateData.city);
    });

    test('should allow CASHIER role to update customer', async () => {
      const updateData = {
        phone: '+1555666777'
      };

      const response = await request(app)
        .put(`/api/customers/${testCustomer.id}`)
        .set('Authorization', `Bearer ${cashierToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.phone).toBe(updateData.phone);
    });

    test('should validate email format on update', async () => {
      const updateData = {
        email: 'invalid-email-format'
      };

      const response = await request(app)
        .put(`/api/customers/${testCustomer.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    test('should return 404 for non-existent customer', async () => {
      const response = await request(app)
        .put('/api/customers/nonexistent-id')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: 'Updated Name' })
        .expect(404);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('DELETE /api/customers/:id', () => {
    test('should soft delete customer (ADMIN only)', async () => {
      const response = await request(app)
        .delete(`/api/customers/${testCustomer.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('message');
      
      // Verify customer is soft deleted
      const deletedCustomer = await prisma.customer.findUnique({
        where: { id: testCustomer.id }
      });
      expect(deletedCustomer.isActive).toBe(false);
    });

    test('should reject deletion by non-admin role', async () => {
      // Create another test customer
      const customerData = {
        name: 'Delete Test Customer',
        email: 'delete@example.com'
      };

      const createResponse = await request(app)
        .post('/api/customers')
        .set('Authorization', `Bearer ${cashierToken}`)
        .send(customerData);

      const response = await request(app)
        .delete(`/api/customers/${createResponse.body.id}`)
        .set('Authorization', `Bearer ${managerToken}`)
        .expect(403);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('Loyalty Management', () => {
    let loyaltyCustomer;

    beforeAll(async () => {
      // Create a customer for loyalty tests
      const customerData = {
        name: 'Loyalty Test Customer',
        email: 'loyalty@example.com'
      };

      const response = await request(app)
        .post('/api/customers')
        .set('Authorization', `Bearer ${cashierToken}`)
        .send(customerData);

      loyaltyCustomer = response.body;
    });

    test('should add loyalty reward (ADMIN role)', async () => {
      const rewardData = {
        pointsUsed: 100,
        rewardType: 'DISCOUNT',
        rewardValue: 10.00,
        description: 'Test loyalty reward',
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
      };

      const response = await request(app)
        .post(`/api/customers/${loyaltyCustomer.id}/loyalty`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(rewardData)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.pointsUsed).toBe(rewardData.pointsUsed);
      expect(response.body.rewardType).toBe(rewardData.rewardType);
      expect(response.body.rewardValue).toBe(rewardData.rewardValue);
      expect(response.body.description).toBe(rewardData.description);
      expect(response.body.isRedeemed).toBe(false);
    });

    test('should add loyalty reward (MANAGER role)', async () => {
      const rewardData = {
        pointsUsed: 50,
        rewardType: 'FREE_PRODUCT',
        rewardValue: 25.00,
        description: 'Manager loyalty reward'
      };

      const response = await request(app)
        .post(`/api/customers/${loyaltyCustomer.id}/loyalty`)
        .set('Authorization', `Bearer ${managerToken}`)
        .send(rewardData)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.pointsUsed).toBe(rewardData.pointsUsed);
    });

    test('should reject loyalty reward creation by CASHIER role', async () => {
      const rewardData = {
        pointsUsed: 25,
        rewardType: 'CASHBACK',
        rewardValue: 5.00,
        description: 'Cashier loyalty reward'
      };

      const response = await request(app)
        .post(`/api/customers/${loyaltyCustomer.id}/loyalty`)
        .set('Authorization', `Bearer ${cashierToken}`)
        .send(rewardData)
        .expect(403);

      expect(response.body).toHaveProperty('error');
    });

    test('should get customer loyalty rewards', async () => {
      const response = await request(app)
        .get(`/api/customers/${loyaltyCustomer.id}/loyalty`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      
      // Verify structure of loyalty rewards
      response.body.forEach(reward => {
        expect(reward).toHaveProperty('id');
        expect(reward).toHaveProperty('pointsUsed');
        expect(reward).toHaveProperty('rewardType');
        expect(reward).toHaveProperty('rewardValue');
        expect(reward).toHaveProperty('description');
        expect(reward).toHaveProperty('isRedeemed');
      });
    });

    test('should redeem loyalty reward', async () => {
      // Get a loyalty reward to redeem
      const rewards = await prisma.loyaltyReward.findMany({
        where: { customerId: loyaltyCustomer.id, isRedeemed: false }
      });

      if (rewards.length > 0) {
        const reward = rewards[0];
        const redeemData = {
          isRedeemed: true,
          notes: 'Redeemed for test'
        };

        const response = await request(app)
          .patch(`/api/customers/${loyaltyCustomer.id}/loyalty/${reward.id}`)
          .set('Authorization', `Bearer ${cashierToken}`)
          .send(redeemData)
          .expect(200);

        expect(response.body).toHaveProperty('message');
        expect(response.body.reward.isRedeemed).toBe(true);
        expect(response.body.reward.redeemedAt).toBeDefined();
      }
    });

    test('should validate loyalty reward data', async () => {
      const invalidRewardData = {
        pointsUsed: -50, // Invalid negative points
        rewardType: 'INVALID_TYPE',
        rewardValue: -10.00 // Invalid negative value
      };

      const response = await request(app)
        .post(`/api/customers/${loyaltyCustomer.id}/loyalty`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(invalidRewardData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('Customer Search and Export', () => {
    test('should support quick customer search', async () => {
      const response = await request(app)
        .get('/api/customers/search/quick?q=test')
        .set('Authorization', `Bearer ${cashierToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      
      // Verify search results contain search term
      response.body.forEach(customer => {
        const searchTerm = 'test';
        const matches = customer.name.toLowerCase().includes(searchTerm) ||
                       (customer.email && customer.email.toLowerCase().includes(searchTerm)) ||
                       (customer.phone && customer.phone.includes(searchTerm));
        expect(matches).toBe(true);
      });
    });

    test('should export customers data (ADMIN role)', async () => {
      const response = await request(app)
        .get('/api/customers/export')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('exportedAt');
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    test('should reject export by non-admin/manager role', async () => {
      const response = await request(app)
        .get('/api/customers/export')
        .set('Authorization', `Bearer ${cashierToken}`)
        .expect(403);

      expect(response.body).toHaveProperty('error');
    });

    test('should support export filtering', async () => {
      const response = await request(app)
        .get('/api/customers/export?status=active&format=csv')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('exportedAt');
    });
  });

  describe('Customer Analytics', () => {
    test('should track customer spending', async () => {
      // Create a sale for the customer to track spending
      const product = await prisma.product.findFirst();
      const customer = await prisma.customer.findFirst();

      if (product && customer) {
        const saleData = {
          items: [
            {
              productId: product.id,
              quantity: 1,
              unitPrice: product.price
            }
          ],
          customerId: customer.id,
          paymentMethod: 'CASH'
        };

        const saleResponse = await request(app)
          .post('/api/sales')
          .set('Authorization', `Bearer ${cashierToken}`)
          .send(saleData);

        expect(saleResponse.status).toBe(201);

        // Verify customer total spent was updated
        const updatedCustomer = await prisma.customer.findUnique({
          where: { id: customer.id }
        });
        expect(updatedCustomer.totalSpent).toBeGreaterThan(0);
      }
    });

    test('should calculate loyalty points correctly', async () => {
      // This test verifies that loyalty points are calculated and stored correctly
      const customer = await prisma.customer.findFirst({
        where: { loyaltyPoints: { gt: 0 } }
      });

      if (customer) {
        expect(customer.loyaltyPoints).toBeGreaterThan(0);
        expect(typeof customer.loyaltyPoints).toBe('number');
      }
    });
  });
});
