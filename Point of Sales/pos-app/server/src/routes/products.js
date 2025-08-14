const express = require('express');
const Joi = require('joi');
const { PrismaClient } = require('@prisma/client');
const { authenticateToken, requireRole } = require('../middleware/auth');
const { logger } = require('../utils/logger');

const router = express.Router();
const prisma = new PrismaClient();

// Validation schemas
const productSchema = Joi.object({
  name: Joi.string().min(1).max(255).required(),
  description: Joi.string().max(1000).optional(),
  sku: Joi.string().min(1).max(100).required(),
  barcode: Joi.string().max(50).optional(),
  price: Joi.number().positive().precision(2).required(),
  costPrice: Joi.number().positive().precision(2).required(),
  comparePrice: Joi.number().positive().precision(2).optional(),
  weight: Joi.number().positive().precision(3).optional(),
  dimensions: Joi.string().max(50).optional(),
  isActive: Joi.boolean().default(true),
  isFeatured: Joi.boolean().default(false),
  tags: Joi.array().items(Joi.string()).max(20).optional(),
  imageUrl: Joi.string().uri().optional(),
  aiGeneratedImageUrl: Joi.string().uri().optional(),
  stockQuantity: Joi.number().integer().min(0).default(0),
  minStockLevel: Joi.number().integer().min(0).default(10),
  maxStockLevel: Joi.number().integer().min(0).optional(),
  lowStockAlert: Joi.boolean().default(true),
  categoryId: Joi.string().required()
});

const variantSchema = Joi.object({
  sku: Joi.string().min(1).max(100).required(),
  name: Joi.string().min(1).max(255).required(),
  attributes: Joi.object().required(),
  price: Joi.number().positive().precision(2).optional(),
  costPrice: Joi.number().positive().precision(2).optional(),
  stockQuantity: Joi.number().integer().min(0).default(0),
  minStockLevel: Joi.number().integer().min(0).default(5),
  maxStockLevel: Joi.number().integer().min(0).optional(),
  isActive: Joi.boolean().default(true)
});

// GET /api/products - Get all products with pagination and filters
router.get('/', authenticateToken, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search,
      categoryId,
      isActive,
      isFeatured,
      minPrice,
      maxPrice,
      lowStock,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Build where clause
    const where = {};
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } },
        { barcode: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (categoryId) where.categoryId = categoryId;
    if (isActive !== undefined) where.isActive = isActive === 'true';
    if (isFeatured !== undefined) where.isFeatured = isFeatured === 'true';
    if (minPrice) where.price = { gte: parseFloat(minPrice) };
    if (maxPrice) where.price = { lte: parseFloat(maxPrice) };
    if (lowStock === 'true') where.stockQuantity = { lte: prisma.raw('"minStockLevel"') };

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
              price: true,
              stockQuantity: true,
              isActive: true
            }
          },
          createdBy: {
            select: { id: true, username: true, firstName: true, lastName: true }
          },
          updatedBy: {
            select: { id: true, username: true, firstName: true, lastName: true }
          }
        },
        orderBy,
        skip,
        take: limitNum
      }),
      prisma.product.count({ where })
    ]);

    // Parse tags from JSON strings
    const productsWithParsedTags = products.map(product => ({
      ...product,
      tags: product.tags ? JSON.parse(product.tags) : []
    }));

    logger.info(`Products retrieved successfully`, {
      userId: req.user.id,
      count: productsWithParsedTags.length,
      total,
      page: pageNum
    });

    res.json({
      success: true,
      data: productsWithParsedTags,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    });

  } catch (error) {
    logger.error('Error retrieving products:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve products',
      message: error.message
    });
  }
});

