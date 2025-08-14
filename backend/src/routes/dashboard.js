const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');

// Mock data for dashboard (in real app, this would come from database)
let dashboardData = {
  totalSales: 0,
  totalRevenue: 0,
  totalProducts: 0,
  totalCustomers: 0,
  lowStockProducts: 0,
  pendingPayments: 0,
  todaySales: 0,
  todayRevenue: 0
};

// Mock recent activities
let recentActivities = [
  {
    id: 1,
    type: 'sale',
    message: 'New sale completed - INV-001',
    timestamp: new Date(),
    amount: 1299,
    user: 'Cashier 1'
  },
  {
    id: 2,
    type: 'product',
    message: 'Low stock alert - Wireless Headphones',
    timestamp: new Date(Date.now() - 3600000),
    severity: 'warning'
  },
  {
    id: 3,
    type: 'customer',
    message: 'New customer registered - John Doe',
    timestamp: new Date(Date.now() - 7200000)
  }
];

// Mock sales data for charts
let salesData = {
  daily: [
    { date: '2024-01-01', sales: 5, revenue: 2500 },
    { date: '2024-01-02', sales: 8, revenue: 4200 },
    { date: '2024-01-03', sales: 12, revenue: 6800 },
    { date: '2024-01-04', sales: 6, revenue: 3100 },
    { date: '2024-01-05', sales: 15, revenue: 8900 },
    { date: '2024-01-06', sales: 10, revenue: 5400 },
    { date: '2024-01-07', sales: 7, revenue: 3800 }
  ],
  weekly: [
    { week: 'Week 1', sales: 25, revenue: 14500 },
    { week: 'Week 2', sales: 32, revenue: 18900 },
    { week: 'Week 3', sales: 28, revenue: 16200 },
    { week: 'Week 4', sales: 35, revenue: 20100 }
  ],
  monthly: [
    { month: 'Jan', sales: 120, revenue: 69600 },
    { month: 'Feb', sales: 135, revenue: 78400 },
    { month: 'Mar', sales: 142, revenue: 82300 },
    { month: 'Apr', sales: 128, revenue: 74100 }
  ]
};

// Mock top products
let topProducts = [
  { name: 'Wireless Headphones', sales: 45, revenue: 58455, stock: 25 },
  { name: 'Premium T-Shirt', sales: 38, revenue: 22762, stock: 50 },
  { name: 'Organic Coffee Beans', sales: 32, revenue: 9568, stock: 100 },
  { name: 'LED Desk Lamp', sales: 28, revenue: 16772, stock: 30 },
  { name: 'Yoga Mat', sales: 25, revenue: 6225, stock: 60 }
];

// Mock low stock alerts
let lowStockAlerts = [
  { product: 'Wireless Headphones', currentStock: 5, minStock: 10, status: 'critical' },
  { product: 'LED Desk Lamp', currentStock: 8, minStock: 10, status: 'warning' },
  { product: 'Yoga Mat', currentStock: 12, minStock: 15, status: 'warning' }
];

