const express = require('express');
const router = express.Router();

// Placeholder suppliers routes - to be implemented
router.get('/', (req, res) => {
  res.json({ message: 'Suppliers API - to be implemented' });
});

router.post('/', (req, res) => {
  res.json({ message: 'Create supplier - to be implemented' });
});

router.put('/:id', (req, res) => {
  res.json({ message: 'Update supplier - to be implemented' });
});

router.delete('/:id', (req, res) => {
  res.json({ message: 'Delete supplier - to be implemented' });
});

module.exports = router;
