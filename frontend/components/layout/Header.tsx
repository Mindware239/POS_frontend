'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useState } from 'react'
import { 
  CpuChipIcon,
  StarIcon,
  ChevronDownIcon,
  BuildingStorefrontIcon,
  UserGroupIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  DevicePhoneMobileIcon,
  CogIcon,
  TruckIcon,
  BanknotesIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline'

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <motion.header 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-b border-white/30 shadow-lg"
    >
      {/* Top Utility Bar - Ribbon Section */}
      <div className="border-b border-slate-200/50 bg-slate-50/80">
        <div className="max-w-7xl mx-auto px-3 lg:px-4">
          <div className="flex items-center justify-between py-1.5">
            {/* Left Side - Company Info */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1.5">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-slate-600 font-medium">24x7 Support Available</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <StarIcon className="w-3 h-3 text-yellow-500" />
                <span className="text-xs text-slate-600">Trusted by 50,000+ Businesses</span>
              </div>
            </div>

            {/* Right Side - Utility Links */}
            <div className="flex items-center space-x-3">
              <Link href="/training" className="text-xs text-blue-600 hover:text-blue-700 transition-colors font-semibold">
                🎓 Join Training
              </Link>
              <Link href="/downloads" className="text-xs text-slate-600 hover:text-blue-600 transition-colors font-medium">
                📥 Downloads
              </Link>
              <Link href="/pricing" className="text-xs text-slate-600 hover:text-blue-600 transition-colors font-medium">
                💰 Pricing
              </Link>
              <Link href="/partners" className="text-xs text-slate-600 hover:text-blue-600 transition-colors font-medium">
                🤝 Become a Partner
              </Link>
              <Link href="/careers" className="text-xs text-slate-600 hover:text-blue-600 transition-colors font-medium">
                💼 Careers
              </Link>
              <Link href="/tutorials" className="text-xs text-blue-600 hover:text-blue-700 transition-colors font-semibold">
                🎥 Video Tutorials
              </Link>
              <Link href="/payment" className="text-xs text-blue-600 hover:text-blue-700 transition-colors font-semibold">
                💳 Payment
              </Link>
              <Link href="/integrations" className="text-xs text-slate-600 hover:text-blue-600 transition-colors font-medium">
                🔌 Integrations
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar - Header Section */}
      <div className="max-w-7xl mx-auto px-3 lg:px-4">
        <div className="flex items-center justify-between py-2">
          {/* Left Side - Logo and Brand */}
          <div className="flex items-center space-x-3">
            <motion.div 
              className="flex items-center space-x-2.5"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <div className="w-9 h-9 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
                <CpuChipIcon className="w-4.5 h-4.5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  Mindware
                </h1>
                <p className="text-xs text-slate-600 font-medium">The Future of Business</p>
              </div>
            </motion.div>
            
            {/* Award Badge */}
            <div className="hidden sm:flex items-center space-x-1.5 bg-gradient-to-r from-yellow-400 to-orange-500 px-2.5 py-1 rounded-full">
              <StarIcon className="w-3.5 h-3.5 text-white" />
              <span className="text-xs text-white font-bold">AI-Powered POS</span>
            </div>
          </div>

          {/* Center Section - Main Navigation Links */}
          <nav className="hidden xl:flex items-center space-x-5">
            {/* Mindware Community */}
            <Link href="/community" className="text-red-600 hover:text-red-700 font-semibold transition-colors text-sm">
              🚀 Mindware Community
            </Link>

            {/* Mindware Cloud */}
            <Link href="/cloud" className="text-slate-700 hover:text-blue-600 transition-colors font-medium text-sm">
              ☁️ Mindware Cloud
            </Link>

            {/* Software Solutions Dropdown */}
            <div className="relative group">
              <button className="flex items-center space-x-1 text-slate-700 hover:text-blue-600 transition-colors font-medium py-1.5 text-sm">
                <span>🛠️ Solutions</span>
                <ChevronDownIcon className="w-3 h-3" />
              </button>
              <div className="absolute top-full left-0 mt-1.5 w-60 bg-white/95 backdrop-blur-xl rounded-lg shadow-lg border border-white/20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-1 group-hover:translate-y-0">
                <div className="p-3 space-y-2.5">
                  <Link href="/pos" className="flex items-center space-x-2.5 p-2.5 rounded-md hover:bg-blue-50 transition-colors">
                    <BuildingStorefrontIcon className="w-4.5 h-4.5 text-blue-600" />
                    <div>
                      <div className="font-semibold text-slate-800 text-sm">POS System</div>
                      <div className="text-xs text-slate-600">Point of Sale Solution</div>
                    </div>
                  </Link>
                  <Link href="/erp" className="flex items-center space-x-2.5 p-2.5 rounded-md hover:bg-blue-50 transition-colors">
                    <BuildingStorefrontIcon className="w-4.5 h-4.5 text-green-600" />
                    <div>
                      <div className="font-semibold text-slate-800 text-sm">ERP System</div>
                      <div className="text-xs text-slate-600">Enterprise Resource Planning</div>
                    </div>
                  </Link>
                  <Link href="/crm" className="flex items-center space-x-2.5 p-2.5 rounded-md hover:bg-blue-50 transition-colors">
                    <UserGroupIcon className="w-4.5 h-4.5 text-purple-600" />
                    <div>
                      <div className="font-semibold text-slate-800 text-sm">CRM System</div>
                      <div className="text-xs text-slate-600">Customer Relationship Management</div>
                    </div>
                  </Link>
                  <Link href="/inventory" className="flex items-center space-x-2.5 p-2.5 rounded-md hover:bg-blue-50 transition-colors">
                    <ChartBarIcon className="w-4.5 h-4.5 text-orange-600" />
                    <div>
                      <div className="font-semibold text-slate-800 text-sm">Inventory Management</div>
                      <div className="text-xs text-slate-600">Stock & Supply Chain</div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>

            {/* Other Products Dropdown */}
            <div className="relative group">
              <button className="flex items-center space-x-1 text-slate-700 hover:text-blue-600 transition-colors font-medium py-1.5 text-sm">
                <span>📦 Products</span>
                <ChevronDownIcon className="w-3 h-3" />
              </button>
              <div className="absolute top-full left-0 mt-1.5 w-60 bg-white/95 backdrop-blur-xl rounded-lg shadow-lg border border-white/20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-1 group-hover:translate-y-0">
                <div className="p-3 space-y-2.5">
                  <Link href="/mobile-app" className="flex items-center space-x-2.5 p-2.5 rounded-md hover:bg-blue-50 transition-colors">
                    <DevicePhoneMobileIcon className="w-4.5 h-4.5 text-blue-600" />
                    <div>
                      <div className="font-semibold text-slate-800 text-sm">Mobile App</div>
                      <div className="text-xs text-slate-600">iOS & Android Solutions</div>
                    </div>
                  </Link>
                  <Link href="/analytics" className="flex items-center space-x-2.5 p-2.5 rounded-md hover:bg-blue-50 transition-colors">
                    <ChartBarIcon className="w-4.5 h-4.5 text-green-600" />
                    <div>
                      <div className="font-semibold text-slate-800 text-sm">Analytics Dashboard</div>
                      <div className="text-xs text-slate-600">Business Intelligence</div>
                    </div>
                  </Link>
                  <Link href="/ai-tools" className="flex items-center space-x-2.5 p-2.5 rounded-md hover:bg-blue-50 transition-colors">
                    <CpuChipIcon className="w-4.5 h-4.5 text-purple-600" />
                    <div>
                      <div className="font-semibold text-slate-800 text-sm">AI Tools</div>
                      <div className="text-xs text-slate-600">Machine Learning Solutions</div>
                    </div>
                  </Link>
                  <Link href="/security" className="flex items-center space-x-2.5 p-2.5 rounded-md hover:bg-blue-50 transition-colors">
                    <ShieldCheckIcon className="w-4.5 h-4.5 text-red-600" />
                    <div>
                      <div className="font-semibold text-slate-800 text-sm">Security Suite</div>
                      <div className="text-xs text-slate-600">Enterprise Security</div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>

            {/* Courses Dropdown */}
            <div className="relative group">
              <button className="flex items-center space-x-1 text-slate-700 hover:text-blue-600 transition-colors font-medium py-1.5 text-sm">
                <span>📚 Courses</span>
                <ChevronDownIcon className="w-3 h-3" />
              </button>
              <div className="absolute top-full left-0 mt-1.5 w-60 bg-white/95 backdrop-blur-xl rounded-lg shadow-lg border border-white/20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-1 group-hover:translate-y-0">
                <div className="p-3 space-y-2.5">
                  <Link href="/pos-training" className="flex items-center space-x-2.5 p-2.5 rounded-md hover:bg-blue-50 transition-colors">
                    <BuildingStorefrontIcon className="w-4.5 h-4.5 text-blue-600" />
                    <div>
                      <div className="font-semibold text-slate-800 text-sm">POS Training</div>
                      <div className="text-xs text-slate-600">Master Your POS System</div>
                    </div>
                  </Link>
                  <Link href="/business-management" className="flex items-center space-x-2.5 p-2.5 rounded-md hover:bg-blue-50 transition-colors">
                    <ChartBarIcon className="w-4.5 h-4.5 text-green-600" />
                    <div>
                      <div className="font-semibold text-slate-800 text-sm">Business Management</div>
                      <div className="text-xs text-slate-600">Strategic Business Skills</div>
                    </div>
                  </Link>
                  <Link href="/ai-fundamentals" className="flex items-center space-x-2.5 p-2.5 rounded-md hover:bg-blue-50 transition-colors">
                    <CpuChipIcon className="w-4.5 h-4.5 text-purple-600" />
                    <div>
                      <div className="font-semibold text-slate-800 text-sm">AI Fundamentals</div>
                      <div className="text-xs text-slate-600">Understanding AI & ML</div>
                    </div>
                  </Link>
                  <Link href="/certification" className="flex items-center space-x-2.5 p-2.5 rounded-md hover:bg-blue-50 transition-colors">
                    <StarIcon className="w-4.5 h-4.5 text-yellow-600" />
                    <div>
                      <div className="font-semibold text-slate-800 text-sm">Certification</div>
                      <div className="text-xs text-slate-600">Get Certified</div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>

            {/* Login Dropdown */}
            <div className="relative group">
              <button className="flex items-center space-x-1 text-slate-700 hover:text-blue-600 transition-colors font-medium py-1.5 text-sm">
                <span>🔐 Login</span>
                <ChevronDownIcon className="w-3 h-3" />
              </button>
              <div className="absolute top-full left-0 mt-1.5 w-60 bg-white/95 backdrop-blur-xl rounded-lg shadow-lg border border-white/20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-1 group-hover:translate-y-0">
                <div className="p-3 space-y-2.5">
                  <Link href="/admin-login" className="flex items-center space-x-2.5 p-2.5 rounded-md hover:bg-blue-50 transition-colors">
                    <CogIcon className="w-4.5 h-4.5 text-blue-600" />
                    <div>
                      <div className="font-semibold text-slate-800 text-sm">Admin Login</div>
                      <div className="text-xs text-slate-600">System Administration</div>
                    </div>
                  </Link>
                  <Link href="/retail-login" className="flex items-center space-x-2.5 p-2.5 rounded-md hover:bg-blue-50 transition-colors">
                    <BuildingStorefrontIcon className="w-4.5 h-4.5 text-green-600" />
                    <div>
                      <div className="font-semibold text-slate-800 text-sm">Retail Login</div>
                      <div className="text-xs text-slate-600">Store Operations</div>
                    </div>
                  </Link>
                  <Link href="/distribution-login" className="flex items-center space-x-2.5 p-2.5 rounded-md hover:bg-blue-50 transition-colors">
                    <TruckIcon className="w-4.5 h-4.5 text-orange-600" />
                    <div>
                      <div className="font-semibold text-slate-800 text-sm">Distribution Login</div>
                      <div className="text-xs text-slate-600">Supply Chain Management</div>
                    </div>
                  </Link>
                  <Link href="/finance-login" className="flex items-center space-x-2.5 p-2.5 rounded-md hover:bg-blue-50 transition-colors">
                    <BanknotesIcon className="w-4.5 h-4.5 text-green-600" />
                    <div>
                      <div className="font-semibold text-slate-800 text-sm">Finance Login</div>
                      <div className="text-xs text-slate-600">Financial Management</div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>

            {/* Contact Us */}
            <Link href="/contact" className="text-slate-700 hover:text-blue-600 transition-colors font-medium text-sm">
              📞 Contact Us
            </Link>
          </nav>

          {/* CTA Buttons - Right Side */}
          <div className="flex items-center space-x-2.5">
            <Link 
              href="/demo" 
              className="hidden lg:inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-semibold rounded-md hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              🚀 Try Demo
            </Link>
            <Link 
              href="/register" 
              className="hidden sm:inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm font-semibold rounded-md hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              ✨ Get Started
            </Link>
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="xl:hidden p-1.5 rounded-md hover:bg-slate-100 transition-colors"
            >
              {isMobileMenuOpen ? (
                <XMarkIcon className="w-5 h-5 text-slate-600" />
              ) : (
                <Bars3Icon className="w-5 h-5 text-slate-600" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="xl:hidden border-t border-slate-200 bg-white/95 backdrop-blur-xl"
        >
          <div className="px-4 py-4 space-y-4">
            <Link href="/community" className="block text-red-600 font-semibold text-base py-2">
              🚀 Mindware Community
            </Link>
            <Link href="/cloud" className="block text-slate-700 font-medium text-base py-2">
              ☁️ Mindware Cloud
            </Link>
            <Link href="/pos" className="block text-slate-700 font-medium text-base py-2">
              🛠️ Solutions
            </Link>
            <Link href="/products" className="block text-slate-700 font-medium text-base py-2">
              📦 Products
            </Link>
            <Link href="/courses" className="block text-slate-700 font-medium text-base py-2">
              📚 Courses
            </Link>
            <Link href="/login" className="block text-slate-700 font-medium text-base py-2">
              🔐 Login
            </Link>
            <Link href="/contact" className="block text-slate-700 font-medium text-base py-2">
              📞 Contact Us
            </Link>
            
            <div className="pt-4 space-y-3">
              <Link 
                href="/demo" 
                className="block w-full text-center px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-base font-semibold rounded-lg"
              >
                🚀 Try Demo
              </Link>
              <Link 
                href="/register" 
                className="block w-full text-center px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-base font-semibold rounded-lg"
              >
                ✨ Get Started
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </motion.header>
  )
}
