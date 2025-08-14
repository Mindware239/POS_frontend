const request = require('supertest');
const { app } = require('../server');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

describe('Sales API', () => {
  let adminToken, managerToken, cashierToken;
  let testProduct, testVariant, testCustomer, testUser;

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

    // Get test data
    testProduct = await prisma.product.findFirst({
      include: { variants: true }
    });
    testVariant = testProduct.variants[0];
    testCustomer = await prisma.customer.findFirst();
    testUser = await prisma.user.findFirst({ where: { username: 'cashier' } });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('GET /api/sales', () => {
    test('should return sales with pagination', async () => {
      const response = await request(app)
        .get('/api/sales')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('sales');
      expect(response.body).toHaveProperty('pagination');
      expect(Array.isArray(response.body.sales)).toBe(true);
      expect(response.body.pagination).toHaveProperty('total');
    });

    test('should support date range filtering', async () => {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 30); // 30 days ago
      
      const response = await request(app)
        .get(`/api/sales?startDate=${startDate.toISOString()}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(Array.isArray(response.body.sales)).toBe(true);
    });

    test('should support customer filtering', async () => {
      const response = await request(app)
        .get(`/api/sales?customerId=${testCustomer.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(Array.isArray(response.body.sales)).toBe(true);
    });

    test('should support payment method filtering', async () => {
      const response = await request(app)
        .get('/api/sales?paymentMethod=CASH')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(Array.isArray(response.body.sales)).toBe(true);
    });
  });

  describe('GET /api/sales/:id', () => {
    test('should return sale by ID with details', async () => {
      // Get a test sale first
      const sale = await prisma.sale.findFirst({
        include: { items: true, customer: true, user: true }
      });

      const response = await request(app)
        .get(`/api/sales/${sale.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('id', sale.id);
      expect(response.body).toHaveProperty('invoiceNumber');
      expect(response.body).toHaveProperty('totalAmount');
      expect(response.body).toHaveProperty('items');
      expect(response.body).toHaveProperty('customer');
      expect(response.body).toHaveProperty('user');
    });

    test('should return 404 for non-existent sale', async () => {
      const response = await request(app)
        .get('/api/sales/nonexistent-id')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /api/sales', () => {
    test('should create sale with valid cart data (CASHIER role)', async () => {
      const cartData = {
        items: [
          {
            productId: testProduct.id,
            quantity: 2,
            unitPrice: testProduct.price
          }
        ],
        customerId: testCustomer.id,
        paymentMethod: 'CASH',
        discountAmount: 5.00,
        notes: 'Test sale'
      };

      const response = await request(app)
        .post('/api/sales')
        .set('Authorization', `Bearer ${cashierToken}`)
        .send(cartData)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('invoiceNumber');
      expect(response.body).toHaveProperty('totalAmount');
      expect(response.body).toHaveProperty('items');
      expect(response.body.items.length).toBe(1);
      expect(response.body.paymentMethod).toBe('CASH');
      expect(response.body.discountAmount).toBe(5.00);

      // Verify stock was updated
      const updatedProduct = await prisma.product.findUnique({
        where: { id: testProduct.id }
      });
      expect(updatedProduct.stockQuantity).toBe(testProduct.stockQuantity - 2);
    });

    test('should create sale with variant items', async () => {
      const cartData = {
        items: [
          {
            variantId: testVariant.id,
            quantity: 1,
            unitPrice: testVariant.price || testProduct.price
          }
        ],
        customerId: testCustomer.id,
        paymentMethod: 'CARD',
        notes: 'Variant sale test'
      };

      const response = await request(app)
        .post('/api/sales')
        .set('Authorization', `Bearer ${cashierToken}`)
        .send(cartData)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.items.length).toBe(1);
      expect(response.body.items[0].variantId).toBe(testVariant.id);

      // Verify variant stock was updated
      const updatedVariant = await prisma.variant.findUnique({
        where: { id: testVariant.id }
      });
      expect(updatedVariant.stockQuantity).toBe(testVariant.stockQuantity - 1);
    });

    test('should calculate taxes correctly', async () => {
      const cartData = {
        items: [
          {
            productId: testProduct.id,
            quantity: 1,
            unitPrice: 100.00
          }
        ],
        customerId: testCustomer.id,
        paymentMethod: 'CASH'
      };

      const response = await request(app)
        .post('/api/sales')
        .set('Authorization', `Bearer ${cashierToken}`)
        .send(cartData)
        .expect(201);

      expect(response.body).toHaveProperty('subtotal');
      expect(response.body).toHaveProperty('taxAmount');
      expect(response.body).toHaveProperty('totalAmount');
      expect(response.body.subtotal).toBe(100.00);
      expect(response.body.taxAmount).toBeGreaterThan(0);
      expect(response.body.totalAmount).toBe(response.body.subtotal + response.body.taxAmount);
    });

    test('should process loyalty points', async () => {
      // First, add loyalty points to customer
      await prisma.customer.update({
        where: { id: testCustomer.id },
        data: { loyaltyPoints: 100 }
      });

      const cartData = {
        items: [
          {
            productId: testProduct.id,
            quantity: 1,
            unitPrice: testProduct.price
          }
        ],
        customerId: testCustomer.id,
        paymentMethod: 'CASH',
        loyaltyPointsUsed: 50
      };

      const response = await request(app)
        .post('/api/sales')
        .set('Authorization', `Bearer ${cashierToken}`)
        .send(cartData)
        .expect(201);

      expect(response.body).toHaveProperty('loyaltyPointsUsed', 50);
      expect(response.body).toHaveProperty('loyaltyDiscount');

      // Verify customer loyalty points were reduced
      const updatedCustomer = await prisma.customer.findUnique({
        where: { id: testCustomer.id }
      });
      expect(updatedCustomer.loyaltyPoints).toBe(50);
    });

    test('should reject sale with insufficient stock', async () => {
      const cartData = {
        items: [
          {
            productId: testProduct.id,
            quantity: 999999, // More than available stock
            unitPrice: testProduct.price
          }
        ],
        customerId: testCustomer.id,
        paymentMethod: 'CASH'
      };

      const response = await request(app)
        .post('/api/sales')
        .set('Authorization', `Bearer ${cashierToken}`)
        .send(cartData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    test('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/sales')
        .set('Authorization', `Bearer ${cashierToken}`)
        .send({ items: [] })
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    test('should validate cart items structure', async () => {
      const cartData = {
        items: [
          {
            productId: testProduct.id,
            quantity: -1, // Invalid quantity
            unitPrice: testProduct.price
          }
        ],
        customerId: testCustomer.id,
        paymentMethod: 'CASH'
      };

      const response = await request(app)
        .post('/api/sales')
        .set('Authorization', `Bearer ${cashierToken}`)
        .send(cartData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /api/sales/:id/refund', () => {
    test('should process refund (ADMIN role)', async () => {
      // First, create a sale to refund
      const cartData = {
        items: [
          {
            productId: testProduct.id,
            quantity: 1,
            unitPrice: testProduct.price
          }
        ],
        customerId: testCustomer.id,
        paymentMethod: 'CASH'
      };

      const saleResponse = await request(app)
        .post('/api/sales')
        .set('Authorization', `Bearer ${cashierToken}`)
        .send(cartData);

      const refundData = {
        items: [
          {
            productId: testProduct.id,
            quantity: 1,
            reason: 'Customer request'
          }
        ],
        refundAmount: testProduct.price,
        notes: 'Test refund'
      };

      const response = await request(app)
        .post(`/api/sales/${saleResponse.body.id}/refund`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(refundData)
        .expect(200);

      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('refund');

      // Verify stock was restored
      const updatedProduct = await prisma.product.findUnique({
        where: { id: testProduct.id }
      });
      expect(updatedProduct.stockQuantity).toBe(testProduct.stockQuantity);
    });

    test('should reject refund by non-admin/manager role', async () => {
      // Create another sale
      const cartData = {
        items: [
          {
            productId: testProduct.id,
            quantity: 1,
            unitPrice: testProduct.price
          }
        ],
        customerId: testCustomer.id,
        paymentMethod: 'CASH'
      };

      const saleResponse = await request(app)
        .post('/api/sales')
        .set('Authorization', `Bearer ${cashierToken}`)
        .send(cartData);

      const refundData = {
        items: [
          {
            productId: testProduct.id,
            quantity: 1,
            reason: 'Customer request'
          }
        ],
        refundAmount: testProduct.price
      };

      const response = await request(app)
        .post(`/api/sales/${saleResponse.body.id}/refund`)
        .set('Authorization', `Bearer ${cashierToken}`)
        .send(refundData)
        .expect(403);

      expect(response.body).toHaveProperty('error');
    });

    test('should validate refund data', async () => {
      const response = await request(app)
        .post('/api/sales/nonexistent-id/refund')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ items: [] })
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /api/sales/:id/receipt', () => {
    test('should generate receipt data', async () => {
      // Get a test sale
      const sale = await prisma.sale.findFirst({
        include: { items: true, customer: true, user: true }
      });

      const response = await request(app)
        .get(`/api/sales/${sale.id}/receipt`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('sale');
      expect(response.body).toHaveProperty('items');
      expect(response.body).toHaveProperty('customer');
      expect(response.body).toHaveProperty('user');
      expect(response.body).toHaveProperty('receiptNumber');
      expect(response.body).toHaveProperty('generatedAt');
    });

    test('should return 404 for non-existent sale', async () => {
      const response = await request(app)
        .get('/api/sales/nonexistent-id/receipt')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /api/sales/cart/validate', () => {
    test('should validate cart items', async () => {
      const cartData = {
        items: [
          {
            productId: testProduct.id,
            quantity: 1,
            unitPrice: testProduct.price
          }
        ]
      };

      const response = await request(app)
        .post('/api/sales/cart/validate')
        .set('Authorization', `Bearer ${cashierToken}`)
        .send(cartData)
        .expect(200);

      expect(response.body).toHaveProperty('valid', true);
      expect(response.body).toHaveProperty('items');
      expect(response.body).toHaveProperty('total');
      expect(response.body).toHaveProperty('taxAmount');
    });

    test('should detect invalid items', async () => {
      const cartData = {
        items: [
          {
            productId: 'nonexistent-id',
            quantity: 1,
            unitPrice: 10.00
          }
        ]
      };

      const response = await request(app)
        .post('/api/sales/cart/validate')
        .set('Authorization', `Bearer ${cashierToken}`)
        .send(cartData)
        .expect(200);

      expect(response.body).toHaveProperty('valid', false);
      expect(response.body).toHaveProperty('errors');
      expect(response.body.errors.length).toBeGreaterThan(0);
    });

    test('should detect insufficient stock', async () => {
      const cartData = {
        items: [
          {
            productId: testProduct.id,
            quantity: 999999,
            unitPrice: testProduct.price
          }
        ]
      };

      const response = await request(app)
        .post('/api/sales/cart/validate')
        .set('Authorization', `Bearer ${cashierToken}`)
        .send(cartData)
        .expect(200);

      expect(response.body).toHaveProperty('valid', false);
      expect(response.body).toHaveProperty('errors');
    });

    test('should validate cart structure', async () => {
      const response = await request(app)
        .post('/api/sales/cart/validate')
        .set('Authorization', `Bearer ${cashierToken}`)
        .send({ items: [] })
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('Sales Transactions', () => {
    test('should use database transactions for atomicity', async () => {
      // This test verifies that the sale creation uses Prisma transactions
      // by checking that both the sale and inventory are updated consistently
      
      const initialStock = testProduct.stockQuantity;
      const saleQuantity = 1;

      const cartData = {
        items: [
          {
            productId: testProduct.id,
            quantity: saleQuantity,
            unitPrice: testProduct.price
          }
        ],
        customerId: testCustomer.id,
        paymentMethod: 'CASH'
      };

      const response = await request(app)
        .post('/api/sales')
        .set('Authorization', `Bearer ${cashierToken}`)
        .send(cartData)
        .expect(201);

      // Verify sale was created
      expect(response.body).toHaveProperty('id');
      
      // Verify inventory was updated
      const updatedProduct = await prisma.product.findUnique({
        where: { id: testProduct.id }
      });
      expect(updatedProduct.stockQuantity).toBe(initialStock - saleQuantity);

      // Verify sale items were created
      const saleItems = await prisma.saleItem.findMany({
        where: { saleId: response.body.id }
      });
      expect(saleItems.length).toBe(1);
      expect(saleItems[0].quantity).toBe(saleQuantity);
    });
  });
});
