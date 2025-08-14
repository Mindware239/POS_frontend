const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();

// Mock sales data (in real app, this would come from database)
let sales = [];
let saleIdCounter = 1;

// Mock products for stock management
let products = [
  { id: '1', name: 'Premium T-Shirt', price: 599, tax: 18, stock: 50 },
  { id: '2', name: 'Wireless Headphones', price: 1299, tax: 18, stock: 25 },
  { id: '3', name: 'Organic Coffee Beans', price: 299, tax: 5, stock: 100 }
];

// Validation middleware
const validateSale = [
  body('items').isArray({ min: 1 }).withMessage('At least one item is required'),
  body('items.*.productId').notEmpty().withMessage('Product ID is required'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('paymentMethod').isIn(['cash', 'upi', 'card', 'wallet', 'cheque', 'bank']).withMessage('Invalid payment method')
];

// @route   POST /api/sales
// @desc    Create a new sale
// @access  Private (Cashier/Manager)
router.post('/', validateSale, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      customerId,
      items,
      paymentMethod,
      receivedAmount,
      billDiscount,
      notes,
      cashierId,
      shiftId
    } = req.body;

    // Validate items and calculate totals
    let subtotal = 0;
    let taxTotal = 0;
    const saleItems = [];

    for (const item of items) {
      const product = products.find(p => p.id === item.productId);
      if (!product) {
        return res.status(400).json({ message: `Product ${item.productId} not found` });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({ 
          message: `Insufficient stock for ${product.name}. Available: ${product.stock}` 
        });
      }

      const itemTotal = (product.price * item.quantity) - (item.discount || 0);
      const itemTax = itemTotal * (product.tax / 100);
      
      subtotal += itemTotal;
      taxTotal += itemTax;

      saleItems.push({
        productId: item.productId,
        productName: product.name,
        quantity: item.quantity,
        price: product.price,
        discount: item.discount || 0,
        tax: product.tax,
        total: itemTotal,
        notes: item.notes || ''
      });

      // Update stock
      product.stock -= item.quantity;
    }

    const total = subtotal + taxTotal - (billDiscount || 0);
    const change = (receivedAmount || 0) - total;

    // Create sale record
    const newSale = {
      id: saleIdCounter++,
      invoiceNumber: `INV-${Date.now()}`,
      customerId: customerId || null,
      cashierId: cashierId || 'cashier-1',
      shiftId: shiftId || 'shift-1',
      saleDate: new Date(),
      saleType: 'retail',
      items: saleItems,
      subtotal: parseFloat(subtotal.toFixed(2)),
      tax: parseFloat(taxTotal.toFixed(2)),
      discount: parseFloat(billDiscount || 0),
      total: parseFloat(total.toFixed(2)),
      paymentMethod,
      receivedAmount: parseFloat(receivedAmount || 0),
      change: parseFloat(change.toFixed(2)),
      status: 'completed',
      paymentStatus: 'paid',
      notes: notes || '',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    sales.push(newSale);

    res.status(201).json({
      message: 'Sale created successfully',
      sale: newSale
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/sales
// @desc    Get all sales with filtering and pagination
// @access  Private (Admin/Manager)
router.get('/', async (req, res) => {
  try {
    const { 
      startDate, 
      endDate, 
      status, 
      paymentMethod, 
      cashierId,
      page = 1, 
      limit = 20 
    } = req.query;
    
    let filteredSales = [...sales];
    
    // Filter by date range
    if (startDate || endDate) {
      filteredSales = filteredSales.filter(sale => {
        const saleDate = new Date(sale.saleDate);
        const start = startDate ? new Date(startDate) : new Date(0);
        const end = endDate ? new Date(endDate) : new Date();
        return saleDate >= start && saleDate <= end;
      });
    }
    
    // Filter by status
    if (status) {
      filteredSales = filteredSales.filter(sale => sale.status === status);
    }
    
    // Filter by payment method
    if (paymentMethod) {
      filteredSales = filteredSales.filter(sale => sale.paymentMethod === paymentMethod);
    }
    
    // Filter by cashier
    if (cashierId) {
      filteredSales = filteredSales.filter(sale => sale.cashierId === cashierId);
    }
    
    // Sort by date (newest first)
    filteredSales.sort((a, b) => new Date(b.saleDate) - new Date(a.saleDate));
    
    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedSales = filteredSales.slice(startIndex, endIndex);
    
    res.json({
      sales: paginatedSales,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(filteredSales.length / limit),
        totalSales: filteredSales.length,
        hasNextPage: endIndex < filteredSales.length,
        hasPrevPage: page > 1
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/sales/:id
// @desc    Get sale by ID
// @access  Private (Admin/Manager/Cashier)
router.get('/:id', async (req, res) => {
  try {
    const sale = sales.find(s => s.id.toString() === req.params.id);
    
    if (!sale) {
      return res.status(404).json({ message: 'Sale not found' });
    }
    
    res.json(sale);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT /api/sales/:id
// @desc    Update sale status
// @access  Private (Admin/Manager)
router.put('/:id', [
  body('status').isIn(['draft', 'confirmed', 'completed', 'cancelled', 'refunded']).withMessage('Invalid status')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const saleIndex = sales.findIndex(s => s.id.toString() === req.params.id);
    
    if (saleIndex === -1) {
      return res.status(404).json({ message: 'Sale not found' });
    }

    const { status, notes } = req.body;
    
    // Update sale
    sales[saleIndex] = {
      ...sales[saleIndex],
      status,
      notes: notes || sales[saleIndex].notes,
      updatedAt: new Date()
    };

    res.json({
      message: 'Sale updated successfully',
      sale: sales[saleIndex]
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST /api/sales/:id/refund
// @desc    Process refund for a sale
// @access  Private (Admin/Manager)
router.post('/:id/refund', [
  body('refundAmount').isFloat({ min: 0 }).withMessage('Refund amount must be positive'),
  body('reason').notEmpty().withMessage('Refund reason is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const sale = sales.find(s => s.id.toString() === req.params.id);
    
    if (!sale) {
      return res.status(404).json({ message: 'Sale not found' });
    }

    if (sale.status !== 'completed') {
      return res.status(400).json({ message: 'Only completed sales can be refunded' });
    }

    const { refundAmount, reason, refundMethod } = req.body;

    if (refundAmount > sale.total) {
      return res.status(400).json({ message: 'Refund amount cannot exceed sale total' });
    }

    // Update sale status
    sale.status = 'refunded';
    sale.refund = {
      amount: refundAmount,
      reason,
      method: refundMethod || sale.paymentMethod,
      date: new Date()
    };
    sale.updatedAt = new Date();

    // Restore stock if full refund
    if (refundAmount === sale.total) {
      for (const item of sale.items) {
        const product = products.find(p => p.id === item.productId);
        if (product) {
          product.stock += item.quantity;
        }
      }
    }

    res.json({
      message: 'Refund processed successfully',
      sale
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/sales/reports/summary
// @desc    Get sales summary report
// @access  Private (Admin/Manager)
router.get('/reports/summary', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    let filteredSales = [...sales];
    
    // Filter by date range
    if (startDate || endDate) {
      filteredSales = filteredSales.filter(sale => {
        const saleDate = new Date(sale.saleDate);
        const start = startDate ? new Date(startDate) : new Date(0);
        const end = endDate ? new Date(endDate) : new Date();
        return saleDate >= start && saleDate <= end;
      });
    }
    
    // Calculate summary
    const summary = {
      totalSales: filteredSales.length,
      totalRevenue: parseFloat(filteredSales.reduce((sum, sale) => sum + sale.total, 0).toFixed(2)),
      totalTax: parseFloat(filteredSales.reduce((sum, sale) => sum + sale.tax, 0).toFixed(2)),
      totalDiscount: parseFloat(filteredSales.reduce((sum, sale) => sum + sale.discount, 0).toFixed(2)),
      averageOrderValue: filteredSales.length > 0 ? 
        parseFloat((filteredSales.reduce((sum, sale) => sum + sale.total, 0) / filteredSales.length).toFixed(2)) : 0,
      paymentMethods: {},
      topProducts: {}
    };
    
    // Payment method breakdown
    filteredSales.forEach(sale => {
      summary.paymentMethods[sale.paymentMethod] = (summary.paymentMethods[sale.paymentMethod] || 0) + 1;
    });
    
    // Top products
    const productSales = {};
    filteredSales.forEach(sale => {
      sale.items.forEach(item => {
        if (!productSales[item.productName]) {
          productSales[item.productName] = { quantity: 0, revenue: 0 };
        }
        productSales[item.productName].quantity += item.quantity;
        productSales[item.productName].revenue += item.total;
      });
    });
    
    summary.topProducts = Object.entries(productSales)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);
    
    res.json(summary);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
