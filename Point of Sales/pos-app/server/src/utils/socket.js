let io = null;

// Initialize Socket.io instance
const initializeSocket = (socketIo) => {
  io = socketIo;
  
  // Set up connection handling
  io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`);
    
    // Handle user authentication
    socket.on('authenticate', (data) => {
      try {
        // Store user info in socket
        socket.userId = data.userId;
        socket.username = data.username;
        socket.role = data.role;
        
        // Join user-specific room
        socket.join(`user_${data.userId}`);
        
        // Join role-based room
        socket.join(`role_${data.role}`);
        
        // Join general room
        socket.join('general');
        
        socket.emit('authenticated', {
          success: true,
          message: 'Successfully authenticated with Socket.io'
        });
        
        console.log(`User ${data.username} (${data.role}) authenticated with socket ${socket.id}`);
      } catch (error) {
        console.error('Socket authentication error:', error);
        socket.emit('authentication_error', {
          success: false,
          message: 'Authentication failed'
        });
      }
    });
    
    // Handle user joining specific rooms
    socket.on('join_room', (roomName) => {
      socket.join(roomName);
      console.log(`Socket ${socket.id} joined room: ${roomName}`);
    });
    
    // Handle user leaving specific rooms
    socket.on('leave_room', (roomName) => {
      socket.leave(roomName);
      console.log(`Socket ${socket.id} left room: ${roomName}`);
    });
    
    // Handle disconnection
    socket.on('disconnect', (reason) => {
      console.log(`Client disconnected: ${socket.id}, Reason: ${reason}`);
      
      // Clean up user-specific data
      if (socket.userId) {
        console.log(`User ${socket.username} (${socket.role}) disconnected`);
      }
    });
    
    // Handle errors
    socket.on('error', (error) => {
      console.error(`Socket error for ${socket.id}:`, error);
    });
  });
  
  // Set up global error handling
  io.engine.on('connection_error', (err) => {
    console.error('Socket.io connection error:', err);
  });
  
  console.log('Socket.io initialized successfully');
};

// Get Socket.io instance
const getSocketIO = () => {
  return io;
};

// Emit to specific user
const emitToUser = (userId, event, data) => {
  if (!io) {
    console.warn('Socket.io not initialized');
    return;
  }
  
  io.to(`user_${userId}`).emit(event, data);
};

// Emit to users with specific role
const emitToRole = (role, event, data) => {
  if (!io) {
    console.warn('Socket.io not initialized');
    return;
  }
  
  io.to(`role_${role}`).emit(event, data);
};

// Emit to specific room
const emitToRoom = (roomName, event, data) => {
  if (!io) {
    console.warn('Socket.io not initialized');
    return;
  }
  
  io.to(roomName).emit(event, data);
};

// Emit to all connected clients
const emitToAll = (event, data) => {
  if (!io) {
    console.warn('Socket.io not initialized');
    return;
  }
  
  io.emit(event, data);
};

// Get connected clients count
const getConnectedClientsCount = () => {
  if (!io) return 0;
  
  return io.engine.clientsCount;
};

// Get connected users info
const getConnectedUsers = () => {
  if (!io) return [];
  
  const users = [];
  io.sockets.sockets.forEach((socket) => {
    if (socket.userId) {
      users.push({
        socketId: socket.id,
        userId: socket.userId,
        username: socket.username,
        role: socket.role,
        connectedAt: socket.connectedAt
      });
    }
  });
  
  return users;
};

// Disconnect specific user
const disconnectUser = (userId) => {
  if (!io) return;
  
  io.sockets.sockets.forEach((socket) => {
    if (socket.userId === userId) {
      socket.disconnect(true);
    }
  });
};

// Broadcast system message
const broadcastSystemMessage = (message, type = 'info', roles = []) => {
  if (!io) return;
  
  const data = {
    type: 'system',
    message,
    messageType: type,
    timestamp: new Date().toISOString()
  };
  
  if (roles.length > 0) {
    roles.forEach(role => {
      emitToRole(role, 'system_message', data);
    });
  } else {
    emitToAll('system_message', data);
  }
};

// Broadcast notification
const broadcastNotification = (notification, roles = []) => {
  if (!io) return;
  
  const data = {
    ...notification,
    timestamp: new Date().toISOString()
  };
  
  if (roles.length > 0) {
    roles.forEach(role => {
      emitToRole(role, 'notification', data);
    });
  } else {
    emitToAll('notification', data);
  }
};

// Inventory-specific events
const emitInventoryUpdate = (data) => {
  if (!io) return;
  
  // Emit to all users (real-time inventory updates)
  emitToAll('inventory_updated', data);
  
  // Emit to managers and admins for detailed updates
  emitToRole('MANAGER', 'inventory_detailed_update', data);
  emitToRole('ADMIN', 'inventory_detailed_update', data);
};

const emitLowStockAlert = (data) => {
  if (!io) return;
  
  // Emit to managers and admins
  emitToRole('MANAGER', 'low_stock_alert', data);
  emitToRole('ADMIN', 'low_stock_alert', data);
  
  // Also emit to general room for any interested clients
  emitToRoom('general', 'low_stock_alert', data);
};

// Sales-specific events
const emitSaleCompleted = (data) => {
  if (!io) return;
  
  // Emit to all users (real-time sales updates)
  emitToAll('sale_completed', data);
  
  // Emit to managers and admins for detailed updates
  emitToRole('MANAGER', 'sale_detailed_update', data);
  emitToRole('ADMIN', 'sale_detailed_update', data);
};

const emitRefundProcessed = (data) => {
  if (!io) return;
  
  // Emit to managers and admins
  emitToRole('MANAGER', 'refund_processed', data);
  emitToRole('ADMIN', 'refund_processed', data);
};

// User management events
const emitUserStatusChange = (data) => {
  if (!io) return;
  
  // Emit to admins
  emitToRole('ADMIN', 'user_status_changed', data);
  
  // Emit to the specific user
  if (data.userId) {
    emitToUser(data.userId, 'user_status_changed', data);
  }
};

// Product management events
const emitProductUpdate = (data) => {
  if (!io) return;
  
  // Emit to all users (real-time product updates)
  emitToAll('product_updated', data);
  
  // Emit to managers and admins for detailed updates
  emitToRole('MANAGER', 'product_detailed_update', data);
  emitToRole('ADMIN', 'product_detailed_update', data);
};

// Customer management events
const emitCustomerUpdate = (data) => {
  if (!io) return;
  
  // Emit to managers and admins
  emitToRole('MANAGER', 'customer_updated', data);
  emitToRole('ADMIN', 'customer_updated', data);
};

// Report generation events
const emitReportGenerated = (data) => {
  if (!io) return;
  
  // Emit to the user who requested the report
  if (data.userId) {
    emitToUser(data.userId, 'report_generated', data);
  }
  
  // Emit to managers and admins for large reports
  if (data.type === 'large' || data.type === 'financial') {
    emitToRole('MANAGER', 'report_generated', data);
    emitToRole('ADMIN', 'report_generated', data);
  }
};

// System health events
const emitSystemHealth = (data) => {
  if (!io) return;
  
  // Emit to admins only
  emitToRole('ADMIN', 'system_health', data);
};

// Export all functions
module.exports = {
  initializeSocket,
  getSocketIO,
  emitToUser,
  emitToRole,
  emitToRoom,
  emitToAll,
  getConnectedClientsCount,
  getConnectedUsers,
  disconnectUser,
  broadcastSystemMessage,
  broadcastNotification,
  
  // Inventory events
  emitInventoryUpdate,
  emitLowStockAlert,
  
  // Sales events
  emitSaleCompleted,
  emitRefundProcessed,
  
  // User management events
  emitUserStatusChange,
  
  // Product management events
  emitProductUpdate,
  
  // Customer management events
  emitCustomerUpdate,
  
  // Report events
  emitReportGenerated,
  
  // System events
  emitSystemHealth
};
