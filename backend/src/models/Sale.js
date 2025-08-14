const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Sale = sequelize.define('Sale', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  invoiceNumber: {
    type: DataTypes.STRING(50),
    unique: true,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  // Customer information
  customerId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'customers',
      key: 'id'
    }
  },
  customerName: {
    type: DataTypes.STRING(200),
    allowNull: true
  },
  customerPhone: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  customerEmail: {
    type: DataTypes.STRING(200),
    allowNull: true
  },
  // Cashier and shift information
  cashierId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  shiftId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'shifts',
      key: 'id'
    }
  },
  // Sale details
  saleDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  saleType: {
    type: DataTypes.ENUM('retail', 'wholesale', 'online', 'return', 'exchange'),
    defaultValue: 'retail'
  },
  // Pricing and totals
  subtotal: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  taxAmount: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  discountAmount: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  totalAmount: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  // Payment information
  paymentStatus: {
    type: DataTypes.ENUM('pending', 'partial', 'completed', 'failed', 'refunded'),
    defaultValue: 'pending'
  },
  paymentMethod: {
    type: DataTypes.ENUM('cash', 'upi', 'card', 'wallet', 'cheque', 'bank_transfer', 'split'),
    allowNull: false
  },
  receivedAmount: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  changeAmount: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  // GST and compliance
  gstNumber: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  hsnSummary: {
    type: DataTypes.JSONB,
    allowNull: true
  },
  eInvoiceNumber: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  // Status and workflow
  status: {
    type: DataTypes.ENUM('draft', 'confirmed', 'completed', 'cancelled', 'refunded'),
    defaultValue: 'draft'
  },
  isHold: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  holdReason: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  // Notes and metadata
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  tags: {
    type: DataTypes.JSONB,
    allowNull: true
  },
  // Timestamps for audit
  completedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  cancelledAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  cancelledBy: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  cancellationReason: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'sales',
  indexes: [
    {
      fields: ['invoice_number']
    },
    {
      fields: ['customer_id']
    },
    {
      fields: ['cashier_id']
    },
    {
      fields: ['shift_id']
    },
    {
      fields: ['sale_date']
    },
    {
      fields: ['status']
    },
    {
      fields: ['payment_status']
    }
  ],
  hooks: {
    beforeCreate: (sale) => {
      // Auto-generate invoice number if not provided
      if (!sale.invoiceNumber) {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const timestamp = Date.now().toString().slice(-6);
        sale.invoiceNumber = `INV-${year}${month}${day}-${timestamp}`;
      }
      
      // Calculate totals
      sale.calculateTotals();
    },
    beforeUpdate: (sale) => {
      // Recalculate totals if items changed
      if (sale.changed('subtotal') || sale.changed('taxAmount') || sale.changed('discountAmount')) {
        sale.calculateTotals();
      }
    }
  }
});

// Instance methods
Sale.prototype.calculateTotals = function() {
  this.totalAmount = this.subtotal + this.taxAmount - this.discountAmount;
  
  if (this.receivedAmount > 0) {
    this.changeAmount = Math.max(0, this.receivedAmount - this.totalAmount);
  }
};

Sale.prototype.markAsCompleted = async function() {
  this.status = 'completed';
  this.paymentStatus = 'completed';
  this.completedAt = new Date();
  await this.save();
};

Sale.prototype.holdSale = async function(reason) {
  this.isHold = true;
  this.holdReason = reason;
  this.status = 'draft';
  await this.save();
};

Sale.prototype.resumeSale = async function() {
  this.isHold = false;
  this.holdReason = null;
  this.status = 'confirmed';
  await this.save();
};

Sale.prototype.cancelSale = async function(reason, cancelledBy) {
  this.status = 'cancelled';
  this.cancelledAt = new Date();
  this.cancelledBy = cancelledBy;
  this.cancellationReason = reason;
  await this.save();
};

Sale.prototype.processRefund = async function(refundAmount, refundMethod) {
  this.status = 'refunded';
  this.paymentStatus = 'refunded';
  // Additional refund logic would go here
  await this.save();
};

// Class methods
Sale.findByInvoiceNumber = function(invoiceNumber) {
  return this.findOne({
    where: { invoiceNumber: invoiceNumber }
  });
};

Sale.getSalesByDateRange = function(startDate, endDate, options = {}) {
  const whereClause = {
    saleDate: {
      [sequelize.Op.between]: [startDate, endDate]
    }
  };
  
  if (options.status) {
    whereClause.status = options.status;
  }
  
  if (options.cashierId) {
    whereClause.cashierId = options.cashierId;
  }
  
  return this.findAll({
    where: whereClause,
    order: [['saleDate', 'DESC']],
    limit: options.limit || 100
  });
};

Sale.getDailySales = function(date) {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);
  
  return this.findAll({
    where: {
      saleDate: {
        [sequelize.Op.between]: [startOfDay, endOfDay]
      },
      status: 'completed'
    },
    attributes: [
      [sequelize.fn('SUM', sequelize.col('totalAmount')), 'totalSales'],
      [sequelize.fn('COUNT', sequelize.col('id')), 'totalTransactions'],
      [sequelize.fn('AVG', sequelize.col('totalAmount')), 'averageTransaction']
    ]
  });
};

Sale.getSalesSummary = function(startDate, endDate) {
  return this.findAll({
    where: {
      saleDate: {
        [sequelize.Op.between]: [startDate, endDate]
      },
      status: 'completed'
    },
    attributes: [
      [sequelize.fn('SUM', sequelize.col('subtotal')), 'totalSubtotal'],
      [sequelize.fn('SUM', sequelize.col('taxAmount')), 'totalTax'],
      [sequelize.fn('SUM', sequelize.col('discountAmount')), 'totalDiscount'],
      [sequelize.fn('SUM', sequelize.col('totalAmount')), 'totalSales'],
      [sequelize.fn('COUNT', sequelize.col('id')), 'totalTransactions']
    ]
  });
};

module.exports = Sale;
