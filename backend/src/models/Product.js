const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  sku: {
    type: DataTypes.STRING(50),
    unique: true,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  barcode: {
    type: DataTypes.STRING(100),
    unique: true,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  name: {
    type: DataTypes.STRING(200),
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [1, 200]
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  category: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  brand: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  // Pricing
  costPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  retailPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  wholesalePrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    validate: {
      min: 0
    }
  },
  memberPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    validate: {
      min: 0
    }
  },
  // Tax and Discount
  taxRate: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0,
      max: 100
    }
  },
  hsnCode: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  // Inventory
  currentStock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  minStockLevel: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  maxStockLevel: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 0
    }
  },
  // Variants
  hasVariants: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  variantType: {
    type: DataTypes.ENUM('size', 'color', 'weight', 'custom'),
    allowNull: true
  },
  variantValues: {
    type: DataTypes.JSONB,
    allowNull: true
  },
  // Status
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  isDeleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  // Images
  images: {
    type: DataTypes.JSONB,
    allowNull: true
  },
  // Metadata
  tags: {
    type: DataTypes.JSONB,
    allowNull: true
  },
  specifications: {
    type: DataTypes.JSONB,
    allowNull: true
  }
}, {
  tableName: 'products',
  indexes: [
    {
      fields: ['sku']
    },
    {
      fields: ['barcode']
    },
    {
      fields: ['category']
    },
    {
      fields: ['is_active']
    }
  ],
  hooks: {
    beforeCreate: (product) => {
      // Auto-generate SKU if not provided
      if (!product.sku) {
        product.sku = `SKU-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
      }
    },
    beforeUpdate: (product) => {
      // Ensure stock doesn't go below 0
      if (product.currentStock < 0) {
        product.currentStock = 0;
      }
    }
  }
});

// Instance methods
Product.prototype.updateStock = async function(quantity, operation = 'add') {
  const currentStock = this.currentStock;
  let newStock;
  
  if (operation === 'add') {
    newStock = currentStock + quantity;
  } else if (operation === 'subtract') {
    newStock = Math.max(0, currentStock - quantity);
  } else if (operation === 'set') {
    newStock = quantity;
  }
  
  this.currentStock = newStock;
  await this.save();
  
  return newStock;
};

Product.prototype.isLowStock = function() {
  return this.currentStock <= this.minStockLevel;
};

Product.prototype.isOutOfStock = function() {
  return this.currentStock === 0;
};

Product.prototype.getAvailableQuantity = function() {
  return Math.max(0, this.currentStock);
};

// Class methods
Product.findByBarcode = function(barcode) {
  return this.findOne({
    where: {
      barcode: barcode,
      isActive: true,
      isDeleted: false
    }
  });
};

Product.findBySKU = function(sku) {
  return this.findOne({
    where: {
      sku: sku,
      isActive: true,
      isDeleted: false
    }
  });
};

Product.searchProducts = function(query, limit = 20) {
  return this.findAll({
    where: {
      [sequelize.Op.or]: [
        { name: { [sequelize.Op.iLike]: `%${query}%` } },
        { sku: { [sequelize.Op.iLike]: `%${query}%` } },
        { barcode: { [sequelize.Op.iLike]: `%${query}%` } },
        { category: { [sequelize.Op.iLike]: `%${query}%` } }
      ],
      isActive: true,
      isDeleted: false
    },
    limit: limit,
    order: [['name', 'ASC']]
  });
};

module.exports = Product;
