'use client';

import React, { useState, useEffect } from 'react';
import {
  ChartBarIcon,
  ShoppingCartIcon,
  UserGroupIcon,
  CurrencyRupeeIcon,
  ExclamationTriangleIcon,
  BellIcon,
  CogIcon,
  DocumentTextIcon,
  CubeIcon,
  UsersIcon,
  CreditCardIcon,
  ChartPieIcon,
  ClockIcon,
  ArrowPathIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  FireIcon,
  StarIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

// Master Pages Data with modern icons
const masterPages = [
  { name: 'Dashboard Home', icon: ChartBarIcon, color: 'from-blue-500 to-blue-600', count: 'Active', href: '/dashboard', gradient: 'bg-gradient-to-r from-blue-500 to-blue-600' },
  { name: 'New Sale (POS)', icon: ShoppingCartIcon, color: 'from-green-500 to-green-600', count: '₹25,000', href: '/pos', gradient: 'bg-gradient-to-r from-green-500 to-green-600' },
  { name: 'Sales History', icon: DocumentTextIcon, color: 'from-purple-500 to-purple-600', count: '156', href: '/sales', gradient: 'bg-gradient-to-r from-purple-500 to-purple-600' },
  { name: 'Returns', icon: ArrowPathIcon, color: 'from-red-500 to-red-600', count: '12', href: '/returns', gradient: 'bg-gradient-to-r from-red-500 to-red-600' },
  { name: 'Pending Payments', icon: CreditCardIcon, color: 'from-orange-500 to-orange-600', count: '₹45,000', href: '/payments', gradient: 'bg-gradient-to-r from-orange-500 to-orange-600' },
  { name: 'Customers', icon: UsersIcon, color: 'from-indigo-500 to-indigo-600', count: '89', href: '/customers', gradient: 'bg-gradient-to-r from-indigo-500 to-indigo-600' },
  { name: 'Shift Management', icon: ClockIcon, color: 'from-pink-500 to-pink-600', count: '2 Active', href: '/shifts', gradient: 'bg-gradient-to-r from-pink-500 to-pink-600' },
  { name: 'Reports', icon: ChartPieIcon, color: 'from-teal-500 to-teal-600', count: 'Updated', href: '/reports', gradient: 'bg-gradient-to-r from-teal-500 to-teal-600' },
  { name: 'Products', icon: CubeIcon, color: 'from-yellow-500 to-yellow-600', count: '234', href: '/products', gradient: 'bg-gradient-to-r from-yellow-500 to-yellow-600' },
  { name: 'Settings', icon: CogIcon, color: 'from-gray-500 to-gray-600', count: 'Admin', href: '/settings', gradient: 'bg-gradient-to-r from-gray-500 to-gray-600' }
];

// Enhanced Chart Data
const salesData = [
  { month: 'Jan', sales: 45000, revenue: 125000, growth: 12.5 },
  { month: 'Feb', sales: 52000, revenue: 145000, growth: 15.6 },
  { month: 'Mar', sales: 48000, revenue: 135000, growth: -7.7 },
  { month: 'Apr', sales: 61000, revenue: 168000, growth: 27.1 },
  { month: 'May', sales: 55000, revenue: 152000, growth: -9.8 },
  { month: 'Jun', sales: 68000, revenue: 185000, growth: 23.6 }
];

const topProducts = [
  { name: 'Laptop Pro', sales: 45, revenue: 225000, growth: 15.2, category: 'Electronics', rating: 4.8 },
  { name: 'Smartphone X', sales: 38, revenue: 114000, growth: 12.8, category: 'Mobile', rating: 4.6 },
  { name: 'Wireless Earbuds', sales: 67, revenue: 67000, growth: 8.5, category: 'Audio', rating: 4.9 },
  { name: 'Gaming Mouse', sales: 23, revenue: 23000, growth: 22.1, category: 'Gaming', rating: 4.7 }
];

const recentActivities = [
  { type: 'sale', description: 'Sale #INV-001 completed', amount: 2500, time: '2 min ago', status: 'success' },
  { type: 'payment', description: 'Payment received', amount: 1500, time: '15 min ago', status: 'success' },
  { type: 'stock', description: 'Low stock alert', time: '1 hour ago', status: 'warning' },
  { type: 'purchase', description: 'New stock added', time: '2 hours ago', status: 'info' }
];

export default function Dashboard() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Enhanced Quick Stats with modern design
  const quickStats = [
    { 
      title: 'Today Sales', 
      value: '₹8,900', 
      change: '+12.5%', 
      changeType: 'positive',
      icon: ShoppingCartIcon,
      gradient: 'from-green-500 to-green-600',
      bgGradient: 'from-green-50 to-green-100'
    },
    { 
      title: 'Total Revenue', 
      value: '₹7,25,000', 
      change: '+8.2%', 
      changeType: 'positive',
      icon: CurrencyRupeeIcon,
      gradient: 'from-blue-500 to-blue-600',
      bgGradient: 'from-blue-50 to-blue-100'
    },
    { 
      title: 'Active Customers', 
      value: '89', 
      change: '+5.1%', 
      changeType: 'positive',
      icon: UserGroupIcon,
      gradient: 'from-purple-500 to-purple-600',
      bgGradient: 'from-purple-50 to-purple-100'
    },
    { 
      title: 'Low Stock Items', 
      value: '8', 
      change: '-2.3%', 
      changeType: 'negative',
      icon: ExclamationTriangleIcon,
      gradient: 'from-orange-500 to-orange-600',
      bgGradient: 'from-orange-50 to-orange-100'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full opacity-20 blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full opacity-20 blur-3xl animate-pulse delay-700"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500 rounded-full opacity-10 blur-3xl animate-pulse delay-1000"></div>
      </div>
      {/* Modern Sidebar */}
      <div className={`fixed left-0 top-0 h-full bg-gray-900/80 backdrop-blur-xl border-r border-gray-800/50 transition-all duration-300 z-50 ${
        sidebarCollapsed ? 'w-20' : 'w-72'
      }`}>
        {/* Sidebar Header with gradient */}
        <div className="h-20 flex items-center justify-between px-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
          {!sidebarCollapsed && (
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <SparklesIcon className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold">Mindware POS</h1>
            </div>
          )}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-2 rounded-xl hover:bg-white/20 transition-all duration-200"
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
        
        {/* Navigation Menu with modern design */}
        <nav className="mt-8 px-4">
          <ul className="space-y-3">
            {masterPages.map((item) => (
              <li key={item.name}>
                <a
                  href={item.href}
                  className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 group hover:shadow-lg ${
                    item.href === '/dashboard'
                      ? 'bg-gradient-to-r from-purple-500 to-blue-600 text-white shadow-lg'
                      : 'text-gray-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    item.href === '/dashboard' 
                      ? 'bg-white/20' 
                      : 'bg-white/10 group-hover:bg-white/20'
                  }`}>
                    <item.icon className={`w-5 h-5 ${
                      item.href === '/dashboard' ? 'text-white' : 'text-gray-300 group-hover:text-white'
                    }`} />
                  </div>
                  {!sidebarCollapsed && (
                    <div className="ml-4 flex-1">
                      <span className="font-medium text-sm">{item.name}</span>
                      <p className={`text-xs ${
                        item.href === '/dashboard' ? 'text-purple-100' : 'text-gray-400 group-hover:text-gray-200'
                      }`}>
                        {item.count}
                      </p>
                    </div>
                  )}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Main Content with modern spacing */}
      <div className={`transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-72'}`}>
        {/* Modern Top Navbar */}
        <div className="bg-white/10 backdrop-blur-xl border-b border-white/20 h-20 flex items-center justify-between px-8 relative">
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
              Master Dashboard
            </h2>
            <p className="text-gray-300">Welcome back, Admin! 👋</p>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Modern Notifications */}
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-3 text-gray-300 hover:text-purple-400 hover:bg-white/10 rounded-xl transition-all duration-200"
            >
              <BellIcon className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold">
                3
              </span>
            </button>

            {/* Modern User Profile */}
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-3 p-3 text-gray-200 hover:text-purple-400 hover:bg-white/10 rounded-xl transition-all duration-200"
            >
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <span className="font-semibold">Admin</span>
            </button>
          </div>
        </div>

        {/* Dashboard Content with modern spacing */}
        <div className="p-8">
          {/* Enhanced Quick Stats with modern cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10 relative">
            {quickStats.map((stat, index) => (
              <div key={index} className="group relative bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden hover:scale-105">
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                <div className="relative p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${stat.gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      <stat.icon className="w-7 h-7 text-white" />
                    </div>
                    <span className={`text-sm font-bold px-3 py-1 rounded-full ${
                      stat.changeType === 'positive' 
                        ? 'bg-green-500/20 text-green-400 border border-green-400/30' 
                        : 'bg-red-500/20 text-red-400 border border-red-400/30'
                    }`}>
                      {stat.change}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-gray-300 mb-2">{stat.title}</p>
                  <p className="text-3xl font-bold text-white">{stat.value}</p>
                </div>
                <div className={`h-1 bg-gradient-to-r ${stat.gradient} opacity-80`}></div>
              </div>
            ))}
          </div>

          {/* Modern Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
            {/* Enhanced Sales Chart */}
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-lg overflow-hidden">
              <div className="p-6 border-b border-white/20">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-white">Sales Overview</h3>
                  <div className="flex items-center space-x-2">
                    <FireIcon className="w-5 h-5 text-orange-400" />
                    <span className="text-sm text-gray-300">Last 6 Months</span>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {salesData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/10 transition-colors">
                      <span className="text-sm font-semibold text-gray-200">{item.month}</span>
                      <div className="flex items-center space-x-6">
                        <span className="text-sm text-gray-400">₹{item.sales.toLocaleString()}</span>
                        <span className="text-lg font-bold text-blue-400">₹{item.revenue.toLocaleString()}</span>
                        <span className={`text-xs px-2 py-1 rounded-full border ${
                          item.growth > 0 
                            ? 'bg-green-500/20 text-green-400 border-green-400/30' 
                            : 'bg-red-500/20 text-red-400 border-red-400/30'
                        }`}>
                          {item.growth > 0 ? '+' : ''}{item.growth}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Enhanced Top Products */}
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-lg overflow-hidden">
              <div className="p-6 border-b border-white/20">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-white">Top Products</h3>
                  <StarIcon className="w-5 h-5 text-yellow-400" />
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {topProducts.map((product, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/10 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
                          <CubeIcon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-white">{product.name}</p>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-400">{product.category}</span>
                            <span className="text-xs text-yellow-400">★ {product.rating}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-white">₹{product.revenue.toLocaleString()}</p>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-400">{product.sales} sales</span>
                          <span className={`text-xs px-2 py-1 rounded-full border ${
                            product.growth > 0 
                              ? 'bg-green-500/20 text-green-400 border-green-400/30' 
                              : 'bg-red-500/20 text-red-400 border-red-400/30'
                          }`}>
                            {product.growth > 0 ? '+' : ''}{product.growth}%
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Modern Master Pages Grid */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-lg overflow-hidden mb-10">
            <div className="p-6 border-b border-white/20">
              <h3 className="text-xl font-bold text-white">Quick Access</h3>
              <p className="text-gray-300">Access all your master pages from here</p>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {masterPages.map((page, index) => (
                  <div
                    key={index}
                    className="group p-4 border border-white/20 rounded-xl hover:shadow-lg hover:bg-white/10 transition-all duration-300 cursor-pointer hover:border-purple-400/50 hover:scale-105"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${page.gradient} text-white shadow-lg`}>
                        <page.icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-white text-sm group-hover:text-purple-300 transition-colors">
                          {page.name}
                        </h4>
                        <p className="text-xs text-gray-400">{page.count}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Enhanced Recent Activities */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-lg overflow-hidden">
            <div className="p-6 border-b border-white/20">
              <h3 className="text-xl font-bold text-white">Recent Activities</h3>
              <p className="text-gray-300">Stay updated with latest happenings</p>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 rounded-xl hover:bg-white/10 transition-colors">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg ${
                      activity.type === 'sale' ? 'bg-gradient-to-r from-green-500 to-green-600' :
                      activity.type === 'payment' ? 'bg-gradient-to-r from-blue-500 to-blue-600' :
                      activity.type === 'stock' ? 'bg-gradient-to-r from-orange-500 to-orange-600' :
                      'bg-gradient-to-r from-purple-500 to-purple-600'
                    }`}>
                      {activity.type === 'sale' && <ShoppingCartIcon className="w-6 h-6 text-white" />}
                      {activity.type === 'payment' && <CreditCardIcon className="w-6 h-6 text-white" />}
                      {activity.type === 'stock' && <CubeIcon className="w-6 h-6 text-white" />}
                      {activity.type === 'purchase' && <DocumentTextIcon className="w-6 h-6 text-white" />}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-white">{activity.description}</p>
                      <div className="flex items-center space-x-3 mt-1">
                        <span className={`px-2 py-1 text-xs rounded-full border ${
                          activity.status === 'success' 
                            ? 'bg-green-500/20 text-green-400 border-green-400/30' :
                          activity.status === 'warning' 
                            ? 'bg-yellow-500/20 text-yellow-400 border-yellow-400/30' :
                            'bg-blue-500/20 text-blue-400 border-blue-400/30'
                        }`}>
                          {activity.status}
                        </span>
                        <span className="text-xs text-gray-400">{activity.time}</span>
                      </div>
                    </div>
                    {activity.amount && (
                      <span className="text-lg font-bold text-green-400">₹{activity.amount.toLocaleString()}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
