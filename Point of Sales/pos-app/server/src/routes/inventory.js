const express = require('express');
const Joi = require('joi');
const { PrismaClient } = require('@prisma/client');
const { authenticateToken, requireRole } = require('../middleware/auth');
const { logger } = require('../utils/logger');
const { getSocketIO } = require('../utils/socket');

const router = express.Router();
const prisma = new PrismaClient();

// Validation schemas
const inventoryAdjustmentSchema = Joi.object({
  productId: Joi.string().optional(),
  variantId: Joi.string().optional(),
  quantityChange: Joi.number().integer().required(),
  reason: Joi.string().valid('SALE', 'PURCHASE', 'ADJUSTMENT', 'RETURN', 'DAMAGED', 'EXPIRED', 'TRANSFER').required(),
  notes: Joi.string().max(500).optional()
}).or('productId', 'variantId');

const bulkAdjustmentSchema = Joi.object({
  adjustments: Joi.array().items(inventoryAdjustmentSchema).min(1).max(100).required()
});

// GET /api/inventory - Get inventory overview with filters
router.get('/', authenticateToken, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 50,
      search,
      categoryId,
      lowStock,
      outOfStock,
      sortBy = 'name',
      sortOrder = 'asc'
    } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Build where clause
    const where = { isActive: true };
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } },
        { barcode: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (categoryId) where.categoryId = categoryId;
    if (lowStock === 'true') where.stockQuantity = { lte: prisma.raw('"minStockLevel"') };
    if (outOfStock === 'true') where.stockQuantity = { equals: 0 };

    // Build order by
    const orderBy = {};
    orderBy[sortBy] = sortOrder;

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: {
            select: { id: true, name: true, slug: true }
          },
          variants: {
            where: { isActive: true },
            select: {
              id: true,
              sku: true,
              name: true,
              attributes: true,
              stockQuantity: true,
              minStockLevel: true,
              maxStockLevel: true,
              isActive: true
            }
          }
        },
        orderBy,
        skip,
        take: limitNum
      }),
      prisma.product.count({ where })
    ]);

    // Calculate inventory metrics
    const inventoryMetrics = await prisma.$transaction(async (tx) => {
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

      return {
        totalProducts,
        lowStockProducts,
        outOfStockProducts,
        totalStockItems: totalValue._sum.stockQuantity || 0
      };
    });

    // Parse variant attributes from JSON strings
    const productsWithParsedVariants = products.map(product => ({
      ...product,
      variants: product.variants.map(variant => ({
        ...variant,
        attributes: JSON.parse(variant.attributes)
      }))
    }));

    logger.info(`Inventory overview retrieved successfully`, {
      userId: req.user.id,
      count: productsWithParsedVariants.length,
      total,
      page: pageNum
    });

    res.json({
      success: true,
      data: {
        products: productsWithParsedVariants,
        metrics: inventoryMetrics
      },
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    });

  } catch (error) {
    logger.error('Error retrieving inventory overview:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve inventory overview',
      message: error.message
    });
  }
});

// GET /api/inventory/low-stock - Get low stock products
router.get('/low-stock', authenticateToken, async (req, res) => {
  try {
    const lowStockProducts = await prisma.product.findMany({
      where: {
        isActive: true,
        stockQuantity: { lte: prisma.raw('"minStockLevel"') }
      },
      include: {
        category: {
          select: { id: true, name: true, slug: true }
        },
        variants: {
          where: {
            isActive: true,
            stockQuantity: { lte: prisma.raw('"minStockLevel"') }
          },
          select: {
            id: true,
            sku: true,
            name: true,
            attributes: true,
            stockQuantity: true,
            minStockLevel: true
          }
        }
      },
      orderBy: { stockQuantity: 'asc' }
    });

    // Parse variant attributes from JSON strings
    const productsWithParsedVariants = lowStockProducts.map(product => ({
      ...product,
      variants: product.variants.map(variant => ({
        ...variant,
        attributes: JSON.parse(variant.attributes)
      }))
    }));

    logger.info(`Low stock products retrieved successfully`, {
      userId: req.user.id,
      count: productsWithParsedVariants.length
    });

    res.json({
      success: true,
      data: productsWithParsedVariants
    });

  } catch (error) {
    logger.error('Error retrieving low stock products:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve low stock products',
      message: error.message
    });
  }
});

