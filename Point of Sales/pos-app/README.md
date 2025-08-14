# Point of Sales (POS) System

A modern, full-stack Point of Sales system built with React, Node.js, Express, and Prisma ORM.

## Features

- 🛍️ **Complete POS Interface** - Process sales, manage inventory, and handle customers
- 👥 **User Management** - Role-based access control (Admin, Manager, Cashier)
- 📦 **Product Management** - Add, edit, and manage products with categories and variants
- 🏪 **Inventory Management** - Track stock levels, set alerts, and manage adjustments
- 👤 **Customer Management** - Customer database with loyalty points and purchase history
- 💰 **Sales Management** - Complete sales workflow with multiple payment methods
- 📊 **Reports & Analytics** - Business insights, sales performance, and financial reports
- 🔐 **Secure Authentication** - JWT-based authentication with role-based permissions
- 📱 **Responsive Design** - Modern UI that works on desktop and mobile devices

## Tech Stack

### Frontend
- **React 19** - Modern React with hooks and functional components
- **Tailwind CSS** - Utility-first CSS framework for rapid UI development
- **React Router** - Client-side routing for SPA navigation
- **Axios** - HTTP client for API communication
- **React Toastify** - Toast notifications for user feedback
- **Heroicons** - Beautiful SVG icons

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **Prisma ORM** - Database toolkit and ORM
- **SQLite** - Lightweight database (can be easily changed to PostgreSQL/MySQL)
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **Socket.io** - Real-time communication (for future features)

## Prerequisites

- Node.js 18+ 
- npm 8+

## Installation & Setup

### 1. Clone the repository
```bash
git clone <repository-url>
cd pos-app
```

### 2. Install dependencies
```bash
# Install root dependencies
npm install

# Install client dependencies
cd client && npm install

# Install server dependencies
cd ../server && npm install

# Return to root
cd ..
```

### 3. Environment Setup

#### Server Environment
Create a `.env` file in the `server` directory:
```env
# Database Configuration
DATABASE_URL="file:./dev.db"

# JWT Configuration
JWT_SECRET="your-super-secret-jwt-key-change-in-production"

# Server Configuration
PORT=5000
NODE_ENV=development

# Client URL for CORS
CLIENT_URL=http://localhost:3000

# Logging
LOG_LEVEL=info
```

#### Client Environment
Create a `.env` file in the `client` directory:
```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_APP_NAME=POS System
```

### 4. Database Setup
```bash
# Generate Prisma client
npm run db:generate

# Push database schema
npm run db:push

# Seed database with sample data
npm run db:seed
```

### 5. Start the application
```bash
# Start both client and server in development mode
npm run dev

# Or start them separately:
# Terminal 1 - Start server
npm run dev:server

# Terminal 2 - Start client
npm run dev:client
```

## Default Login Credentials

After seeding the database, you can use these default accounts:

| Role | Username | Password |
|------|----------|----------|
| Admin | `admin` | `admin123` |
| Manager | `manager` | `manager123` |
| Cashier | `cashier` | `cashier123` |

## Available Scripts

### Root Directory
- `npm run install:all` - Install all dependencies
- `npm run dev` - Start both client and server in development mode
- `npm run build` - Build the client for production
- `npm run test` - Run tests for both client and server
- `npm run setup` - Complete setup (install + database setup)

### Server Directory
- `npm run dev` - Start server with nodemon
- `npm start` - Start server in production mode
- `npm test` - Run server tests
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push database schema
- `npm run db:seed` - Seed database with sample data
- `npm run db:studio` - Open Prisma Studio

### Client Directory
- `npm start` - Start React development server
- `npm run build` - Build for production
- `npm test` - Run tests

## Project Structure

```
pos-app/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── auth/      # Authentication components
│   │   │   ├── dashboard/ # Dashboard components
│   │   │   ├── products/  # Product management
│   │   │   ├── sales/     # Sales and POS interface
│   │   │   ├── customers/ # Customer management
│   │   │   ├── inventory/ # Inventory management
│   │   │   ├── reports/   # Reports and analytics
│   │   │   └── layout/    # Layout and navigation
│   │   ├── context/       # React context providers
│   │   └── App.js         # Main application component
│   └── package.json
├── server/                 # Node.js backend
│   ├── src/
│   │   ├── routes/        # API route handlers
│   │   ├── controllers/   # Business logic
│   │   ├── middleware/    # Express middleware
│   │   ├── services/      # Business services
│   │   └── utils/         # Utility functions
│   ├── prisma/            # Database schema and migrations
│   └── package.json
└── package.json            # Root package.json with workspace config
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration (Admin only)
- `GET /api/auth/verify` - Verify JWT token
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/change-password` - Change password

### Products
- `GET /api/products` - Get all products
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `GET /api/products/categories` - Get product categories

### Sales
- `GET /api/sales` - Get all sales
- `POST /api/sales` - Create new sale
- `GET /api/sales/:id` - Get sale details
- `PUT /api/sales/:id` - Update sale

### Customers
- `GET /api/customers` - Get all customers
- `POST /api/customers` - Create new customer
- `PUT /api/customers/:id` - Update customer
- `DELETE /api/customers/:id` - Delete customer

### Inventory
- `GET /api/inventory` - Get inventory status
- `POST /api/inventory/adjustments` - Create inventory adjustment

### Reports
- `GET /api/reports/dashboard-stats` - Get dashboard statistics
- `GET /api/reports/sales` - Get sales reports

## Development

### Adding New Features
1. Create new components in the appropriate directory under `client/src/components/`
2. Add new routes in `client/src/App.js`
3. Create corresponding API endpoints in the server
4. Update the navigation in `client/src/components/layout/Layout.js`

### Database Changes
1. Modify the Prisma schema in `server/prisma/schema.prisma`
2. Run `npm run db:push` to apply changes
3. Update the seed script if needed

### Styling
The application uses Tailwind CSS. Custom styles can be added to `client/src/App.css`.

## Testing

```bash
# Run all tests
npm run test

# Run server tests only
npm run test:server

# Run client tests only
npm run test:client

# Run tests with coverage
npm run test:coverage
```

## Production Deployment

### Build the Application
```bash
# Build the client
npm run build

# The built files will be in client/build/
```

### Environment Variables
Make sure to set appropriate environment variables for production:
- `NODE_ENV=production`
- `JWT_SECRET` - Use a strong, unique secret
- `DATABASE_URL` - Use production database
- `CLIENT_URL` - Set to your production domain

### Database
For production, consider using:
- PostgreSQL or MySQL instead of SQLite
- Database connection pooling
- Regular backups
- Migration strategy

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## License

This project is licensed under the ISC License.

## Support

For support and questions, please open an issue in the repository.

---

**Note**: This is a development version. For production use, ensure proper security measures, error handling, and testing are in place.
