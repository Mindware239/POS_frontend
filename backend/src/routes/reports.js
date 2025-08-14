const express = require('express');
const router = express.Router();

// @route   GET /api/reports/sales
// @desc    Get sales report
// @access  Private (Admin/Manager)
router.get('/sales', async (req, res) => {
  try {
    const { startDate, endDate, cashierId, paymentMethod } = req.query;
    
    // Mock sales data (in real app, this would come from database)
    const sales = [
      {
        id: '1',
        date: new Date('2024-01-15'),
        amount: 2500,
        cashierId: 'cashier-1',
        paymentMethod: 'cash',
        items: 5
      },
      {
        id: '2',
        date: new Date('2024-01-15'),
        amount: 1800,
        cashierId: 'cashier-2',
        paymentMethod: 'upi',
        items: 3
      }
    ];
    
    let filteredSales = [...sales];
    
    // Filter by date range
    if (startDate || endDate) {
      filteredSales = filteredSales.filter(sale => {
        const saleDate = new Date(sale.date);
        const start = startDate ? new Date(startDate) : new Date(0);
        const end = endDate ? new Date(endDate) : new Date();
        return saleDate >= start && saleDate <= end;
      });
    }
    
    // Filter by cashier
    if (cashierId) {
      filteredSales = filteredSales.filter(sale => sale.cashierId === cashierId);
    }
    
    // Filter by payment method
    if (paymentMethod) {
      filteredSales = filteredSales.filter(sale => sale.paymentMethod === paymentMethod);
    }
    
    const report = {
      totalSales: filteredSales.length,
      totalRevenue: filteredSales.reduce((sum, sale) => sum + sale.amount, 0),
      averageOrderValue: filteredSales.length > 0 ? 
        filteredSales.reduce((sum, sale) => sum + sale.amount, 0) / filteredSales.length : 0,
      totalItems: filteredSales.reduce((sum, sale) => sum + sale.items, 0),
      salesByDate: {},
      salesByCashier: {},
      salesByPaymentMethod: {}
    };
    
    // Group by date
    filteredSales.forEach(sale => {
      const date = sale.date.toISOString().split('T')[0];
      if (!report.salesByDate[date]) {
        report.salesByDate[date] = { count: 0, revenue: 0 };
      }
      report.salesByDate[date].count++;
      report.salesByDate[date].revenue += sale.amount;
    });
    
    // Group by cashier
    filteredSales.forEach(sale => {
      if (!report.salesByCashier[sale.cashierId]) {
        report.salesByCashier[sale.cashierId] = { count: 0, revenue: 0 };
      }
      report.salesByCashier[sale.cashierId].count++;
      report.salesByCashier[sale.cashierId].revenue += sale.amount;
    });
    
    // Group by payment method
    filteredSales.forEach(sale => {
      if (!report.salesByPaymentMethod[sale.paymentMethod]) {
        report.salesByPaymentMethod[sale.paymentMethod] = { count: 0, revenue: 0 };
      }
      report.salesByPaymentMethod[sale.paymentMethod].count++;
      report.salesByPaymentMethod[sale.paymentMethod].revenue += sale.amount;
    });
    
    res.json(report);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/reports/inventory
// @desc    Get inventory report
// @access  Private (Admin/Manager)
router.get('/inventory', async (req, res) => {
  try {
    // Mock inventory data (in real app, this would come from database)
    const inventory = [
      {
        id: '1',
        name: 'Premium T-Shirt',
        sku: 'TS001',
        stock: 50,
        minStock: 10,
        maxStock: 100,
        value: 15000
      },
      {
        id: '2',
        name: 'Wireless Headphones',
        sku: 'WH001',
        stock: 25,
        minStock: 5,
        maxStock: 50,
        value: 20000
      }
    ];
    
    const report = {
      totalProducts: inventory.length,
      totalStock: inventory.reduce((sum, item) => sum + item.stock, 0),
      totalValue: inventory.reduce((sum, item) => sum + item.value, 0),
      lowStockItems: inventory.filter(item => item.stock <= item.minStock),
      outOfStockItems: inventory.filter(item => item.stock === 0),
      overStockItems: inventory.filter(item => item.stock > item.maxStock)
    };
    
    res.json(report);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/reports/cashier
// @desc    Get cashier performance report
// @access  Private (Admin/Manager)
router.get('/cashier', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    // Mock cashier data (in real app, this would come from database)
    const cashiers = [
      {
        id: 'cashier-1',
        name: 'John Doe',
        sales: 25,
        revenue: 12500,
        averageOrder: 500
      },
      {
        id: 'cashier-2',
        name: 'Jane Smith',
        sales: 18,
        revenue: 9000,
        averageOrder: 500
      }
    ];
    
    const report = {
      totalCashiers: cashiers.length,
      totalSales: cashiers.reduce((sum, cashier) => sum + cashier.sales, 0),
      totalRevenue: cashiers.reduce((sum, cashier) => sum + cashier.revenue, 0),
      topPerformer: cashiers.reduce((top, current) => 
        current.revenue > top.revenue ? current : top
      ),
      cashiers: cashiers
    };
    
    res.json(report);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/reports/dashboard
// @desc    Get dashboard summary
// @access  Private (Admin/Manager)
router.get('/dashboard', async (req, res) => {
  try {
    const report = {
      today: {
        sales: 15,
        revenue: 7500,
        customers: 12
      },
      week: {
        sales: 89,
        revenue: 44500,
        customers: 67
      },
      month: {
        sales: 342,
        revenue: 171000,
        customers: 245
      },
      topProducts: [
        { name: 'Premium T-Shirt', sales: 45, revenue: 22500 },
        { name: 'Wireless Headphones', sales: 23, revenue: 29900 }
      ],
      recentActivity: [
        { type: 'sale', message: 'New sale completed', time: new Date() },
        { type: 'payment', message: 'Payment received', time: new Date() }
      ]
    };
    
    res.json(report);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
