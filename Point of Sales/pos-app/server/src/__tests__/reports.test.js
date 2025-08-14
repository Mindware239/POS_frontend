const request = require('supertest');
const { app } = require('../server');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

describe('Reports API', () => {
  let adminToken, managerToken, cashierToken;

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

  describe('GET /api/reports/sales', () => {
    test('should return sales report with date range', async () => {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 30); // 30 days ago
      const endDate = new Date();

      const response = await request(app)
        .get(`/api/reports/sales?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('summary');
      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('period');
      expect(response.body.summary).toHaveProperty('totalSales');
      expect(response.body.summary).toHaveProperty('totalRevenue');
      expect(response.body.summary).toHaveProperty('averageOrderValue');
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    test('should support grouping by day', async () => {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 7); // 7 days ago
      const endDate = new Date();

      const response = await request(app)
        .get(`/api/reports/sales?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}&groupBy=day`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
      
      // Verify data is grouped by day
      if (response.body.data.length > 0) {
        expect(response.body.data[0]).toHaveProperty('date');
        expect(response.body.data[0]).toHaveProperty('sales');
        expect(response.body.data[0]).toHaveProperty('revenue');
      }
    });

    test('should support grouping by month', async () => {
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 6); // 6 months ago
      const endDate = new Date();

      const response = await request(app)
        .get(`/api/reports/sales?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}&groupBy=month`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    test('should support payment method filtering', async () => {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 30);
      const endDate = new Date();

      const response = await request(app)
        .get(`/api/reports/sales?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}&paymentMethod=CASH`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('summary');
      expect(response.body).toHaveProperty('data');
    });

    test('should support customer filtering', async () => {
      const customer = await prisma.customer.findFirst();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 30);
      const endDate = new Date();

      const response = await request(app)
        .get(`/api/reports/sales?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}&customerId=${customer.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('summary');
      expect(response.body).toHaveProperty('data');
    });

    test('should validate date parameters', async () => {
      const response = await request(app)
        .get('/api/reports/sales?startDate=invalid-date')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    test('should require authentication', async () => {
      const response = await request(app)
        .get('/api/reports/sales')
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /api/reports/inventory', () => {
    test('should return inventory report', async () => {
      const response = await request(app)
        .get('/api/reports/inventory')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('summary');
      expect(response.body).toHaveProperty('products');
      expect(response.body).toHaveProperty('categories');
      expect(response.body.summary).toHaveProperty('totalProducts');
      expect(response.body.summary).toHaveProperty('totalValue');
      expect(response.body.summary).toHaveProperty('lowStockCount');
      expect(Array.isArray(response.body.products)).toBe(true);
      expect(Array.isArray(response.body.categories)).toBe(true);
    });

    test('should support category filtering', async () => {
      const category = await prisma.category.findFirst();

      const response = await request(app)
        .get(`/api/reports/inventory?categoryId=${category.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('products');
      expect(response.body).toHaveProperty('categories');
      
      // Verify products belong to the specified category
      response.body.products.forEach(product => {
        expect(product.categoryId).toBe(category.id);
      });
    });

    test('should support stock level filtering', async () => {
      const response = await request(app)
        .get('/api/reports/inventory?stockLevel=low')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('products');
      
      // Verify all returned products are low stock
      response.body.products.forEach(product => {
        expect(product.stockQuantity).toBeLessThanOrEqual(product.minStockLevel);
      });
    });

    test('should support search filtering', async () => {
      const response = await request(app)
        .get('/api/reports/inventory?search=laptop')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('products');
      expect(response.body).toHaveProperty('categories');
    });

    test('should require authentication', async () => {
      const response = await request(app)
        .get('/api/reports/inventory')
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /api/reports/top-products', () => {
    test('should return top performing products report', async () => {
      const response = await request(app)
        .get('/api/reports/top-products')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('summary');
      expect(response.body).toHaveProperty('products');
      expect(response.body.summary).toHaveProperty('totalRevenue');
      expect(response.body.summary).toHaveProperty('totalUnits');
      expect(Array.isArray(response.body.products)).toBe(true);
    });

    test('should support limit parameter', async () => {
      const limit = 5;
      const response = await request(app)
        .get(`/api/reports/top-products?limit=${limit}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.products.length).toBeLessThanOrEqual(limit);
    });

    test('should support date range filtering', async () => {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 30);
      const endDate = new Date();

      const response = await request(app)
        .get(`/api/reports/top-products?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('products');
      expect(response.body).toHaveProperty('summary');
    });

    test('should support category filtering', async () => {
      const category = await prisma.category.findFirst();

      const response = await request(app)
        .get(`/api/reports/top-products?categoryId=${category.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('products');
      
      // Verify all returned products belong to the specified category
      response.body.products.forEach(product => {
        expect(product.categoryId).toBe(category.id);
      });
    });

    test('should sort products by revenue by default', async () => {
      const response = await request(app)
        .get('/api/reports/top-products')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('products');
      
      // Verify products are sorted by revenue (descending)
      if (response.body.products.length > 1) {
        for (let i = 0; i < response.body.products.length - 1; i++) {
          expect(response.body.products[i].revenue).toBeGreaterThanOrEqual(response.body.products[i + 1].revenue);
        }
      }
    });

    test('should require authentication', async () => {
      const response = await request(app)
        .get('/api/reports/top-products')
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /api/reports/financial', () => {
    test('should return financial summary report (ADMIN role)', async () => {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 30);
      const endDate = new Date();

      const response = await request(app)
        .get(`/api/reports/financial?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('summary');
      expect(response.body).toHaveProperty('revenue');
      expect(response.body).toHaveProperty('expenses');
      expect(response.body).toHaveProperty('profit');
      expect(response.body.summary).toHaveProperty('totalRevenue');
      expect(response.body.summary).toHaveProperty('totalExpenses');
      expect(response.body.summary).toHaveProperty('netProfit');
      expect(response.body.summary).toHaveProperty('profitMargin');
    });

    test('should return financial summary report (MANAGER role)', async () => {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 30);
      const endDate = new Date();

      const response = await request(app)
        .get(`/api/reports/financial?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`)
        .set('Authorization', `Bearer ${managerToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('summary');
      expect(response.body).toHaveProperty('revenue');
      expect(response.body).toHaveProperty('expenses');
      expect(response.body).toHaveProperty('profit');
    });

    test('should reject financial report by CASHIER role', async () => {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 30);
      const endDate = new Date();

      const response = await request(app)
        .get(`/api/reports/financial?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`)
        .set('Authorization', `Bearer ${cashierToken}`)
        .expect(403);

      expect(response.body).toHaveProperty('error');
    });

    test('should support different time periods', async () => {
      const periods = ['day', 'week', 'month', 'quarter', 'year'];
      
      for (const period of periods) {
        const response = await request(app)
          .get(`/api/reports/financial?period=${period}`)
          .set('Authorization', `Bearer ${adminToken}`)
          .expect(200);

        expect(response.body).toHaveProperty('summary');
        expect(response.body).toHaveProperty('revenue');
        expect(response.body).toHaveProperty('expenses');
        expect(response.body).toHaveProperty('profit');
      }
    });

    test('should require authentication', async () => {
      const response = await request(app)
        .get('/api/reports/financial')
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /api/reports/customers', () => {
    test('should return customer analytics report', async () => {
      const response = await request(app)
        .get('/api/reports/customers')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('summary');
      expect(response.body).toHaveProperty('customers');
      expect(response.body).toHaveProperty('loyalty');
      expect(response.body.summary).toHaveProperty('totalCustomers');
      expect(response.body.summary).toHaveProperty('activeCustomers');
      expect(response.body.summary).toHaveProperty('averageOrderValue');
      expect(Array.isArray(response.body.customers)).toBe(true);
    });

    test('should support customer segmentation', async () => {
      const response = await request(app)
        .get('/api/reports/customers?segment=high-value')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('customers');
      expect(response.body).toHaveProperty('summary');
    });

    test('should support date range filtering', async () => {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 90);
      const endDate = new Date();

      const response = await request(app)
        .get(`/api/reports/customers?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('customers');
      expect(response.body).toHaveProperty('summary');
    });

    test('should include loyalty program data', async () => {
      const response = await request(app)
        .get('/api/reports/customers')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('loyalty');
      expect(response.body.loyalty).toHaveProperty('totalPoints');
      expect(response.body.loyalty).toHaveProperty('redemptions');
      expect(response.body.loyalty).toHaveProperty('topCustomers');
    });

    test('should require authentication', async () => {
      const response = await request(app)
        .get('/api/reports/customers')
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('Report Data Validation', () => {
    test('should return consistent data across different report types', async () => {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 30);
      const endDate = new Date();

      // Get sales report
      const salesResponse = await request(app)
        .get(`/api/reports/sales?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`)
        .set('Authorization', `Bearer ${adminToken}`);

      // Get financial report
      const financialResponse = await request(app)
        .get(`/api/reports/financial?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`)
        .set('Authorization', `Bearer ${adminToken}`);

      // Verify that total revenue matches between reports
      expect(salesResponse.body.summary.totalRevenue).toBe(financialResponse.body.summary.totalRevenue);
    });

    test('should handle empty data periods gracefully', async () => {
      const startDate = new Date();
      startDate.setFullYear(startDate.getFullYear() - 10); // 10 years ago
      const endDate = new Date();
      endDate.setFullYear(endDate.getFullYear() - 9); // 9 years ago

      const response = await request(app)
        .get(`/api/reports/sales?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.summary.totalSales).toBe(0);
      expect(response.body.summary.totalRevenue).toBe(0);
      expect(response.body.data).toEqual([]);
    });
  });
});
