const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();

// Mock customers data (in real app, this would come from database)
let customers = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+91-9876543210',
    address: '123 Main St, City',
    gstNumber: 'GST123456789',
    customerType: 'retail',
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '+91-9876543211',
    address: '456 Oak Ave, Town',
    gstNumber: 'GST987654321',
    customerType: 'wholesale',
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Validation middleware
const validateCustomer = [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('phone').notEmpty().withMessage('Phone number is required')
];

// @route   GET /api/customers
// @desc    Get all customers
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { search, customerType, status, page = 1, limit = 20 } = req.query;
    
    let filteredCustomers = [...customers];
    
    // Search by name, email, or phone
    if (search) {
      const searchLower = search.toLowerCase();
      filteredCustomers = filteredCustomers.filter(customer =>
        customer.name.toLowerCase().includes(searchLower) ||
        customer.email.toLowerCase().includes(searchLower) ||
        customer.phone.includes(search)
      );
    }
    
    // Filter by customer type
    if (customerType) {
      filteredCustomers = filteredCustomers.filter(customer =>
        customer.customerType === customerType
      );
    }
    
    // Filter by status
    if (status) {
      filteredCustomers = filteredCustomers.filter(customer =>
        customer.status === status
      );
    }
    
    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedCustomers = filteredCustomers.slice(startIndex, endIndex);
    
    res.json({
      customers: paginatedCustomers,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(filteredCustomers.length / limit),
        totalCustomers: filteredCustomers.length,
        hasNextPage: endIndex < filteredCustomers.length,
        hasPrevPage: page > 1
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/customers/:id
// @desc    Get customer by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const customer = customers.find(c => c.id === req.params.id);
    
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    
    res.json(customer);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST /api/customers
// @desc    Create a new customer
// @access  Private (Admin/Manager)
router.post('/', validateCustomer, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      name, email, phone, address, gstNumber, customerType
    } = req.body;

    // Check if email already exists
    const existingEmail = customers.find(c => c.email === email);
    if (existingEmail) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const newCustomer = {
      id: (customers.length + 1).toString(),
      name,
      email,
      phone,
      address: address || '',
      gstNumber: gstNumber || '',
      customerType: customerType || 'retail',
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    customers.push(newCustomer);
    res.status(201).json(newCustomer);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT /api/customers/:id
// @desc    Update a customer
// @access  Private (Admin/Manager)
router.put('/:id', validateCustomer, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const customerIndex = customers.findIndex(c => c.id === req.params.id);
    
    if (customerIndex === -1) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    // Check if email already exists (excluding current customer)
    if (req.body.email && req.body.email !== customers[customerIndex].email) {
      const existingEmail = customers.find(c => c.email === req.body.email);
      if (existingEmail) {
        return res.status(400).json({ message: 'Email already exists' });
      }
    }

    // Update customer
    customers[customerIndex] = {
      ...customers[customerIndex],
      ...req.body,
      updatedAt: new Date()
    };

    res.json(customers[customerIndex]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   DELETE /api/customers/:id
// @desc    Delete a customer
// @access  Private (Admin)
router.delete('/:id', async (req, res) => {
  try {
    const customerIndex = customers.findIndex(c => c.id === req.params.id);
    
    if (customerIndex === -1) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    customers.splice(customerIndex, 1);
    res.json({ message: 'Customer deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
