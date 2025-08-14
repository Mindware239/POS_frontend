const express = require('express');
const router = express.Router();
const axios = require('axios');
const FormData = require('form-data');
const { PrismaClient } = require('@prisma/client');
const Joi = require('joi');
const rateLimit = require('express-rate-limit');
const { logger } = require('../utils/logger');
const { requireManager } = require('../middleware/auth');

const prisma = new PrismaClient();

// Rate limiting for AI image generation (more restrictive due to API costs)
const aiImageLimiter = process.env.NODE_ENV === 'test' ? 
  (req, res, next) => next() : // Skip rate limiting in tests
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // limit each IP to 10 AI image generations per 15 minutes
    message: {
      error: 'Too many AI image generation requests. Please try again later.',
      retryAfter: '15 minutes'
    },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: false,
    keyGenerator: (req) => req.user?.userId || req.ip, // Rate limit by user ID if authenticated
    skip: (req) => req.user?.userId, // Skip rate limiting for authenticated users
  });

// Input validation schema for image generation
const generateImageSchema = Joi.object({
  productName: Joi.string().min(2).max(100).required()
    .messages({
      'string.min': 'Product name must be at least 2 characters long',
      'string.max': 'Product name cannot exceed 100 characters',
      'any.required': 'Product name is required'
    }),
  description: Joi.string().min(10).max(500).required()
    .messages({
      'string.min': 'Description must be at least 10 characters long',
      'string.max': 'Description cannot exceed 500 characters',
      'any.required': 'Product description is required'
    }),
  category: Joi.string().min(2).max(50).required()
    .messages({
      'string.min': 'Category must be at least 2 characters long',
      'string.max': 'Category cannot exceed 50 characters',
      'any.required': 'Product category is required'
    }),
  productId: Joi.string().min(1).max(50).optional()
    .messages({
      'string.min': 'Product ID must be at least 1 character long',
      'string.max': 'Product ID cannot exceed 50 characters'
    }),
  style: Joi.string().valid('professional', 'lifestyle', 'minimalist', 'elegant', 'modern').default('professional')
    .messages({
      'any.only': 'Style must be one of: professional, lifestyle, minimalist, elegant, modern'
    }),
  aspectRatio: Joi.string().valid('1:1', '4:3', '16:9', '3:2').default('1:1')
    .messages({
      'any.only': 'Aspect ratio must be one of: 1:1, 4:3, 16:9, 3:2'
    })
});

// Prompt template builder with style variations
const buildPrompt = (productName, description, category, style) => {
  const stylePrompts = {
    professional: `Professional product photography of ${productName} (${description}) in a ${category} setting, studio lighting, clean background, commercial quality, high resolution, product-focused composition`,
    lifestyle: `Lifestyle product photo of ${productName} (${description}) in a natural ${category} environment, warm lighting, contextual setting, aspirational mood, lifestyle photography style`,
    minimalist: `Minimalist product photo of ${productName} (${description}) in ${category} context, clean lines, simple composition, neutral background, modern aesthetic, focus on product details`,
    elegant: `Elegant product photography of ${productName} (${description}) in sophisticated ${category} setting, premium lighting, luxury atmosphere, refined composition, high-end aesthetic`,
    modern: `Modern product photo of ${productName} (${description}) in contemporary ${category} setting, innovative lighting, trendy composition, current design aesthetic, fresh perspective`
  };

  return stylePrompts[style] || stylePrompts.professional;
};

// AdCreative.ai API integration
const generateImageWithAdCreative = async (prompt, aspectRatio, style) => {
  try {
    logger.info('Generating image with AdCreative.ai', { prompt, aspectRatio, style });
    
    const formData = new FormData();
    formData.append('prompt', prompt);
    formData.append('aspect_ratio', aspectRatio);
    formData.append('style', style);
    formData.append('api_key', process.env.ADCREATIVE_API_KEY);
    
    const response = await axios.post(
      'https://api.adcreative.ai/v1/generate',
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          'Authorization': `Bearer ${process.env.ADCREATIVE_API_KEY}`
        },
        timeout: 30000, // 30 second timeout
        maxRedirects: 3
      }
    );

    logger.info('AdCreative.ai API response received', { 
      status: response.status,
      dataKeys: Object.keys(response.data || {})
    });

    if (response.data && response.data.image_url) {
      return {
        success: true,
        imageUrl: response.data.image_url,
        provider: 'AdCreative.ai',
        metadata: {
          prompt: response.data.prompt,
          style: response.data.style,
          aspectRatio: response.data.aspect_ratio,
          generationId: response.data.id
        }
      };
    } else {
      throw new Error('Invalid response format from AdCreative.ai');
    }

  } catch (error) {
    logger.error('AdCreative.ai API error', {
      error: error.message,
      status: error.response?.status,
      data: error.response?.data
    });
    
    return {
      success: false,
      error: error.message,
      provider: 'AdCreative.ai'
    };
  }
};

