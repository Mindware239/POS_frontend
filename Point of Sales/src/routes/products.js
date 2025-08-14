const express = require('express');
const router = express.Router();

// GET /api/products - Get all products
router.get('/', (req, res) => {
  res.json({ message: 'Products endpoint - to be implemented' });
});

// GET /api/products/:id - Get product by ID
router.get('/:id', (req, res) => {
  res.json({ message: 'Get product by ID - to be implemented' });
});

// POST /api/products - Create new product
router.post('/', (req, res) => {
  res.json({ message: 'Create product - to be implemented' });
});

// PUT /api/products/:id - Update product
router.put('/:id', (req, res) => {
  res.json({ message: 'Update product - to be implemented' });
});

// DELETE /api/products/:id - Delete product
router.delete('/:id', (req, res) => {
  res.json({ message: 'Delete product - to be implemented' });
});

module.exports = router;