// GET /api/inventory/product/:id - Get detailed inventory for a product
router.get('/product/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: {
          select: { id: true, name: true, slug: true }
        },
        variants: {
          where: { isActive: true },
          select: {
            id: true,
            sku: true,
            name: true,
            attributes: true,
            stockQuantity: true,
            minStockLevel: true,
            maxStockLevel: true,
            isActive: true
          }
        },
        inventoryAdjustments: {
          take: 10,
          orderBy: { adjustmentDate: 'desc' },
          include: {
            adjustedBy: {
              select: { id: true, username: true, firstName: true, lastName: true }
            }
          }
        }
      }
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    // Parse variant attributes from JSON strings
    const productWithParsedData = {
      ...product,
      variants: product.variants.map(variant => ({
        ...variant,
        attributes: JSON.parse(variant.attributes)
      }))
    };

    logger.info(`Product inventory details retrieved successfully`, {
      userId: req.user.id,
      productId: id
    });

    res.json({
      success: true,
      data: productWithParsedData
    });

  } catch (error) {
    logger.error('Error retrieving product inventory details:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve product inventory details',
      message: error.message
    });
  }
});

// PATCH /api/inventory/adjust - Adjust inventory for a product or variant
router.patch('/adjust', authenticateToken, requireRole(['ADMIN', 'MANAGER', 'CASHIER']), async (req, res) => {
  try {
    const { error: validationError, value: validatedData } = inventoryAdjustmentSchema.validate(req.body);
    if (validationError) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: validationError.details
      });
    }

    const { productId, variantId, quantityChange, reason, notes } = validatedData;

    // Validate that either productId or variantId is provided, but not both
    if (productId && variantId) {
      return res.status(400).json({
        success: false,
        error: 'Cannot specify both productId and variantId'
      });
    }

    // Process inventory adjustment in a transaction
    const result = await prisma.$transaction(async (tx) => {
      let product, variant, previousStock, newStock;

      if (variantId) {
        // Adjust variant inventory
        variant = await tx.variant.findUnique({
          where: { id: variantId },
          include: { product: true }
        });

        if (!variant) {
          throw new Error('Variant not found');
        }

        product = variant.product;
        previousStock = variant.stockQuantity;
        newStock = previousStock + quantityChange;

        if (newStock < 0) {
          throw new Error('Insufficient stock for adjustment');
        }

        // Update variant stock
        await tx.variant.update({
          where: { id: variantId },
          data: { stockQuantity: newStock }
        });

        // Update product stock (sum of all variants)
        const totalVariantStock = await tx.variant.aggregate({
          where: { productId: product.id, isActive: true },
          _sum: { stockQuantity: true }
        });

        await tx.product.update({
          where: { id: product.id },
          data: { stockQuantity: totalVariantStock._sum.stockQuantity || 0 }
        });

      } else {
        // Adjust product inventory
        product = await tx.product.findUnique({
          where: { id: productId }
        });

        if (!product) {
          throw new Error('Product not found');
        }

        previousStock = product.stockQuantity;
        newStock = previousStock + quantityChange;

        if (newStock < 0) {
          throw new Error('Insufficient stock for adjustment');
        }

        // Update product stock
        await tx.product.update({
          where: { id: productId },
          data: { stockQuantity: newStock }
        });
      }

      // Create inventory adjustment record
      const adjustment = await tx.inventoryAdjustment.create({
        data: {
          productId: product.id,
          variantId: variantId || null,
          quantityChange,
          previousStock,
          newStock,
          reason,
          notes,
          adjustedById: req.user.id
        }
      });

      return { product, variant, adjustment, previousStock, newStock };
    });

    // Check for low stock alerts
    const io = getSocketIO();
    if (io) {
      if (result.variant) {
        // Check variant stock levels
        if (result.newStock <= result.variant.minStockLevel) {
          io.emit('lowStockAlert', {
            type: 'VARIANT_LOW_STOCK',
            productId: result.product.id,
            productName: result.product.name,
            variantId: result.variant.id,
            variantName: result.variant.name,
            currentStock: result.newStock,
            minStockLevel: result.variant.minStockLevel,
            message: `Variant ${result.variant.name} of ${result.product.name} is running low on stock (${result.newStock}/${result.variant.minStockLevel})`
          });
        }
      } else {
        // Check product stock levels
        if (result.newStock <= result.product.minStockLevel) {
          io.emit('lowStockAlert', {
            type: 'PRODUCT_LOW_STOCK',
            productId: result.product.id,
            productName: result.product.name,
            currentStock: result.newStock,
            minStockLevel: result.product.minStockLevel,
            message: `${result.product.name} is running low on stock (${result.newStock}/${result.product.minStockLevel})`
          });
        }
      }

      // Emit inventory update
      io.emit('inventoryUpdated', {
        productId: result.product.id,
        productName: result.product.name,
        variantId: result.variant?.id || null,
        newStock: result.newStock,
        adjustment: {
          quantityChange,
          reason,
          adjustedBy: req.user.username
        }
      });
    }

    logger.info(`Inventory adjustment completed successfully`, {
      userId: req.user.id,
      productId: result.product.id,
      productName: result.product.name,
      variantId: result.variant?.id || null,
      quantityChange,
      reason,
      previousStock: result.previousStock,
      newStock: result.newStock
    });

    res.json({
      success: true,
      message: 'Inventory adjusted successfully',
      data: {
        productId: result.product.id,
        productName: result.product.name,
        variantId: result.variant?.id || null,
        previousStock: result.previousStock,
        newStock: result.newStock,
        adjustment: result.adjustment
      }
    });

  } catch (error) {
    logger.error('Error adjusting inventory:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to adjust inventory',
      message: error.message
    });
  }
});

