const express = require('express');
const router = express.Router();

// GET /api/suppliers - Get all suppliers
router.get('/', (req, res) => {
  res.json({ message: 'Suppliers endpoint - to be implemented' });
});

// GET /api/suppliers/:id - Get supplier by ID
router.get('/:id', (req, res) => {
  res.json({ message: 'Get supplier by ID - to be implemented' });
});

// POST /api/suppliers - Create new supplier
router.post('/', (req, res) => {
  res.json({ message: 'Create supplier - to be implemented' });
});

// PUT /api/suppliers/:id - Update supplier
router.put('/:id', (req, res) => {
  res.json({ message: 'Update supplier - to be implemented' });
});

module.exports = router;
