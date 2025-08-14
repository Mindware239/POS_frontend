# 🛒 POS (Point of Sale) System

A robust, full-stack Point of Sale web application with AI-generated product photos, built with React, Node.js, and SQLite.

## ✨ Features

- **Product Management**: Add, edit, delete products with AI-generated images
- **Inventory Tracking**: Real-time stock monitoring and alerts
- **Sales Processing**: Complete sales workflow with multiple payment methods
- **Customer Management**: Customer profiles and loyalty points
- **Supplier Management**: Supplier information and purchase orders
- **User Management**: Role-based access control (Admin, Manager, Staff, Cashier)
- **AI Integration**: AdCreative.ai for product image generation
- **Real-time Updates**: Socket.io for live notifications
- **Reporting**: Sales analytics and inventory reports
- **Barcode Scanning**: Quagga.js for product scanning

## 🏗️ Architecture

- **Frontend**: React 18 with modern hooks, Framer Motion animations
- **Backend**: Node.js/Express with JWT authentication
- **Database**: SQLite with Prisma ORM (easily migratable to PostgreSQL)
- **Real-time**: Socket.io for live updates
- **Styling**: Tailwind CSS with custom component library
- **State Management**: Redux Toolkit with Redux Thunk
- **Testing**: Jest for backend, React Testing Library for frontend

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd pos-app
   ```

2. **Install dependencies**
   ```bash
   # Install server dependencies
   cd server
   npm install
   
   # Install client dependencies
   cd ../client
   npm install
   ```

3. **Environment Setup**
   
   **Server (.env in server directory):**
   ```env
   DATABASE_URL=file:./dev.db
   JWT_SECRET=your_super_secret_jwt_key_change_in_production
   PORT=5000
   ADCREATIVE_API_KEY=your_adcreative_api_key_here
   NODE_ENV=development
   ```
   
   **Client (.env in client directory):**
   ```env
   REACT_APP_API_URL=http://localhost:5000
   REACT_APP_SOCKET_URL=http://localhost:5000
   REACT_APP_ADCREATIVE_API_KEY=your_adcreative_api_key_here
   REACT_APP_ENVIRONMENT=development
   ```

4. **Database Setup**
   ```bash
   cd server
   npx prisma generate
   npx prisma db push
   ```

5. **Start the application**
   ```bash
   # Terminal 1 - Start server
   cd server
   npm run dev
   
   # Terminal 2 - Start client
   cd client
   npm start
   ```

## 📁 Project Structure

```
pos-app/
├── client/                 # React frontend
│   ├── public/            # Static files
│   ├── src/               # Source code
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── store/         # Redux store
│   │   ├── services/      # API services
│   │   └── utils/         # Utility functions
│   ├── tailwind.config.js # Tailwind configuration
│   └── package.json
├── server/                 # Node.js backend
│   ├── src/               # Source code
│   │   ├── routes/        # API routes
│   │   ├── controllers/   # Route controllers
│   │   ├── middleware/    # Custom middleware
│   │   ├── services/      # Business logic
│   │   └── utils/         # Utility functions
│   ├── prisma/            # Database schema
│   ├── logs/              # Application logs
│   └── package.json
└── README.md
```

## 🧪 Testing

### Backend Tests
```bash
cd server
npm test
npm run test:watch
```

### Frontend Tests
```bash
cd client
npm test
```

## 🗄️ Database

The application uses Prisma ORM with SQLite for development. The schema includes:

- **Users**: Authentication and role management
- **Products**: Product catalog with AI-generated images
- **Categories**: Product categorization
- **Customers**: Customer information and loyalty
- **Suppliers**: Supplier management
- **Sales**: Sales transactions and history
- **Inventory**: Stock tracking and logs

## 🔐 Security Features

- JWT-based authentication
- Role-based access control (RBAC)
- Password hashing with bcrypt
- Rate limiting with express-rate-limit
- Input validation and sanitization
- CORS configuration
- Environment variable management

## 📊 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration (Admin only)
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/change-password` - Change password

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Sales
- `GET /api/sales` - Get all sales
- `GET /api/sales/:id` - Get sale by ID
- `POST /api/sales` - Create sale
- `PUT /api/sales/:id` - Update sale

### AI Integration
- `POST /api/ai/generate-image` - Generate AI product image
- `GET /api/ai/images` - Get generated images

## 🎨 UI Components

The application includes a comprehensive component library built with Tailwind CSS:

- **Buttons**: Primary, secondary, success, warning, danger variants
- **Forms**: Input fields, select dropdowns, textareas
- **Cards**: Content containers with shadows and borders
- **Modals**: Overlay dialogs with animations
- **Tables**: Data display with sorting and pagination
- **Charts**: Data visualization with Chart.js

## 🚀 Deployment

### Production Build
```bash
# Client
cd client
npm run build

# Server
cd server
npm start
```

### Environment Variables
Update `.env` files with production values:
- Strong JWT secret
- Production database URL
- API keys
- CORS origins

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📝 License

This project is licensed under the ISC License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the test files for examples

## 🔮 Roadmap

- [ ] Multi-store support
- [ ] Advanced reporting dashboard
- [ ] Mobile app (React Native)
- [ ] Offline mode support
- [ ] Integration with accounting software
- [ ] Advanced AI features
- [ ] Multi-language support
