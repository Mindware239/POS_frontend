# 🗄️ Database Schema Documentation

This document describes the comprehensive database schema for the POS system built with Prisma ORM and SQLite.

## 📊 Database Overview

The POS system uses a relational database design optimized for:
- **Scalability**: Supports 100+ concurrent users
- **Performance**: Efficient queries with proper indexing
- **Data Integrity**: Foreign key constraints and validation
- **Flexibility**: JSON fields for extensible attributes

## 🏗️ Schema Architecture

### Core Models

#### 1. User Management
- **User**: Authentication, roles, and permissions
- **Role-based Access Control**: ADMIN, MANAGER, CASHIER

#### 2. Product Catalog
- **Category**: Hierarchical product categorization
- **Product**: Core product information with AI image support
- **Variant**: Product variations (size, color, storage, etc.)

#### 3. Inventory Management
- **InventoryAdjustment**: Track all stock changes
- **Stock Levels**: Min/max thresholds with alerts

#### 4. Sales Processing
- **Sale**: Complete sales transactions
- **SaleItem**: Individual items in sales
- **Payment Tracking**: Multiple payment methods and statuses

#### 5. Customer Management
- **Customer**: Customer profiles and contact information
- **LoyaltyReward**: Points system and rewards

## 🔗 Relationships

```
User (1) ←→ (Many) Sale
User (1) ←→ (Many) Product (as creator/updater)
User (1) ←→ (Many) Category (as creator/updater)
User (1) ←→ (Many) InventoryAdjustment

Category (1) ←→ (Many) Product
Category (1) ←→ (Many) Category (self-referencing hierarchy)

Product (1) ←→ (Many) Variant
Product (1) ←→ (Many) SaleItem
Product (1) ←→ (Many) InventoryAdjustment

Variant (1) ←→ (Many) SaleItem
Variant (1) ←→ (Many) InventoryAdjustment

Sale (1) ←→ (Many) SaleItem
Sale (1) ←→ (Many) LoyaltyReward

Customer (1) ←→ (Many) Sale
Customer (1) ←→ (Many) LoyaltyReward
```

## 📋 Model Details

### User Model
```prisma
model User {
  id           String   @id @default(cuid())
  username     String   @unique
  email        String   @unique
  passwordHash String
  firstName    String
  lastName     String
  role         UserRole @default(CASHIER)
  isActive     Boolean  @default(true)
  lastLogin    DateTime?
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}
```

**Key Features:**
- Unique username and email constraints
- Role-based access control
- Password hashing with bcrypt
- Activity tracking and timestamps

### Category Model
```prisma
model Category {
  id          String   @id @default(cuid())
  name        String
  description String?
  slug        String   @unique
  parentId    String?
  parent      Category? @relation("CategoryHierarchy", fields: [parentId], references: [id])
  children    Category[] @relation("CategoryHierarchy")
  isActive    Boolean  @default(true)
  sortOrder   Int      @default(0)
}
```

**Key Features:**
- Hierarchical structure (parent-child relationships)
- SEO-friendly slugs
- Sort ordering for display
- Soft deletion with isActive flag

### Product Model
```prisma
model Product {
  id          String   @id @default(cuid())
  name        String
  description String?
  sku         String   @unique
  barcode     String?  @unique
  price       Float
  costPrice   Float
  comparePrice Float?
  weight      Float?
  dimensions  String?
  isActive    Boolean  @default(true)
  isFeatured  Boolean  @default(false)
  tags        String   // JSON string of tags
  imageUrl    String?
  aiGeneratedImageUrl String?
  stockQuantity Int    @default(0)
  minStockLevel Int    @default(10)
  maxStockLevel Int?
  lowStockAlert Boolean @default(true)
}
```

**Key Features:**
- Unique SKU and barcode constraints
- AI-generated image support
- Comprehensive inventory tracking
- Tag system for categorization
- Stock level monitoring

### Variant Model
```prisma
model Variant {
  id          String   @id @default(cuid())
  productId   String
  product     Product  @relation(fields: [productId], references: [id])
  sku         String   @unique
  name        String
  attributes  String   // JSON string of attributes
  price       Float?
  costPrice   Float?
  stockQuantity Int    @default(0)
  minStockLevel Int    @default(5)
  maxStockLevel Int?
  isActive    Boolean  @default(true)
}
```

