const express = require('express');
const Joi = require('joi');
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const { authenticateToken, requireRole } = require('../middleware/auth');
const { logger } = require('../utils/logger');

const router = express.Router();
const prisma = new PrismaClient();

// Validation schemas
const userSchema = Joi.object({
  username: Joi.string().min(3).max(50).required(),
  email: Joi.string().email().max(255).required(),
  password: Joi.string().min(8).max(255).required(),
  firstName: Joi.string().min(1).max(100).required(),
  lastName: Joi.string().min(1).max(100).required(),
  role: Joi.string().valid('ADMIN', 'MANAGER', 'CASHIER').default('CASHIER'),
  isActive: Joi.boolean().default(true)
});

const userUpdateSchema = Joi.object({
  username: Joi.string().min(3).max(50).optional(),
  email: Joi.string().email().max(255).optional(),
  firstName: Joi.string().min(1).max(100).optional(),
  lastName: Joi.string().min(1).max(100).optional(),
  role: Joi.string().valid('ADMIN', 'MANAGER', 'CASHIER').optional(),
  isActive: Joi.boolean().optional()
});

const passwordChangeSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string().min(8).max(255).required(),
  confirmPassword: Joi.string().valid(Joi.ref('newPassword')).required()
});

// GET /api/users - Get all users (admin only)
router.get('/', authenticateToken, requireRole(['ADMIN']), async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search,
      role,
      isActive,
      sortBy = 'username',
      sortOrder = 'asc'
    } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Build where clause
    const where = {};
    
    if (search) {
      where.OR = [
        { username: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (role) where.role = role;
    if (isActive !== undefined) where.isActive = isActive === 'true';

    // Build order by
    const orderBy = {};
    orderBy[sortBy] = sortOrder;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          username: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          isActive: true,
          lastLogin: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: { sales: true }
          }
        },
        orderBy,
        skip,
        take: limitNum
      }),
      prisma.user.count({ where })
    ]);

    // Calculate user metrics
    const userMetrics = await prisma.$transaction(async (tx) => {
      const totalUsers = await tx.user.count({ where: { isActive: true } });
      const usersByRole = await tx.user.groupBy({
        by: ['role'],
        where: { isActive: true },
        _count: { id: true }
      });
      const activeUsers = await tx.user.count({
        where: { isActive: true }
      });
      const inactiveUsers = await tx.user.count({
        where: { isActive: false }
      });

      return {
        totalUsers,
        activeUsers,
        inactiveUsers,
        usersByRole: usersByRole.reduce((acc, item) => {
          acc[item.role] = item._count.id;
          return acc;
        }, {})
      };
    });

    logger.info(`Users retrieved successfully`, {
      userId: req.user.id,
      count: users.length,
      total,
      page: pageNum
    });

    res.json({
      success: true,
      data: {
        users: users.map(user => ({
          ...user,
          fullName: `${user.firstName} ${user.lastName}`,
          salesCount: user._count.sales
        })),
        metrics: userMetrics
      },
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    });

  } catch (error) {
    logger.error('Error retrieving users:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve users',
      message: error.message
    });
  }
});

// GET /api/users/:id - Get user by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Users can only view their own profile unless they're admin
    if (req.user.id !== id && req.user.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        lastLogin: true,
        createdAt: true,
        updatedAt: true,
        sales: {
          take: 10,
          orderBy: { saleDate: 'desc' },
          select: {
            id: true,
            invoiceNumber: true,
            totalAmount: true,
            saleDate: true,
            saleStatus: true
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    logger.info(`User profile retrieved successfully`, {
      userId: req.user.id,
      targetUserId: id
    });

    res.json({
      success: true,
      data: {
        ...user,
        fullName: `${user.firstName} ${user.lastName}`
      }
    });

  } catch (error) {
    logger.error('Error retrieving user profile:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve user profile',
      message: error.message
    });
  }
});