// DALL-E fallback integration
const generateImageWithDalle = async (prompt, aspectRatio) => {
  try {
    logger.info('Generating image with DALL-E fallback', { prompt, aspectRatio });
    
    // Map aspect ratios to DALL-E format
    const dalleSize = aspectRatio === '1:1' ? '1024x1024' : 
                     aspectRatio === '4:3' ? '1024x1024' : 
                     aspectRatio === '16:9' ? '1792x1024' : '1024x1024';
    
    const response = await axios.post(
      'https://api.openai.com/v1/images/generations',
      {
        prompt: prompt,
        n: 1,
        size: dalleSize,
        quality: 'standard',
        response_format: 'url'
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 60000, // 60 second timeout for DALL-E
        maxRedirects: 3
      }
    );

    logger.info('DALL-E API response received', { 
      status: response.status,
      dataKeys: Object.keys(response.data || {})
    });

    if (response.data && response.data.data && response.data.data[0] && response.data.data[0].url) {
      return {
        success: true,
        imageUrl: response.data.data[0].url,
        provider: 'DALL-E',
        metadata: {
          prompt: prompt,
          size: dalleSize,
          quality: 'standard'
        }
      };
    } else {
      throw new Error('Invalid response format from DALL-E');
    }

  } catch (error) {
    logger.error('DALL-E API error', {
      error: error.message,
      status: error.response?.status,
      data: error.response?.data
    });
    
    return {
      success: false,
      error: error.message,
      provider: 'DALL-E'
    };
  }
};

// Main image generation endpoint
router.post('/generate-image', 
  aiImageLimiter, 
  requireManager, 
  async (req, res) => {
    try {
      const startTime = Date.now();
      
      // Validate input
      const { error, value } = generateImageSchema.validate(req.body);
      if (error) {
        logger.warn('Image generation validation failed', { 
          errors: error.details,
          body: req.body 
        });
        return res.status(400).json({
          error: 'Validation failed',
          details: error.details.map(d => d.message)
        });
      }

      const { productName, description, category, productId, style, aspectRatio } = value;

      // Check if user has permission to generate images
      if (!req.user) {
        logger.warn('Unauthorized image generation attempt', { ip: req.ip });
        return res.status(401).json({ error: 'Authentication required' });
      }

      logger.info('Starting AI image generation', {
        userId: req.user.userId,
        productName,
        category,
        style,
        aspectRatio
      });

      // Build prompt
      const prompt = buildPrompt(productName, description, category, style);
      
      // Try AdCreative.ai first
      let result = await generateImageWithAdCreative(prompt, aspectRatio, style);
      
      // Fallback to DALL-E if AdCreative.ai fails
      if (!result.success) {
        logger.info('AdCreative.ai failed, trying DALL-E fallback', { 
          error: result.error 
        });
        result = await generateImageWithDalle(prompt, aspectRatio);
      }

      if (!result.success) {
        logger.error('All AI providers failed', { 
          adcreativeError: result.provider === 'AdCreative.ai' ? result.error : null,
          dalleError: result.provider === 'DALL-E' ? result.error : null
        });
        
        return res.status(500).json({
          error: 'Image generation failed',
          message: 'All AI providers are currently unavailable. Please try again later.',
          retryAfter: '5 minutes'
        });
      }

      // Update product in database if productId provided
      if (productId) {
        try {
          await prisma.product.update({
            where: { id: productId },
            data: {
              aiGeneratedImageUrl: result.imageUrl,
              updatedAt: new Date(),
              updatedById: req.user.userId
            }
          });
          
          logger.info('Product updated with AI generated image', { 
            productId, 
            imageUrl: result.imageUrl 
          });
        } catch (dbError) {
          logger.error('Failed to update product with AI image', { 
            productId, 
            error: dbError.message 
          });
          // Don't fail the request if DB update fails
        }
      }

      const generationTime = Date.now() - startTime;
      
      logger.info('AI image generation completed successfully', {
        userId: req.user.userId,
        provider: result.provider,
        generationTime: `${generationTime}ms`,
        productName,
        category
      });

      // Return success response
      res.status(200).json({
        success: true,
        imageUrl: result.imageUrl,
        provider: result.provider,
        metadata: {
          prompt,
          style,
          aspectRatio,
          generationTime: `${generationTime}ms`,
          timestamp: new Date().toISOString()
        },
        message: `Image generated successfully using ${result.provider}`
      });

    } catch (error) {
      logger.error('Unexpected error in image generation', {
        error: error.message,
        stack: error.stack,
        userId: req.user?.userId,
        body: req.body
      });

      res.status(500).json({
        error: 'Internal server error',
        message: 'An unexpected error occurred during image generation. Please try again later.',
        retryAfter: '5 minutes'
      });
    }
  }
);