// POST /api/inventory/bulk-adjust - Bulk inventory adjustments
router.post('/bulk-adjust', authenticateToken, requireRole(['ADMIN', 'MANAGER']), async (req, res) => {
  try {
    const { error: validationError, value: validatedData } = bulkAdjustmentSchema.validate(req.body);
    if (validationError) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: validationError.details
      });
    }

    const { adjustments } = validatedData;
    const results = [];
    const errors = [];

    // Process each adjustment
    for (const adjustment of adjustments) {
      try {
        const result = await prisma.$transaction(async (tx) => {
          let product, variant, previousStock, newStock;

          if (adjustment.variantId) {
            variant = await tx.variant.findUnique({
              where: { id: adjustment.variantId },
              include: { product: true }
            });

            if (!variant) {
              throw new Error(`Variant ${adjustment.variantId} not found`);
            }

            product = variant.product;
            previousStock = variant.stockQuantity;
            newStock = previousStock + adjustment.quantityChange;

            if (newStock < 0) {
              throw new Error(`Insufficient stock for variant ${variant.sku}`);
            }

            await tx.variant.update({
              where: { id: adjustment.variantId },
              data: { stockQuantity: newStock }
            });

            const totalVariantStock = await tx.variant.aggregate({
              where: { productId: product.id, isActive: true },
              _sum: { stockQuantity: true }
            });

            await tx.product.update({
              where: { id: product.id },
              data: { stockQuantity: totalVariantStock._sum.stockQuantity || 0 }
            });

          } else {
            product = await tx.product.findUnique({
              where: { id: adjustment.productId }
            });

            if (!product) {
              throw new Error(`Product ${adjustment.productId} not found`);
            }

            previousStock = product.stockQuantity;
            newStock = previousStock + adjustment.quantityChange;

            if (newStock < 0) {
              throw new Error(`Insufficient stock for product ${product.sku}`);
            }

            await tx.product.update({
              where: { id: adjustment.productId },
              data: { stockQuantity: newStock }
            });
          }

          const adjustmentRecord = await tx.inventoryAdjustment.create({
            data: {
              productId: product.id,
              variantId: adjustment.variantId || null,
              quantityChange: adjustment.quantityChange,
              previousStock,
              newStock,
              reason: adjustment.reason,
              notes: adjustment.notes,
              adjustedById: req.user.id
            }
          });

          return { product, variant, adjustment: adjustmentRecord, previousStock, newStock };
        });

        results.push({
          success: true,
          productId: result.product.id,
          productName: result.product.name,
          variantId: result.variant?.id || null,
          quantityChange: adjustment.quantityChange,
          newStock: result.newStock
        });

      } catch (error) {
        errors.push({
          success: false,
          productId: adjustment.productId,
          variantId: adjustment.variantId,
          error: error.message
        });
      }
    }

    // Emit bulk inventory update
    const io = getSocketIO();
    if (io && results.length > 0) {
      io.emit('bulkInventoryUpdated', {
        updatedCount: results.length,
        errorCount: errors.length,
        updates: results
      });
    }

    logger.info(`Bulk inventory adjustment completed`, {
      userId: req.user.id,
      totalAdjustments: adjustments.length,
      successfulAdjustments: results.length,
      failedAdjustments: errors.length
    });

    res.json({
      success: true,
      message: 'Bulk inventory adjustment completed',
      data: {
        totalAdjustments: adjustments.length,
        successfulAdjustments: results.length,
        failedAdjustments: errors.length,
        results,
        errors
      }
    });

  } catch (error) {
    logger.error('Error processing bulk inventory adjustment:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process bulk inventory adjustment',
      message: error.message
    });
  }
});

