const request = require('supertest');
const { app } = require('../server');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

describe('Products API', () => {
  let authToken, adminToken, managerToken, cashierToken;
  let testCategory, testProduct, testVariant;

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

    // Get a test category
    testCategory = await prisma.category.findFirst();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('GET /api/products', () => {
    test('should return all products with pagination', async () => {
      const response = await request(app)
        .get('/api/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('products');
      expect(response.body).toHaveProperty('pagination');
      expect(Array.isArray(response.body.products)).toBe(true);
      expect(response.body.pagination).toHaveProperty('total');
      expect(response.body.pagination).toHaveProperty('page');
      expect(response.body.pagination).toHaveProperty('limit');
    });

    test('should support pagination parameters', async () => {
      const response = await request(app)
        .get('/api/products?page=1&limit=2')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.pagination.page).toBe(1);
      expect(response.body.pagination.limit).toBe(2);
    });

    test('should support search by name', async () => {
      const response = await request(app)
        .get('/api/products?search=laptop')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.products.length).toBeGreaterThan(0);
    });

    test('should support category filtering', async () => {
      const response = await request(app)
        .get(`/api/products?categoryId=${testCategory.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.products.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/products/:id', () => {
    test('should return product by ID with relations', async () => {
      // Get a test product first
      const product = await prisma.product.findFirst({
        include: { category: true, variants: true }
      });

      const response = await request(app)
        .get(`/api/products/${product.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('id', product.id);
      expect(response.body).toHaveProperty('name', product.name);
      expect(response.body).toHaveProperty('category');
      expect(response.body).toHaveProperty('variants');
    });

    test('should return 404 for non-existent product', async () => {
      const response = await request(app)
        .get('/api/products/nonexistent-id')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /api/products', () => {
    test('should create product with valid data (ADMIN role)', async () => {
      const productData = {
        name: 'Test Product',
        description: 'A test product for testing',
        sku: 'TEST-001',
        price: 29.99,
        costPrice: 20.00,
        categoryId: testCategory.id,
        tags: JSON.stringify(['test', 'sample']),
        stockQuantity: 100,
        minStockLevel: 10
      };

      const response = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(productData)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe(productData.name);
      expect(response.body.sku).toBe(productData.sku);
      expect(response.body.price).toBe(productData.price);

      // Store for cleanup
      testProduct = response.body;
    });

    test('should create product with valid data (MANAGER role)', async () => {
      const productData = {
        name: 'Manager Product',
        description: 'A product created by manager',
        sku: 'MGR-001',
        price: 39.99,
        costPrice: 25.00,
        categoryId: testCategory.id,
        tags: JSON.stringify(['manager', 'test']),
        stockQuantity: 50,
        minStockLevel: 5
      };

      const response = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${managerToken}`)
        .send(productData)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe(productData.name);
    });

    test('should reject product creation by CASHIER role', async () => {
      const productData = {
        name: 'Cashier Product',
        description: 'A product that should not be created',
        sku: 'CASH-001',
        price: 19.99,
        costPrice: 15.00,
        categoryId: testCategory.id,
        tags: JSON.stringify(['cashier', 'test']),
        stockQuantity: 25,
        minStockLevel: 5
      };

      const response = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${cashierToken}`)
        .send(productData)
        .expect(403);

      expect(response.body).toHaveProperty('error');
    });

    test('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: 'Incomplete Product' })
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    test('should enforce unique SKU constraint', async () => {
      const productData = {
        name: 'Duplicate SKU Product',
        description: 'A product with duplicate SKU',
        sku: 'TEST-001', // Same SKU as first test
        price: 19.99,
        costPrice: 15.00,
        categoryId: testCategory.id,
        tags: JSON.stringify(['duplicate', 'test']),
        stockQuantity: 25,
        minStockLevel: 5
      };

      const response = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(productData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('PUT /api/products/:id', () => {
    test('should update product with valid data', async () => {
      const updateData = {
        name: 'Updated Test Product',
        price: 34.99,
        description: 'Updated description'
      };

      const response = await request(app)
        .put(`/api/products/${testProduct.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.name).toBe(updateData.name);
      expect(response.body.price).toBe(updateData.price);
      expect(response.body.description).toBe(updateData.description);
    });

    test('should reject update by unauthorized role', async () => {
      const updateData = { name: 'Unauthorized Update' };

      const response = await request(app)
        .put(`/api/products/${testProduct.id}`)
        .set('Authorization', `Bearer ${cashierToken}`)
        .send(updateData)
        .expect(403);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('DELETE /api/products/:id', () => {
    test('should soft delete product (ADMIN only)', async () => {
      const response = await request(app)
        .delete(`/api/products/${testProduct.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('message');
      
      // Verify product is soft deleted
      const deletedProduct = await prisma.product.findUnique({
        where: { id: testProduct.id }
      });
      expect(deletedProduct.isActive).toBe(false);
    });

    test('should reject deletion by non-admin role', async () => {
      // Create another test product
      const productData = {
        name: 'Delete Test Product',
        description: 'A product to test deletion',
        sku: 'DELETE-001',
        price: 19.99,
        costPrice: 15.00,
        categoryId: testCategory.id,
        tags: JSON.stringify(['delete', 'test']),
        stockQuantity: 25,
        minStockLevel: 5
      };

      const createResponse = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(productData);

      const response = await request(app)
        .delete(`/api/products/${createResponse.body.id}`)
        .set('Authorization', `Bearer ${managerToken}`)
        .expect(403);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('Product Variants', () => {
    test('should get product variants', async () => {
      const response = await request(app)
        .get(`/api/products/${testProduct.id}/variants`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });

    test('should create product variant', async () => {
      const variantData = {
        name: 'Test Variant',
        sku: 'TEST-VAR-001',
        attributes: JSON.stringify({ size: 'L', color: 'Red' }),
        price: 34.99,
        costPrice: 25.00,
        stockQuantity: 50,
        minStockLevel: 5
      };

      const response = await request(app)
        .post(`/api/products/${testProduct.id}/variants`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(variantData)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe(variantData.name);
      expect(response.body.sku).toBe(variantData.sku);

      // Store for cleanup
      testVariant = response.body;
    });

    test('should enforce unique SKU constraint for variants', async () => {
      const variantData = {
        name: 'Duplicate Variant',
        sku: 'TEST-VAR-001', // Same SKU as previous variant
        attributes: JSON.stringify({ size: 'M', color: 'Blue' }),
        price: 29.99,
        costPrice: 20.00,
        stockQuantity: 30,
        minStockLevel: 3
      };

      const response = await request(app)
        .post(`/api/products/${testProduct.id}/variants`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(variantData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });
});
