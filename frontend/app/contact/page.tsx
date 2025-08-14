'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  CpuChipIcon,
  BuildingStorefrontIcon,
  UserGroupIcon,
  ChartBarIcon,
  CogIcon,
  TruckIcon,
  CreditCardIcon,
  DocumentTextIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  ArrowRightIcon,
  SparklesIcon,
  BoltIcon,
  ShieldCheckIcon,
  GlobeAltIcon,
  EyeIcon,
  EyeSlashIcon,
  CheckIcon,
  StarIcon,
  RocketLaunchIcon,
  FireIcon,
  HeartIcon,
  PuzzlePieceIcon,
  LightBulbIcon,
  WrenchScrewdriverIcon,
  ClipboardDocumentListIcon,
  CubeIcon,
  BanknotesIcon,
  DevicePhoneMobileIcon,
  ComputerDesktopIcon,
  DeviceTabletIcon
} from '@heroicons/react/24/outline'
import Link from 'next/link'

export default function ContactPage() {
  const [activeTab, setActiveTab] = useState('contact')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [selectedLoginType, setSelectedLoginType] = useState('admin')

  const loginTypes = [
    {
      id: 'admin',
      title: 'Admin Login',
      description: 'Full system access and management',
      icon: CpuChipIcon,
      color: 'from-violet-500 via-purple-500 to-indigo-600',
      bgColor: 'from-violet-50/80 to-purple-50/80',
      features: ['System Configuration', 'User Management', 'Advanced Analytics', 'Security Settings']
    },
    {
      id: 'retail',
      title: 'Retail Login',
      description: 'Store operations and sales management',
      icon: BuildingStorefrontIcon,
      color: 'from-blue-500 via-cyan-500 to-teal-600',
      bgColor: 'from-blue-50/80 to-cyan-50/80',
      features: ['Point of Sale', 'Inventory Management', 'Customer Service', 'Sales Reports']
    },
    {
      id: 'distribution',
      title: 'Distribution Login',
      description: 'Supply chain and logistics management',
      icon: TruckIcon,
      color: 'from-green-500 via-emerald-500 to-teal-600',
      bgColor: 'from-green-50/80 to-emerald-50/80',
      features: ['Order Management', 'Route Optimization', 'Warehouse Control', 'Delivery Tracking']
    },
    {
      id: 'manufacturing',
      title: 'Manufacturing Login',
      description: 'Production and quality control',
      icon: CogIcon,
      color: 'from-orange-500 via-red-500 to-pink-600',
      bgColor: 'from-orange-50/80 to-red-50/80',
      features: ['Production Planning', 'Quality Control', 'Resource Management', 'Performance Analytics']
    },
    {
      id: 'finance',
      title: 'Finance Login',
      description: 'Financial management and accounting',
      icon: ChartBarIcon,
      color: 'from-purple-500 via-pink-500 to-rose-600',
      bgColor: 'from-purple-50/80 to-pink-50/80',
      features: ['Financial Reports', 'Budget Management', 'Tax Compliance', 'Cash Flow Analysis']
    },
    {
      id: 'hr',
      title: 'HR Login',
      description: 'Human resources and payroll',
      icon: UserGroupIcon,
      color: 'from-indigo-500 via-blue-500 to-cyan-600',
      bgColor: 'from-indigo-50/80 to-blue-50/80',
      features: ['Employee Management', 'Payroll Processing', 'Performance Reviews', 'Training Programs']
    }
  ]

  const contactMethods = [
    {
      icon: PhoneIcon,
      title: 'Call Us',
      description: 'Speak with our experts',
      value: '+1 (555) 123-4567',
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'from-blue-50/80 to-cyan-50/80'
    },
    {
      icon: EnvelopeIcon,
      title: 'Email Us',
      description: 'Send us a message',
      value: 'hello@mindwarepos.com',
      color: 'from-purple-500 to-pink-500',
      bgColor: 'from-purple-50/80 to-pink-50/80'
    },
    {
      icon: MapPinIcon,
      title: 'Visit Us',
      description: 'Our headquarters',
      value: '123 Innovation Drive, Tech City, 12345',
      color: 'from-green-500 to-emerald-500',
      bgColor: 'from-green-50/80 to-emerald-50/80'
    }
  ]

  const features = [
    {
      icon: BoltIcon,
      title: 'Lightning Fast',
      description: 'Process transactions in milliseconds',
      color: 'from-yellow-400 to-orange-500'
    },
    {
      icon: ShieldCheckIcon,
      title: 'Bank-Level Security',
      description: 'Enterprise-grade protection',
      color: 'from-emerald-400 to-green-500'
    },
    {
      icon: GlobeAltIcon,
      title: 'Cloud-Native',
      description: 'Access from anywhere, anytime',
      color: 'from-blue-400 to-cyan-500'
    },
    {
      icon: CpuChipIcon,
      title: 'AI-Powered',
      description: 'Intelligent business insights',
      color: 'from-violet-400 to-purple-500'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 relative overflow-hidden">
      {/* Advanced Floating Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ 
            y: [0, -30, 0],
            rotate: [0, 10, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-20 left-10 w-40 h-40 bg-gradient-to-br from-violet-200/30 via-purple-200/30 to-indigo-200/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ 
            y: [0, 25, 0],
            rotate: [0, -8, 0],
            scale: [1, 0.9, 1]
          }}
          transition={{ 
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-40 right-20 w-32 h-32 bg-gradient-to-br from-green-200/30 via-cyan-200/30 to-blue-200/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ 
            y: [0, -20, 0],
            scale: [1, 1.2, 1],
            rotate: [0, 5, 0]
          }}
          transition={{ 
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-20 left-1/4 w-28 h-28 bg-gradient-to-br from-orange-200/30 via-red-200/30 to-pink-200/30 rounded-full blur-3xl"
        />
      </div>

      {/* Revolutionary Glass Morphism Header */}
      <motion.header 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50"
      >
        <div className="bg-white/10 backdrop-blur-2xl border-b border-white/20 shadow-2xl shadow-black/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <motion.div 
                className="flex items-center"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Link href="/" className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-violet-500 via-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-purple-500/25">
                    <CpuChipIcon className="w-7 h-7 text-white" />
                  </div>
                  <h1 className="ml-3 text-2xl font-bold bg-gradient-to-r from-slate-800 via-purple-800 to-indigo-800 bg-clip-text text-transparent">
                    Mindware POS
                  </h1>
                </Link>
              </motion.div>
              
              <nav className="hidden md:flex space-x-8">
                {['Features', 'Industries', 'Pricing', 'Contact'].map((item, index) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Link 
                      href={`/${item.toLowerCase()}`} 
                      className="text-slate-700 hover:text-purple-600 font-medium transition-all duration-300 relative group"
                    >
                      {item}
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500 transition-all duration-300 group-hover:w-full"></span>
                    </Link>
                  </motion.div>
                ))}
              </nav>
              
              <div className="flex items-center space-x-4">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <Link 
                    href="/login" 
                    className="text-slate-700 hover:text-purple-600 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 hover:bg-white/20 backdrop-blur-sm"
                  >
                    Login
                  </Link>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link 
                    href="/register" 
                    className="bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-600 text-white px-6 py-3 rounded-2xl text-sm font-semibold hover:from-violet-600 hover:via-purple-600 hover:to-indigo-700 transition-all duration-300 shadow-2xl shadow-purple-500/25 hover:shadow-2xl hover:shadow-purple-500/30"
                  >
                    Start Free Trial
                  </Link>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Revolutionary Main Content */}
      <main className="pt-24 relative">
        {/* Hero Section */}
        <section className="py-20 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mb-8"
              >
                <div className="w-24 h-24 bg-gradient-to-br from-violet-500 via-purple-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-purple-500/25">
                  <SparklesIcon className="w-12 h-12 text-white" />
                </div>
              </motion.div>
              
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="text-6xl md:text-7xl font-black mb-6 leading-tight"
              >
                <span className="text-slate-900 drop-shadow-2xl">
                  Get in Touch
                </span>
                <br />
                <span className="bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-600 bg-clip-text text-transparent drop-shadow-2xl">
                  with Mindware POS
                </span>
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-xl text-slate-700 max-w-3xl mx-auto leading-relaxed font-medium"
              >
                Experience the future of POS software. Connect with us through multiple channels and discover how we can transform your business.
              </motion.p>
            </motion.div>

            {/* Tab Navigation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex justify-center mb-12"
            >
              <div className="bg-white/20 backdrop-blur-xl rounded-2xl p-2 border border-white/30 shadow-2xl shadow-black/10">
                {[
                  { id: 'contact', label: 'Contact Us', icon: EnvelopeIcon },
                  { id: 'login', label: 'Multiple Logins', icon: CpuChipIcon },
                  { id: 'support', label: 'Support', icon: PhoneIcon }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2 ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-600 text-white shadow-2xl shadow-purple-500/25'
                        : 'text-slate-700 hover:text-purple-600 hover:bg-white/20'
                    }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
              {activeTab === 'contact' && (
                <motion.div
                  key="contact"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="grid grid-cols-1 lg:grid-cols-2 gap-12"
                >
                  {/* Contact Form */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 border border-white/50 shadow-2xl shadow-black/20"
                  >
                    <h3 className="text-3xl font-bold text-slate-900 mb-6">Send us a Message</h3>
                    
                    <form className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">First Name</label>
                          <input
                            type="text"
                            className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                            placeholder="John"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">Last Name</label>
                          <input
                            type="text"
                            className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                            placeholder="Doe"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
                        <input
                          type="email"
                          className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                          placeholder="john@company.com"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Company</label>
                        <input
                          type="text"
                          className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                          placeholder="Your Company"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Message</label>
                        <textarea
                          rows={4}
                          className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 resize-none"
                          placeholder="Tell us how we can help..."
                        />
                      </div>
                      
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-600 text-white py-4 rounded-2xl font-bold text-lg shadow-2xl shadow-purple-500/25 hover:shadow-2xl hover:shadow-purple-500/40 transition-all duration-300"
                      >
                        Send Message
                      </motion.button>
                    </form>
                  </motion.div>

                  {/* Contact Methods */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="space-y-6"
                  >
                    {contactMethods.map((method, index) => (
                      <motion.div
                        key={method.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                        className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 border border-white/50 shadow-xl shadow-black/20 hover:shadow-2xl hover:shadow-black/30 transition-all duration-300 hover:-translate-y-2"
                      >
                        <div className="flex items-start space-x-4">
                          <div className={`w-16 h-16 bg-gradient-to-r ${method.color} rounded-2xl flex items-center justify-center shadow-lg`}>
                            <method.icon className="w-8 h-8 text-white" />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-xl font-bold text-slate-900 mb-2">{method.title}</h4>
                            <p className="text-slate-600 mb-3">{method.description}</p>
                            <p className="text-slate-800 font-semibold">{method.value}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                </motion.div>
              )}

              {activeTab === 'login' && (
                <motion.div
                  key="login"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-12"
                >
                  {/* Login Types Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {loginTypes.map((loginType, index) => (
                      <motion.div
                        key={loginType.id}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        whileHover={{ y: -10, scale: 1.02 }}
                        className={`group cursor-pointer bg-gradient-to-br ${loginType.bgColor} backdrop-blur-xl rounded-3xl p-8 border border-white/30 shadow-2xl shadow-black/20 hover:shadow-2xl hover:shadow-black/30 transition-all duration-500 overflow-hidden relative`}
                        onClick={() => setSelectedLoginType(loginType.id)}
                      >
                        {/* Background Pattern */}
                        <div className="absolute inset-0 opacity-10">
                          <div className="absolute inset-0" style={{
                            backgroundImage: `radial-gradient(circle at 25% 25%, ${loginType.color.split(' ')[1]} 2px, transparent 2px)`,
                            backgroundSize: '20px 20px'
                          }}></div>
                        </div>
                        
                        <div className="relative z-10">
                          <div className={`w-20 h-20 bg-gradient-to-r ${loginType.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl`}>
                            <loginType.icon className="w-10 h-10 text-white" />
                          </div>
                          
                          <h3 className="text-2xl font-bold text-slate-900 mb-3 text-center">{loginType.title}</h3>
                          <p className="text-slate-700 text-center mb-6">{loginType.description}</p>
                          
                          <div className="space-y-3">
                            {loginType.features.map((feature, idx) => (
                              <div key={idx} className="flex items-center text-sm text-slate-700">
                                <div className="w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                                  <CheckIcon className="w-2.5 h-2.5 text-white" />
                                </div>
                                <span className="font-medium">{feature}</span>
                              </div>
                            ))}
                          </div>
                          
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="mt-6"
                          >
                            <button className={`w-full bg-gradient-to-r ${loginType.color} text-white py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300`}>
                              Access {loginType.title}
                            </button>
                          </motion.div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Selected Login Form */}
                  {selectedLoginType && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6 }}
                      className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 border border-white/50 shadow-2xl shadow-black/20 max-w-2xl mx-auto"
                    >
                      <div className="text-center mb-8">
                        <h3 className="text-3xl font-bold text-slate-900 mb-2">
                          {loginTypes.find(lt => lt.id === selectedLoginType)?.title}
                        </h3>
                        <p className="text-slate-600">
                          {loginTypes.find(lt => lt.id === selectedLoginType)?.description}
                        </p>
                      </div>
                      
                      <form className="space-y-6">
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">Username/Email</label>
                          <input
                            type="text"
                            className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                            placeholder="Enter your username or email"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
                          <div className="relative">
                            <input
                              type={showPassword ? 'text' : 'password'}
                              className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 pr-12"
                              placeholder="Enter your password"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                            >
                              {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                            </button>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <label className="flex items-center">
                            <input type="checkbox" className="w-4 h-4 text-purple-600 border-slate-300 rounded focus:ring-purple-500" />
                            <span className="ml-2 text-sm text-slate-700">Remember me</span>
                          </label>
                          <Link href="/forgot-password" className="text-sm text-purple-600 hover:text-purple-700 font-medium">
                            Forgot Password?
                          </Link>
                        </div>
                        
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-600 text-white py-4 rounded-2xl font-bold text-lg shadow-2xl shadow-purple-500/25 hover:shadow-2xl hover:shadow-purple-500/40 transition-all duration-300"
                        >
                          Sign In
                        </motion.button>
                      </form>
                    </motion.div>
                  )}
                </motion.div>
              )}

              {activeTab === 'support' && (
                <motion.div
                  key="support"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="grid grid-cols-1 lg:grid-cols-2 gap-12"
                >
                  {/* Support Features */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="space-y-6"
                  >
                    {features.map((feature, index) => (
                      <motion.div
                        key={feature.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                        className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 border border-white/50 shadow-xl shadow-black/20 hover:shadow-2xl hover:shadow-black/30 transition-all duration-300 hover:-translate-y-2"
                      >
                        <div className="flex items-start space-x-4">
                          <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center shadow-lg`}>
                            <feature.icon className="w-8 h-8 text-white" />
                          </div>
                          <div>
                            <h4 className="text-xl font-bold text-slate-900 mb-2">{feature.title}</h4>
                            <p className="text-slate-600">{feature.description}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>

                  {/* Support Contact */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="bg-gradient-to-br from-violet-100/90 via-purple-100/80 to-indigo-100/90 backdrop-blur-xl rounded-3xl p-8 border border-white/50 shadow-2xl shadow-black/20"
                  >
                    <h3 className="text-3xl font-bold text-slate-900 mb-6">24/7 Support</h3>
                    <p className="text-slate-700 mb-8">
                      Our dedicated support team is available around the clock to help you with any questions or issues.
                    </p>
                    
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-slate-700 font-medium">Live Chat Support</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                        <span className="text-slate-700 font-medium">Phone Support</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
                        <span className="text-slate-700 font-medium">Email Support</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
                        <span className="text-slate-700 font-medium">Video Tutorials</span>
                      </div>
                    </div>
                    
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full mt-8 bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-600 text-white py-4 rounded-2xl font-bold text-lg shadow-2xl shadow-purple-500/25 hover:shadow-2xl hover:shadow-purple-500/40 transition-all duration-300"
                    >
                      Start Live Chat
                    </motion.button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* Features Showcase */}
        <section className="py-20 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-5xl font-bold text-slate-800 mb-6">
                Why Choose Mindware POS?
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                Experience the difference with our cutting-edge technology and unparalleled support
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { number: '50K+', label: 'Happy Businesses', icon: HeartIcon, color: 'from-pink-400 to-rose-500' },
                { number: '99.9%', label: 'Uptime Guarantee', icon: ShieldCheckIcon, color: 'from-emerald-400 to-green-500' },
                { number: '24/7', label: 'AI Support', icon: CpuChipIcon, color: 'from-violet-400 to-purple-500' },
                { number: '10x', label: 'Faster Performance', icon: BoltIcon, color: 'from-blue-400 to-cyan-500' }
              ].map((stat, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center group"
                >
                  <div className={`w-20 h-20 bg-gradient-to-br ${stat.color} rounded-3xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-2xl`}>
                    <stat.icon className="w-10 h-10 text-white" />
                  </div>
                  <div className="text-4xl md:text-5xl font-bold text-slate-800 mb-2">{stat.number}</div>
                  <div className="text-slate-600 text-sm">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-600 rounded-3xl p-12 text-white shadow-2xl overflow-hidden relative">
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-white rounded-full opacity-10 blur-3xl"></div>
                <div className="relative text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="mb-8"
                  >
                    <RocketLaunchIcon className="w-16 h-16 text-white mx-auto animate-bounce" />
                  </motion.div>
                  <h2 className="text-5xl font-bold text-white mb-6">
                    Ready to Transform Your Business?
                  </h2>
                  <p className="text-xl text-white/90 mb-10 max-w-3xl mx-auto leading-relaxed">
                    Experience the future of POS software with our <span className="text-white font-semibold">free trial</span>. 
                    No credit card required, no commitment.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-6 justify-center">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link 
                        href="/register"
                        className="group bg-white text-purple-600 px-10 py-4 rounded-2xl text-lg font-bold hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center space-x-3"
                      >
                        <FireIcon className="w-6 h-6 group-hover:text-purple-700 transition-colors" />
                        <span>Start Free Trial</span>
                      </Link>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link 
                        href="/demo"
                        className="group text-white border-2 border-white/50 bg-white/10 backdrop-blur-sm px-10 py-4 rounded-2xl text-lg font-bold hover:border-white hover:bg-white/20 transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-3"
                      >
                        <span>Schedule Demo</span>
                        <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Glass Morphism Footer */}
      <motion.footer 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="bg-slate-900/95 backdrop-blur-xl text-white mt-24 border-t border-white/10"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-violet-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <CpuChipIcon className="w-5 h-5 text-white" />
                </div>
                <span className="ml-2 text-xl font-bold">Mindware POS</span>
              </div>
              <p className="text-slate-400 text-sm">
                The AI-powered POS system built for the future of retail. Transform your business with cutting-edge technology.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link href="/features" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="/integrations" className="hover:text-white transition-colors">Integrations</Link></li>
                <li><Link href="/api" className="hover:text-white transition-colors">API</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
                <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
                <li><Link href="/careers" className="hover:text-white transition-colors">Careers</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Contact Us</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li className="flex items-center"><MapPinIcon className="w-4 h-4 mr-2"/>123 Innovation Drive, Tech City, 12345</li>
                <li className="flex items-center"><EnvelopeIcon className="w-4 h-4 mr-2"/>hello@mindwarepos.com</li>
                <li className="flex items-center"><PhoneIcon className="w-4 h-4 mr-2"/>+1 (555) 123-4567</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/10 mt-8 pt-8 flex justify-between items-center text-sm text-slate-400">
            <p>&copy; 2024 Mindware POS. All rights reserved.</p>
            <div className="flex space-x-4">
              <Link href="/privacy" className="hover:text-white">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-white">Terms of Service</Link>
            </div>
          </div>
        </div>
      </motion.footer>
    </div>
  )
}
