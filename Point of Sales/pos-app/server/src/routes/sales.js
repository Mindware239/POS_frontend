const express = require('express');
const Joi = require('joi');
const { PrismaClient } = require('@prisma/client');
const { authenticateToken, requireRole } = require('../middleware/auth');
const { logger } = require('../utils/logger');
const { getSocketIO } = require('../utils/socket');

const router = express.Router();
const prisma = new PrismaClient();

// Validation schemas
const cartItemSchema = Joi.object({
  productId: Joi.string().optional(),
  variantId: Joi.string().optional(),
  quantity: Joi.number().integer().min(1).required(),
  unitPrice: Joi.number().positive().precision(2).required(),
  discount: Joi.number().min(0).precision(2).default(0)
}).or('productId', 'variantId');

const saleSchema = Joi.object({
  customerId: Joi.string().optional(),
  items: Joi.array().items(cartItemSchema).min(1).max(100).required(),
  subtotal: Joi.number().positive().precision(2).required(),
  taxAmount: Joi.number().min(0).precision(2).required(),
  discountAmount: Joi.number().min(0).precision(2).default(0),
  totalAmount: Joi.number().positive().precision(2).required(),
  paymentMethod: Joi.string().valid('CASH', 'CARD', 'BANK_TRANSFER', 'MOBILE_MONEY', 'CHECK', 'GIFT_CARD').required(),
  notes: Joi.string().max(500).optional(),
  loyaltyPointsUsed: Joi.number().integer().min(0).default(0)
});

const refundSchema = Joi.object({
  saleId: Joi.string().required(),
  items: Joi.array().items(Joi.object({
    saleItemId: Joi.string().required(),
    quantity: Joi.number().integer().min(1).required(),
    reason: Joi.string().valid('DEFECTIVE', 'WRONG_ITEM', 'CUSTOMER_REQUEST', 'OTHER').required(),
    notes: Joi.string().max(500).optional()
  })).min(1).required(),
  refundAmount: Joi.number().positive().precision(2).required(),
  refundMethod: Joi.string().valid('CASH', 'CARD_REFUND', 'STORE_CREDIT').required()
});

// Helper function to calculate tax
const calculateTax = (subtotal, taxRate = 0.08) => {
  return Math.round(subtotal * taxRate * 100) / 100;
};

// Helper function to generate invoice number
const generateInvoiceNumber = async () => {
  const today = new Date();
  const dateStr = today.getFullYear().toString() + 
                  (today.getMonth() + 1).toString().padStart(2, '0') + 
                  today.getDate().toString().padStart(2, '0');
  
  const lastSale = await prisma.sale.findFirst({
    where: {
      invoiceNumber: { startsWith: `INV-${dateStr}` }
    },
    orderBy: { invoiceNumber: 'desc' }
  });

  let sequence = 1;
  if (lastSale) {
    const lastSequence = parseInt(lastSale.invoiceNumber.split('-')[2]);
    sequence = lastSequence + 1;
  }

  return `INV-${dateStr}-${sequence.toString().padStart(3, '0')}`;
};

// Helper function to process loyalty points
const processLoyaltyPoints = async (customerId, saleAmount, pointsUsed = 0) => {
  if (!customerId) return { pointsEarned: 0, pointsUsed: 0 };

  const customer = await prisma.customer.findUnique({
    where: { id: customerId }
  });

  if (!customer) return { pointsEarned: 0, pointsUsed: 0 };

  // Calculate points earned (1 point per $1 spent)
  const pointsEarned = Math.floor(saleAmount);

  // Validate points used
  if (pointsUsed > customer.loyaltyPoints) {
    throw new Error('Insufficient loyalty points');
  }

  // Calculate discount from points (100 points = $1)
  const discountFromPoints = (pointsUsed / 100);

  return {
    pointsEarned,
    pointsUsed,
    discountFromPoints,
    newBalance: customer.loyaltyPoints - pointsUsed + pointsEarned
  };
};

// GET /api/sales - Get sales with pagination and filters
router.get('/', authenticateToken, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      startDate,
      endDate,
      customerId,
      userId,
      paymentMethod,
      paymentStatus,
      saleStatus,
      minAmount,
      maxAmount,
      sortBy = 'saleDate',
      sortOrder = 'desc'
    } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Build where clause
    const where = {};
    
    if (startDate || endDate) {
      where.saleDate = {};
      if (startDate) where.saleDate.gte = new Date(startDate);
      if (endDate) where.saleDate.lte = new Date(endDate);
    }

    if (customerId) where.customerId = customerId;
    if (userId) where.userId = userId;
    if (paymentMethod) where.paymentMethod = paymentMethod;
    if (paymentStatus) where.paymentStatus = paymentStatus;
    if (saleStatus) where.saleStatus = saleStatus;
    if (minAmount) where.totalAmount = { gte: parseFloat(minAmount) };
    if (maxAmount) where.totalAmount = { lte: parseFloat(maxAmount) };

    // Build order by
    const orderBy = {};
    orderBy[sortBy] = sortOrder;

    const [sales, total] = await Promise.all([
      prisma.sale.findMany({
        where,
        include: {
          customer: {
            select: { id: true, name: true, email: true, phone: true }
          },
          user: {
            select: { id: true, username: true, firstName: true, lastName: true }
          },
          items: {
            include: {
              product: {
                select: { id: true, name: true, sku: true }
              },
              variant: {
                select: { id: true, name: true, sku: true }
              }
            }
          }
        },
        orderBy,
        skip,
        take: limitNum
      }),
      prisma.sale.count({ where })
    ]);

    logger.info(`Sales retrieved successfully`, {
      userId: req.user.id,
      count: sales.length,
      total,
      page: pageNum
    });

    res.json({
      success: true,
      data: sales,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    });

  } catch (error) {
    logger.error('Error retrieving sales:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve sales',
      message: error.message
    });
  }
});

// GET /api/sales/:id - Get sale by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const sale = await prisma.sale.findUnique({
      where: { id },
      include: {
        customer: {
          select: { id: true, name: true, email: true, phone: true, address: true, city: true, state: true, zipCode: true, country: true }
        },
        user: {
          select: { id: true, username: true, firstName: true, lastName: true }
        },
        items: {
          include: {
            product: {
              select: { id: true, name: true, sku: true, barcode: true, imageUrl: true }
            },
            variant: {
              select: { id: true, name: true, sku: true, attributes: true }
            }
          }
        },
        loyaltyRewards: {
          select: { id: true, pointsUsed: true, rewardType: true, rewardValue: true, description: true }
        }
      }
    });

    if (!sale) {
      return res.status(404).json({
        success: false,
        error: 'Sale not found'
      });
    }

    // Parse variant attributes from JSON strings
    const saleWithParsedData = {
      ...sale,
      items: sale.items.map(item => ({
        ...item,
        variant: item.variant ? {
          ...item.variant,
          attributes: JSON.parse(item.variant.attributes)
        } : null
      }))
    };

    logger.info(`Sale retrieved successfully`, {
      userId: req.user.id,
      saleId: id,
      invoiceNumber: sale.invoiceNumber
    });

    res.json({
      success: true,
      data: saleWithParsedData
    });

  } catch (error) {
    logger.error('Error retrieving sale:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve sale',
      message: error.message
    });
  }
});