// GET /api/products/:id - Get product by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: {
          select: { id: true, name: true, slug: true, description: true }
        },
        variants: {
          where: { isActive: true },
          select: {
            id: true,
            sku: true,
            name: true,
            attributes: true,
            price: true,
            costPrice: true,
            stockQuantity: true,
            minStockLevel: true,
            maxStockLevel: true,
            isActive: true,
            createdAt: true,
            updatedAt: true
          }
        },
        createdBy: {
          select: { id: true, username: true, firstName: true, lastName: true }
        },
        updatedBy: {
          select: { id: true, username: true, firstName: true, lastName: true }
        }
      }
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    // Parse tags from JSON string
    const productWithParsedTags = {
      ...product,
      tags: product.tags ? JSON.parse(product.tags) : []
    };

    // Parse variant attributes from JSON strings
    productWithParsedTags.variants = productWithParsedTags.variants.map(variant => ({
      ...variant,
      attributes: JSON.parse(variant.attributes)
    }));

    logger.info(`Product retrieved successfully`, {
      userId: req.user.id,
      productId: id
    });

    res.json({
      success: true,
      data: productWithParsedTags
    });

  } catch (error) {
    logger.error('Error retrieving product:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve product',
      message: error.message
    });
  }
});

// POST /api/products - Create new product
router.post('/', authenticateToken, requireRole(['ADMIN', 'MANAGER']), async (req, res) => {
  try {
    const { variants, ...productData } = req.body;

    // Validate product data
    const { error: productError, value: validatedProduct } = productSchema.validate(productData);
    if (productError) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: productError.details
      });
    }

    // Validate variants if provided
    if (variants && Array.isArray(variants)) {
      for (const variant of variants) {
        const { error: variantError } = variantSchema.validate(variant);
        if (variantError) {
          return res.status(400).json({
            success: false,
            error: 'Variant validation error',
            details: variantError.details
          });
        }
      }
    }

    // Check if SKU already exists
    const existingProduct = await prisma.product.findUnique({
      where: { sku: validatedProduct.sku }
    });

    if (existingProduct) {
      return res.status(400).json({
        success: false,
        error: 'SKU already exists'
      });
    }

    // Check if barcode already exists (if provided)
    if (validatedProduct.barcode) {
      const existingBarcode = await prisma.product.findUnique({
        where: { barcode: validatedProduct.barcode }
      });

      if (existingBarcode) {
        return res.status(400).json({
          success: false,
          error: 'Barcode already exists'
        });
      }
    }

    // Verify category exists
    const category = await prisma.category.findUnique({
      where: { id: validatedProduct.categoryId }
    });

    if (!category) {
      return res.status(400).json({
        success: false,
        error: 'Category not found'
      });
    }

    // Convert tags array to JSON string
    const productToCreate = {
      ...validatedProduct,
      tags: validatedProduct.tags ? JSON.stringify(validatedProduct.tags) : JSON.stringify([]),
      createdById: req.user.id,
      updatedById: req.user.id
    };

    // Create product with variants in a transaction
    const result = await prisma.$transaction(async (tx) => {
      const product = await tx.product.create({
        data: productToCreate,
        include: {
          category: {
            select: { id: true, name: true, slug: true }
          },
          createdBy: {
            select: { id: true, username: true, firstName: true, lastName: true }
          },
          updatedBy: {
            select: { id: true, username: true, firstName: true, lastName: true }
          }
        }
      });

      let createdVariants = [];
      if (variants && variants.length > 0) {
        const variantsToCreate = variants.map(variant => ({
          ...variant,
          productId: product.id,
          attributes: JSON.stringify(variant.attributes)
        }));

        createdVariants = await tx.variant.createMany({
          data: variantsToCreate
        });

        // Fetch created variants with full data
        createdVariants = await tx.variant.findMany({
          where: { productId: product.id },
          select: {
            id: true,
            sku: true,
            name: true,
            attributes: true,
            price: true,
            costPrice: true,
            stockQuantity: true,
            minStockLevel: true,
            maxStockLevel: true,
            isActive: true,
            createdAt: true,
            updatedAt: true
          }
        });
      }

      return { product, variants: createdVariants };
    });

    // Parse tags from JSON string for response
    const productResponse = {
      ...result.product,
      tags: JSON.parse(result.product.tags)
    };

    // Parse variant attributes from JSON strings
    const variantsResponse = result.variants.map(variant => ({
      ...variant,
      attributes: JSON.parse(variant.attributes)
    }));

    logger.info(`Product created successfully`, {
      userId: req.user.id,
      productId: result.product.id,
      productName: result.product.name
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: {
        ...productResponse,
        variants: variantsResponse
      }
    });

  } catch (error) {
    logger.error('Error creating product:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create product',
      message: error.message
    });
  }
});

