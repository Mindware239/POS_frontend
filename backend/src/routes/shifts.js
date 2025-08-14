const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();

// Mock shifts data (in real app, this would come from database)
let shifts = [];

// @route   POST /api/shifts/open
// @desc    Open a new shift
// @access  Private (Cashier/Manager)
router.post('/open', [
  body('cashierId').notEmpty().withMessage('Cashier ID is required'),
  body('openingAmount').isFloat({ min: 0 }).withMessage('Opening amount must be positive')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { cashierId, openingAmount, notes } = req.body;

    const shift = {
      id: (shifts.length + 1).toString(),
      cashierId,
      openingAmount: parseFloat(openingAmount),
      openingTime: new Date(),
      status: 'open',
      notes: notes || '',
      sales: [],
      payments: [],
      createdAt: new Date()
    };

    shifts.push(shift);

    res.status(201).json({
      message: 'Shift opened successfully',
      shift
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST /api/shifts/:id/close
// @desc    Close a shift
// @access  Private (Cashier/Manager)
router.post('/:id/close', [
  body('closingAmount').isFloat({ min: 0 }).withMessage('Closing amount must be positive')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const shift = shifts.find(s => s.id === req.params.id);
    if (!shift) {
      return res.status(404).json({ message: 'Shift not found' });
    }

    if (shift.status !== 'open') {
      return res.status(400).json({ message: 'Shift is already closed' });
    }

    const { closingAmount, notes } = req.body;

    shift.closingAmount = parseFloat(closingAmount);
    shift.closingTime = new Date();
    shift.status = 'closed';
    shift.notes = notes || shift.notes;
    shift.updatedAt = new Date();

    res.json({
      message: 'Shift closed successfully',
      shift
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/shifts
// @desc    Get all shifts
// @access  Private (Admin/Manager)
router.get('/', async (req, res) => {
  try {
    const { status, cashierId, startDate, endDate, page = 1, limit = 20 } = req.query;
    
    let filteredShifts = [...shifts];
    
    // Filter by status
    if (status) {
      filteredShifts = filteredShifts.filter(shift => shift.status === status);
    }
    
    // Filter by cashier
    if (cashierId) {
      filteredShifts = filteredShifts.filter(shift => shift.cashierId === cashierId);
    }
    
    // Filter by date range
    if (startDate || endDate) {
      filteredShifts = filteredShifts.filter(shift => {
        const shiftDate = new Date(shift.openingTime);
        const start = startDate ? new Date(startDate) : new Date(0);
        const end = endDate ? new Date(endDate) : new Date();
        return shiftDate >= start && shiftDate <= end;
      });
    }
    
    // Sort by opening time (newest first)
    filteredShifts.sort((a, b) => new Date(b.openingTime) - new Date(a.openingTime));
    
    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedShifts = filteredShifts.slice(startIndex, endIndex);
    
    res.json({
      shifts: paginatedShifts,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(filteredShifts.length / limit),
        totalShifts: filteredShifts.length,
        hasNextPage: endIndex < filteredShifts.length,
        hasPrevPage: page > 1
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/shifts/:id
// @desc    Get shift by ID
// @access  Private (Admin/Manager/Cashier)
router.get('/:id', async (req, res) => {
  try {
    const shift = shifts.find(s => s.id === req.params.id);
    
    if (!shift) {
      return res.status(404).json({ message: 'Shift not found' });
    }
    
    res.json(shift);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/shifts/current/:cashierId
// @desc    Get current open shift for a cashier
// @access  Private (Cashier/Manager)
router.get('/current/:cashierId', async (req, res) => {
  try {
    const currentShift = shifts.find(s => 
      s.cashierId === req.params.cashierId && s.status === 'open'
    );
    
    if (!currentShift) {
      return res.status(404).json({ message: 'No open shift found' });
    }
    
    res.json(currentShift);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