// POST /api/sales - Create new sale
router.post('/', authenticateToken, requireRole(['ADMIN', 'MANAGER', 'CASHIER']), async (req, res) => {
  try {
    const { error: validationError, value: validatedData } = saleSchema.validate(req.body);
    if (validationError) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: validationError.details
      });
    }

    const {
      customerId,
      items,
      subtotal,
      taxAmount,
      discountAmount,
      totalAmount,
      paymentMethod,
      notes,
      loyaltyPointsUsed
    } = validatedData;

    // Validate customer if provided
    if (customerId) {
      const customer = await prisma.customer.findUnique({
        where: { id: customerId }
      });
      if (!customer) {
        return res.status(400).json({
          success: false,
          error: 'Customer not found'
        });
      }
    }

    // Process loyalty points
    let loyaltyResult = { pointsEarned: 0, pointsUsed: 0, discountFromPoints: 0, newBalance: 0 };
    if (customerId) {
      try {
        loyaltyResult = await processLoyaltyPoints(customerId, totalAmount, loyaltyPointsUsed);
      } catch (error) {
        return res.status(400).json({
          success: false,
          error: error.message
        });
      }
    }

    // Generate invoice number
    const invoiceNumber = await generateInvoiceNumber();

    // Process sale in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create sale record
      const sale = await tx.sale.create({
        data: {
          invoiceNumber,
          customerId,
          userId: req.user.id,
          subtotal,
          taxAmount,
          discountAmount: discountAmount + loyaltyResult.discountFromPoints,
          totalAmount,
          paymentMethod,
          paymentStatus: 'COMPLETED',
          saleStatus: 'COMPLETED',
          notes,
          saleDate: new Date()
        }
      });

      // Process sale items and update inventory
      const saleItems = [];
      for (const item of items) {
        // Validate product/variant exists and has sufficient stock
        let product, variant, currentStock, itemPrice;

        if (item.variantId) {
          variant = await tx.variant.findUnique({
            where: { id: item.variantId },
            include: { product: true }
          });

          if (!variant) {
            throw new Error(`Variant ${item.variantId} not found`);
          }

          product = variant.product;
          currentStock = variant.stockQuantity;
          itemPrice = variant.price || product.price;
        } else {
          product = await tx.product.findUnique({
            where: { id: item.productId }
          });

          if (!product) {
            throw new Error(`Product ${item.productId} not found`);
          }

          currentStock = product.stockQuantity;
          itemPrice = product.price;
        }

        // Check stock availability
        if (currentStock < item.quantity) {
          throw new Error(`Insufficient stock for ${product.name}${variant ? ` (${variant.name})` : ''}. Available: ${currentStock}, Requested: ${item.quantity}`);
        }

        // Create sale item
        const saleItem = await tx.saleItem.create({
          data: {
            saleId: sale.id,
            productId: product.id,
            variantId: variant?.id || null,
            quantity: item.quantity,
            unitPrice: itemPrice,
            totalPrice: itemPrice * item.quantity,
            discount: item.discount
          }
        });

        saleItems.push(saleItem);

        // Update inventory
        if (variant) {
          await tx.variant.update({
            where: { id: variant.id },
            data: { stockQuantity: currentStock - item.quantity }
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
          await tx.product.update({
            where: { id: product.id },
            data: { stockQuantity: currentStock - item.quantity }
          });
        }

        // Create inventory adjustment record
        await tx.inventoryAdjustment.create({
          data: {
            productId: product.id,
            variantId: variant?.id || null,
            quantityChange: -item.quantity,
            previousStock: currentStock,
            newStock: currentStock - item.quantity,
            reason: 'SALE',
            notes: `Sold in sale ${invoiceNumber}`,
            adjustedById: req.user.id
          }
        });
      }

      // Update customer loyalty points if applicable
      if (customerId && (loyaltyResult.pointsEarned > 0 || loyaltyResult.pointsUsed > 0)) {
        await tx.customer.update({
          where: { id: customerId },
          data: {
            loyaltyPoints: loyaltyResult.newBalance,
            totalSpent: { increment: totalAmount }
          }
        });

        // Create loyalty reward record
        if (loyaltyResult.pointsEarned > 0) {
          await tx.loyaltyReward.create({
            data: {
              customerId,
              saleId: sale.id,
              pointsUsed: loyaltyResult.pointsUsed,
              rewardType: 'POINTS_MULTIPLIER',
              rewardValue: loyaltyResult.pointsEarned,
              description: `Earned ${loyaltyResult.pointsEarned} points for purchase`,
              isRedeemed: false,
              expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year
            }
          });
        }
      }

      return { sale, saleItems, loyaltyResult };
    });

    // Emit real-time updates
    const io = getSocketIO();
    if (io) {
      io.emit('saleCompleted', {
        saleId: result.sale.id,
        invoiceNumber: result.sale.invoiceNumber,
        totalAmount: result.sale.totalAmount,
        customerName: customerId ? 'Customer' : 'Walk-in Customer',
        cashier: req.user.username
      });

      // Emit inventory updates for sold items
      for (const item of items) {
        io.emit('inventoryUpdated', {
          productId: item.productId,
          variantId: item.variantId,
          quantityChange: -item.quantity,
          reason: 'SALE',
          saleId: result.sale.id
        });
      }
    }

    logger.info(`Sale completed successfully`, {
      userId: req.user.id,
      saleId: result.sale.id,
      invoiceNumber: result.sale.invoiceNumber,
      totalAmount: result.sale.totalAmount,
      itemCount: items.length,
      customerId
    });

    res.status(201).json({
      success: true,
      message: 'Sale completed successfully',
      data: {
        sale: result.sale,
        items: result.saleItems,
        loyalty: loyaltyResult,
        receipt: {
          invoiceNumber: result.sale.invoiceNumber,
          saleDate: result.sale.saleDate,
          totalAmount: result.sale.totalAmount,
          paymentMethod: result.sale.paymentMethod
        }
      }
    });

  } catch (error) {
    logger.error('Error creating sale:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create sale',
      message: error.message
    });
  }
});

