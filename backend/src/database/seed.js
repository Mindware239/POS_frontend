const { sequelize } = require('../config/database');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Product = require('../models/Product');
const Customer = require('../models/Customer');
const Category = require('../models/Category');

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Create sample users
    console.log('👥 Creating sample users...');
    const hashedPassword = await bcrypt.hash('password123', 12);
    
    const users = await User.bulkCreate([
      {
        name: 'Admin User',
        email: 'admin@mindware.com',
        password: hashedPassword,
        role: 'admin',
        isActive: true
      },
      {
        name: 'Cashier 1',
        email: 'cashier1@mindware.com',
        password: hashedPassword,
        role: 'cashier',
        isActive: true
      },
      {
        name: 'Cashier 2',
        email: 'cashier2@mindware.com',
        password: hashedPassword,
        role: 'cashier',
        isActive: true
      },
      {
        name: 'Manager',
        email: 'manager@mindware.com',
        password: hashedPassword,
        role: 'manager',
        isActive: true
      }
    ]);
    
    console.log(`✅ Created ${users.length} users`);
    
    // Create sample categories
    console.log('📂 Creating sample categories...');
    const categories = await Category.bulkCreate([
      { name: 'Electronics', description: 'Electronic devices and accessories' },
      { name: 'Clothing', description: 'Apparel and fashion items' },
      { name: 'Food & Beverages', description: 'Food items and drinks' },
      { name: 'Home & Garden', description: 'Home improvement and garden items' },
      { name: 'Sports & Fitness', description: 'Sports equipment and fitness gear' },
      { name: 'Books & Stationery', description: 'Books, notebooks, and office supplies' }
    ]);
    
    console.log(`✅ Created ${categories.length} categories`);
    
    // Create sample products
    console.log('📦 Creating sample products...');
    const products = await Product.bulkCreate([
      {
        sku: 'ELEC-001',
        barcode: '1234567890123',
        name: 'Wireless Bluetooth Headphones',
        description: 'High-quality wireless headphones with noise cancellation',
        category: 'Electronics',
        brand: 'SoundMax',
        costPrice: 800.00,
        retailPrice: 1299.00,
        wholesalePrice: 1100.00,
        memberPrice: 1199.00,
        taxRate: 18.00,
        hsnCode: '8518',
        currentStock: 50,
        minStockLevel: 10,
        maxStockLevel: 100,
        hasVariants: false,
        isActive: true
      },
      {
        sku: 'CLOTH-001',
        barcode: '9876543210987',
        name: 'Premium Cotton T-Shirt',
        description: 'Comfortable cotton t-shirt in various colors',
        category: 'Clothing',
        brand: 'FashionHub',
        costPrice: 150.00,
        retailPrice: 299.00,
        wholesalePrice: 250.00,
        memberPrice: 279.00,
        taxRate: 5.00,
        hsnCode: '6104',
        currentStock: 100,
        minStockLevel: 20,
        maxStockLevel: 200,
        hasVariants: true,
        variantType: 'color',
        variantValues: ['Red', 'Blue', 'Black', 'White'],
        isActive: true
      },
      {
        sku: 'FOOD-001',
        barcode: '4567891230456',
        name: 'Organic Coffee Beans',
        description: 'Premium organic coffee beans from high-altitude farms',
        category: 'Food & Beverages',
        brand: 'CoffeeCraft',
        costPrice: 200.00,
        retailPrice: 399.00,
        wholesalePrice: 350.00,
        memberPrice: 379.00,
        taxRate: 5.00,
        hsnCode: '0901',
        currentStock: 75,
        minStockLevel: 15,
        maxStockLevel: 150,
        hasVariants: false,
        isActive: true
      },
      {
        sku: 'HOME-001',
        barcode: '7891234560789',
        name: 'LED Desk Lamp',
        description: 'Modern LED desk lamp with adjustable brightness',
        category: 'Home & Garden',
        brand: 'LightPro',
        costPrice: 300.00,
        retailPrice: 599.00,
        wholesalePrice: 500.00,
        memberPrice: 549.00,
        taxRate: 18.00,
        hsnCode: '9405',
        currentStock: 30,
        minStockLevel: 5,
        maxStockLevel: 60,
        hasVariants: false,
        isActive: true
      },
      {
        sku: 'SPORT-001',
        barcode: '3210987654321',
        name: 'Yoga Mat',
        description: 'Non-slip yoga mat for home and studio use',
        category: 'Sports & Fitness',
        brand: 'FitLife',
        costPrice: 120.00,
        retailPrice: 249.00,
        wholesalePrice: 200.00,
        memberPrice: 229.00,
        taxRate: 5.00,
        hsnCode: '6306',
        currentStock: 60,
        minStockLevel: 12,
        maxStockLevel: 120,
        hasVariants: true,
        variantType: 'color',
        variantValues: ['Purple', 'Blue', 'Green', 'Pink'],
        isActive: true
      },
      {
        sku: 'BOOK-001',
        barcode: '6543210987654',
        name: 'Business Strategy Book',
        description: 'Comprehensive guide to modern business strategy',
        category: 'Books & Stationery',
        brand: 'BusinessPress',
        costPrice: 80.00,
        retailPrice: 199.00,
        wholesalePrice: 150.00,
        memberPrice: 179.00,
        taxRate: 0.00,
        hsnCode: '4901',
        currentStock: 25,
        minStockLevel: 5,
        maxStockLevel: 50,
        hasVariants: false,
        isActive: true
      }
    ]);
    
    console.log(`✅ Created ${products.length} products`);
    
    // Create sample customers
    console.log('👤 Creating sample customers...');
    const customers = await Customer.bulkCreate([
      {
        name: 'John Doe',
        phone: '+91-9876543210',
        email: 'john.doe@email.com',
        address: '123 Main Street, City, State 12345',
        loyaltyPoints: 150,
        customerType: 'regular',
        isActive: true
      },
      {
        name: 'Jane Smith',
        phone: '+91-9876543211',
        email: 'jane.smith@email.com',
        address: '456 Oak Avenue, City, State 12345',
        loyaltyPoints: 75,
        customerType: 'regular',
        isActive: true
      },
      {
        name: 'Business Corp',
        phone: '+91-9876543212',
        email: 'orders@businesscorp.com',
        address: '789 Business Park, City, State 12345',
        loyaltyPoints: 500,
        customerType: 'wholesale',
        gstNumber: '22AAAAA0000A1Z5',
        isActive: true
      },
      {
        name: 'VIP Customer',
        phone: '+91-9876543213',
        email: 'vip@email.com',
        address: '321 VIP Lane, City, State 12345',
        loyaltyPoints: 1000,
        customerType: 'vip',
        isActive: true
      }
    ]);
    
    console.log(`✅ Created ${customers.length} customers`);
    
    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📊 Sample data summary:');
    console.log(`   - Users: ${users.length}`);
    console.log(`   - Categories: ${categories.length}`);
    console.log(`   - Products: ${products.length}`);
    console.log(`   - Customers: ${customers.length}`);
    console.log('\n🔑 Default login credentials:');
    console.log('   Email: admin@mindware.com');
    console.log('   Password: password123');
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    process.exit(1);
  }
}

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };
