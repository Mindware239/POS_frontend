const request = require('supertest');
const { app } = require('../server');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

describe('Inventory API', () => {
  let adminToken, managerToken, cashierToken;
  let testProduct, testVariant;

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

    // Get test product and variant
    testProduct = await prisma.product.findFirst({
      include: { variants: true }
    });
    testVariant = testProduct.variants[0];
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('GET /api/inventory', () => {
    test('should return inventory overview', async () => {
      const response = await request(app)
        .get('/api/inventory')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('overview');
      expect(response.body).toHaveProperty('lowStockCount');
      expect(response.body).toHaveProperty('totalProducts');
      expect(response.body).toHaveProperty('totalValue');
    });

    test('should support category filtering', async () => {
      const response = await request(app)
        .get(`/api/inventory?categoryId=${testProduct.categoryId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.overview.length).toBeGreaterThan(0);
    });

    test('should support search filtering', async () => {
      const response = await request(app)
        .get(`/api/inventory?search=${testProduct.name}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.overview.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/inventory/low-stock', () => {
    test('should return low stock products', async () => {
      const response = await request(app)
        .get('/api/inventory/low-stock')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      
      // Verify all returned products are actually low stock
      response.body.forEach(product => {
        expect(product.stockQuantity).toBeLessThanOrEqual(product.minStockLevel);
      });
    });

    test('should support threshold parameter', async () => {
      const threshold = 50;
      const response = await request(app)
        .get(`/api/inventory/low-stock?threshold=${threshold}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      response.body.forEach(product => {
        expect(product.stockQuantity).toBeLessThanOrEqual(threshold);
      });
    });
  });

  describe('GET /api/inventory/product/:id', () => {
    test('should return detailed inventory for a product', async () => {
      const response = await request(app)
        .get(`/api/inventory/product/${testProduct.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('product');
      expect(response.body).toHaveProperty('variants');
      expect(response.body).toHaveProperty('adjustments');
      expect(response.body.product.id).toBe(testProduct.id);
    });

    test('should return 404 for non-existent product', async () => {
      const response = await request(app)
        .get('/api/inventory/product/nonexistent-id')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('PATCH /api/inventory/adjust', () => {
    test('should adjust product inventory (ADMIN role)', async () => {
      const adjustmentData = {
        productId: testProduct.id,
        quantityChange: 10,
        reason: 'PURCHASE',
        notes: 'Test inventory adjustment'
      };

      const response = await request(app)
        .patch('/api/inventory/adjust')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(adjustmentData)
        .expect(200);

      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('adjustment');
      expect(response.body.adjustment.quantityChange).toBe(10);
      expect(response.body.adjustment.reason).toBe('PURCHASE');

      // Verify stock was updated
      const updatedProduct = await prisma.product.findUnique({
        where: { id: testProduct.id }
      });
      expect(updatedProduct.stockQuantity).toBe(testProduct.stockQuantity + 10);
    });

    test('should adjust variant inventory', async () => {
      const adjustmentData = {
        variantId: testVariant.id,
        quantityChange: -5,
        reason: 'SALE',
        notes: 'Test variant adjustment'
      };

      const response = await request(app)
        .patch('/api/inventory/adjust')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(adjustmentData)
        .expect(200);

      expect(response.body).toHaveProperty('message');
      expect(response.body.adjustment.quantityChange).toBe(-5);

      // Verify variant stock was updated
      const updatedVariant = await prisma.variant.findUnique({
        where: { id: testVariant.id }
      });
      expect(updatedVariant.stockQuantity).toBe(testVariant.stockQuantity - 5);
    });

    test('should allow CASHIER role to adjust inventory', async () => {
      const adjustmentData = {
        productId: testProduct.id,
        quantityChange: -2,
        reason: 'SALE',
        notes: 'Cashier adjustment'
      };

      const response = await request(app)
        .patch('/api/inventory/adjust')
        .set('Authorization', `Bearer ${cashierToken}`)
        .send(adjustmentData)
        .expect(200);

      expect(response.body).toHaveProperty('message');
    });

    test('should validate required fields', async () => {
      const response = await request(app)
        .patch('/api/inventory/adjust')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ quantityChange: 10 })
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    test('should require either productId or variantId', async () => {
      const response = await request(app)
        .patch('/api/inventory/adjust')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          quantityChange: 10,
          reason: 'PURCHASE'
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    test('should not allow both productId and variantId', async () => {
      const response = await request(app)
        .patch('/api/inventory/adjust')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          productId: testProduct.id,
          variantId: testVariant.id,
          quantityChange: 10,
          reason: 'PURCHASE'
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /api/inventory/bulk-adjust', () => {
    test('should process bulk inventory adjustments (ADMIN role)', async () => {
      const bulkAdjustments = [
        {
          productId: testProduct.id,
          quantityChange: 15,
          reason: 'PURCHASE',
          notes: 'Bulk purchase'
        },
        {
          variantId: testVariant.id,
          quantityChange: -3,
          reason: 'SALE',
          notes: 'Bulk sale'
        }
      ];

      const response = await request(app)
        .post('/api/inventory/bulk-adjust')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ adjustments: bulkAdjustments })
        .expect(200);

      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('results');
      expect(response.body.results.length).toBe(2);
    });

    test('should reject bulk adjustments by non-admin/manager role', async () => {
      const bulkAdjustments = [
        {
          productId: testProduct.id,
          quantityChange: 10,
          reason: 'PURCHASE'
        }
      ];

      const response = await request(app)
        .post('/api/inventory/bulk-adjust')
        .set('Authorization', `Bearer ${cashierToken}`)
        .send({ adjustments: bulkAdjustments })
        .expect(403);

      expect(response.body).toHaveProperty('error');
    });

    test('should validate bulk adjustment data', async () => {
      const response = await request(app)
        .post('/api/inventory/bulk-adjust')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ adjustments: [] })
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /api/inventory/history', () => {
    test('should return inventory adjustment history', async () => {
      const response = await request(app)
        .get('/api/inventory/history')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      
      // Verify structure of adjustment records
      response.body.forEach(adjustment => {
        expect(adjustment).toHaveProperty('id');
        expect(adjustment).toHaveProperty('quantityChange');
        expect(adjustment).toHaveProperty('reason');
        expect(adjustment).toHaveProperty('adjustmentDate');
      });
    });

    test('should support pagination', async () => {
      const response = await request(app)
        .get('/api/inventory/history?page=1&limit=5')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.length).toBeLessThanOrEqual(5);
    });

    test('should support date range filtering', async () => {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 7); // 7 days ago
      
      const response = await request(app)
        .get(`/api/inventory/history?startDate=${startDate.toISOString()}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('GET /api/inventory/export', () => {
    test('should export inventory data (ADMIN role)', async () => {
      const response = await request(app)
        .get('/api/inventory/export')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('exportedAt');
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    test('should reject export by non-admin/manager role', async () => {
      const response = await request(app)
        .get('/api/inventory/export')
        .set('Authorization', `Bearer ${cashierToken}`)
        .expect(403);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('Low Stock Alerts', () => {
    test('should emit low stock alert when product goes below threshold', async () => {
      // First, reduce stock to trigger low stock alert
      const adjustmentData = {
        productId: testProduct.id,
        quantityChange: -(testProduct.stockQuantity - testProduct.minStockLevel + 1),
        reason: 'SALE',
        notes: 'Trigger low stock alert'
      };

      const response = await request(app)
        .patch('/api/inventory/adjust')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(adjustmentData)
        .expect(200);

      expect(response.body).toHaveProperty('message');
      
      // Verify product is now low stock
      const updatedProduct = await prisma.product.findUnique({
        where: { id: testProduct.id }
      });
      expect(updatedProduct.stockQuantity).toBeLessThanOrEqual(updatedProduct.minStockLevel);
    });
  });
});