// Get generation history for a user
router.get('/generation-history', 
  requireManager, 
  async (req, res) => {
    try {
      const { page = 1, limit = 10 } = req.query;
      const offset = (page - 1) * limit;

      // Get products with AI generated images for the current user
      const products = await prisma.product.findMany({
        where: {
          aiGeneratedImageUrl: { not: null },
          updatedById: req.user.userId
        },
        select: {
          id: true,
          name: true,
          category: {
            select: { name: true }
          },
          aiGeneratedImageUrl: true,
          updatedAt: true
        },
        orderBy: { updatedAt: 'desc' },
        skip: offset,
        take: parseInt(limit)
      });

      const total = await prisma.product.count({
        where: {
          aiGeneratedImageUrl: { not: null },
          updatedById: req.user.userId
        }
      });

      res.status(200).json({
        success: true,
        data: products,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      });

    } catch (error) {
      logger.error('Error fetching generation history', {
        error: error.message,
        userId: req.user?.userId
      });

      res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to fetch generation history'
      });
    }
  }
);

// Health check for AI services
router.get('/health', async (req, res) => {
  try {
    const healthStatus = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        adcreative: 'unknown',
        dalle: 'unknown'
      }
    };

    // Check AdCreative.ai API key
    if (process.env.ADCREATIVE_API_KEY) {
      healthStatus.services.adcreative = 'configured';
    } else {
      healthStatus.services.adcreative = 'not_configured';
    }

    // Check OpenAI API key
    if (process.env.OPENAI_API_KEY) {
      healthStatus.services.dalle = 'configured';
    } else {
      healthStatus.services.dalle = 'not_configured';
    }

    res.status(200).json(healthStatus);

  } catch (error) {
    logger.error('AI health check failed', { error: error.message });
    res.status(500).json({
      status: 'unhealthy',
      error: 'Health check failed'
    });
  }
});

// Get available styles and aspect ratios
router.get('/options', (req, res) => {
  res.status(200).json({
    success: true,
    styles: [
      { value: 'professional', label: 'Professional', description: 'Studio-quality product photography' },
      { value: 'lifestyle', label: 'Lifestyle', description: 'Natural, contextual product shots' },
      { value: 'minimalist', label: 'Minimalist', description: 'Clean, simple product focus' },
      { value: 'elegant', label: 'Elegant', description: 'Premium, sophisticated aesthetic' },
      { value: 'modern', label: 'Modern', description: 'Contemporary, trendy approach' }
    ],
    aspectRatios: [
      { value: '1:1', label: 'Square (1:1)', description: 'Perfect for social media and thumbnails' },
      { value: '4:3', label: 'Standard (4:3)', description: 'Traditional product photography ratio' },
      { value: '16:9', label: 'Widescreen (16:9)', description: 'Modern display and banner formats' },
      { value: '3:2', label: 'Classic (3:2)', description: 'Traditional photography ratio' }
    ]
  });
});

module.exports = router;