**Key Features:**
- Flexible attribute system (JSON)
- Individual stock tracking per variant
- Override pricing from base product
- Unique SKU per variant

### Sale Model
```prisma
model Sale {
  id            String   @id @default(cuid())
  invoiceNumber String   @unique
  customerId    String?
  customer      Customer? @relation(fields: [customerId], references: [id])
  userId        String
  user          User     @relation(fields: [userId], references: [id])
  subtotal      Float
  taxAmount     Float
  discountAmount Float   @default(0)
  totalAmount   Float
  paymentMethod PaymentMethod
  paymentStatus PaymentStatus @default(PENDING)
  saleStatus    SaleStatus @default(COMPLETED)
  notes         String?
  saleDate      DateTime @default(now())
}
```

**Key Features:**
- Unique invoice numbers
- Comprehensive payment tracking
- Multiple payment methods
- Sales status management
- Customer and user associations

## 🚀 Database Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Generate Prisma Client
```bash
npm run db:generate
```

### 3. Create Database
```bash
npm run db:push
```

### 4. Seed with Sample Data
```bash
npm run db:seed
```

### 5. View Database (Optional)
```bash
npm run db:studio
```

## 🧪 Testing the Schema

### Run Database Tests
```bash
npm test
```

### Run Tests with Coverage
```bash
npm run test:coverage
```

### Watch Mode for Development
```bash
npm run test:watch
```

## 🔄 Database Operations

### Reset Database
```bash
npm run db:reset
```
This will:
1. Drop all tables
2. Recreate the schema
3. Seed with sample data

### Generate Prisma Client
```bash
npm run db:generate
```
Required after schema changes.

### Push Schema Changes
```bash
npm run db:push
```
Applies schema changes to database.

## 📊 Sample Data

The seed script creates:

- **3 Users**: Admin, Manager, Cashier
- **5 Categories**: Electronics, Clothing, Home & Garden (with subcategories)
- **5 Products**: iPhone, MacBook, Earbuds, T-Shirt, Garden Tools
- **4 Variants**: Different sizes, colors, and storage options
- **2 Customers**: Sample customer profiles
- **2 Sales**: Sample transactions with items
- **2 Inventory Adjustments**: Stock change tracking
- **2 Loyalty Rewards**: Points and rewards system

## 🔑 Default Credentials

After seeding:
- **Admin**: `admin` / `admin123`
- **Manager**: `manager` / `manager123`
- **Cashier**: `cashier` / `cashier123`

## 🚨 Important Notes

### Data Types
- **JSON Fields**: Tags and attributes are stored as JSON strings
- **Timestamps**: All models include createdAt/updatedAt
- **Soft Deletion**: Use isActive flag instead of hard deletion

### Constraints
- **Unique Fields**: SKU, barcode, invoice numbers, usernames, emails
- **Foreign Keys**: All relationships are properly constrained
- **Cascading**: Deletions are handled carefully to maintain data integrity

### Performance
- **Indexing**: Prisma automatically creates indexes for foreign keys
- **Queries**: Use include for efficient relationship loading
- **Pagination**: Implement for large datasets

## 🔮 Future Enhancements

- **Multi-tenancy**: Support for multiple stores
- **Audit Trail**: Comprehensive change logging
- **Data Archiving**: Historical data management
- **Advanced Analytics**: Complex reporting queries
- **Real-time Sync**: WebSocket integration for live updates

## 🆘 Troubleshooting

### Common Issues

1. **Prisma Client Not Generated**
   ```bash
   npm run db:generate
   ```

2. **Database Connection Error**
   - Check `.env` file for DATABASE_URL
   - Ensure SQLite file path is correct

3. **Schema Validation Errors**
   - Run `npm run db:push` to apply changes
   - Check for syntax errors in schema.prisma

4. **Test Failures**
   - Ensure database is seeded: `npm run db:seed`
   - Check for conflicting data in test database

### Getting Help

- Check Prisma documentation: https://pris.ly/docs
- Review test files for usage examples
- Check server logs for detailed error messages
