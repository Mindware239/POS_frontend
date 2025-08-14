const express = require('express');
const Joi = require('joi');
const { PrismaClient } = require('@prisma/client');
const { authenticateToken, requireRole } = require('../middleware/auth');
const { logger } = require('../utils/logger');

const router = express.Router();
const prisma = new PrismaClient();

// Validation schemas
const dateRangeSchema = Joi.object({
  startDate: Joi.date().required(),
  endDate: Joi.date().min(Joi.ref('startDate')).required(),
  groupBy: Joi.string().valid('day', 'week', 'month', 'quarter', 'year').default('day')
});

const inventoryReportSchema = Joi.object({
  categoryId: Joi.string().optional(),
  lowStock: Joi.boolean().default(false),
  outOfStock: Joi.boolean().default(false),
  sortBy: Joi.string().valid('stockQuantity', 'value', 'name', 'category').default('stockQuantity'),
  sortOrder: Joi.string().valid('asc', 'desc').default('asc')
});

// Helper function to get date range for different periods
const getDateRange = (period) => {
  const now = new Date();
  const startDate = new Date();
  
  switch (period) {
    case 'today':
      startDate.setHours(0, 0, 0, 0);
      return { startDate, endDate: now };
    case 'yesterday':
      startDate.setDate(startDate.getDate() - 1);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(startDate);
      endDate.setHours(23, 59, 59, 999);
      return { startDate, endDate };
    case 'week':
      startDate.setDate(startDate.getDate() - 7);
      return { startDate, endDate: now };
    case 'month':
      startDate.setMonth(startDate.getMonth() - 1);
      return { startDate, endDate: now };
    case 'quarter':
      startDate.setMonth(startDate.getMonth() - 3);
      return { startDate, endDate: now };
    case 'year':
      startDate.setFullYear(startDate.getFullYear() - 1);
      return { startDate, endDate: now };
    default:
      startDate.setDate(startDate.getDate() - 30);
      return { startDate, endDate: now };
  }
};

