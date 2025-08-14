# AI Image Generation Integration

This document describes the AI image generation integration for the POS system, including setup, configuration, and usage.

## Overview

The AI integration provides automated product image generation using two AI providers:
- **Primary**: AdCreative.ai (recommended for commercial use)
- **Fallback**: OpenAI DALL-E (backup option)

## Features

- 🎨 **Multiple Styles**: Professional, Lifestyle, Minimalist, Elegant, Modern
- 📐 **Aspect Ratios**: 1:1 (Square), 4:3 (Standard), 16:9 (Widescreen), 3:2 (Classic)
- 🔄 **Automatic Fallback**: Seamlessly switches between providers if one fails
- 🛡️ **Security**: API keys are hidden from frontend, rate limiting enforced
- 📊 **Logging**: Comprehensive logging for monitoring and debugging
- 🗄️ **Database Integration**: Automatically updates products with generated images

## Environment Variables

Create a `.env` file in the `server` directory with the following variables:

```bash
# AI Image Generation API Keys
ADCREATIVE_API_KEY="your-adcreative-ai-api-key-here"
OPENAI_API_KEY="your-openai-api-key-here"

# Other required variables
JWT_SECRET="your-super-secret-jwt-key-here"
DATABASE_URL="file:./dev.db"
PORT=5000
NODE_ENV="development"
CLIENT_URL="http://localhost:3000"
```

### Getting API Keys

#### AdCreative.ai
1. Visit [AdCreative.ai](https://adcreative.ai)
2. Sign up for an account
3. Navigate to API section
4. Generate your API key
5. Copy the key to your `.env` file

#### OpenAI DALL-E
1. Visit [OpenAI Platform](https://platform.openai.com)
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key to your `.env` file

## API Endpoints

### Generate Image
```http
POST /api/ai/generate-image
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "productName": "Wireless Headphones",
  "description": "Premium noise-cancelling wireless headphones with 30-hour battery life",
  "category": "Electronics",
  "style": "professional",
  "aspectRatio": "1:1",
  "productId": "optional-product-id"
}
```

**Response:**
```json
{
  "success": true,
  "imageUrl": "https://example.com/generated-image.jpg",
  "provider": "AdCreative.ai",
  "metadata": {
    "prompt": "Professional product photography...",
    "style": "professional",
    "aspectRatio": "1:1",
    "generationTime": "2.5s",
    "timestamp": "2024-01-01T12:00:00.000Z"
  },
  "message": "Image generated successfully using AdCreative.ai"
}
```

### Get Generation History
```http
GET /api/ai/generation-history?page=1&limit=10
Authorization: Bearer <jwt-token>
```

### Get Available Options
```http
GET /api/ai/options
Authorization: Bearer <jwt-token>
```

### Health Check
```http
GET /api/ai/health
Authorization: Bearer <jwt-token>
```

## Style Options

| Style | Description | Best For |
|-------|-------------|----------|
| **Professional** | Studio-quality product photography | E-commerce, catalogs |
| **Lifestyle** | Natural, contextual product shots | Social media, marketing |
| **Minimalist** | Clean, simple product focus | Modern brands, minimal design |
| **Elegant** | Premium, sophisticated aesthetic | Luxury products, high-end brands |
| **Modern** | Contemporary, trendy approach | Tech products, fashion |

## Aspect Ratios

| Ratio | Dimensions | Best Use |
|-------|------------|----------|
| **1:1** | Square | Social media, thumbnails, product grids |
| **4:3** | Standard | Traditional product photography, catalogs |
| **16:9** | Widescreen | Banner images, hero sections, displays |
| **3:2** | Classic | Traditional photography, print materials |

## Rate Limiting

- **General API**: 100 requests per 15 minutes per IP
- **AI Generation**: 10 requests per 15 minutes per user
- Rate limits are enforced per user ID when authenticated

## Error Handling

The system handles various error scenarios gracefully:

- **API Failures**: Automatic fallback between providers
- **Network Issues**: Timeout handling and retry logic
- **Invalid Input**: Comprehensive validation with clear error messages
- **Database Errors**: Graceful degradation without failing the request

## Security Features

- **API Key Protection**: Keys are never exposed to the frontend
- **Authentication Required**: All endpoints require valid JWT tokens
- **Role-Based Access**: Only managers and admins can generate images
- **Input Validation**: Strict validation of all input parameters
- **Rate Limiting**: Prevents abuse and controls costs

## Monitoring and Logging

### Log Levels
- **Info**: Successful operations, API calls
- **Warn**: Validation failures, rate limit hits
- **Error**: API failures, unexpected errors

### Log Files
- `combined.log`: All logs
- `error.log`: Error-level logs only
- `access.log`: HTTP request logs
- `exceptions.log`: Uncaught exceptions

## Testing

Run the test suite to verify functionality:

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

## Troubleshooting

### Common Issues

1. **"API key not configured"**
   - Check your `.env` file
   - Ensure API keys are correctly set
   - Restart the server after changing environment variables

2. **"Rate limit exceeded"**
   - Wait for the rate limit window to reset (15 minutes)
   - Check your usage patterns
   - Consider upgrading your API plan if needed

3. **"Image generation failed"**
   - Check the logs for specific error details
   - Verify API key validity
   - Check network connectivity

4. **"Validation failed"**
   - Review the error details in the response
   - Ensure all required fields are provided
   - Check field length and format requirements

### Debug Mode

Enable debug logging by setting:
```bash
LOG_LEVEL="debug"
```

## Performance Considerations

- **Generation Time**: Typically 5-30 seconds depending on provider
- **Image Quality**: High-resolution outputs suitable for commercial use
- **Caching**: Generated images are stored in the database
- **Fallback Strategy**: Ensures high availability

## Cost Management

- **AdCreative.ai**: Pay-per-generation model
- **OpenAI DALL-E**: Pay-per-image model
- **Rate Limiting**: Built-in cost controls
- **Monitoring**: Track usage through logs and health endpoints

## Future Enhancements

- [ ] Batch image generation
- [ ] Custom prompt templates
- [ ] Image editing capabilities
- [ ] Style transfer options
- [ ] Bulk product processing
- [ ] Advanced analytics dashboard

## Support

For issues or questions:
1. Check the logs for error details
2. Review this documentation
3. Test with the health endpoint
4. Verify API key configuration
5. Check rate limit status

## License

This integration is part of the POS system and follows the same licensing terms.