// GET /api/inventory/history - Get inventory adjustment history
router.get('/history', authenticateToken, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 50,
      productId,
      variantId,
      reason,
      startDate,
      endDate,
      sortBy = 'adjustmentDate',
      sortOrder = 'desc'
    } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Build where clause
    const where = {};
    
    if (productId) where.productId = productId;
    if (variantId) where.variantId = variantId;
    if (reason) where.reason = reason;
    
    if (startDate || endDate) {
      where.adjustmentDate = {};
      if (startDate) where.adjustmentDate.gte = new Date(startDate);
      if (endDate) where.adjustmentDate.lte = new Date(endDate);
    }

    // Build order by
    const orderBy = {};
    orderBy[sortBy] = sortOrder;

    const [adjustments, total] = await Promise.all([
      prisma.inventoryAdjustment.findMany({
        where,
        include: {
          product: {
            select: { id: true, name: true, sku: true }
          },
          variant: {
            select: { id: true, name: true, sku: true }
          },
          adjustedBy: {
            select: { id: true, username: true, firstName: true, lastName: true }
          }
        },
        orderBy,
        skip,
        take: limitNum
      }),
      prisma.inventoryAdjustment.count({ where })
    ]);

    logger.info(`Inventory history retrieved successfully`, {
      userId: req.user.id,
      count: adjustments.length,
      total,
      page: pageNum
    });

    res.json({
      success: true,
      data: adjustments,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    });

  } catch (error) {
    logger.error('Error retrieving inventory history:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve inventory history',
      message: error.message
    });
  }
});

// GET /api/inventory/export - Export inventory data
router.get('/export', authenticateToken, requireRole(['ADMIN', 'MANAGER']), async (req, res) => {
  try {
    const { format = 'json' } = req.query;

    const inventory = await prisma.product.findMany({
      where: { isActive: true },
      include: {
        category: {
          select: { name: true }
        },
        variants: {
          where: { isActive: true },
          select: {
            sku: true,
            name: true,
            stockQuantity: true,
            minStockLevel: true,
            maxStockLevel: true
          }
        }
      },
      orderBy: { name: 'asc' }
    });

    if (format === 'csv') {
      // Generate CSV format
      const csvData = inventory.map(product => {
        const baseRow = {
          'Product Name': product.name,
          'SKU': product.sku,
          'Category': product.category.name,
          'Stock Quantity': product.stockQuantity,
          'Min Stock Level': product.minStockLevel,
          'Max Stock Level': product.maxStockLevel || '',
          'Unit Price': product.price,
          'Cost Price': product.costPrice
        };

        if (product.variants.length === 0) {
          return baseRow;
        }

        // Create rows for each variant
        return product.variants.map(variant => ({
          ...baseRow,
          'Variant Name': variant.name,
          'Variant SKU': variant.sku,
          'Variant Stock': variant.stockQuantity,
          'Variant Min Stock': variant.minStockLevel,
          'Variant Max Stock': variant.maxStockLevel || ''
        }));
      }).flat();

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="inventory-export.csv"');
      
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
        data: inventory,
        exportDate: new Date().toISOString(),
        totalProducts: inventory.length
      });
    }

    logger.info(`Inventory export completed successfully`, {
      userId: req.user.id,
      format,
      productCount: inventory.length
    });

  } catch (error) {
    logger.error('Error exporting inventory:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to export inventory',
      message: error.message
    });
  }
});

module.exports = router;
