const winston = require('winston');
const path = require('path');

// Create logs directory if it doesn't exist
const fs = require('fs');
const logsDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Define log format
const logFormat = winston.format.combine(
  winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss'
  }),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

// Define console format for development
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({
    format: 'HH:mm:ss'
  }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    let log = `${timestamp} [${level}]: ${message}`;
    
    if (Object.keys(meta).length > 0) {
      log += ` ${JSON.stringify(meta, null, 2)}`;
    }
    
    return log;
  })
);

// Create logger instance
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  defaultMeta: { service: 'pos-server' },
  transports: [
    // Console transport for development
    new winston.transports.Console({
      format: consoleFormat,
      level: process.env.NODE_ENV === 'production' ? 'warn' : 'debug'
    }),
    
    // File transport for all logs
    new winston.transports.File({
      filename: path.join(logsDir, 'combined.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      tailable: true
    }),
    
    // File transport for error logs
    new winston.transports.File({
      filename: path.join(logsDir, 'error.log'),
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      tailable: true
    }),
    
    // File transport for access logs
    new winston.transports.File({
      filename: path.join(logsDir, 'access.log'),
      level: 'info',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      tailable: true
    })
  ],
  
  // Handle uncaught exceptions
  exceptionHandlers: [
    new winston.transports.File({
      filename: path.join(logsDir, 'exceptions.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5
    })
  ],
  
  // Handle unhandled rejections
  rejectionHandlers: [
    new winston.transports.File({
      filename: path.join(logsDir, 'rejections.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5
    })
  ]
});

// Add request logging middleware
const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  // Log request
  logger.info('HTTP Request', {
    method: req.method,
    url: req.url,
    ip: req.ip || req.connection.remoteAddress,
    userAgent: req.get('User-Agent'),
    userId: req.user?.id || 'anonymous',
    timestamp: new Date().toISOString()
  });
  
  // Override res.end to log response
  const originalEnd = res.end;
  res.end = function(chunk, encoding) {
    const duration = Date.now() - start;
    
    logger.info('HTTP Response', {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      userId: req.user?.id || 'anonymous',
      timestamp: new Date().toISOString()
    });
    
    originalEnd.call(this, chunk, encoding);
  };
  
  next();
};

// Add error logging middleware
const errorLogger = (err, req, res, next) => {
  logger.error('Application Error', {
    error: err.message,
    stack: err.stack,
    method: req.method,
    url: req.url,
    ip: req.ip || req.connection.remoteAddress,
    userId: req.user?.id || 'anonymous',
    timestamp: new Date().toISOString()
  });
  
  next(err);
};

// Add database query logging
const dbLogger = {
  query: (query, params, duration) => {
    logger.debug('Database Query', {
      query,
      params,
      duration: `${duration}ms`,
      timestamp: new Date().toISOString()
    });
  },
  
  error: (error, query, params) => {
    logger.error('Database Error', {
      error: error.message,
      query,
      params,
      timestamp: new Date().toISOString()
    });
  }
};

// Add performance logging
const performanceLogger = {
  start: (operation) => {
    const startTime = Date.now();
    return {
      operation,
      startTime,
      end: () => {
        const duration = Date.now() - startTime;
        logger.info('Performance', {
          operation,
          duration: `${duration}ms`,
          timestamp: new Date().toISOString()
        });
        return duration;
      }
    };
  },
  
  measure: async (operation, fn) => {
    const timer = performanceLogger.start(operation);
    try {
      const result = await fn();
      timer.end();
      return result;
    } catch (error) {
      timer.end();
      throw error;
    }
  }
};

// Add security logging
const securityLogger = {
  login: (userId, username, success, ip, userAgent) => {
    logger.info('Authentication', {
      event: 'login',
      userId,
      username,
      success,
      ip,
      userAgent,
      timestamp: new Date().toISOString()
    });
  },
  
  logout: (userId, username, ip) => {
    logger.info('Authentication', {
      event: 'logout',
      userId,
      username,
      ip,
      timestamp: new Date().toISOString()
    });
  },
  
  unauthorized: (ip, url, userAgent) => {
    logger.warn('Security', {
      event: 'unauthorized_access',
      ip,
      url,
      userAgent,
      timestamp: new Date().toISOString()
    });
  },
  
  roleViolation: (userId, username, requiredRole, actualRole, ip) => {
    logger.warn('Security', {
      event: 'role_violation',
      userId,
      username,
      requiredRole,
      actualRole,
      ip,
      timestamp: new Date().toISOString()
    });
  }
};

// Add business logic logging
const businessLogger = {
  sale: (saleId, userId, totalAmount, itemCount, customerId) => {
    logger.info('Business', {
      event: 'sale_completed',
      saleId,
      userId,
      totalAmount,
      itemCount,
      customerId,
      timestamp: new Date().toISOString()
    });
  },
  
  inventory: (productId, variantId, quantityChange, reason, userId) => {
    logger.info('Business', {
      event: 'inventory_adjusted',
      productId,
      variantId,
      quantityChange,
      reason,
      userId,
      timestamp: new Date().toISOString()
    });
  },
  
  lowStock: (productId, productName, currentStock, minStockLevel) => {
    logger.warn('Business', {
      event: 'low_stock_alert',
      productId,
      productName,
      currentStock,
      minStockLevel,
      timestamp: new Date().toISOString()
    });
  }
};

// Export logger and utilities
module.exports = {
  logger,
  requestLogger,
  errorLogger,
  dbLogger,
  performanceLogger,
  securityLogger,
  businessLogger
};