// POST /api/users - Create new user (admin only)
router.post('/', authenticateToken, requireRole(['ADMIN']), async (req, res) => {
  try {
    const { error: validationError, value: validatedData } = userSchema.validate(req.body);
    if (validationError) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: validationError.details
      });
    }

    // Check if username already exists
    const existingUsername = await prisma.user.findUnique({
      where: { username: validatedData.username }
    });

    if (existingUsername) {
      return res.status(400).json({
        success: false,
        error: 'Username already exists'
      });
    }

    // Check if email already exists
    const existingEmail = await prisma.user.findUnique({
      where: { email: validatedData.email }
    });

    if (existingEmail) {
      return res.status(400).json({
        success: false,
        error: 'Email already exists'
      });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(validatedData.password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        ...validatedData,
        passwordHash
      },
      select: {
        id: true,
        username: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        createdAt: true
      }
    });

    logger.info(`User created successfully`, {
      userId: req.user.id,
      newUserId: user.id,
      newUserUsername: user.username,
      newUserRole: user.role
    });

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: user
    });

  } catch (error) {
    logger.error('Error creating user:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create user',
      message: error.message
    });
  }
});

// PUT /api/users/:id - Update user
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Users can only update their own profile unless they're admin
    if (req.user.id !== id && req.user.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }

    // Non-admin users cannot change their role
    if (req.user.role !== 'ADMIN' && req.body.role) {
      return res.status(403).json({
        success: false,
        error: 'Cannot change role'
      });
    }

    const { error: validationError, value: validatedData } = userUpdateSchema.validate(req.body);
    if (validationError) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: validationError.details
      });
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id }
    });

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Check if new username conflicts with other users
    if (validatedData.username && validatedData.username !== existingUser.username) {
      const usernameConflict = await prisma.user.findUnique({
        where: { username: validatedData.username }
      });

      if (usernameConflict) {
        return res.status(400).json({
          success: false,
          error: 'Username already exists'
        });
      }
    }

    // Check if new email conflicts with other users
    if (validatedData.email && validatedData.email !== existingUser.email) {
      const emailConflict = await prisma.user.findUnique({
        where: { email: validatedData.email }
      });

      if (emailConflict) {
        return res.status(400).json({
          success: false,
          error: 'Email already exists'
        });
      }
    }

    // Update user
    const user = await prisma.user.update({
      where: { id },
      data: validatedData,
      select: {
        id: true,
        username: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        updatedAt: true
      }
    });

    logger.info(`User updated successfully`, {
      userId: req.user.id,
      targetUserId: id,
      updatedFields: Object.keys(validatedData)
    });

    res.json({
      success: true,
      message: 'User updated successfully',
      data: user
    });

  } catch (error) {
    logger.error('Error updating user:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update user',
      message: error.message
    });
  }
});

// DELETE /api/users/:id - Soft delete user (admin only)
router.delete('/:id', authenticateToken, requireRole(['ADMIN']), async (req, res) => {
  try {
    const { id } = req.params;

    // Prevent admin from deleting themselves
    if (req.user.id === id) {
      return res.status(400).json({
        success: false,
        error: 'Cannot delete your own account'
      });
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Check if user has active sales
    const activeSales = await prisma.sale.findFirst({
      where: { userId: id }
    });

    if (activeSales) {
      return res.status(400).json({
        success: false,
        error: 'Cannot delete user with sales history'
      });
    }

    // Soft delete user
    await prisma.user.update({
      where: { id },
      data: { isActive: false }
    });

    logger.info(`User soft deleted successfully`, {
      userId: req.user.id,
      targetUserId: id,
      targetUsername: user.username
    });

    res.json({
      success: true,
      message: 'User deleted successfully'
    });

  } catch (error) {
    logger.error('Error deleting user:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete user',
      message: error.message
    });
  }
});

// PATCH /api/users/:id/password - Change password
router.patch('/:id/password', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Users can only change their own password
    if (req.user.id !== id) {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }

    const { error: validationError, value: validatedData } = passwordChangeSchema.validate(req.body);
    if (validationError) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: validationError.details
      });
    }

    // Get current user with password hash
    const user = await prisma.user.findUnique({
      where: { id },
      select: { passwordHash: true }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Verify current password
    const isValidPassword = await bcrypt.compare(validatedData.currentPassword, user.passwordHash);
    if (!isValidPassword) {
      return res.status(400).json({
        success: false,
        error: 'Current password is incorrect'
      });
    }

    // Hash new password
    const newPasswordHash = await bcrypt.hash(validatedData.newPassword, 12);

    // Update password
    await prisma.user.update({
      where: { id },
      data: { passwordHash: newPasswordHash }
    });

    logger.info(`User password changed successfully`, {
      userId: id
    });

    res.json({
      success: true,
      message: 'Password changed successfully'
    });

  } catch (error) {
    logger.error('Error changing password:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to change password',
      message: error.message
    });
  }
});