// @route   GET /api/dashboard/overview
// @desc    Get main dashboard overview
// @access  Private
router.get('/overview', async (req, res) => {
  try {
    // Calculate dashboard metrics
    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    
    // In real app, these would be database queries
    dashboardData = {
      totalSales: 1250,
      totalRevenue: 725000,
      totalProducts: 156,
      totalCustomers: 89,
      lowStockProducts: lowStockAlerts.length,
      pendingPayments: 45000,
      todaySales: 15,
      todayRevenue: 8900
    };

    res.json({
      success: true,
      data: dashboardData
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/dashboard/quick-stats
// @desc    Get quick statistics for dashboard cards
// @access  Private
router.get('/quick-stats', async (req, res) => {
  try {
    const stats = {
      sales: {
        today: dashboardData.todaySales,
        week: 89,
        month: 342,
        growth: '+12.5%'
      },
      revenue: {
        today: dashboardData.todayRevenue,
        week: 45600,
        month: 189000,
        growth: '+8.3%'
      },
      products: {
        total: dashboardData.totalProducts,
        active: 142,
        inactive: 14,
        lowStock: dashboardData.lowStockProducts
      },
      customers: {
        total: dashboardData.totalCustomers,
        new: 12,
        returning: 67,
        vip: 10
      }
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/dashboard/recent-activities
// @desc    Get recent activities for dashboard
// @access  Private
router.get('/recent-activities', async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const activities = recentActivities.slice(0, parseInt(limit));

    res.json({
      success: true,
      data: activities
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/dashboard/sales-chart
// @desc    Get sales data for charts
// @access  Private
router.get('/sales-chart', async (req, res) => {
  try {
    const { period = 'daily' } = req.query;
    let chartData = [];

    switch (period) {
      case 'daily':
        chartData = salesData.daily;
        break;
      case 'weekly':
        chartData = salesData.weekly;
        break;
      case 'monthly':
        chartData = salesData.monthly;
        break;
      default:
        chartData = salesData.daily;
    }

    res.json({
      success: true,
      data: chartData
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/dashboard/top-products
// @desc    Get top selling products
// @access  Private
router.get('/top-products', async (req, res) => {
  try {
    const { limit = 5 } = req.query;
    const products = topProducts.slice(0, parseInt(limit));

    res.json({
      success: true,
      data: products
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/dashboard/low-stock-alerts
// @desc    Get low stock product alerts
// @access  Private
router.get('/low-stock-alerts', async (req, res) => {
  try {
    const { status } = req.query;
    let alerts = lowStockAlerts;

    if (status) {
      alerts = lowStockAlerts.filter(alert => alert.status === status);
    }

    res.json({
      success: true,
      data: alerts
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/dashboard/navigation
// @desc    Get navigation menu with permissions
// @access  Private
router.get('/navigation', async (req, res) => {
  try {
    const navigation = [
      {
        id: 'dashboard',
        title: 'Dashboard',
        icon: 'dashboard',
        path: '/dashboard',
        permissions: ['admin', 'manager', 'cashier']
      },
      {
        id: 'pos',
        title: 'New Sale',
        icon: 'point-of-sale',
        path: '/pos',
        permissions: ['admin', 'manager', 'cashier']
      },
      {
        id: 'sales',
        title: 'Sales History',
        icon: 'receipt',
        path: '/sales',
        permissions: ['admin', 'manager', 'cashier']
      },
      {
        id: 'returns',
        title: 'Returns & Exchanges',
        icon: 'swap-horiz',
        path: '/returns',
        permissions: ['admin', 'manager']
      },
      {
        id: 'dues',
        title: 'Due Collection',
        icon: 'account-balance-wallet',
        path: '/dues',
        permissions: ['admin', 'manager']
      },
      {
        id: 'customers',
        title: 'Customer Management',
        icon: 'people',
        path: '/customers',
        permissions: ['admin', 'manager', 'cashier']
      },
      {
        id: 'shifts',
        title: 'Shift Management',
        icon: 'schedule',
        path: '/shifts',
        permissions: ['admin', 'manager']
      },
      {
        id: 'reports',
        title: 'Reports & Analytics',
        icon: 'analytics',
        path: '/reports',
        permissions: ['admin', 'manager']
      },
      {
        id: 'products',
        title: 'Product Management',
        icon: 'inventory',
        path: '/products',
        permissions: ['admin', 'manager']
      },
      {
        id: 'settings',
        title: 'POS Settings',
        icon: 'settings',
        path: '/settings',
        permissions: ['admin']
      }
    ];

    res.json({
      success: true,
      data: navigation
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/dashboard/notifications
// @desc    Get dashboard notifications
// @access  Private
router.get('/notifications', async (req, res) => {
  try {
    const notifications = [
      {
        id: 1,
        type: 'warning',
        title: 'Low Stock Alert',
        message: '5 products are running low on stock',
        timestamp: new Date(),
        read: false
      },
      {
        id: 2,
        type: 'info',
        title: 'Daily Summary',
        message: 'Today\'s sales: ₹8,900 from 15 transactions',
        timestamp: new Date(Date.now() - 3600000),
        read: false
      },
      {
        id: 3,
        type: 'success',
        title: 'Payment Received',
        message: 'Payment of ₹2,500 received from John Doe',
        timestamp: new Date(Date.now() - 7200000),
        read: true
      }
    ];

    res.json({
      success: true,
      data: notifications
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/dashboard/update-settings
// @desc    Update dashboard settings
// @access  Private (Admin/Manager)
router.post('/update-settings', [
  body('refreshInterval').optional().isInt({ min: 30, max: 300 }),
  body('showCharts').optional().isBoolean(),
  body('showNotifications').optional().isBoolean()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { refreshInterval, showCharts, showNotifications } = req.body;

    // In real app, save to database
    const settings = {
      refreshInterval: refreshInterval || 60,
      showCharts: showCharts !== undefined ? showCharts : true,
      showNotifications: showNotifications !== undefined ? showNotifications : true,
      updatedAt: new Date()
    };

    res.json({
      success: true,
      message: 'Dashboard settings updated successfully',
      data: settings
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;