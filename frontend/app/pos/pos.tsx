'use client';

import React, { useState, useEffect } from 'react';
import {
  MagnifyingGlassIcon,
  QrCodeIcon,
  XMarkIcon,
  ShoppingCartIcon,
  UserIcon,
  CreditCardIcon,
  DocumentTextIcon,
  PrinterIcon,
  ArrowPathIcon,
  CheckIcon,
  ExclamationTriangleIcon,
  CurrencyRupeeIcon,
  ClockIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';

interface Product {
  id: number;
  name: string;
  sku: string;
  price: number;
  stock: number;
  category: string;
}

interface CartItem {
  product: Product;
  quantity: number;
  total: number;
}

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  loyaltyPoints: number;
}

interface Shift {
  id: number;
  cashierName: string;
  startTime: string;
  endTime?: string;
  status: 'open' | 'closed';
  openingBalance: number;
  currentBalance: number;
}

interface PaymentMethod {
  id: number;
  name: string;
  icon: string;
}

export default function NewSale() {
  const [shift, setShift] = useState<Shift | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [splitPayments, setSplitPayments] = useState<{ method: string; amount: number }[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  // Mock data
  useEffect(() => {
    setProducts([
      { id: 1, name: 'Laptop Pro', sku: 'LP001', price: 45000, stock: 25, category: 'Electronics' },
      { id: 2, name: 'Smartphone X', sku: 'SP002', price: 30000, stock: 40, category: 'Electronics' },
      { id: 3, name: 'Wireless Earbuds', sku: 'WE003', price: 2500, stock: 100, category: 'Electronics' },
      { id: 4, name: 'Gaming Mouse', sku: 'GM004', price: 1500, stock: 75, category: 'Electronics' },
      { id: 5, name: 'T-Shirt Cotton', sku: 'TS005', price: 800, stock: 200, category: 'Clothing' },
      { id: 6, name: 'Jeans Denim', sku: 'JD006', price: 1200, stock: 150, category: 'Clothing' },
      { id: 7, name: 'Protein Powder', sku: 'PP007', price: 2500, stock: 50, category: 'Food' },
      { id: 8, name: 'Yoga Mat', sku: 'YM008', price: 800, stock: 80, category: 'Sports' }
    ]);

    setShift({
      id: 1,
      cashierName: 'Admin User',
      startTime: new Date().toLocaleTimeString(),
      status: 'open',
      openingBalance: 10000,
      currentBalance: 10000
    });
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = products.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts([]);
    }
  }, [searchQuery, products]);

  const addToCart = (product: Product) => {
    const existingItem = cart.find(item => item.product.id === product.id);
    
    if (existingItem) {
      setCart(cart.map(item =>
        item.product.id === product.id
          ? { ...item, quantity: item.quantity + 1, total: (item.quantity + 1) * item.product.price }
          : item
      ));
    } else {
      setCart([...cart, {
        product,
        quantity: 1,
        total: product.price
      }]);
    }
  };

  const updateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCart(cart.map(item =>
      item.product.id === productId
        ? { ...item, quantity: newQuantity, total: newQuantity * item.product.price }
        : item
    ));
  };

  const removeFromCart = (productId: number) => {
    setCart(cart.filter(item => item.product.id !== productId));
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.total, 0);
  };

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  const scanBarcode = () => {
    // Simulate barcode scanning
    alert('Barcode scanner activated. Please scan a product.');
  };

  const processPayment = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert('Payment processed successfully!');
      // Here you would typically save to database, update stock, etc.
    }, 2000);
  };

  const generateInvoice = () => {
    const invoiceData = {
      invoiceNumber: `INV-${Date.now()}`,
      date: new Date().toLocaleDateString(),
      customer: selectedCustomer,
      items: cart,
      total: getCartTotal(),
      shift: shift
    };
    
    console.log('Invoice generated:', invoiceData);
    alert('Invoice generated and saved to database!');
  };

  const printReceipt = () => {
    const receiptWindow = window.open('', '_blank');
    if (receiptWindow) {
      receiptWindow.document.write(`
        <html>
          <head><title>Receipt</title></head>
          <body style="font-family: monospace; padding: 20px;">
            <h2>Mindware POS - Receipt</h2>
            <p>Date: ${new Date().toLocaleDateString()}</p>
            <p>Cashier: ${shift?.cashierName}</p>
            <hr>
            ${cart.map(item => `
              <p>${item.product.name} x${item.quantity} - ₹${item.total}</p>
            `).join('')}
            <hr>
            <h3>Total: ₹${getCartTotal()}</h3>
            <p>Thank you for your purchase!</p>
          </body>
        </html>
      `);
      receiptWindow.print();
    }
  };

  const paymentMethods: PaymentMethod[] = [
    { id: 1, name: 'Cash', icon: '💵' },
    { id: 2, name: 'Card', icon: '💳' },
    { id: 3, name: 'UPI', icon: '📱' },
    { id: 4, name: 'Net Banking', icon: '🏦' },
    { id: 5, name: 'Wallet', icon: '👛' }
  ];

  const customers: Customer[] = [
    { id: 1, name: 'John Doe', email: 'john@example.com', phone: '+91 98765 43210', loyaltyPoints: 150 },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '+91 98765 43211', loyaltyPoints: 75 },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', phone: '+91 98765 43212', loyaltyPoints: 200 }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">New Sale</h1>
              <p className="text-sm text-gray-500">Complete the billing process</p>
            </div>
            
            {/* Shift Info */}
            <div className="flex items-center space-x-4">
              <div className="bg-green-100 text-green-800 px-3 py-2 rounded-lg">
                <div className="flex items-center space-x-2">
                  <ClockIcon className="w-4 h-4" />
                  <span className="text-sm font-medium">Shift Open</span>
                </div>
                <p className="text-xs">Cashier: {shift?.cashierName}</p>
              </div>
              
              <div className="bg-blue-100 text-blue-800 px-3 py-2 rounded-lg">
                <p className="text-sm font-medium">Balance: ₹{shift?.currentBalance.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-120px)]">
        {/* Left Side - Product Selection & Cart */}
        <div className="flex-1 flex flex-col">
          {/* Product Search & Quick Actions */}
          <div className="bg-white p-4 border-b border-gray-200">
            {/* Search Bar with Quick Actions */}
            <div className="flex items-center space-x-3 mb-4">
              <div className="flex-1 relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Type product name, SKU, or scan barcode..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-lg"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                )}
              </div>
              
              <button
                onClick={scanBarcode}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl flex items-center space-x-2"
              >
                <QrCodeIcon className="w-5 h-5" />
                <span className="font-medium">Scan</span>
              </button>
            </div>

            {/* Quick Category Pills */}
            <div className="flex flex-wrap gap-2 mb-4">
              {['All', 'Electronics', 'Clothing', 'Food', 'Sports'].map((category) => (
                <button
                  key={category}
                  onClick={() => setSearchQuery(category === 'All' ? '' : category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    (searchQuery === category || (category === 'All' && searchQuery === ''))
                      ? 'bg-primary-600 text-white shadow-lg scale-105'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:scale-105'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Search Results - Modern Floating Style */}
            {searchQuery && (
              <div className="bg-white rounded-xl shadow-2xl border border-gray-200 max-h-96 overflow-hidden">
                <div className="p-4 bg-gradient-to-r from-primary-50 to-primary-100 border-b border-primary-200">
                  <h3 className="text-lg font-semibold text-primary-800">
                    {filteredProducts.length > 0 
                      ? `Found ${filteredProducts.length} products` 
                      : 'No products found'
                    }
                  </h3>
                </div>
                
                {filteredProducts.length > 0 ? (
                  <div className="max-h-80 overflow-y-auto">
                    {filteredProducts.map((product) => (
                      <div
                        key={product.id}
                        className="flex items-center justify-between p-4 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors cursor-pointer group"
                        onClick={() => addToCart(product)}
                      >
                        {/* Product Info */}
                        <div className="flex items-center space-x-4 flex-1">
                          {/* Product Avatar */}
                          <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg flex items-center justify-center flex-shrink-0">
                            <span className="text-lg font-bold text-primary-700">
                              {product.name.charAt(0)}
                            </span>
                          </div>
                          
                          {/* Product Details */}
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-gray-900 text-lg truncate">
                              {product.name}
                            </h4>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span>SKU: {product.sku}</span>
                              <span>Stock: {product.stock}</span>
                              <span className="capitalize">{product.category}</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Price & Actions */}
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <p className="text-2xl font-bold text-primary-600">
                              ₹{product.price.toLocaleString()}
                            </p>
                            <p className="text-sm text-gray-500">
                              {product.stock > 10 ? 'In Stock' : product.stock > 0 ? 'Low Stock' : 'Out of Stock'}
                            </p>
                          </div>
                          
                          {/* Quick Add Button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              addToCart(product);
                            }}
                            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 duration-200"
                          >
                            + Add
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <MagnifyingGlassIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg mb-2">No products found for "{searchQuery}"</p>
                    <p className="text-gray-400">Try a different search term or category</p>
                    <button
                      onClick={() => setSearchQuery('')}
                      className="mt-4 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                    >
                      Clear Search
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Popular Products - When No Search */}
            {!searchQuery && (
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Popular Products</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {products.slice(0, 6).map((product) => (
                    <div
                      key={product.id}
                      className="bg-white rounded-lg p-3 hover:shadow-lg transition-all cursor-pointer group border border-gray-200 hover:border-primary-300"
                      onClick={() => addToCart(product)}
                    >
                      {/* Product Icon */}
                      <div className="w-12 h-12 bg-gradient-to-br from-primary-50 to-primary-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                        <span className="text-xl font-bold text-primary-600">
                          {product.name.charAt(0)}
                        </span>
                      </div>
                      
                      {/* Product Info */}
                      <div className="text-center">
                        <h4 className="font-medium text-gray-900 text-sm mb-1 truncate" title={product.name}>
                          {product.name}
                        </h4>
                        <p className="text-lg font-bold text-primary-600 mb-1">
                          ₹{product.price.toLocaleString()}
                        </p>
                        
                        {/* Quick Add on Hover */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            addToCart(product);
                          }}
                          className="w-full py-1.5 bg-primary-600 text-white text-xs rounded-md hover:bg-primary-700 transition-all opacity-0 group-hover:opacity-100 transform translate-y-1 group-hover:translate-y-0 duration-200"
                        >
                          Quick Add
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Cart */}
          <div className="flex-1 bg-white p-4 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Shopping Cart</h3>
              <div className="flex items-center space-x-2">
                <ShoppingCartIcon className="w-5 h-5 text-gray-600" />
                <span className="text-sm text-gray-500">{getCartCount()} items</span>
              </div>
            </div>

            {cart.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingCartIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">Your cart is empty</p>
                <p className="text-gray-400 text-sm">Search and add products to get started</p>
              </div>
            ) : (
              <div className="space-y-3">
                {cart.map((item) => (
                  <div key={item.product.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3 flex-1">
                      <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                        <span className="text-lg font-bold text-primary-600">
                          {item.product.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{item.product.name}</h4>
                        <p className="text-sm text-gray-500">SKU: {item.product.sku}</p>
                        <p className="text-sm text-gray-500">₹{item.product.price.toLocaleString()} each</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="w-8 h-8 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                        >
                          -
                        </button>
                        <span className="w-12 text-center font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="w-8 h-8 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                        >
                          +
                        </button>
                      </div>
                      
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">₹{item.total.toLocaleString()}</p>
                      </div>
                      
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="w-8 h-8 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                      >
                        <XMarkIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Side - Customer & Payment */}
        <div className="w-96 bg-white border-l border-gray-200 flex flex-col">
          {/* Customer Selection */}
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer</h3>
            
            {selectedCustomer ? (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-blue-900">{selectedCustomer.name}</p>
                    <p className="text-sm text-blue-700">{selectedCustomer.email}</p>
                    <p className="text-sm text-blue-700">{selectedCustomer.phone}</p>
                    <p className="text-xs text-blue-600">Loyalty Points: {selectedCustomer.loyaltyPoints}</p>
                  </div>
                  <button
                    onClick={() => setSelectedCustomer(null)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                {customers.map((customer) => (
                  <button
                    key={customer.id}
                    onClick={() => setSelectedCustomer(customer)}
                    className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <p className="font-medium text-gray-900">{customer.name}</p>
                    <p className="text-sm text-gray-500">{customer.email}</p>
                    <p className="text-xs text-gray-400">Points: {customer.loyaltyPoints}</p>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Payment Summary */}
          <div className="flex-1 p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Summary</h3>
            
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium">₹{getCartTotal().toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Tax (18%):</span>
                  <span className="font-medium">₹{(getCartTotal() * 0.18).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Discount:</span>
                  <span className="font-medium text-green-600">₹0</span>
                </div>
                <hr className="my-2" />
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900">Total:</span>
                  <span className="text-2xl font-bold text-primary-600">
                    ₹{(getCartTotal() * 1.18).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Payment Methods */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Payment Method</h4>
                <div className="grid grid-cols-2 gap-2">
                  {paymentMethods.map((method) => (
                    <button
                      key={method.id}
                      className="p-3 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors text-center"
                    >
                      <div className="text-2xl mb-1">{method.icon}</div>
                      <p className="text-sm font-medium text-gray-700">{method.name}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={processPayment}
                  disabled={cart.length === 0 || loading}
                  className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  {loading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <ArrowPathIcon className="w-5 h-5 animate-spin" />
                      <span>Processing...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2">
                      <CreditCardIcon className="w-5 h-5" />
                      <span>Process Payment</span>
                    </div>
                  )}
                </button>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={generateInvoice}
                    className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    <DocumentTextIcon className="w-4 h-4 inline mr-2" />
                    Generate Invoice
                  </button>
                  
                  <button
                    onClick={printReceipt}
                    className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                  >
                    <PrinterIcon className="w-4 h-4 inline mr-2" />
                    Print Receipt
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
