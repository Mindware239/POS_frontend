const express = require('express');
const Joi = require('joi');
const { PrismaClient } = require('@prisma/client');
const { authenticateToken, requireRole } = require('../middleware/auth');
const { logger } = require('../utils/logger');

const router = express.Router();
const prisma = new PrismaClient();

// Validation schemas
const customerSchema = Joi.object({
  name: Joi.string().min(1).max(255).required(),
  email: Joi.string().email().max(255).optional(),
  phone: Joi.string().max(20).optional(),
  address: Joi.string().max(500).optional(),
  city: Joi.string().max(100).optional(),
  state: Joi.string().max(100).optional(),
  zipCode: Joi.string().max(20).optional(),
  country: Joi.string().max(100).optional(),
  dateOfBirth: Joi.date().max('now').optional(),
  loyaltyPoints: Joi.number().integer().min(0).default(0),
  totalSpent: Joi.number().min(0).precision(2).default(0),
  isActive: Joi.boolean().default(true),
  notes: Joi.string().max(1000).optional()
});

const loyaltyRewardSchema = Joi.object({
  pointsUsed: Joi.number().integer().min(0).required(),
  rewardType: Joi.string().valid('DISCOUNT', 'FREE_PRODUCT', 'CASHBACK', 'POINTS_MULTIPLIER').required(),
  rewardValue: Joi.number().positive().precision(2).required(),
  description: Joi.string().min(1).max(500).required(),
  expiresAt: Joi.date().min('now').optional()
});

// GET /api/customers - Get all customers with pagination and filters
router.get('/', authenticateToken, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search,
      isActive,
      minLoyaltyPoints,
      maxLoyaltyPoints,
      minTotalSpent,
      maxTotalSpent,
      sortBy = 'name',
      sortOrder = 'asc'
    } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Build where clause
    const where = {};
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (isActive !== undefined) where.isActive = isActive === 'true';
    if (minLoyaltyPoints) where.loyaltyPoints = { gte: parseInt(minLoyaltyPoints) };
    if (maxLoyaltyPoints) where.loyaltyPoints = { ...where.loyaltyPoints, lte: parseInt(maxLoyaltyPoints) };
    if (minTotalSpent) where.totalSpent = { gte: parseFloat(minTotalSpent) };
    if (maxTotalSpent) where.totalSpent = { ...where.totalSpent, lte: parseFloat(maxTotalSpent) };

    // Build order by
    const orderBy = {};
    orderBy[sortBy] = sortOrder;

    const [customers, total] = await Promise.all([
      prisma.customer.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          city: true,
          state: true,
          loyaltyPoints: true,
          totalSpent: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: { sales: true }
          }
        },
        orderBy,
        skip,
        take: limitNum
      }),
      prisma.customer.count({ where })
    ]);

    // Calculate customer metrics
    const customerMetrics = await prisma.$transaction(async (tx) => {
      const totalCustomers = await tx.customer.count({ where: { isActive: true } });
      const totalLoyaltyPoints = await tx.customer.aggregate({
        where: { isActive: true },
        _sum: { loyaltyPoints: true }
      });
      const totalRevenue = await tx.customer.aggregate({
        where: { isActive: true },
        _sum: { totalSpent: true }
      });
      const averageLoyaltyPoints = totalCustomers > 0 ? (totalLoyaltyPoints._sum.loyaltyPoints || 0) / totalCustomers : 0;
      const averageTotalSpent = totalCustomers > 0 ? (totalRevenue._sum.totalSpent || 0) / totalCustomers : 0;

      return {
        totalCustomers,
        totalLoyaltyPoints: totalLoyaltyPoints._sum.loyaltyPoints || 0,
        totalRevenue: totalRevenue._sum.totalSpent || 0,
        averageLoyaltyPoints: Math.round(averageLoyaltyPoints * 100) / 100,
        averageTotalSpent: Math.round(averageTotalSpent * 100) / 100
      };
    });

    logger.info(`Customers retrieved successfully`, {
      userId: req.user.id,
      count: customers.length,
      total,
      page: pageNum
    });

    res.json({
      success: true,
      data: {
        customers: customers.map(customer => ({
          ...customer,
          orderCount: customer._count.sales
        })),
        metrics: customerMetrics
      },
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    });

  } catch (error) {
    logger.error('Error retrieving customers:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve customers',
      message: error.message
    });
  }
});

