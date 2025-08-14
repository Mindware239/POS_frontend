const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  try {
    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await prisma.loyaltyReward.deleteMany();
    await prisma.saleItem.deleteMany();
    await prisma.sale.deleteMany();
    await prisma.inventoryAdjustment.deleteMany();
    await prisma.variant.deleteMany();
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();
    await prisma.customer.deleteMany();
    await prisma.user.deleteMany();

    console.log('✅ Data cleared successfully');

    // Create users
    console.log('👥 Creating users...');
    const adminPassword = await bcrypt.hash('admin123', 12);
    const managerPassword = await bcrypt.hash('manager123', 12);
    const cashierPassword = await bcrypt.hash('cashier123', 12);

    const admin = await prisma.user.create({
      data: {
        username: 'admin',
        email: 'admin@pos.com',
        passwordHash: adminPassword,
        firstName: 'System',
        lastName: 'Administrator',
        role: 'ADMIN',
        isActive: true
      }
    });

    const manager = await prisma.user.create({
      data: {
        username: 'manager',
        email: 'manager@pos.com',
        passwordHash: managerPassword,
        firstName: 'John',
        lastName: 'Manager',
        role: 'MANAGER',
        isActive: true
      }
    });

    const cashier = await prisma.user.create({
      data: {
        username: 'cashier',
        email: 'cashier@pos.com',
        passwordHash: cashierPassword,
        firstName: 'Sarah',
        lastName: 'Cashier',
        role: 'CASHIER',
        isActive: true
      }
    });

    console.log('✅ Users created successfully');

    // Create categories
    console.log('📂 Creating categories...');
    const electronics = await prisma.category.create({
      data: {
        name: 'Electronics',
        description: 'Electronic devices and accessories',
        slug: 'electronics',
        isActive: true,
        sortOrder: 1,
        createdById: admin.id,
        updatedById: admin.id
      }
    });

    const clothing = await prisma.category.create({
      data: {
        name: 'Clothing',
        description: 'Apparel and fashion items',
        slug: 'clothing',
        isActive: true,
        sortOrder: 2,
        createdById: admin.id,
        updatedById: admin.id
      }
    });

    const home = await prisma.category.create({
      data: {
        name: 'Home & Garden',
        description: 'Home improvement and garden supplies',
        slug: 'home-garden',
        isActive: true,
        sortOrder: 3,
        createdById: admin.id,
        updatedById: admin.id
      }
    });

    // Create subcategories
    const smartphones = await prisma.category.create({
      data: {
        name: 'Smartphones',
        description: 'Mobile phones and accessories',
        slug: 'smartphones',
        parentId: electronics.id,
        isActive: true,
        sortOrder: 1,
        createdById: admin.id,
        updatedById: admin.id
      }
    });

    const laptops = await prisma.category.create({
      data: {
        name: 'Laptops',
        description: 'Portable computers and accessories',
        slug: 'laptops',
        parentId: electronics.id,
        isActive: true,
        sortOrder: 2,
        createdById: admin.id,
        updatedById: admin.id
      }
    });

    console.log('✅ Categories created successfully');

    // Create products
    console.log('📦 Creating products...');
    const product1 = await prisma.product.create({
      data: {
        name: 'iPhone 15 Pro',
        description: 'Latest iPhone with advanced camera system and A17 Pro chip',
        sku: 'IPHONE-15-PRO-001',
        barcode: '1234567890123',
        price: 999.99,
        costPrice: 750.00,
        comparePrice: 1099.99,
        weight: 0.187,
        dimensions: '5.8x2.8x0.32',
        isActive: true,
        isFeatured: true,
        tags: JSON.stringify(['smartphone', 'apple', '5g', 'camera']),
        imageUrl: 'https://example.com/iphone15pro.jpg',
        aiGeneratedImageUrl: 'https://example.com/ai-iphone15pro.jpg',
        stockQuantity: 25,
        minStockLevel: 5,
        maxStockLevel: 100,
        lowStockAlert: true,
        categoryId: smartphones.id,
        createdById: admin.id,
        updatedById: admin.id
      }
    });

    const product2 = await prisma.product.create({
      data: {
        name: 'MacBook Air M2',
        description: 'Lightweight laptop with M2 chip for productivity',
        sku: 'MACBOOK-AIR-M2-001',
        barcode: '1234567890124',
        price: 1199.99,
        costPrice: 900.00,
        comparePrice: 1299.99,
        weight: 1.24,
        dimensions: '11.97x8.46x0.44',
        isActive: true,
        isFeatured: true,
        tags: JSON.stringify(['laptop', 'apple', 'm2', 'ultrabook']),
        imageUrl: 'https://example.com/macbook-air-m2.jpg',
        aiGeneratedImageUrl: 'https://example.com/ai-macbook-air-m2.jpg',
        stockQuantity: 15,
        minStockLevel: 3,
        maxStockLevel: 50,
        lowStockAlert: true,
        categoryId: laptops.id,
        createdById: admin.id,
        updatedById: admin.id
      }
    });

    const product3 = await prisma.product.create({
      data: {
        name: 'Wireless Earbuds Pro',
        description: 'Premium wireless earbuds with noise cancellation',
        sku: 'EARBUDS-PRO-001',
        barcode: '1234567890125',
        price: 249.99,
        costPrice: 180.00,
        comparePrice: 299.99,
        weight: 0.045,
        dimensions: '1.2x0.8x0.9',
        isActive: true,
        isFeatured: false,
        tags: JSON.stringify(['earbuds', 'wireless', 'noise-cancellation', 'bluetooth']),
        imageUrl: 'https://example.com/earbuds-pro.jpg',
        aiGeneratedImageUrl: 'https://example.com/ai-earbuds-pro.jpg',
        stockQuantity: 50,
        minStockLevel: 10,
        maxStockLevel: 200,
        lowStockAlert: true,
        categoryId: electronics.id,
        createdById: admin.id,
        updatedById: admin.id
      }
    });

    const product4 = await prisma.product.create({
      data: {
        name: 'Premium T-Shirt',
        description: 'High-quality cotton t-shirt with modern fit',
        sku: 'TSHIRT-PREMIUM-001',
        barcode: '1234567890126',
        price: 29.99,
        costPrice: 15.00,
        comparePrice: 39.99,
        weight: 0.2,
        dimensions: '28x20x0.1',
        isActive: true,
        isFeatured: false,
        tags: JSON.stringify(['clothing', 't-shirt', 'cotton', 'casual']),
        imageUrl: 'https://example.com/tshirt-premium.jpg',
        aiGeneratedImageUrl: 'https://example.com/ai-tshirt-premium.jpg',
        stockQuantity: 100,
        minStockLevel: 20,
        maxStockLevel: 500,
        lowStockAlert: true,
        categoryId: clothing.id,
        createdById: admin.id,
        updatedById: admin.id
      }
    });

    const product5 = await prisma.product.create({
      data: {
        name: 'Garden Tool Set',
        description: 'Complete set of essential garden tools',
        sku: 'GARDEN-TOOLS-001',
        barcode: '1234567890127',
        price: 89.99,
        costPrice: 60.00,
        comparePrice: 119.99,
        weight: 2.5,
        dimensions: '30x20x15',
        isActive: true,
        isFeatured: false,
        tags: JSON.stringify(['garden', 'tools', 'outdoor', 'maintenance']),
        imageUrl: 'https://example.com/garden-tools.jpg',
        aiGeneratedImageUrl: 'https://example.com/ai-garden-tools.jpg',
        stockQuantity: 30,
        minStockLevel: 5,
        maxStockLevel: 100,
        lowStockAlert: true,
        categoryId: home.id,
        createdById: admin.id,
        updatedById: admin.id
      }
    });

    console.log('✅ Products created successfully');

    // Create variants
    console.log('🎨 Creating product variants...');
    const iphoneVariant1 = await prisma.variant.create({
      data: {
        productId: product1.id,
        sku: 'IPHONE-15-PRO-128GB-BLACK',
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

    const iphoneVariant2 = await prisma.variant.create({
      data: {
        productId: product1.id,
        sku: 'IPHONE-15-PRO-256GB-BLUE',
        name: '256GB Blue',
        attributes: JSON.stringify({ storage: '256GB', color: 'Blue' }),
        price: 1099.99,
        costPrice: 800.00,
        stockQuantity: 15,
        minStockLevel: 3,
        maxStockLevel: 40,
        isActive: true
      }
    });

    const tshirtVariant1 = await prisma.variant.create({
      data: {
        productId: product4.id,
        sku: 'TSHIRT-PREMIUM-S-BLACK',
        name: 'Small Black',
        attributes: JSON.stringify({ size: 'S', color: 'Black' }),
        price: 29.99,
        costPrice: 15.00,
        stockQuantity: 25,
        minStockLevel: 5,
        maxStockLevel: 100,
        isActive: true
      }
    });

    const tshirtVariant2 = await prisma.variant.create({
      data: {
        productId: product4.id,
        sku: 'TSHIRT-PREMIUM-M-WHITE',
        name: 'Medium White',
        attributes: JSON.stringify({ size: 'M', color: 'White' }),
        price: 29.99,
        costPrice: 15.00,
        stockQuantity: 30,
        minStockLevel: 5,
        maxStockLevel: 100,
        isActive: true
      }
    });

    console.log('✅ Variants created successfully');

    // Create customers
    console.log('👤 Creating customers...');
    const customer1 = await prisma.customer.create({
      data: {
        name: 'Alice Johnson',
        email: 'alice.johnson@email.com',
        phone: '+1-555-0101',
        address: '123 Main St',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'USA',
        loyaltyPoints: 150,
        totalSpent: 1250.00,
        isActive: true,
        notes: 'Premium customer, prefers premium products'
      }
    });

    const customer2 = await prisma.customer.create({
      data: {
        name: 'Bob Smith',
        email: 'bob.smith@email.com',
        phone: '+1-555-0102',
        address: '456 Oak Ave',
        city: 'Los Angeles',
        state: 'CA',
        zipCode: '90210',
        country: 'USA',
        loyaltyPoints: 75,
        totalSpent: 450.00,
        isActive: true,
        notes: 'Budget-conscious customer'
      }
    });

    console.log('✅ Customers created successfully');

    // Create sample sales
    console.log('💰 Creating sample sales...');
    const sale1 = await prisma.sale.create({
      data: {
        invoiceNumber: 'INV-001',
        customerId: customer1.id,
        userId: cashier.id,
        subtotal: 999.99,
        taxAmount: 89.99,
        discountAmount: 50.00,
        totalAmount: 1039.98,
        paymentMethod: 'CARD',
        paymentStatus: 'COMPLETED',
        saleStatus: 'COMPLETED',
        notes: 'Customer was very satisfied with the product',
        saleDate: new Date('2024-01-15T10:30:00Z')
      }
    });

    const sale2 = await prisma.sale.create({
      data: {
        invoiceNumber: 'INV-002',
        customerId: customer2.id,
        userId: cashier.id,
        subtotal: 59.98,
        taxAmount: 5.40,
        discountAmount: 0,
        totalAmount: 65.38,
        paymentMethod: 'CASH',
        paymentStatus: 'COMPLETED',
        saleStatus: 'COMPLETED',
        notes: 'Quick sale, no issues',
        saleDate: new Date('2024-01-16T14:15:00Z')
      }
    });

    console.log('✅ Sales created successfully');

    // Create sale items
    console.log('📋 Creating sale items...');
    await prisma.saleItem.create({
      data: {
        saleId: sale1.id,
        productId: product1.id,
        variantId: iphoneVariant1.id,
        quantity: 1,
        unitPrice: 999.99,
        totalPrice: 999.99,
        discount: 50.00
      }
    });

    await prisma.saleItem.create({
      data: {
        saleId: sale2.id,
        productId: product4.id,
        variantId: tshirtVariant1.id,
        quantity: 2,
        unitPrice: 29.99,
        totalPrice: 59.98,
        discount: 0
      }
    });

    console.log('✅ Sale items created successfully');

    // Create inventory adjustments
    console.log('📊 Creating inventory adjustments...');
    await prisma.inventoryAdjustment.create({
      data: {
        productId: product1.id,
        variantId: iphoneVariant1.id,
        quantityChange: -1,
        previousStock: 11,
        newStock: 10,
        reason: 'SALE',
        notes: 'Sold to Alice Johnson',
        adjustedById: cashier.id
      }
    });

    await prisma.inventoryAdjustment.create({
      data: {
        productId: product4.id,
        variantId: tshirtVariant1.id,
        quantityChange: -2,
        previousStock: 27,
        newStock: 25,
        reason: 'SALE',
        notes: 'Sold to Bob Smith',
        adjustedById: cashier.id
      }
    });

    console.log('✅ Inventory adjustments created successfully');

    // Create loyalty rewards
    console.log('🎁 Creating loyalty rewards...');
    await prisma.loyaltyReward.create({
      data: {
        customerId: customer1.id,
        saleId: sale1.id,
        pointsUsed: 0,
        rewardType: 'POINTS_MULTIPLIER',
        rewardValue: 100,
        description: 'Earned 100 points for iPhone 15 Pro purchase',
        isRedeemed: false,
        expiresAt: new Date('2025-01-15T23:59:59Z')
      }
    });

    await prisma.loyaltyReward.create({
      data: {
        customerId: customer2.id,
        saleId: sale2.id,
        pointsUsed: 0,
        rewardType: 'POINTS_MULTIPLIER',
        rewardValue: 20,
        description: 'Earned 20 points for T-shirt purchase',
        isRedeemed: false,
        expiresAt: new Date('2025-01-16T23:59:59Z')
      }
    });

    console.log('✅ Loyalty rewards created successfully');

    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📊 Summary of created data:');
    console.log(`   👥 Users: 3 (Admin, Manager, Cashier)`);
    console.log(`   📂 Categories: 5 (including subcategories)`);
    console.log(`   📦 Products: 5 (with variants)`);
    console.log(`   🎨 Variants: 4`);
    console.log(`   👤 Customers: 2`);
    console.log(`   💰 Sales: 2`);
    console.log(`   📋 Sale Items: 2`);
    console.log(`   📊 Inventory Adjustments: 2`);
    console.log(`   🎁 Loyalty Rewards: 2`);

    console.log('\n🔑 Default login credentials:');
    console.log(`   Admin: admin / admin123`);
    console.log(`   Manager: manager / manager123`);
    console.log(`   Cashier: cashier / cashier123`);

  } catch (error) {
    console.error('❌ Error during seeding:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  });
