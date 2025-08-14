const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();

// Mock products data (in real app, this would come from database)
let products = [
  {
    id: '1',
    sku: 'TS001',
    barcode: '1234567890123',
    name: 'Premium T-Shirt',
    description: 'High-quality cotton t-shirt',
    category: 'Clothing',
    brand: 'Mindware',
    price: 599,
    costPrice: 300,
    wholesalePrice: 450,
    tax: 18,
    stock: 50,
    minStock: 10,
    maxStock: 100,
    status: 'active',
    images: [],
    variants: [],
    metadata: {}
  },
  {
    id: '2',
    sku: 'WH001',
    barcode: '9876543210987',
    name: 'Wireless Headphones',
    description: 'Bluetooth wireless headphones',
    category: 'Electronics',
    brand: 'Mindware',
    price: 1299,
    costPrice: 800,
    wholesalePrice: 1100,
    tax: 18,
    stock: 25,
    minStock: 5,
    maxStock: 50,
    status: 'active',
    images: [],
    variants: [],
    metadata: {}
  },
  {
    id: '3',
    sku: 'CB001',
    barcode: '4567891230456',
    name: 'Organic Coffee Beans',
    description: 'Premium organic coffee beans',
    category: 'Food',
    brand: 'Mindware',
    price: 299,
    costPrice: 150,
    wholesalePrice: 250,
    tax: 5,
    stock: 100,
    minStock: 20,
    maxStock: 200,
    status: 'active',
    images: [],
    variants: [],
    metadata: {}
  }
];

// Validation middleware
const validateProduct = [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('sku').trim().isLength({ min: 3 }).withMessage('SKU must be at least 3 characters'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('stock').isInt({ min: 0 }).withMessage('Stock must be a positive integer'),
  body('tax').isFloat({ min: 0, max: 100 }).withMessage('Tax must be between 0 and 100')
];

// @route   GET /api/products
// @desc    Get all products
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { search, category, status, page = 1, limit = 20 } = req.query;
    
    let filteredProducts = [...products];
    
    // Search by name, SKU, or barcode
    if (search) {
      const searchLower = search.toLowerCase();
      filteredProducts = filteredProducts.filter(product =>
        product.name.toLowerCase().includes(searchLower) ||
        product.sku.toLowerCase().includes(searchLower) ||
        product.barcode.includes(search)
      );
    }
    
    // Filter by category
    if (category) {
      filteredProducts = filteredProducts.filter(product =>
        product.category.toLowerCase() === category.toLowerCase()
      );
    }
    
    // Filter by status
    if (status) {
      filteredProducts = filteredProducts.filter(product =>
        product.status === status
      );
    }
    
    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
    
    res.json({
      products: paginatedProducts,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(filteredProducts.length / limit),
        totalProducts: filteredProducts.length,
        hasNextPage: endIndex < filteredProducts.length,
        hasPrevPage: page > 1
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/products/:id
// @desc    Get product by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const product = products.find(p => p.id === req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json(product);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST /api/products
// @desc    Create a new product
// @access  Private (Admin/Manager)
router.post('/', validateProduct, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      name, description, category, brand, price, costPrice,
      wholesalePrice, tax, stock, minStock, maxStock, barcode
    } = req.body;

    // Check if SKU already exists
    const existingSku = products.find(p => p.sku === req.body.sku);
    if (existingSku) {
      return res.status(400).json({ message: 'SKU already exists' });
    }

    // Check if barcode already exists
    if (barcode) {
      const existingBarcode = products.find(p => p.barcode === barcode);
      if (existingBarcode) {
        return res.status(400).json({ message: 'Barcode already exists' });
      }
    }

    const newProduct = {
      id: (products.length + 1).toString(),
      sku: req.body.sku,
      barcode: barcode || '',
      name,
      description: description || '',
      category,
      brand: brand || 'Mindware',
      price: parseFloat(price),
      costPrice: parseFloat(costPrice) || 0,
      wholesalePrice: parseFloat(wholesalePrice) || 0,
      tax: parseFloat(tax) || 0,
      stock: parseInt(stock) || 0,
      minStock: parseInt(minStock) || 0,
      maxStock: parseInt(maxStock) || 0,
      status: 'active',
      images: [],
      variants: [],
      metadata: {},
      createdAt: new Date(),
      updatedAt: new Date()
    };

    products.push(newProduct);
    res.status(201).json(newProduct);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT /api/products/:id
// @desc    Update a product
// @access  Private (Admin/Manager)
router.put('/:id', validateProduct, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const productIndex = products.findIndex(p => p.id === req.params.id);
    
    if (productIndex === -1) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if SKU already exists (excluding current product)
    if (req.body.sku && req.body.sku !== products[productIndex].sku) {
      const existingSku = products.find(p => p.sku === req.body.sku);
      if (existingSku) {
        return res.status(400).json({ message: 'SKU already exists' });
      }
    }

    // Update product
    products[productIndex] = {
      ...products[productIndex],
      ...req.body,
      updatedAt: new Date()
    };

    res.json(products[productIndex]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   DELETE /api/products/:id
// @desc    Delete a product
// @access  Private (Admin)
router.delete('/:id', async (req, res) => {
  try {
    const productIndex = products.findIndex(p => p.id === req.params.id);
    
    if (productIndex === -1) {
      return res.status(404).json({ message: 'Product not found' });
    }

    products.splice(productIndex, 1);
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST /api/products/:id/stock
// @desc    Update product stock
// @access  Private (Admin/Manager/Cashier)
router.post('/:id/stock', [
  body('quantity').isInt().withMessage('Quantity must be an integer'),
  body('type').isIn(['add', 'remove', 'set']).withMessage('Type must be add, remove, or set')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const product = products.find(p => p.id === req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const { quantity, type, reason = '' } = req.body;
    let newStock = product.stock;

    switch (type) {
      case 'add':
        newStock += quantity;
        break;
      case 'remove':
        newStock -= quantity;
        if (newStock < 0) {
          return res.status(400).json({ message: 'Insufficient stock' });
        }
        break;
      case 'set':
        newStock = quantity;
        break;
    }

    product.stock = newStock;
    product.updatedAt = new Date();

    // Add stock history (in real app, this would go to a separate table)
    if (!product.metadata.stockHistory) {
      product.metadata.stockHistory = [];
    }

    product.metadata.stockHistory.push({
      date: new Date(),
      type,
      quantity,
      reason,
      previousStock: product.stock - (type === 'add' ? quantity : type === 'remove' ? -quantity : 0),
      newStock: product.stock
    });

    res.json({
      message: 'Stock updated successfully',
      product: {
        id: product.id,
        name: product.name,
        stock: product.stock,
        updatedAt: product.updatedAt
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