// GET /api/customers/:id - Get customer by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const customer = await prisma.customer.findUnique({
      where: { id },
      include: {
        sales: {
          take: 10,
          orderBy: { saleDate: 'desc' },
          select: {
            id: true,
            invoiceNumber: true,
            totalAmount: true,
            saleDate: true,
            paymentMethod: true,
            saleStatus: true
          }
        },
        loyaltyRewards: {
          take: 10,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            pointsUsed: true,
            rewardType: true,
            rewardValue: true,
            description: true,
            isRedeemed: true,
            expiresAt: true,
            createdAt: true
          }
        }
      }
    });

    if (!customer) {
      return res.status(404).json({
        success: false,
        error: 'Customer not found'
      });
    }

    logger.info(`Customer retrieved successfully`, {
      userId: req.user.id,
      customerId: id
    });

    res.json({
      success: true,
      data: customer
    });

  } catch (error) {
    logger.error('Error retrieving customer:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve customer',
      message: error.message
    });
  }
});

// POST /api/customers - Create new customer
router.post('/', authenticateToken, requireRole(['ADMIN', 'MANAGER', 'CASHIER']), async (req, res) => {
  try {
    const { error: validationError, value: validatedData } = customerSchema.validate(req.body);
    if (validationError) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: validationError.details
      });
    }

    // Check if email already exists (if provided)
    if (validatedData.email) {
      const existingCustomer = await prisma.customer.findUnique({
        where: { email: validatedData.email }
      });

      if (existingCustomer) {
        return res.status(400).json({
          success: false,
          error: 'Email already exists'
        });
      }
    }

    // Create customer
    const customer = await prisma.customer.create({
      data: validatedData
    });

    logger.info(`Customer created successfully`, {
      userId: req.user.id,
      customerId: customer.id,
      customerName: customer.name
    });

    res.status(201).json({
      success: true,
      message: 'Customer created successfully',
      data: customer
    });

  } catch (error) {
    logger.error('Error creating customer:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create customer',
      message: error.message
    });
  }
});

// PUT /api/customers/:id - Update customer
router.put('/:id', authenticateToken, requireRole(['ADMIN', 'MANAGER', 'CASHIER']), async (req, res) => {
  try {
    const { id } = req.params;
    const { error: validationError, value: validatedData } = customerSchema.validate(req.body);
    
    if (validationError) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: validationError.details
      });
    }

    // Check if customer exists
    const existingCustomer = await prisma.customer.findUnique({
      where: { id }
    });

    if (!existingCustomer) {
      return res.status(404).json({
        success: false,
        error: 'Customer not found'
      });
    }

    // Check if new email conflicts with other customers
    if (validatedData.email && validatedData.email !== existingCustomer.email) {
      const emailConflict = await prisma.customer.findUnique({
        where: { email: validatedData.email }
      });

      if (emailConflict) {
        return res.status(400).json({
          success: false,
          error: 'Email already exists'
        });
      }
    }

    // Update customer
    const customer = await prisma.customer.update({
      where: { id },
      data: validatedData
    });

    logger.info(`Customer updated successfully`, {
      userId: req.user.id,
      customerId: id,
      customerName: customer.name
    });

    res.json({
      success: true,
      message: 'Customer updated successfully',
      data: customer
    });

  } catch (error) {
    logger.error('Error updating customer:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update customer',
      message: error.message
    });
  }
});

