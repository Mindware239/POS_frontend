const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

describe('Database Schema Tests', () => {
  let adminUser, managerUser, cashierUser;
  let electronicsCategory, smartphonesCategory;
  let testProduct, testVariant;
  let testCustomer, testSale;

  beforeAll(async () => {
    // Clean up any existing test data
    await prisma.loyaltyReward.deleteMany();
    await prisma.saleItem.deleteMany();
    await prisma.sale.deleteMany();
    await prisma.inventoryAdjustment.deleteMany();
    await prisma.variant.deleteMany();
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();
    await prisma.customer.deleteMany();
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('User Model', () => {
    test('should create a user with all required fields', async () => {
      const passwordHash = await bcrypt.hash('testpass123', 12);
      
      adminUser = await prisma.user.create({
        data: {
          username: 'testadmin',
          email: 'testadmin@pos.com',
          passwordHash,
          firstName: 'Test',
          lastName: 'Admin',
          role: 'ADMIN',
          isActive: true
        }
      });

      expect(adminUser).toBeDefined();
      expect(adminUser.username).toBe('testadmin');
      expect(adminUser.email).toBe('testadmin@pos.com');
      expect(adminUser.role).toBe('ADMIN');
      expect(adminUser.isActive).toBe(true);
      expect(adminUser.id).toMatch(/^[a-zA-Z0-9]{25}$/); // CUID format
    });

    test('should create users with different roles', async () => {
      const managerPassword = await bcrypt.hash('manager123', 12);
      const cashierPassword = await bcrypt.hash('cashier123', 12);

      managerUser = await prisma.user.create({
        data: {
          username: 'testmanager',
          email: 'testmanager@pos.com',
          passwordHash: managerPassword,
          firstName: 'Test',
          lastName: 'Manager',
          role: 'MANAGER',
          isActive: true
        }
      });

      cashierUser = await prisma.user.create({
        data: {
          username: 'testcashier',
          email: 'testcashier@pos.com',
          passwordHash: cashierPassword,
          firstName: 'Test',
          lastName: 'Cashier',
          role: 'CASHIER',
          isActive: true
        }
      });

      expect(managerUser.role).toBe('MANAGER');
      expect(cashierUser.role).toBe('CASHIER');
    });

    test('should enforce unique constraints', async () => {
      const duplicateUser = {
        username: 'testadmin', // Duplicate username
        email: 'different@pos.com',
        passwordHash: 'hash',
        firstName: 'Different',
        lastName: 'User',
        role: 'CASHIER'
      };

      await expect(prisma.user.create({ data: duplicateUser }))
        .rejects.toThrow();
    });
  });

  describe('Category Model', () => {
    test('should create a category with all required fields', async () => {
      electronicsCategory = await prisma.category.create({
        data: {
          name: 'Electronics',
          description: 'Electronic devices and accessories',
          slug: 'electronics',
          isActive: true,
          sortOrder: 1,
          createdById: adminUser.id,
          updatedById: adminUser.id
        }
      });

      expect(electronicsCategory).toBeDefined();
      expect(electronicsCategory.name).toBe('Electronics');
      expect(electronicsCategory.slug).toBe('electronics');
      expect(electronicsCategory.isActive).toBe(true);
    });

    test('should create hierarchical categories', async () => {
      smartphonesCategory = await prisma.category.create({
        data: {
          name: 'Smartphones',
          description: 'Mobile phones and accessories',
          slug: 'smartphones',
          parentId: electronicsCategory.id,
          isActive: true,
          sortOrder: 1,
          createdById: adminUser.id,
          updatedById: adminUser.id
        }
      });

      expect(smartphonesCategory.parentId).toBe(electronicsCategory.id);
    });

    test('should query parent and children relationships', async () => {
      const parentWithChildren = await prisma.category.findUnique({
        where: { id: electronicsCategory.id },
        include: { children: true }
      });

      expect(parentWithChildren.children).toHaveLength(1);
      expect(parentWithChildren.children[0].id).toBe(smartphonesCategory.id);

      const childWithParent = await prisma.category.findUnique({
        where: { id: smartphonesCategory.id },
        include: { parent: true }
      });

      expect(childWithParent.parent.id).toBe(electronicsCategory.id);
    });
  });

  describe('Product Model', () => {
    test('should create a product with all required fields', async () => {
      testProduct = await prisma.product.create({
        data: {
          name: 'Test iPhone',
          description: 'Test iPhone description',
          sku: 'TEST-IPHONE-001',
          barcode: '1234567890128',
          price: 999.99,
          costPrice: 750.00,
          comparePrice: 1099.99,
          weight: 0.187,
          dimensions: '5.8x2.8x0.32',
          isActive: true,
          isFeatured: true,
          tags: JSON.stringify(['test', 'smartphone', 'apple']),
          imageUrl: 'https://example.com/test-iphone.jpg',
          aiGeneratedImageUrl: 'https://example.com/ai-test-iphone.jpg',
          stockQuantity: 25,
          minStockLevel: 5,
          maxStockLevel: 100,
          lowStockAlert: true,
          categoryId: smartphonesCategory.id,
          createdById: adminUser.id,
          updatedById: adminUser.id
        }
      });

      expect(testProduct).toBeDefined();
      expect(testProduct.name).toBe('Test iPhone');
      expect(testProduct.sku).toBe('TEST-IPHONE-001');
      expect(testProduct.price).toBe(999.99);
      expect(testProduct.categoryId).toBe(smartphonesCategory.id);
      expect(testProduct.createdById).toBe(adminUser.id);
    });

    test('should enforce unique SKU and barcode constraints', async () => {
      const duplicateProduct = {
        name: 'Duplicate iPhone',
        sku: 'TEST-IPHONE-001', // Duplicate SKU
        barcode: '1234567890129',
        price: 999.99,
        costPrice: 750.00,
        categoryId: smartphonesCategory.id,
        createdById: adminUser.id,
        updatedById: adminUser.id
      };

      await expect(prisma.product.create({ data: duplicateProduct }))
        .rejects.toThrow();
    });

    test('should query product with category and creator', async () => {
      const productWithRelations = await prisma.product.findUnique({
        where: { id: testProduct.id },
        include: {
          category: true,
          createdBy: true,
          updatedBy: true
        }
      });

      expect(productWithRelations.category.name).toBe('Smartphones');
      expect(productWithRelations.createdBy.username).toBe('testadmin');
      expect(productWithRelations.updatedBy.username).toBe('testadmin');
    });
  });

  describe('Variant Model', () => {
    test('should create a product variant', async () => {
      testVariant = await prisma.variant.create({
        data: {
          productId: testProduct.id,
          sku: 'TEST-IPHONE-128GB-BLACK',
          name: '128GB Black',
          attributes: JSON.stringify({ storage: '128GB', color: 'Black' }),
          price: 999.99,
          costPrice: 750.00,
          stockQuantity: 10,
          minStockLevel: 2,
          maxStockLevel: 30,
          isActive: true
        }
      });

      expect(testVariant).toBeDefined();
      expect(testVariant.productId).toBe(testProduct.id);
      expect(testVariant.sku).toBe('TEST-IPHONE-128GB-BLACK');
      expect(testVariant.attributes).toBe(JSON.stringify({ storage: '128GB', color: 'Black' }));
    });

    test('should enforce unique SKU constraint', async () => {
      const duplicateVariant = {
        productId: testProduct.id,
        sku: 'TEST-IPHONE-128GB-BLACK', // Duplicate SKU
        name: 'Duplicate Variant',
        attributes: JSON.stringify({ storage: '128GB', color: 'White' }),
        price: 999.99,
        costPrice: 750.00,
        stockQuantity: 10
      };

      await expect(prisma.variant.create({ data: duplicateVariant }))
        .rejects.toThrow();
    });

    test('should query variant with product', async () => {
      const variantWithProduct = await prisma.variant.findUnique({
        where: { id: testVariant.id },
        include: { product: true }
      });

      expect(variantWithProduct.product.name).toBe('Test iPhone');
    });
  });

  describe('Customer Model', () => {
    test('should create a customer with all required fields', async () => {
      testCustomer = await prisma.customer.create({
        data: {
          name: 'Test Customer',
          email: 'testcustomer@email.com',
          phone: '+1-555-0103',
          address: '789 Test St',
          city: 'Test City',
          state: 'TS',
          zipCode: '12345',
          country: 'USA',
          loyaltyPoints: 100,
          totalSpent: 500.00,
          isActive: true,
          notes: 'Test customer for testing purposes'
        }
      });

      expect(testCustomer).toBeDefined();
      expect(testCustomer.name).toBe('Test Customer');
      expect(testCustomer.email).toBe('testcustomer@email.com');
      expect(testCustomer.loyaltyPoints).toBe(100);
      expect(testCustomer.totalSpent).toBe(500.00);
    });

    test('should enforce unique email constraint', async () => {
      const duplicateCustomer = {
        name: 'Duplicate Customer',
        email: 'testcustomer@email.com', // Duplicate email
        phone: '+1-555-0104',
        loyaltyPoints: 0,
        totalSpent: 0
      };

      await expect(prisma.customer.create({ data: duplicateCustomer }))
        .rejects.toThrow();
    });
  });

  describe('Sale Model', () => {
    test('should create a sale with all required fields', async () => {
      testSale = await prisma.sale.create({
        data: {
          invoiceNumber: 'TEST-INV-001',
          customerId: testCustomer.id,
          userId: cashierUser.id,
          subtotal: 999.99,
          taxAmount: 89.99,
          discountAmount: 50.00,
          totalAmount: 1039.98,
          paymentMethod: 'CARD',
          paymentStatus: 'COMPLETED',
          saleStatus: 'COMPLETED',
          notes: 'Test sale for testing purposes',
          saleDate: new Date()
        }
      });

      expect(testSale).toBeDefined();
      expect(testSale.invoiceNumber).toBe('TEST-INV-001');
      expect(testSale.customerId).toBe(testCustomer.id);
      expect(testSale.userId).toBe(cashierUser.id);
      expect(testSale.totalAmount).toBe(1039.98);
    });

    test('should enforce unique invoice number constraint', async () => {
      const duplicateSale = {
        invoiceNumber: 'TEST-INV-001', // Duplicate invoice number
        customerId: testCustomer.id,
        userId: cashierUser.id,
        subtotal: 100.00,
        taxAmount: 10.00,
        totalAmount: 110.00,
        paymentMethod: 'CASH',
        paymentStatus: 'COMPLETED',
        saleStatus: 'COMPLETED'
      };

      await expect(prisma.sale.create({ data: duplicateSale }))
        .rejects.toThrow();
    });

    test('should query sale with customer and user', async () => {
      const saleWithRelations = await prisma.sale.findUnique({
        where: { id: testSale.id },
        include: {
          customer: true,
          user: true
        }
      });

      expect(saleWithRelations.customer.name).toBe('Test Customer');
      expect(saleWithRelations.user.username).toBe('testcashier');
    });
  });

  describe('SaleItem Model', () => {
    test('should create a sale item', async () => {
      const saleItem = await prisma.saleItem.create({
        data: {
          saleId: testSale.id,
          productId: testProduct.id,
          variantId: testVariant.id,
          quantity: 1,
          unitPrice: 999.99,
          totalPrice: 999.99,
          discount: 50.00
        }
      });

      expect(saleItem).toBeDefined();
      expect(saleItem.saleId).toBe(testSale.id);
      expect(saleItem.productId).toBe(testProduct.id);
      expect(saleItem.variantId).toBe(testVariant.id);
      expect(saleItem.quantity).toBe(1);
      expect(saleItem.totalPrice).toBe(999.99);
    });

    test('should query sale item with all relations', async () => {
      const saleItemWithRelations = await prisma.saleItem.findFirst({
        where: { saleId: testSale.id },
        include: {
          sale: true,
          product: true,
          variant: true
        }
      });

      expect(saleItemWithRelations.sale.invoiceNumber).toBe('TEST-INV-001');
      expect(saleItemWithRelations.product.name).toBe('Test iPhone');
      expect(saleItemWithRelations.variant.name).toBe('128GB Black');
    });
  });

  describe('InventoryAdjustment Model', () => {
    test('should create an inventory adjustment', async () => {
      const adjustment = await prisma.inventoryAdjustment.create({
        data: {
          productId: testProduct.id,
          variantId: testVariant.id,
          quantityChange: -1,
          previousStock: 10,
          newStock: 9,
          reason: 'SALE',
          notes: 'Sold to test customer',
          adjustedById: cashierUser.id
        }
      });

      expect(adjustment).toBeDefined();
      expect(adjustment.productId).toBe(testProduct.id);
      expect(adjustment.variantId).toBe(testVariant.id);
      expect(adjustment.quantityChange).toBe(-1);
      expect(adjustment.reason).toBe('SALE');
    });

    test('should query adjustment with all relations', async () => {
      const adjustmentWithRelations = await prisma.inventoryAdjustment.findFirst({
        where: { productId: testProduct.id },
        include: {
          product: true,
          variant: true,
          adjustedBy: true
        }
      });

      expect(adjustmentWithRelations.product.name).toBe('Test iPhone');
      expect(adjustmentWithRelations.variant.name).toBe('128GB Black');
      expect(adjustmentWithRelations.adjustedBy.username).toBe('testcashier');
    });
  });

  describe('LoyaltyReward Model', () => {
    test('should create a loyalty reward', async () => {
      const reward = await prisma.loyaltyReward.create({
        data: {
          customerId: testCustomer.id,
          saleId: testSale.id,
          pointsUsed: 0,
          rewardType: 'POINTS_MULTIPLIER',
          rewardValue: 100,
          description: 'Earned 100 points for test purchase',
          isRedeemed: false,
          expiresAt: new Date('2025-12-31T23:59:59Z')
        }
      });

      expect(reward).toBeDefined();
      expect(reward.customerId).toBe(testCustomer.id);
      expect(reward.saleId).toBe(testSale.id);
      expect(reward.rewardType).toBe('POINTS_MULTIPLIER');
      expect(reward.rewardValue).toBe(100);
      expect(reward.isRedeemed).toBe(false);
    });

    test('should query reward with customer and sale', async () => {
      const rewardWithRelations = await prisma.loyaltyReward.findFirst({
        where: { customerId: testCustomer.id },
        include: {
          customer: true,
          sale: true
        }
      });

      expect(rewardWithRelations.customer.name).toBe('Test Customer');
      expect(rewardWithRelations.sale.invoiceNumber).toBe('TEST-INV-001');
    });
  });

  describe('Complex Queries', () => {
    test('should query products with variants and category', async () => {
      const productsWithVariants = await prisma.product.findMany({
        where: { isActive: true },
        include: {
          category: true,
          variants: {
            where: { isActive: true }
          }
        }
      });

      expect(productsWithVariants).toHaveLength(1);
      expect(productsWithVariants[0].variants).toHaveLength(1);
      expect(productsWithVariants[0].category.name).toBe('Smartphones');
    });

    test('should query sales with items and customer', async () => {
      const salesWithItems = await prisma.sale.findMany({
        include: {
          customer: true,
          items: {
            include: {
              product: true,
              variant: true
            }
          }
        }
      });

      expect(salesWithItems).toHaveLength(1);
      expect(salesWithItems[0].items).toHaveLength(1);
      expect(salesWithItems[0].customer.name).toBe('Test Customer');
    });

    test('should query inventory status for products', async () => {
      const inventoryStatus = await prisma.product.findMany({
        where: { isActive: true },
        select: {
          name: true,
          stockQuantity: true,
          minStockLevel: true,
          variants: {
            select: {
              name: true,
              stockQuantity: true,
              minStockLevel: true
            }
          }
        }
      });

      expect(inventoryStatus).toHaveLength(1);
      expect(inventoryStatus[0].stockQuantity).toBe(25);
      expect(inventoryStatus[0].variants).toHaveLength(1);
    });
  });
});