// POST /api/sales/:id/refund - Process refund
router.post('/:id/refund', authenticateToken, requireRole(['ADMIN', 'MANAGER']), async (req, res) => {
  try {
    const { id: saleId } = req.params;
    const { error: validationError, value: validatedData } = refundSchema.validate(req.body);
    if (validationError) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: validationError.details
      });
    }

    const { items: refundItems, refundAmount, refundMethod, reason } = validatedData;

    // Process refund in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Get original sale
      const sale = await tx.sale.findUnique({
        where: { id: saleId },
        include: {
          items: {
            include: {
              product: true,
              variant: true
            }
          }
        }
      });

      if (!sale) {
        throw new Error('Sale not found');
      }

      if (sale.saleStatus === 'REFUNDED') {
        throw new Error('Sale has already been refunded');
      }

      // Process refund items and restore inventory
      for (const refundItem of refundItems) {
        const saleItem = await tx.saleItem.findUnique({
          where: { id: refundItem.saleItemId },
          include: { product: true, variant: true }
        });

        if (!saleItem) {
          throw new Error(`Sale item ${refundItem.saleItemId} not found`);
        }

        if (refundItem.quantity > saleItem.quantity) {
          throw new Error(`Refund quantity cannot exceed sold quantity`);
        }

        // Restore inventory
        if (saleItem.variantId) {
          await tx.variant.update({
            where: { id: saleItem.variantId },
            data: {
              stockQuantity: { increment: refundItem.quantity }
            }
          });

          // Update product stock
          const totalVariantStock = await tx.variant.aggregate({
            where: { productId: saleItem.productId, isActive: true },
            _sum: { stockQuantity: true }
          });

          await tx.product.update({
            where: { id: saleItem.productId },
            data: { stockQuantity: totalVariantStock._sum.stockQuantity || 0 }
          });
        } else {
          await tx.product.update({
            where: { id: saleItem.productId },
            data: {
              stockQuantity: { increment: refundItem.quantity }
            }
          });
        }

        // Create inventory adjustment record
        await tx.inventoryAdjustment.create({
          data: {
            productId: saleItem.productId,
            variantId: saleItem.variantId,
            quantityChange: refundItem.quantity,
            previousStock: saleItem.variantId ? 
              (await tx.variant.findUnique({ where: { id: saleItem.variantId } })).stockQuantity - refundItem.quantity :
              (await tx.product.findUnique({ where: { id: saleItem.productId } })).stockQuantity - refundItem.quantity,
            newStock: saleItem.variantId ? 
              (await tx.variant.findUnique({ where: { id: saleItem.variantId } })).stockQuantity :
              (await tx.product.findUnique({ where: { id: saleItem.productId } })).stockQuantity,
            reason: 'RETURN',
            notes: `Refund from sale ${sale.invoiceNumber}: ${refundItem.reason}`,
            adjustedById: req.user.id
          }
        });
      }

      // Update sale status
      const updatedSale = await tx.sale.update({
        where: { id: saleId },
        data: {
          saleStatus: 'REFUNDED',
          notes: sale.notes ? `${sale.notes}\n\nREFUND: ${refundAmount} via ${refundMethod}. Reason: ${refundItems.map(item => item.reason).join(', ')}` : 
                               `REFUND: ${refundAmount} via ${refundMethod}. Reason: ${refundItems.map(item => item.reason).join(', ')}`
        }
      });

      return { sale: updatedSale, refundAmount, refundMethod };
    });

    // Emit real-time updates
    const io = getSocketIO();
    if (io) {
      io.emit('refundProcessed', {
        saleId: result.sale.id,
        invoiceNumber: result.sale.invoiceNumber,
        refundAmount: result.refundAmount,
        refundMethod: result.refundMethod,
        processedBy: req.user.username
      });
    }

    logger.info(`Refund processed successfully`, {
      userId: req.user.id,
      saleId,
      refundAmount: result.refundAmount,
      refundMethod: result.refundMethod
    });

    res.json({
      success: true,
      message: 'Refund processed successfully',
      data: {
        sale: result.sale,
        refundAmount: result.refundAmount,
        refundMethod: result.refundMethod
      }
    });

  } catch (error) {
    logger.error('Error processing refund:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process refund',
      message: error.message
    });
  }
});