// DELETE /api/customers/:id - Soft delete customer
router.delete('/:id', authenticateToken, requireRole(['ADMIN']), async (req, res) => {
  try {
    const { id } = req.params;

    // Check if customer exists
    const customer = await prisma.customer.findUnique({
      where: { id }
    });

    if (!customer) {
      return res.status(404).json({
        success: false,
        error: 'Customer not found'
      });
    }

    // Check if customer has active sales
    const activeSales = await prisma.sale.findFirst({
      where: { customerId: id }
    });

    if (activeSales) {
      return res.status(400).json({
        success: false,
        error: 'Cannot delete customer with sales history'
      });
    }

    // Soft delete customer
    await prisma.customer.update({
      where: { id },
      data: { isActive: false }
    });

    logger.info(`Customer soft deleted successfully`, {
      userId: req.user.id,
      customerId: id,
      customerName: customer.name
    });

    res.json({
      success: true,
      message: 'Customer deleted successfully'
    });

  } catch (error) {
    logger.error('Error deleting customer:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete customer',
      message: error.message
    });
  }
});

// POST /api/customers/:id/loyalty - Add loyalty reward
router.post('/:id/loyalty', authenticateToken, requireRole(['ADMIN', 'MANAGER']), async (req, res) => {
  try {
    const { id: customerId } = req.params;
    const { error: validationError, value: validatedData } = loyaltyRewardSchema.validate(req.body);
    
    if (validationError) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: validationError.details
      });
    }

    // Check if customer exists
    const customer = await prisma.customer.findUnique({
      where: { id: customerId }
    });

    if (!customer) {
      return res.status(404).json({
        success: false,
        error: 'Customer not found'
      });
    }

    // Validate points usage
    if (validatedData.pointsUsed > customer.loyaltyPoints) {
      return res.status(400).json({
        success: false,
        error: 'Insufficient loyalty points'
      });
    }

    // Create loyalty reward
    const loyaltyReward = await prisma.loyaltyReward.create({
      data: {
        ...validatedData,
        customerId,
        isRedeemed: false
      }
    });

    // Update customer loyalty points
    await prisma.customer.update({
      where: { id: customerId },
      data: {
        loyaltyPoints: { decrement: validatedData.pointsUsed }
      }
    });

    logger.info(`Loyalty reward created successfully`, {
      userId: req.user.id,
      customerId,
      customerName: customer.name,
      rewardId: loyaltyReward.id
    });

    res.status(201).json({
      success: true,
      message: 'Loyalty reward created successfully',
      data: loyaltyReward
    });

  } catch (error) {
    logger.error('Error creating loyalty reward:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create loyalty reward',
      message: error.message
    });
  }
});

// GET /api/customers/:id/loyalty - Get customer loyalty rewards
router.get('/:id/loyalty', authenticateToken, async (req, res) => {
  try {
    const { id: customerId } = req.params;
    const { page = 1, limit = 20, isRedeemed } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Build where clause
    const where = { customerId };
    if (isRedeemed !== undefined) where.isRedeemed = isRedeemed === 'true';

    const [rewards, total] = await Promise.all([
      prisma.loyaltyReward.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limitNum
      }),
      prisma.loyaltyReward.count({ where })
    ]);

    logger.info(`Customer loyalty rewards retrieved successfully`, {
      userId: req.user.id,
      customerId,
      count: rewards.length
    });

    res.json({
      success: true,
      data: rewards,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    });

  } catch (error) {
    logger.error('Error retrieving customer loyalty rewards:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve loyalty rewards',
      message: error.message
    });
  }
});