// PUT /api/products/:id - Update product
router.put('/:id', authenticateToken, requireRole(['ADMIN', 'MANAGER']), async (req, res) => {
  try {
    const { id } = req.params;
    const { variants, ...productData } = req.body;

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id },
      include: { variants: true }
    });

    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    // Validate product data
    const { error: productError, value: validatedProduct } = productSchema.validate(productData);
    if (productError) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: productError.details
      });
    }

    // Check if new SKU conflicts with other products
    if (validatedProduct.sku !== existingProduct.sku) {
      const skuConflict = await prisma.product.findUnique({
        where: { sku: validatedProduct.sku }
      });

      if (skuConflict) {
        return res.status(400).json({
          success: false,
          error: 'SKU already exists'
        });
      }
    }

    // Check if new barcode conflicts with other products
    if (validatedProduct.barcode && validatedProduct.barcode !== existingProduct.barcode) {
      const barcodeConflict = await prisma.product.findUnique({
        where: { barcode: validatedProduct.barcode }
      });

      if (barcodeConflict) {
        return res.status(400).json({
          success: false,
          error: 'Barcode already exists'
        });
      }
    }

    // Verify category exists
    const category = await prisma.category.findUnique({
      where: { id: validatedProduct.categoryId }
    });

    if (!category) {
      return res.status(400).json({
        success: false,
        error: 'Category not found'
      });
    }

    // Convert tags array to JSON string
    const productToUpdate = {
      ...validatedProduct,
      tags: validatedProduct.tags ? JSON.stringify(validatedProduct.tags) : JSON.stringify([]),
      updatedById: req.user.id
    };

    // Update product and variants in a transaction
    const result = await prisma.$transaction(async (tx) => {
      const product = await tx.product.update({
        where: { id },
        data: productToUpdate,
        include: {
          category: {
            select: { id: true, name: true, slug: true }
          },
          createdBy: {
            select: { id: true, username: true, firstName: true, lastName: true }
          },
          updatedBy: {
            select: { id: true, username: true, firstName: true, lastName: true }
          }
        }
      });

      let updatedVariants = [];
      if (variants && Array.isArray(variants)) {
        // Delete existing variants
        await tx.variant.deleteMany({
          where: { productId: id }
        });

        // Create new variants
        const variantsToCreate = variants.map(variant => ({
          ...variant,
          productId: id,
          attributes: JSON.stringify(variant.attributes)
        }));

        await tx.variant.createMany({
          data: variantsToCreate
        });

        // Fetch updated variants
        updatedVariants = await tx.variant.findMany({
          where: { productId: id },
          select: {
            id: true,
            sku: true,
            name: true,
            attributes: true,
            price: true,
            costPrice: true,
            stockQuantity: true,
            minStockLevel: true,
            maxStockLevel: true,
            isActive: true,
            createdAt: true,
            updatedAt: true
          }
        });
      } else {
        // Keep existing variants
        updatedVariants = existingProduct.variants;
      }

      return { product, variants: updatedVariants };
    });

    // Parse tags from JSON string for response
    const productResponse = {
      ...result.product,
      tags: JSON.parse(result.product.tags)
    };

    // Parse variant attributes from JSON strings
    const variantsResponse = result.variants.map(variant => ({
      ...variant,
      attributes: JSON.parse(variant.attributes)
    }));

    logger.info(`Product updated successfully`, {
      userId: req.user.id,
      productId: id,
      productName: result.product.name
    });

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: {
        ...productResponse,
        variants: variantsResponse
      }
    });

  } catch (error) {
    logger.error('Error updating product:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update product',
      message: error.message
    });
  }
});

