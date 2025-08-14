const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();

// Mock payments data (in real app, this would come from database)
let payments = [];

// @route   POST /api/payments/process
// @desc    Process a payment
// @access  Private (Cashier/Manager)
router.post('/process', [
  body('amount').isFloat({ min: 0 }).withMessage('Amount must be positive'),
  body('method').isIn(['cash', 'upi', 'card', 'wallet', 'cheque', 'bank']).withMessage('Invalid payment method'),
  body('saleId').notEmpty().withMessage('Sale ID is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { amount, method, saleId, receivedAmount, notes } = req.body;

    const payment = {
      id: (payments.length + 1).toString(),
      saleId,
      amount: parseFloat(amount),
      method,
      receivedAmount: parseFloat(receivedAmount || amount),
      change: parseFloat((receivedAmount || amount) - amount),
      status: 'completed',
      notes: notes || '',
      createdAt: new Date()
    };

    payments.push(payment);

    res.status(201).json({
      message: 'Payment processed successfully',
      payment
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/payments
// @desc    Get all payments
// @access  Private (Admin/Manager)
router.get('/', async (req, res) => {
  try {
    const { method, status, startDate, endDate, page = 1, limit = 20 } = req.query;
    
    let filteredPayments = [...payments];
    
    // Filter by method
    if (method) {
      filteredPayments = filteredPayments.filter(payment => payment.method === method);
    }
    
    // Filter by status
    if (status) {
      filteredPayments = filteredPayments.filter(payment => payment.status === status);
    }
    
    // Filter by date range
    if (startDate || endDate) {
      filteredPayments = filteredPayments.filter(payment => {
        const paymentDate = new Date(payment.createdAt);
        const start = startDate ? new Date(startDate) : new Date(0);
        const end = endDate ? new Date(endDate) : new Date();
        return paymentDate >= start && paymentDate <= end;
      });
    }
    
    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedPayments = filteredPayments.slice(startIndex, endIndex);
    
    res.json({
      payments: paginatedPayments,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(filteredPayments.length / limit),
        totalPayments: filteredPayments.length,
        hasNextPage: endIndex < filteredPayments.length,
        hasPrevPage: page > 1
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/payments/summary
// @desc    Get payment summary
// @access  Private (Admin/Manager)
router.get('/summary', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    let filteredPayments = [...payments];
    
    // Filter by date range
    if (startDate || endDate) {
      filteredPayments = filteredPayments.filter(payment => {
        const paymentDate = new Date(payment.createdAt);
        const start = startDate ? new Date(startDate) : new Date(0);
        const end = endDate ? new Date(endDate) : new Date();
        return paymentDate >= start && paymentDate <= end;
      });
    }
    
    const summary = {
      totalPayments: filteredPayments.length,
      totalAmount: parseFloat(filteredPayments.reduce((sum, payment) => sum + payment.amount, 0).toFixed(2)),
      methodBreakdown: {},
      averagePayment: filteredPayments.length > 0 ? 
        parseFloat((filteredPayments.reduce((sum, payment) => sum + payment.amount, 0) / filteredPayments.length).toFixed(2)) : 0
    };
    
    // Payment method breakdown
    filteredPayments.forEach(payment => {
      summary.methodBreakdown[payment.method] = (summary.methodBreakdown[payment.method] || 0) + 1;
    });
    
    res.json(summary);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