// GET /api/reports/sales - Sales reports with date range and grouping
router.get('/sales', authenticateToken, async (req, res) => {
  try {
    const { error: validationError, value: validatedData } = dateRangeSchema.validate(req.query);
    if (validationError) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: validationError.details
      });
    }

    const { startDate, endDate, groupBy } = validatedData;

    // Get sales summary
    const salesSummary = await prisma.$transaction(async (tx) => {
      const totalSales = await tx.sale.count({
        where: {
          saleDate: { gte: startDate, lte: endDate },
          saleStatus: 'COMPLETED'
        }
      });

      const totalRevenue = await tx.sale.aggregate({
        where: {
          saleDate: { gte: startDate, lte: endDate },
          saleStatus: 'COMPLETED'
        },
        _sum: { totalAmount: true }
      });

      const totalItems = await tx.saleItem.aggregate({
        where: {
          sale: {
            saleDate: { gte: startDate, lte: endDate },
            saleStatus: 'COMPLETED'
          }
        },
        _sum: { quantity: true }
      });

      const averageOrderValue = totalSales > 0 ? (totalRevenue._sum.totalAmount || 0) / totalSales : 0;

      return {
        totalSales,
        totalRevenue: totalRevenue._sum.totalAmount || 0,
        totalItems: totalItems._sum.quantity || 0,
        averageOrderValue: Math.round(averageOrderValue * 100) / 100
      };
    });

    // Get sales by payment method
    const salesByPaymentMethod = await prisma.sale.groupBy({
      by: ['paymentMethod'],
      where: {
        saleDate: { gte: startDate, lte: endDate },
        saleStatus: 'COMPLETED'
      },
      _count: { id: true },
      _sum: { totalAmount: true }
    });

    // Get sales by date (grouped)
    let salesByDate;
    if (groupBy === 'day') {
      salesByDate = await prisma.$queryRaw`
        SELECT 
          DATE(saleDate) as date,
          COUNT(*) as salesCount,
          SUM(totalAmount) as revenue,
          SUM(discountAmount) as totalDiscounts
        FROM sales 
        WHERE saleDate >= ${startDate} AND saleDate <= ${endDate} AND saleStatus = 'COMPLETED'
        GROUP BY DATE(saleDate)
        ORDER BY date ASC
      `;
    } else if (groupBy === 'week') {
      salesByDate = await prisma.$queryRaw`
        SELECT 
          strftime('%Y-W%W', saleDate) as week,
          COUNT(*) as salesCount,
          SUM(totalAmount) as revenue,
          SUM(discountAmount) as totalDiscounts
        FROM sales 
        WHERE saleDate >= ${startDate} AND saleDate <= ${endDate} AND saleStatus = 'COMPLETED'
        GROUP BY strftime('%Y-W%W', saleDate)
        ORDER BY week ASC
      `;
    } else if (groupBy === 'month') {
      salesByDate = await prisma.$queryRaw`
        SELECT 
          strftime('%Y-%m', saleDate) as month,
          COUNT(*) as salesCount,
          SUM(totalAmount) as revenue,
          SUM(discountAmount) as totalDiscounts
        FROM sales 
        WHERE saleDate >= ${startDate} AND saleDate <= ${endDate} AND saleStatus = 'COMPLETED'
        GROUP BY strftime('%Y-%m', saleDate)
        ORDER BY month ASC
      `;
    }

    // Get top performing products
    const topProducts = await prisma.saleItem.groupBy({
      by: ['productId'],
      where: {
        sale: {
          saleDate: { gte: startDate, lte: endDate },
          saleStatus: 'COMPLETED'
        }
      },
      _sum: { quantity: true, totalPrice: true },
      orderBy: {
        _sum: {
          totalPrice: 'desc'
        }
      },
      take: 10
    });

    // Get product details for top products
    const topProductsWithDetails = await Promise.all(
      topProducts.map(async (item) => {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
          select: { name: true, sku: true, category: { select: { name: true } } }
        });
        return {
          productId: item.productId,
          productName: product?.name || 'Unknown Product',
          sku: product?.sku || 'Unknown SKU',
          category: product?.category?.name || 'Uncategorized',
          quantitySold: item._sum.quantity || 0,
          revenue: item._sum.totalPrice || 0
        };
      })
    );

    // Get top customers
    const topCustomers = await prisma.sale.groupBy({
      by: ['customerId'],
      where: {
        saleDate: { gte: startDate, lte: endDate },
        saleStatus: 'COMPLETED',
        customerId: { not: null }
      },
      _count: { id: true },
      _sum: { totalAmount: true },
      orderBy: {
        _sum: {
          totalAmount: 'desc'
        }
      },
      take: 10
    });

    // Get customer details for top customers
    const topCustomersWithDetails = await Promise.all(
      topCustomers.map(async (customer) => {
        const customerDetails = await prisma.customer.findUnique({
          where: { id: customer.customerId },
          select: { name: true, email: true, phone: true }
        });
        return {
          customerId: customer.customerId,
          customerName: customerDetails?.name || 'Unknown Customer',
          email: customerDetails?.email || 'No Email',
          phone: customerDetails?.phone || 'No Phone',
          orderCount: customer._count.id,
          totalSpent: customer._sum.totalAmount || 0
        };
      })
    );

    logger.info(`Sales report generated successfully`, {
      userId: req.user.id,
      startDate,
      endDate,
      groupBy
    });

    res.json({
      success: true,
      data: {
        summary: salesSummary,
        salesByPaymentMethod: salesByPaymentMethod.map(item => ({
          paymentMethod: item.paymentMethod,
          count: item._count.id,
          revenue: item._sum.totalAmount || 0
        })),
        salesByDate,
        topProducts: topProductsWithDetails,
        topCustomers: topCustomersWithDetails,
        dateRange: { startDate, endDate, groupBy }
      }
    });

  } catch (error) {
    logger.error('Error generating sales report:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate sales report',
      message: error.message
    });
  }
});