// PATCH /api/customers/:id/loyalty/:rewardId - Redeem loyalty reward
router.patch('/:id/loyalty/:rewardId', authenticateToken, requireRole(['ADMIN', 'MANAGER', 'CASHIER']), async (req, res) => {
  try {
    const { id: customerId, rewardId } = req.params;

    // Check if customer exists
    const customer = await prisma.customer.findUnique({
      where: { id: customerId }
    });

    if (!customer) {
      return res.status(404).json({
        success: false,
        error: 'Customer not found'
      });
    }

    // Check if loyalty reward exists and belongs to customer
    const loyaltyReward = await prisma.loyaltyReward.findFirst({
      where: {
        id: rewardId,
        customerId
      }
    });

    if (!loyaltyReward) {
      return res.status(404).json({
        success: false,
        error: 'Loyalty reward not found'
      });
    }

    if (loyaltyReward.isRedeemed) {
      return res.status(400).json({
        success: false,
        error: 'Loyalty reward already redeemed'
      });
    }

    if (loyaltyReward.expiresAt && loyaltyReward.expiresAt < new Date()) {
      return res.status(400).json({
        success: false,
        error: 'Loyalty reward has expired'
      });
    }

    // Mark reward as redeemed
    const updatedReward = await prisma.loyaltyReward.update({
      where: { id: rewardId },
      data: {
        isRedeemed: true,
        redeemedAt: new Date()
      }
    });

    logger.info(`Loyalty reward redeemed successfully`, {
      userId: req.user.id,
      customerId,
      customerName: customer.name,
      rewardId
    });

    res.json({
      success: true,
      message: 'Loyalty reward redeemed successfully',
      data: updatedReward
    });

  } catch (error) {
    logger.error('Error redeeming loyalty reward:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to redeem loyalty reward',
      message: error.message
    });
  }
});

// GET /api/customers/search/quick - Quick customer search
router.get('/search/quick', authenticateToken, async (req, res) => {
  try {
    const { q, limit = 10 } = req.query;

    if (!q || q.length < 2) {
      return res.status(400).json({
        success: false,
        error: 'Search query must be at least 2 characters long'
      });
    }

    const customers = await prisma.customer.findMany({
      where: {
        isActive: true,
        OR: [
          { name: { contains: q, mode: 'insensitive' } },
          { email: { contains: q, mode: 'insensitive' } },
          { phone: { contains: q, mode: 'insensitive' } }
        ]
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        loyaltyPoints: true,
        totalSpent: true
      },
      orderBy: { name: 'asc' },
      take: parseInt(limit)
    });

    logger.info(`Quick customer search completed`, {
      userId: req.user.id,
      query: q,
      results: customers.length
    });

    res.json({
      success: true,
      data: customers
    });

  } catch (error) {
    logger.error('Error performing quick customer search:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to perform customer search',
      message: error.message
    });
  }
});

// GET /api/customers/export - Export customers data
router.get('/export', authenticateToken, requireRole(['ADMIN', 'MANAGER']), async (req, res) => {
  try {
    const { format = 'json' } = req.query;

    const customers = await prisma.customer.findMany({
      where: { isActive: true },
      include: {
        _count: {
          select: { sales: true }
        }
      },
      orderBy: { name: 'asc' }
    });

    if (format === 'csv') {
      // Generate CSV format
      const csvData = customers.map(customer => ({
        'Customer Name': customer.name,
        'Email': customer.email || '',
        'Phone': customer.phone || '',
        'Address': customer.address || '',
        'City': customer.city || '',
        'State': customer.state || '',
        'Zip Code': customer.zipCode || '',
        'Country': customer.country || '',
        'Loyalty Points': customer.loyaltyPoints,
        'Total Spent': customer.totalSpent,
        'Order Count': customer._count.sales,
        'Customer Since': customer.createdAt.toISOString().split('T')[0]
      }));

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="customers-export.csv"');
      
      // Convert to CSV string
      const headers = Object.keys(csvData[0]);
      const csvString = [
        headers.join(','),
        ...csvData.map(row => headers.map(header => `"${row[header]}"`).join(','))
      ].join('\n');

      res.send(csvString);
    } else {
      // Return JSON format
      res.json({
        success: true,
        data: customers,
        exportDate: new Date().toISOString(),
        totalCustomers: customers.length
      });
    }

    logger.info(`Customer export completed successfully`, {
      userId: req.user.id,
      format,
      customerCount: customers.length
    });

  } catch (error) {
    logger.error('Error exporting customers:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to export customers',
      message: error.message
    });
  }
});

module.exports = router;