// GET /api/sales/:id/receipt - Generate receipt data
router.get('/:id/receipt', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const sale = await prisma.sale.findUnique({
      where: { id },
      include: {
        customer: {
          select: { name: true, email: true, phone: true }
        },
        user: {
          select: { firstName: true, lastName: true }
        },
        items: {
          include: {
            product: {
              select: { name: true, sku: true, barcode: true }
            },
            variant: {
              select: { name: true, sku: true, attributes: true }
            }
          }
        }
      }
    });

    if (!sale) {
      return res.status(404).json({
        success: false,
        error: 'Sale not found'
      });
    }

    // Generate receipt data
    const receipt = {
      invoiceNumber: sale.invoiceNumber,
      saleDate: sale.saleDate,
      cashier: `${sale.user.firstName} ${sale.user.lastName}`,
      customer: sale.customer ? {
        name: sale.customer.name,
        email: sale.customer.email,
        phone: sale.customer.phone
      } : null,
      items: sale.items.map(item => ({
        name: item.variant ? `${item.product.name} (${item.variant.name})` : item.product.name,
        sku: item.variant ? item.variant.sku : item.product.sku,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.totalPrice,
        discount: item.discount
      })),
      summary: {
        subtotal: sale.subtotal,
        taxAmount: sale.taxAmount,
        discountAmount: sale.discountAmount,
        totalAmount: sale.totalAmount
      },
      paymentMethod: sale.paymentMethod,
      notes: sale.notes
    };

    logger.info(`Receipt generated successfully`, {
      userId: req.user.id,
      saleId: id,
      invoiceNumber: sale.invoiceNumber
    });

    res.json({
      success: true,
      data: receipt
    });

  } catch (error) {
    logger.error('Error generating receipt:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate receipt',
      message: error.message
    });
  }
});

// GET /api/sales/cart/validate - Validate cart items
router.post('/cart/validate', authenticateToken, async (req, res) => {
  try {
    const { items } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Cart items are required'
      });
    }

    const validationResults = [];
    let totalSubtotal = 0;

    for (const item of items) {
      try {
        let product, variant, availableStock, unitPrice;

        if (item.variantId) {
          variant = await prisma.variant.findUnique({
            where: { id: item.variantId, isActive: true },
            include: { product: true }
          });

          if (!variant) {
            validationResults.push({
              ...item,
              valid: false,
              error: 'Variant not found or inactive'
            });
            continue;
          }

          product = variant.product;
          availableStock = variant.stockQuantity;
          unitPrice = variant.price || product.price;
        } else {
          product = await prisma.product.findUnique({
            where: { id: item.productId, isActive: true }
          });

          if (!product) {
            validationResults.push({
              ...item,
              valid: false,
              error: 'Product not found or inactive'
            });
            continue;
          }

          availableStock = product.stockQuantity;
          unitPrice = product.price;
        }

        // Check stock availability
        if (availableStock < item.quantity) {
          validationResults.push({
            ...item,
            valid: false,
            error: `Insufficient stock. Available: ${availableStock}, Requested: ${item.quantity}`,
            availableStock
          });
          continue;
        }

        // Calculate item total
        const itemTotal = unitPrice * item.quantity;
        totalSubtotal += itemTotal;

        validationResults.push({
          ...item,
          valid: true,
          productName: product.name,
          unitPrice,
          totalPrice: itemTotal,
          availableStock
        });

      } catch (error) {
        validationResults.push({
          ...item,
          valid: false,
          error: error.message
        });
      }
    }

    const validItems = validationResults.filter(item => item.valid);
    const invalidItems = validationResults.filter(item => !item.valid);

    // Calculate totals
    const taxAmount = calculateTax(totalSubtotal);
    const totalAmount = totalSubtotal + taxAmount;

    res.json({
      success: true,
      data: {
        items: validationResults,
        summary: {
          subtotal: totalSubtotal,
          taxAmount,
          totalAmount,
          itemCount: validItems.length
        },
        valid: invalidItems.length === 0,
        errors: invalidItems.map(item => ({
          productId: item.productId,
          variantId: item.variantId,
          error: item.error
        }))
      }
    });

  } catch (error) {
    logger.error('Error validating cart:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to validate cart',
      message: error.message
    });
  }
});

module.exports = router;