// GET /api/reports/inventory - Inventory reports
router.get('/inventory', authenticateToken, async (req, res) => {
  try {
    const { error: validationError, value: validatedData } = inventoryReportSchema.validate(req.query);
    if (validationError) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: validationError.details
      });
    }

    const { categoryId, lowStock, outOfStock, sortBy, sortOrder } = validatedData;

    // Build where clause
    const where = { isActive: true };
    
    if (categoryId) where.categoryId = categoryId;
    if (lowStock) where.stockQuantity = { lte: prisma.raw('"minStockLevel"') };
    if (outOfStock) where.stockQuantity = { equals: 0 };

    // Build order by
    const orderBy = {};
    orderBy[sortBy] = sortOrder;

    // Get inventory overview
    const inventoryOverview = await prisma.$transaction(async (tx) => {
      const totalProducts = await tx.product.count({ where: { isActive: true } });
      const lowStockProducts = await tx.product.count({
        where: {
          isActive: true,
          stockQuantity: { lte: prisma.raw('"minStockLevel"') }
        }
      });
      const outOfStockProducts = await tx.product.count({
        where: {
          isActive: true,
          stockQuantity: { equals: 0 }
        }
      });
      const totalValue = await tx.product.aggregate({
        where: { isActive: true },
        _sum: { stockQuantity: true }
      });

      // Calculate total inventory value
      const products = await tx.product.findMany({
        where: { isActive: true },
        select: { stockQuantity: true, costPrice: true }
      });

      const totalInventoryValue = products.reduce((sum, product) => {
        return sum + (product.stockQuantity * product.costPrice);
      }, 0);

      return {
        totalProducts,
        lowStockProducts,
        outOfStockProducts,
        totalStockItems: totalValue._sum.stockQuantity || 0,
        totalInventoryValue: Math.round(totalInventoryValue * 100) / 100
      };
    });

    // Get inventory by category
    const inventoryByCategory = await prisma.product.groupBy({
      by: ['categoryId'],
      where: { isActive: true },
      _count: { id: true },
      _sum: { stockQuantity: true }
    });

    // Get category details for inventory by category
    const inventoryByCategoryWithDetails = await Promise.all(
      inventoryByCategory.map(async (item) => {
        const category = await prisma.category.findUnique({
          where: { id: item.categoryId },
          select: { name: true, slug: true }
        });
        return {
          categoryId: item.categoryId,
          categoryName: category?.name || 'Uncategorized',
          categorySlug: category?.slug || 'uncategorized',
          productCount: item._count.id,
          totalStock: item._sum.stockQuantity || 0
        };
      })
    );

    // Get low stock products
    const lowStockProducts = await prisma.product.findMany({
      where: {
        isActive: true,
        stockQuantity: { lte: prisma.raw('"minStockLevel"') }
      },
      include: {
        category: {
          select: { name: true }
        }
      },
      orderBy: { stockQuantity: 'asc' },
      take: 20
    });

    // Get out of stock products
    const outOfStockProducts = await prisma.product.findMany({
      where: {
        isActive: true,
        stockQuantity: { equals: 0 }
      },
      include: {
        category: {
          select: { name: true }
        }
      },
      orderBy: { name: 'asc' },
      take: 20
    });

    // Get inventory movement (recent adjustments)
    const recentInventoryMovements = await prisma.inventoryAdjustment.findMany({
      where: {
        adjustmentDate: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } // Last 7 days
      },
      include: {
        product: {
          select: { name: true, sku: true }
        },
        variant: {
          select: { name: true, sku: true }
        },
        adjustedBy: {
          select: { username: true, firstName: true, lastName: true }
        }
      },
      orderBy: { adjustmentDate: 'desc' },
      take: 50
    });

    logger.info(`Inventory report generated successfully`, {
      userId: req.user.id,
      categoryId,
      lowStock,
      outOfStock
    });

    res.json({
      success: true,
      data: {
        overview: inventoryOverview,
        byCategory: inventoryByCategoryWithDetails,
        lowStockProducts: lowStockProducts.map(product => ({
          id: product.id,
          name: product.name,
          sku: product.sku,
          category: product.category.name,
          currentStock: product.stockQuantity,
          minStockLevel: product.minStockLevel,
          maxStockLevel: product.maxStockLevel
        })),
        outOfStockProducts: outOfStockProducts.map(product => ({
          id: product.id,
          name: product.name,
          sku: product.sku,
          category: product.category.name,
          lastStockLevel: product.minStockLevel
        })),
        recentMovements: recentInventoryMovements.map(movement => ({
          id: movement.id,
          productName: movement.product.name,
          productSku: movement.product.sku,
          variantName: movement.variant?.name || null,
          variantSku: movement.variant?.sku || null,
          quantityChange: movement.quantityChange,
          reason: movement.reason,
          previousStock: movement.previousStock,
          newStock: movement.newStock,
          adjustedBy: `${movement.adjustedBy.firstName} ${movement.adjustedBy.lastName}`,
          adjustmentDate: movement.adjustmentDate
        }))
      }
    });

  } catch (error) {
    logger.error('Error generating inventory report:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate inventory report',
      message: error.message
    });
  }
});

