const { sequelize, testConnection } = require('../config/database');
const Product = require('../models/Product');
const Sale = require('../models/Sale');
const User = require('../models/User');
const Customer = require('../models/Customer');
const Shift = require('../models/Shift');
const Payment = require('../models/Payment');

async function runMigrations() {
  try {
    console.log('🔄 Starting database migrations...');
    
    // Test database connection
    await testConnection();
    
    // Sync all models (this will create tables)
    console.log('📊 Syncing database models...');
    await sequelize.sync({ force: true }); // force: true will drop existing tables
    
    console.log('✅ Database migration completed successfully!');
    console.log('📋 Created tables:');
    console.log('   - users');
    console.log('   - products');
    console.log('   - customers');
    console.log('   - sales');
    console.log('   - sale_items');
    console.log('   - payments');
    console.log('   - shifts');
    console.log('   - returns');
    console.log('   - inventory_logs');
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Database migration failed:', error);
    process.exit(1);
  }
}

// Run migrations if this file is executed directly
if (require.main === module) {
  runMigrations();
}

module.exports = { runMigrations };
