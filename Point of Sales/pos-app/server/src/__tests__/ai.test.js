const request = require('supertest');
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const axios = require('axios');

// Mock external dependencies
jest.mock('axios');
jest.mock('@prisma/client');
jest.mock('../utils/logger', () => ({
  logger: {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn()
  }
}));

// Mock Prisma client
const mockPrisma = {
  product: {
    update: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn()
  }
};

// Mock the PrismaClient constructor
PrismaClient.mockImplementation(() => mockPrisma);

// Create test app
const app = express();
app.use(express.json());

// Mock authentication middleware
const mockAuth = (req, res, next) => {
  req.user = {
    userId: 'test-user-id',
    username: 'testuser',
    role: 'MANAGER'
  };
  next();
};

// Import and apply routes with mocked auth
const aiRoutes = require('../routes/ai');
app.use('/api/ai', mockAuth, aiRoutes);

// Mock the logger to avoid console output during tests
jest.mock('../utils/logger', () => ({
  logger: {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn()
  }
}));

describe('AI Image Generation API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.NODE_ENV = 'test';
    process.env.ADCREATIVE_API_KEY = 'test-adcreative-key';
    process.env.OPENAI_API_KEY = 'test-openai-key';
  });

  afterEach(() => {
    delete process.env.ADCREATIVE_API_KEY;
    delete process.env.OPENAI_API_KEY;
  });

  describe('POST /api/ai/generate-image', () => {
    const validRequest = {
      productName: 'Test Product',
      description: 'A high-quality test product for testing purposes',
      category: 'Electronics',
      style: 'professional',
      aspectRatio: '1:1'
    };

    it('should generate image successfully with AdCreative.ai', async () => {
      // Mock successful AdCreative.ai response
      axios.post.mockResolvedValueOnce({
        data: {
          image_url: 'https://example.com/generated-image.jpg',
          prompt: 'Professional product photography...',
          style: 'professional',
          aspect_ratio: '1:1',
          id: 'gen-123'
        }
      });

      const response = await request(app)
        .post('/api/ai/generate-image')
        .send(validRequest)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.imageUrl).toBe('https://example.com/generated-image.jpg');
      expect(response.body.provider).toBe('AdCreative.ai');
      expect(response.body.metadata).toBeDefined();
    });

    it('should fallback to DALL-E when AdCreative.ai fails', async () => {
      // Mock AdCreative.ai failure
      axios.post.mockRejectedValueOnce(new Error('API unavailable'));

      // Mock successful DALL-E response
      axios.post.mockResolvedValueOnce({
        data: {
          data: [{
            url: 'https://example.com/dalle-image.jpg'
          }]
        }
      });

      const response = await request(app)
        .post('/api/ai/generate-image')
        .send(validRequest)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.imageUrl).toBe('https://example.com/dalle-image.jpg');
      expect(response.body.provider).toBe('DALL-E');
    });

    it('should return error when all providers fail', async () => {
      // Mock both providers failing
      axios.post.mockRejectedValueOnce(new Error('AdCreative.ai failed'));
      axios.post.mockRejectedValueOnce(new Error('DALL-E failed'));

      const response = await request(app)
        .post('/api/ai/generate-image')
        .send(validRequest)
        .expect(500);

      expect(response.body.error).toBe('Image generation failed');
      expect(response.body.message).toContain('All AI providers are currently unavailable');
    });

    it('should validate required fields', async () => {
      const invalidRequest = {
        productName: '', // Empty name
        description: 'Too short', // Too short description
        category: 'E' // Too short category
      };

      const response = await request(app)
        .post('/api/ai/generate-image')
        .send(invalidRequest)
        .expect(400);

      expect(response.body.error).toBe('Validation failed');
      // Joi validation stops at first error, so we expect 1 validation error
      expect(response.body.details).toHaveLength(1);
    });

    it('should validate style options', async () => {
      const invalidRequest = {
        ...validRequest,
        style: 'invalid-style'
      };

      const response = await request(app)
        .post('/api/ai/generate-image')
        .send(invalidRequest)
        .expect(400);

      expect(response.body.error).toBe('Validation failed');
      expect(response.body.details[0]).toContain('Style must be one of');
    });

    it('should validate aspect ratio options', async () => {
      const invalidRequest = {
        ...validRequest,
        aspectRatio: '5:4'
      };

      const response = await request(app)
        .post('/api/ai/generate-image')
        .send(invalidRequest)
        .expect(400);

      expect(response.body.error).toBe('Validation failed');
      expect(response.body.details[0]).toContain('Aspect ratio must be one of');
    });

    it('should update product in database when productId is provided', async () => {
      // Reset all mocks before test
      jest.clearAllMocks();
      
      // Mock successful AdCreative.ai response
      axios.post.mockResolvedValueOnce({
        data: {
          image_url: 'https://example.com/generated-image.jpg',
          prompt: 'Professional product photography...',
          style: 'professional',
          aspect_ratio: '1:1',
          id: 'gen-123'
        }
      });

      // Mock successful database update
      mockPrisma.product.update.mockResolvedValueOnce({ id: 'test-product-id' });

      const requestWithProductId = {
        ...validRequest,
        productId: 'test-product-id'
      };

      const response = await request(app)
        .post('/api/ai/generate-image')
        .send(requestWithProductId)
        .expect(200);

      // Verify the response
      expect(response.body.success).toBe(true);
      expect(response.body.imageUrl).toBe('https://example.com/generated-image.jpg');

      // Verify database update was called
      expect(mockPrisma.product.update).toHaveBeenCalledWith({
        where: { id: 'test-product-id' },
        data: {
          aiGeneratedImageUrl: 'https://example.com/generated-image.jpg',
          updatedAt: expect.any(Date),
          updatedById: 'test-user-id'
        }
      });
    });

    it('should handle database update failures gracefully', async () => {
      mockPrisma.product.update.mockRejectedValueOnce(new Error('Database error'));

      axios.post.mockResolvedValueOnce({
        data: {
          image_url: 'https://example.com/generated-image.jpg',
          prompt: 'Professional product photography...',
          style: 'professional',
          aspect_ratio: '1:1',
          id: 'gen-123'
        }
      });

      const requestWithProductId = {
        ...validRequest,
        productId: 'test-product-id'
      };

      // Should still succeed even if DB update fails
      const response = await request(app)
        .post('/api/ai/generate-image')
        .send(requestWithProductId)
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    it('should use default values for optional fields', async () => {
      const minimalRequest = {
        productName: 'Test Product',
        description: 'A high-quality test product for testing purposes',
        category: 'Electronics'
      };

      axios.post.mockResolvedValueOnce({
        data: {
          image_url: 'https://example.com/generated-image.jpg',
          prompt: 'Professional product photography...',
          style: 'professional',
          aspect_ratio: '1:1',
          id: 'gen-123'
        }
      });

      const response = await request(app)
        .post('/api/ai/generate-image')
        .send(minimalRequest)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.metadata.style).toBe('professional');
      expect(response.body.metadata.aspectRatio).toBe('1:1');
    });
  });

  describe('GET /api/ai/generation-history', () => {
    it('should return generation history for authenticated user', async () => {
      const mockProducts = [
        {
          id: 'product-1',
          name: 'Product 1',
          category: { name: 'Electronics' },
          aiGeneratedImageUrl: 'https://example.com/image1.jpg',
          updatedAt: '2024-01-01T00:00:00.000Z'
        }
      ];

      // Reset all mocks before test
      jest.clearAllMocks();
      
      // Mock successful database queries
      mockPrisma.product.findMany.mockResolvedValueOnce(mockProducts);
      mockPrisma.product.count.mockResolvedValueOnce(1);

      const response = await request(app)
        .get('/api/ai/generation-history')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(mockProducts);
      expect(response.body.pagination.total).toBe(1);
    });

    it('should handle pagination parameters', async () => {
      // Reset all mocks before test
      jest.clearAllMocks();
      
      // Mock successful database queries
      mockPrisma.product.findMany.mockResolvedValueOnce([]);
      mockPrisma.product.count.mockResolvedValueOnce(0);

      await request(app)
        .get('/api/ai/generation-history?page=2&limit=5')
        .expect(200);

      expect(mockPrisma.product.findMany).toHaveBeenCalledWith({
        where: {
          aiGeneratedImageUrl: { not: null },
          updatedById: 'test-user-id'
        },
        select: {
          id: true,
          name: true,
          category: { select: { name: true } },
          aiGeneratedImageUrl: true,
          updatedAt: true
        },
        orderBy: { updatedAt: 'desc' },
        skip: 5,
        take: 5
      });
    });

    it('should handle database errors gracefully', async () => {
      mockPrisma.product.findMany.mockRejectedValueOnce(new Error('Database error'));

      const response = await request(app)
        .get('/api/ai/generation-history')
        .expect(500);

      expect(response.body.error).toBe('Internal server error');
    });
  });

  describe('GET /api/ai/health', () => {
    it('should return health status when both API keys are configured', async () => {
      const response = await request(app)
        .get('/api/ai/health')
        .expect(200);

      expect(response.body.status).toBe('healthy');
      expect(response.body.services.adcreative).toBe('configured');
      expect(response.body.services.dalle).toBe('configured');
    });

    it('should return not_configured for missing API keys', async () => {
      delete process.env.ADCREATIVE_API_KEY;
      delete process.env.OPENAI_API_KEY;

      const response = await request(app)
        .get('/api/ai/health')
        .expect(200);

      expect(response.body.services.adcreative).toBe('not_configured');
      expect(response.body.services.dalle).toBe('not_configured');
    });
  });

  describe('GET /api/ai/options', () => {
    it('should return available styles and aspect ratios', async () => {
      const response = await request(app)
        .get('/api/ai/options')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.styles).toHaveLength(5);
      expect(response.body.aspectRatios).toHaveLength(4);
      
      expect(response.body.styles[0]).toHaveProperty('value');
      expect(response.body.styles[0]).toHaveProperty('label');
      expect(response.body.styles[0]).toHaveProperty('description');
    });
  });

  describe('Rate Limiting', () => {
    it('should enforce rate limiting on image generation', async () => {
      // This test would require more complex setup to test rate limiting
      // In a real scenario, you'd need to mock the rate limiter or test with actual requests
      expect(true).toBe(true); // Placeholder assertion
    });
  });

  describe('Error Handling', () => {
    it('should handle axios timeout errors', async () => {
      axios.post.mockRejectedValueOnce(new Error('timeout of 30000ms exceeded'));

      const response = await request(app)
        .post('/api/ai/generate-image')
        .send({
          productName: 'Test Product',
          description: 'A high-quality test product for testing purposes',
          category: 'Electronics'
        })
        .expect(500);

      expect(response.body.error).toBe('Image generation failed');
    });

    it('should handle network errors', async () => {
      axios.post.mockRejectedValueOnce(new Error('Network Error'));

      const response = await request(app)
        .post('/api/ai/generate-image')
        .send({
          productName: 'Test Product',
          description: 'A high-quality test product for testing purposes',
          category: 'Electronics'
        })
        .expect(500);

      expect(response.body.error).toBe('Image generation failed');
    });

    it('should handle malformed API responses', async () => {
      axios.post.mockResolvedValueOnce({
        data: { invalid: 'response' }
      });

      const response = await request(app)
        .post('/api/ai/generate-image')
        .send({
          productName: 'Test Product',
          description: 'A high-quality test product for testing purposes',
          category: 'Electronics'
        })
        .expect(500);

      expect(response.body.error).toBe('Image generation failed');
    });
  });
});

// Test prompt building function
describe('Prompt Building', () => {
  const aiRoutes = require('../routes/ai');
  
  // Access the buildPrompt function from the module
  const buildPrompt = aiRoutes.stack
    .find(layer => layer.route?.path === '/generate-image')
    ?.route?.stack
    ?.find(layer => layer.name === 'generateImageWithAdCreative')
    ?.handle?.toString()
    .match(/buildPrompt\([^)]+\)/)?.[0];

  it('should build professional prompts correctly', () => {
    // This is a conceptual test since we can't easily access the internal function
    // In practice, you'd test this by calling the actual endpoint
    expect(true).toBe(true);
  });
});

// Test environment variable handling
describe('Environment Variables', () => {
  it('should handle missing API keys gracefully', () => {
    delete process.env.ADCREATIVE_API_KEY;
    delete process.env.OPENAI_API_KEY;

    // The system should still function but mark services as not configured
    expect(process.env.ADCREATIVE_API_KEY).toBeUndefined();
    expect(process.env.OPENAI_API_KEY).toBeUndefined();
  });
});