// GET /api/reports/top-products - Top performing products report
router.get('/top-products', authenticateToken, async (req, res) => {
  try {
    const {
      period = 'month',
      limit = 20,
      categoryId,
      sortBy = 'revenue'
    } = req.query;

    const { startDate, endDate } = getDateRange(period);

    // Build where clause
    const where = {
      sale: {
        saleDate: { gte: startDate, lte: endDate },
        saleStatus: 'COMPLETED'
      }
    };

    if (categoryId) {
      where.product = { categoryId };
    }

    // Get top products by revenue
    const topProductsByRevenue = await prisma.saleItem.groupBy({
      by: ['productId'],
      where,
      _sum: { quantity: true, totalPrice: true },
      orderBy: {
        _sum: {
          totalPrice: 'desc'
        }
      },
      take: parseInt(limit)
    });

    // Get top products by quantity
    const topProductsByQuantity = await prisma.saleItem.groupBy({
      by: ['productId'],
      where,
      _sum: { quantity: true, totalPrice: true },
      orderBy: {
        _sum: {
          quantity: 'desc'
        }
      },
      take: parseInt(limit)
    });

    // Get product details and calculate metrics
    const getProductDetails = async (productId) => {
      const product = await prisma.product.findUnique({
        where: { id: productId },
        include: {
          category: { select: { name: true } },
          variants: {
            where: { isActive: true },
            select: { id: true, name: true, sku: true, stockQuantity: true }
          }
        }
      });

      if (!product) return null;

      // Get sales data for this product
      const salesData = await prisma.saleItem.aggregate({
        where: {
          productId,
          sale: {
            saleDate: { gte: startDate, lte: endDate },
            saleStatus: 'COMPLETED'
          }
        },
        _sum: { quantity: true, totalPrice: true },
        _count: { id: true }
      });

      // Get inventory data
      const totalStock = product.variants.length > 0 
        ? product.variants.reduce((sum, variant) => sum + variant.stockQuantity, 0)
        : product.stockQuantity;

      return {
        id: product.id,
        name: product.name,
        sku: product.sku,
        category: product.category.name,
        currentStock: totalStock,
        minStockLevel: product.minStockLevel,
        maxStockLevel: product.maxStockLevel,
        unitPrice: product.price,
        costPrice: product.costPrice,
        salesMetrics: {
          quantitySold: salesData._sum.quantity || 0,
          revenue: salesData._sum.totalPrice || 0,
          orderCount: salesData._count.id,
          averageOrderValue: salesData._count.id > 0 
            ? (salesData._sum.totalPrice || 0) / salesData._count.id 
            : 0
        },
        variants: product.variants.map(variant => ({
          id: variant.id,
          name: variant.name,
          sku: variant.sku,
          stockQuantity: variant.stockQuantity
        }))
      };
    };

    // Process top products by revenue
    const topProductsByRevenueWithDetails = await Promise.all(
      topProductsByRevenue.map(async (item) => {
        const details = await getProductDetails(item.productId);
        if (!details) return null;
        
        return {
          ...details,
          rank: 'revenue',
          rankValue: item._sum.totalPrice || 0
        };
      })
    );

    // Process top products by quantity
    const topProductsByQuantityWithDetails = await Promise.all(
      topProductsByQuantity.map(async (item) => {
        const details = await getProductDetails(item.productId);
        if (!details) return null;
        
        return {
          ...details,
          rank: 'quantity',
          rankValue: item._sum.quantity || 0
        };
      })
    );

    // Filter out null values
    const validRevenueProducts = topProductsByRevenueWithDetails.filter(p => p !== null);
    const validQuantityProducts = topProductsByQuantityWithDetails.filter(p => p !== null);

    // Get category performance
    const categoryPerformance = await prisma.saleItem.groupBy({
      by: ['productId'],
      where,
      _sum: { quantity: true, totalPrice: true },
      _count: { id: true }
    });

    const categoryStats = await Promise.all(
      categoryPerformance.map(async (item) => {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
          include: { category: { select: { name: true } } }
        });

        return {
          categoryName: product?.category?.name || 'Uncategorized',
          quantitySold: item._sum.quantity || 0,
          revenue: item._sum.totalPrice || 0,
          orderCount: item._count.id
        };
      })
    );

    // Aggregate category stats
    const categorySummary = categoryStats.reduce((acc, item) => {
      const existing = acc.find(cat => cat.categoryName === item.categoryName);
      if (existing) {
        existing.quantitySold += item.quantitySold;
        existing.revenue += item.revenue;
        existing.orderCount += item.orderCount;
      } else {
        acc.push({ ...item });
      }
      return acc;
    }, []);

    // Sort categories by revenue
    categorySummary.sort((a, b) => b.revenue - a.revenue);

    logger.info(`Top products report generated successfully`, {
      userId: req.user.id,
      period,
      limit,
      categoryId
    });

    res.json({
      success: true,
      data: {
        period: { startDate, endDate, period },
        topProductsByRevenue: validRevenueProducts,
        topProductsByQuantity: validQuantityProducts,
        categoryPerformance: categorySummary,
        summary: {
          totalProducts: validRevenueProducts.length,
          totalRevenue: validRevenueProducts.reduce((sum, p) => sum + p.salesMetrics.revenue, 0),
          totalQuantity: validRevenueProducts.reduce((sum, p) => sum + p.salesMetrics.quantitySold, 0)
        }
      }
    });

  } catch (error) {
    logger.error('Error generating top products report:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate top products report',
      message: error.message
    });
  }
});