// PATCH /api/users/:id/status - Toggle user status (admin only)
router.patch('/:id/status', authenticateToken, requireRole(['ADMIN']), async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    // Prevent admin from deactivating themselves
    if (req.user.id === id) {
      return res.status(400).json({
        success: false,
        error: 'Cannot change your own status'
      });
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Update user status
    const updatedUser = await prisma.user.update({
      where: { id },
      data: { isActive },
      select: {
        id: true,
        username: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        updatedAt: true
      }
    });

    logger.info(`User status updated successfully`, {
      userId: req.user.id,
      targetUserId: id,
      newStatus: isActive
    });

    res.json({
      success: true,
      message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
      data: updatedUser
    });

  } catch (error) {
    logger.error('Error updating user status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update user status',
      message: error.message
    });
  }
});

// GET /api/users/profile - Get current user profile
router.get('/profile/me', authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        username: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        lastLogin: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    logger.info(`User profile retrieved successfully`, {
      userId: req.user.id
    });

    res.json({
      success: true,
      data: {
        ...user,
        fullName: `${user.firstName} ${user.lastName}`
      }
    });

  } catch (error) {
    logger.error('Error retrieving user profile:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve user profile',
      message: error.message
    });
  }
});

// PUT /api/users/profile - Update current user profile
router.put('/profile/me', authenticateToken, async (req, res) => {
  try {
    const { error: validationError, value: validatedData } = userUpdateSchema.validate(req.body);
    if (validationError) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: validationError.details
      });
    }

    // Remove role from update data (users cannot change their own role)
    delete validatedData.role;

    // Check if new username conflicts with other users
    if (validatedData.username && validatedData.username !== req.user.username) {
      const usernameConflict = await prisma.user.findUnique({
        where: { username: validatedData.username }
      });

      if (usernameConflict) {
        return res.status(400).json({
          success: false,
          error: 'Username already exists'
        });
      }
    }

    // Check if new email conflicts with other users
    if (validatedData.email && validatedData.email !== req.user.email) {
      const emailConflict = await prisma.user.findUnique({
        where: { email: validatedData.email }
      });

      if (emailConflict) {
        return res.status(400).json({
          success: false,
          error: 'Email already exists'
        });
      }
    }

    // Update user profile
    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: validatedData,
      select: {
        id: true,
        username: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        updatedAt: true
      }
    });

    logger.info(`User profile updated successfully`, {
      userId: req.user.id,
      updatedFields: Object.keys(validatedData)
    });

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: user
    });

  } catch (error) {
    logger.error('Error updating user profile:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update profile',
      message: error.message
    });
  }
});

// GET /api/users/activity - Get user activity (admin only)
router.get('/activity', authenticateToken, requireRole(['ADMIN']), async (req, res) => {
  try {
    const { page = 1, limit = 20, userId } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Build where clause
    const where = {};
    if (userId) where.userId = userId;

    const [activities, total] = await Promise.all([
      prisma.sale.findMany({
        where,
        include: {
          user: {
            select: { username: true, firstName: true, lastName: true }
          }
        },
        orderBy: { saleDate: 'desc' },
        skip,
        take: limitNum
      }),
      prisma.sale.count({ where })
    ]);

    logger.info(`User activity retrieved successfully`, {
      userId: req.user.id,
      count: activities.length,
      total,
      page: pageNum
    });

    res.json({
      success: true,
      data: activities.map(activity => ({
        id: activity.id,
        invoiceNumber: activity.invoiceNumber,
        totalAmount: activity.totalAmount,
        saleDate: activity.saleDate,
        paymentMethod: activity.paymentMethod,
        saleStatus: activity.saleStatus,
        user: {
          username: activity.user.username,
          fullName: `${activity.user.firstName} ${activity.user.lastName}`
        }
      })),
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    });

  } catch (error) {
    logger.error('Error retrieving user activity:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve user activity',
      message: error.message
    });
  }
});

module.exports = router;