// DELETE /api/products/:id - Soft delete product
router.delete('/:id', authenticateToken, requireRole(['ADMIN']), async (req, res) => {
  try {
    const { id } = req.params;

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id }
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    // Check if product has active sales
    const activeSales = await prisma.saleItem.findFirst({
      where: { productId: id }
    });

    if (activeSales) {
      return res.status(400).json({
        success: false,
        error: 'Cannot delete product with sales history'
      });
    }

    // Soft delete product and variants
    await prisma.$transaction(async (tx) => {
      await tx.variant.updateMany({
        where: { productId: id },
        data: { isActive: false }
      });

      await tx.product.update({
        where: { id },
        data: { isActive: false, updatedById: req.user.id }
      });
    });

    logger.info(`Product soft deleted successfully`, {
      userId: req.user.id,
      productId: id,
      productName: product.name
    });

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });

  } catch (error) {
    logger.error('Error deleting product:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete product',
      message: error.message
    });
  }
});

// GET /api/products/:id/variants - Get product variants
router.get('/:id/variants', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const variants = await prisma.variant.findMany({
      where: { 
        productId: id,
        isActive: true
      },
      select: {
        id: true,
        sku: true,
        name: true,
        attributes: true,
        price: true,
        costPrice: true,
        stockQuantity: true,
        minStockLevel: true,
        maxStockLevel: true,
        isActive: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: { createdAt: 'asc' }
    });

    // Parse attributes from JSON strings
    const variantsWithParsedAttributes = variants.map(variant => ({
      ...variant,
      attributes: JSON.parse(variant.attributes)
    }));

    logger.info(`Product variants retrieved successfully`, {
      userId: req.user.id,
      productId: id,
      variantCount: variantsWithParsedAttributes.length
    });

    res.json({
      success: true,
      data: variantsWithParsedAttributes
    });

  } catch (error) {
    logger.error('Error retrieving product variants:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve product variants',
      message: error.message
    });
  }
});

// POST /api/products/:id/variants - Add variant to product
router.post('/:id/variants', authenticateToken, requireRole(['ADMIN', 'MANAGER']), async (req, res) => {
  try {
    const { id: productId } = req.params;
    const variantData = req.body;

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId }
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    // Validate variant data
    const { error: variantError, value: validatedVariant } = variantSchema.validate(variantData);
    if (variantError) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: variantError.details
      });
    }

    // Check if SKU already exists
    const existingVariant = await prisma.variant.findUnique({
      where: { sku: validatedVariant.sku }
    });

    if (existingVariant) {
      return res.status(400).json({
        success: false,
        error: 'Variant SKU already exists'
      });
    }

    // Create variant
    const variant = await prisma.variant.create({
      data: {
        ...validatedVariant,
        productId,
        attributes: JSON.stringify(validatedVariant.attributes)
      },
      select: {
        id: true,
        sku: true,
        name: true,
        attributes: true,
        price: true,
        costPrice: true,
        stockQuantity: true,
        minStockLevel: true,
        maxStockLevel: true,
        isActive: true,
        createdAt: true,
        updatedAt: true
      }
    });

    // Parse attributes from JSON string for response
    const variantResponse = {
      ...variant,
      attributes: JSON.parse(variant.attributes)
    };

    logger.info(`Product variant created successfully`, {
      userId: req.user.id,
      productId,
      variantId: variant.id,
      variantSku: variant.sku
    });

    res.status(201).json({
      success: true,
      message: 'Variant created successfully',
      data: variantResponse
    });

  } catch (error) {
    logger.error('Error creating product variant:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create variant',
      message: error.message
    });
  }
});

module.exports = router;