// GET /api/reports/financial - Financial summary report
router.get('/financial', authenticateToken, requireRole(['ADMIN', 'MANAGER']), async (req, res) => {
  try {
    const { error: validationError, value: validatedData } = dateRangeSchema.validate(req.query);
    if (validationError) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: validationError.details
      });
    }

    const { startDate, endDate, groupBy } = validatedData;

    // Get financial summary
    const financialSummary = await prisma.$transaction(async (tx) => {
      const salesData = await tx.sale.aggregate({
        where: {
          saleDate: { gte: startDate, lte: endDate },
          saleStatus: 'COMPLETED'
        },
        _sum: {
          subtotal: true,
          taxAmount: true,
          discountAmount: true,
          totalAmount: true
        },
        _count: { id: true }
      });

      const refundsData = await tx.sale.aggregate({
        where: {
          saleDate: { gte: startDate, lte: endDate },
          saleStatus: 'REFUNDED'
        },
        _sum: { totalAmount: true },
        _count: { id: true }
      });

      // Calculate net revenue
      const grossRevenue = salesData._sum.totalAmount || 0;
      const refunds = refundsData._sum.totalAmount || 0;
      const netRevenue = grossRevenue - refunds;

      // Calculate profit margins (assuming cost data is available)
      const salesItems = await tx.saleItem.findMany({
        where: {
          sale: {
            saleDate: { gte: startDate, lte: endDate },
            saleStatus: 'COMPLETED'
          }
        },
        include: {
          product: { select: { costPrice: true } },
          variant: { select: { costPrice: true } }
        }
      });

      let totalCost = 0;
      salesItems.forEach(item => {
        const costPrice = item.variant?.costPrice || item.product.costPrice;
        totalCost += costPrice * item.quantity;
      });

      const grossProfit = netRevenue - totalCost;
      const profitMargin = netRevenue > 0 ? (grossProfit / netRevenue) * 100 : 0;

      return {
        grossRevenue,
        refunds,
        netRevenue,
        totalCost,
        grossProfit,
        profitMargin: Math.round(profitMargin * 100) / 100,
        totalSales: salesData._count.id,
        totalRefunds: refundsData._count.id,
        subtotal: salesData._sum.subtotal || 0,
        taxes: salesData._sum.taxAmount || 0,
        discounts: salesData._sum.discountAmount || 0
      };
    });

    // Get payment method breakdown
    const paymentMethodBreakdown = await prisma.sale.groupBy({
      by: ['paymentMethod'],
      where: {
        saleDate: { gte: startDate, lte: endDate },
        saleStatus: 'COMPLETED'
      },
      _count: { id: true },
      _sum: { totalAmount: true }
    });

    // Get daily/weekly/monthly revenue trends
    let revenueTrends;
    if (groupBy === 'day') {
      revenueTrends = await prisma.$queryRaw`
        SELECT 
          DATE(saleDate) as date,
          SUM(totalAmount) as revenue,
          COUNT(*) as salesCount,
          SUM(discountAmount) as discounts
        FROM sales 
        WHERE saleDate >= ${startDate} AND saleDate <= ${endDate} AND saleStatus = 'COMPLETED'
        GROUP BY DATE(saleDate)
        ORDER BY date ASC
      `;
    } else if (groupBy === 'week') {
      revenueTrends = await prisma.$queryRaw`
        SELECT 
          strftime('%Y-W%W', saleDate) as week,
          SUM(totalAmount) as revenue,
          COUNT(*) as salesCount,
          SUM(discountAmount) as discounts
        FROM sales 
        WHERE saleDate >= ${startDate} AND saleDate <= ${endDate} AND saleStatus = 'COMPLETED'
        GROUP BY strftime('%Y-W%W', saleDate)
        ORDER BY week ASC
      `;
    } else if (groupBy === 'month') {
      revenueTrends = await prisma.$queryRaw`
        SELECT 
          strftime('%Y-%m', saleDate) as month,
          SUM(totalAmount) as revenue,
          COUNT(*) as salesCount,
          SUM(discountAmount) as discounts
        FROM sales 
        WHERE saleDate >= ${startDate} AND saleDate <= ${endDate} AND saleStatus = 'COMPLETED'
        GROUP BY strftime('%Y-%m', saleDate)
        ORDER BY month ASC
      `;
    }

    // Get top revenue days
    const topRevenueDays = await prisma.sale.groupBy({
      by: ['saleDate'],
      where: {
        saleDate: { gte: startDate, lte: endDate },
        saleStatus: 'COMPLETED'
      },
      _sum: { totalAmount: true },
      _count: { id: true },
      orderBy: {
        _sum: { totalAmount: 'desc' }
      },
      take: 10
    });

    logger.info(`Financial report generated successfully`, {
      userId: req.user.id,
      startDate,
      endDate,
      groupBy
    });

    res.json({
      success: true,
      data: {
        summary: financialSummary,
        paymentMethods: paymentMethodBreakdown.map(item => ({
          method: item.paymentMethod,
          count: item._count.id,
          amount: item._sum.totalAmount || 0,
          percentage: financialSummary.netRevenue > 0 
            ? Math.round((item._sum.totalAmount || 0) / financialSummary.netRevenue * 10000) / 100 
            : 0
        })),
        revenueTrends,
        topRevenueDays: topRevenueDays.map(item => ({
          date: item.saleDate,
          revenue: item._sum.totalAmount || 0,
          salesCount: item._count.id
        })),
        dateRange: { startDate, endDate, groupBy }
      }
    });

  } catch (error) {
    logger.error('Error generating financial report:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate financial report',
      message: error.message
    });
  }
});

// GET /api/reports/customers - Customer analytics report
router.get('/customers', authenticateToken, async (req, res) => {
  try {
    const { period = 'month', limit = 20 } = req.query;
    const { startDate, endDate } = getDateRange(period);

    // Get customer summary
    const customerSummary = await prisma.$transaction(async (tx) => {
      const totalCustomers = await tx.customer.count({ where: { isActive: true } });
      const newCustomers = await tx.customer.count({
        where: {
          isActive: true,
          createdAt: { gte: startDate, lte: endDate }
        }
      });

      const activeCustomers = await tx.customer.count({
        where: {
          isActive: true,
          sales: {
            some: {
              saleDate: { gte: startDate, lte: endDate },
              saleStatus: 'COMPLETED'
            }
          }
        }
      });

      const totalLoyaltyPoints = await tx.customer.aggregate({
        where: { isActive: true },
        _sum: { loyaltyPoints: true }
      });

      return {
        totalCustomers,
        newCustomers,
        activeCustomers,
        inactiveCustomers: totalCustomers - activeCustomers,
        totalLoyaltyPoints: totalLoyaltyPoints._sum.loyaltyPoints || 0,
        customerRetentionRate: totalCustomers > 0 ? Math.round((activeCustomers / totalCustomers) * 10000) / 100 : 0
      };
    });

    // Get top customers by spending
    const topCustomersBySpending = await prisma.sale.groupBy({
      by: ['customerId'],
      where: {
        saleDate: { gte: startDate, lte: endDate },
        saleStatus: 'COMPLETED',
        customerId: { not: null }
      },
      _sum: { totalAmount: true },
      _count: { id: true },
      orderBy: {
        _sum: { totalAmount: 'desc' }
      },
      take: parseInt(limit)
    });

    // Get customer details for top customers
    const topCustomersWithDetails = await Promise.all(
      topCustomersBySpending.map(async (customer) => {
        const customerDetails = await prisma.customer.findUnique({
          where: { id: customer.customerId },
          select: {
            name: true,
            email: true,
            phone: true,
            loyaltyPoints: true,
            totalSpent: true,
            createdAt: true
          }
        });

        return {
          customerId: customer.customerId,
          name: customerDetails?.name || 'Unknown Customer',
          email: customerDetails?.email || 'No Email',
          phone: customerDetails?.phone || 'No Phone',
          loyaltyPoints: customerDetails?.loyaltyPoints || 0,
          totalSpent: customerDetails?.totalSpent || 0,
          periodSpending: customer._sum.totalAmount || 0,
          orderCount: customer._count.id,
          averageOrderValue: customer._count.id > 0 
            ? Math.round((customer._sum.totalAmount || 0) / customer._count.id * 100) / 100 
            : 0,
          customerSince: customerDetails?.createdAt
        };
      })
    );

    // Get customer segments
    const customerSegments = await prisma.$transaction(async (tx) => {
      const allCustomers = await tx.customer.findMany({
        where: { isActive: true },
        include: {
          sales: {
            where: {
              saleDate: { gte: startDate, lte: endDate },
              saleStatus: 'COMPLETED'
            }
          }
        }
      });

      const segments = {
        highValue: 0,    // >$1000
        mediumValue: 0,  // $100-$1000
        lowValue: 0,     // <$100
        inactive: 0      // No purchases
      };

      allCustomers.forEach(customer => {
        const periodSpending = customer.sales.reduce((sum, sale) => sum + sale.totalAmount, 0);
        
        if (periodSpending === 0) {
          segments.inactive++;
        } else if (periodSpending > 1000) {
          segments.highValue++;
        } else if (periodSpending > 100) {
          segments.mediumValue++;
        } else {
          segments.lowValue++;
        }
      });

      return segments;
    });

    // Get loyalty program statistics
    const loyaltyStats = await prisma.loyaltyReward.aggregate({
      where: {
        createdAt: { gte: startDate, lte: endDate }
      },
      _sum: { pointsUsed: true, rewardValue: true },
      _count: { id: true }
    });

    logger.info(`Customer report generated successfully`, {
      userId: req.user.id,
      period,
      limit
    });

    res.json({
      success: true,
      data: {
        summary: customerSummary,
        topCustomers: topCustomersWithDetails,
        customerSegments,
        loyaltyProgram: {
          totalRewards: loyaltyStats._count.id,
          totalPointsUsed: loyaltyStats._sum.pointsUsed || 0,
          totalRewardValue: loyaltyStats._sum.rewardValue || 0
        },
        period: { startDate, endDate, period }
      }
    });

  } catch (error) {
    logger.error('Error generating customer report:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate customer report',
      message: error.message
    });
  }
});

module.exports = router;
