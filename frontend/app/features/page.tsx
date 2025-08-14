'use client'

import { useState, useEffect } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { 
  ShoppingCartIcon, 
  CurrencyRupeeIcon, 
  UserGroupIcon, 
  ChartBarIcon,
  CubeIcon,
  BoltIcon,
  DevicePhoneMobileIcon,
  ShieldCheckIcon,
  CloudIcon,
  PrinterIcon,
  CreditCardIcon,
  ClockIcon,
  ArrowLeftIcon,
  SparklesIcon,
  CheckIcon,
  StarIcon,
  CpuChipIcon,
  GlobeAltIcon,
  LightBulbIcon,
  FireIcon,
  RocketLaunchIcon,
  PuzzlePieceIcon,
  HeartIcon,
  EyeIcon,
  CogIcon,
  DocumentTextIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  MagnifyingGlassIcon,
  ChartBarSquareIcon,
  BanknotesIcon,
  TruckIcon,
  BuildingStorefrontIcon,
  WrenchScrewdriverIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon
} from '@heroicons/react/24/outline'
import Link from 'next/link'

export default function FeaturesPage() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [currentFeature, setCurrentFeature] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0, 1], [0, -100])

  useEffect(() => {
    setIsVisible(true)
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % 6)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const categories = [
    { id: 'all', name: 'All Features', color: 'from-violet-500 to-purple-500' },
    { id: 'ai', name: 'AI & Intelligence', color: 'from-blue-500 to-cyan-500' },
    { id: 'pos', name: 'POS & Billing', color: 'from-green-500 to-emerald-500' },
    { id: 'inventory', name: 'Inventory Management', color: 'from-orange-500 to-red-500' },
    { id: 'analytics', name: 'Analytics & Reports', color: 'from-indigo-500 to-blue-500' },
    { id: 'security', name: 'Security & Compliance', color: 'from-purple-500 to-pink-500' }
  ]

  const features = [
    {
      id: 'ai-inventory',
      category: 'ai',
      title: 'AI-Powered Inventory Management',
      description: 'Predict demand, prevent stockouts, and optimize reordering with machine learning algorithms that learn from your business patterns.',
      icon: CpuChipIcon,
      color: 'from-violet-400 to-purple-500',
      bgColor: 'from-violet-50/80 to-purple-50/80',
      features: ['Demand Forecasting', 'Auto Reordering', 'Seasonal Analysis', 'Cross-selling Insights', 'Smart Alerts'],
      stats: { accuracy: '95%', timeSaved: '40hrs/week', costReduction: '25%' }
    },
    {
      id: 'lightning-pos',
      category: 'pos',
      title: 'Lightning-Fast POS System',
      description: 'Process transactions in milliseconds with our optimized interface designed for maximum speed and efficiency.',
      icon: BoltIcon,
      color: 'from-blue-400 to-cyan-500',
      bgColor: 'from-blue-50/80 to-cyan-50/80',
      features: ['Touch-Optimized UI', 'Barcode Scanning', 'Multiple Payment Modes', 'Offline Mode', 'Quick Search'],
      stats: { speed: '0.3s', transactions: '1000+/hour', uptime: '99.9%' }
    },
    {
      id: 'real-time-analytics',
      category: 'analytics',
      title: 'Real-Time Business Intelligence',
      description: 'Get instant insights into your business performance with AI-driven dashboards that adapt to your specific needs.',
      icon: ChartBarSquareIcon,
      color: 'from-emerald-400 to-green-500',
      bgColor: 'from-emerald-50/80 to-green-50/80',
      features: ['Live Dashboards', 'Predictive Reports', 'Custom Metrics', 'Performance Tracking', 'Trend Analysis'],
      stats: { realTime: 'Live', insights: '24/7', reports: 'Instant' }
    },
    {
      id: 'advanced-security',
      category: 'security',
      title: 'Enterprise-Grade Security',
      description: 'Protect your business with intelligent fraud detection and encrypted data protection.',
      icon: ShieldCheckIcon,
      color: 'from-red-400 to-pink-500',
      bgColor: 'from-red-50/80 to-pink-50/80',
      features: ['Fraud Detection', 'Data Encryption', 'Access Control', 'Audit Trails', 'Compliance Ready'],
      stats: { security: 'Bank-Level', encryption: '256-bit', compliance: '100%' }
    },
    {
      id: 'cloud-native',
      category: 'ai',
      title: 'Cloud-Native Architecture',
      description: 'Access your business from anywhere with real-time synchronization and unlimited scalability.',
      icon: CloudIcon,
      color: 'from-indigo-400 to-blue-500',
      bgColor: 'from-indigo-50/80 to-blue-50/80',
      features: ['Multi-Device Access', 'Real-time Sync', 'Auto Backup', 'Scalable Infrastructure', 'Global CDN'],
      stats: { locations: 'Unlimited', sync: 'Real-time', backup: 'Auto' }
    },
    {
      id: 'multi-location',
      category: 'inventory',
      title: 'Multi-Location Management',
      description: 'Manage all your stores from a single dashboard with centralized control and unified reporting.',
      icon: GlobeAltIcon,
      color: 'from-orange-400 to-red-500',
      bgColor: 'from-orange-50/80 to-red-50/80',
      features: ['Centralized Control', 'Store Analytics', 'Inventory Transfer', 'Unified Reporting', 'Role Management'],
      stats: { stores: 'Unlimited', users: 'Unlimited', locations: 'Global' }
    }
  ]

  const filteredFeatures = activeCategory === 'all' 
    ? features 
    : features.filter(feature => feature.category === activeCategory)

  const testimonials = [
    {
      quote: "The AI inventory management is incredible! It predicts our needs before we even realize them.",
      author: "Sarah Chen",
      company: "TechMart Electronics",
      rating: 5,
      avatar: "SC"
    },
    {
      quote: "Lightning-fast POS system that our customers love. No more waiting in lines!",
      author: "Marcus Rodriguez",
      company: "FreshBite Restaurant",
      rating: 5,
      avatar: "MR"
    },
    {
      quote: "Real-time analytics have transformed how we make business decisions.",
      author: "Priya Patel",
      company: "HealthFirst Pharmacy",
      rating: 5,
      avatar: "PP"
    }
  ]

  const stats = [
    { number: '50,000+', label: 'Happy Businesses', icon: HeartIcon, color: 'from-pink-400 to-rose-500' },
    { number: '99.9%', label: 'Uptime Guarantee', icon: ShieldCheckIcon, color: 'from-emerald-400 to-green-500' },
    { number: '24/7', label: 'AI Support', icon: CpuChipIcon, color: 'from-violet-400 to-purple-500' },
    { number: '10x', label: 'Faster Performance', icon: BoltIcon, color: 'from-blue-400 to-cyan-500' }
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

      {/* Glass Morphism Header */}
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

        {/* Hero Section */}
      <main className="pt-24 relative">
        <section className="py-20 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
        >
          <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
            className="mb-8"
          >
                <div className="w-20 h-20 bg-gradient-to-br from-violet-100 to-purple-100 rounded-full flex items-center justify-center mx-auto">
                  <SparklesIcon className="w-10 h-10 text-violet-600" />
            </div>
          </motion.div>
              <h1 className="text-6xl font-bold text-slate-800 mb-6">
                Revolutionary Features
          </h1>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                Discover the cutting-edge capabilities that make Mindware POS the most advanced retail management system
          </p>
        </motion.div>

            {/* Category Filter */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="flex flex-wrap justify-center gap-4 mb-16"
            >
              {categories.map((category) => (
                <motion.button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-6 py-3 rounded-2xl font-medium transition-all duration-300 ${
                    activeCategory === category.id
                      ? `bg-gradient-to-r ${category.color} text-white shadow-2xl shadow-black/20`
                      : 'bg-white/60 backdrop-blur-xl text-slate-700 hover:bg-white/80 border border-white/20'
                  }`}
                >
                  {category.name}
                </motion.button>
              ))}
            </motion.div>

        {/* Features Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {filteredFeatures.map((feature, index) => (
            <motion.div
                  key={feature.id}
              initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -10 }}
                  className="group relative"
                >
                  <div className={`bg-gradient-to-br ${feature.bgColor} backdrop-blur-xl rounded-3xl p-8 border border-white/20 hover:border-white/40 transition-all duration-300 hover:shadow-2xl hover:shadow-black/10`}>
                    <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                      <feature.icon className="w-8 h-8 text-white" />
              </div>
                    <h3 className="text-2xl font-bold text-slate-800 mb-4 group-hover:text-purple-600 transition-colors">
                {feature.title}
              </h3>
                    <p className="text-slate-600 leading-relaxed mb-6 group-hover:text-slate-700 transition-colors">
                {feature.description}
              </p>
                    
                    {/* Feature List */}
                    <div className="grid grid-cols-1 gap-3 mb-6">
                      {feature.features.map((item, idx) => (
                        <div key={idx} className="flex items-center text-sm text-slate-600">
                          <CheckIcon className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                          {item}
                        </div>
                      ))}
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/20">
                      {Object.entries(feature.stats).map(([key, value]) => (
                        <div key={key} className="text-center">
                          <div className="text-lg font-bold text-slate-800">{value}</div>
                          <div className="text-xs text-slate-500 capitalize">{key.replace(/([A-Z])/g, ' $1')}</div>
                        </div>
                      ))}
                    </div>
                  </div>
            </motion.div>
          ))}
        </div>
          </div>
        </section>

        {/* Interactive Feature Showcase */}
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
                See Features in Action
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                Experience the power of Mindware POS through our interactive demonstrations
              </p>
            </motion.div>

            <div className="bg-gradient-to-br from-violet-50/80 to-purple-50/80 backdrop-blur-xl rounded-3xl p-12 border border-white/20 shadow-2xl shadow-black/10">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentFeature}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.5 }}
          className="text-center"
        >
                  <div className="w-24 h-24 bg-gradient-to-br from-violet-100 to-purple-100 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg">
                    {(() => {
                      const IconComponent = features[currentFeature].icon;
                      return <IconComponent className="w-12 h-12 text-violet-600" />;
                    })()}
                  </div>
                  <h3 className="text-3xl font-bold text-slate-800 mb-4">
                    {features[currentFeature].title}
                  </h3>
                  <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed mb-8">
                    {features[currentFeature].description}
                  </p>
                  
                  {/* Feature Highlights */}
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-4xl mx-auto">
                    {features[currentFeature].features.map((item, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: idx * 0.1 }}
                        className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/20"
                      >
                        <div className="text-sm text-slate-700 font-medium">{item}</div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Navigation */}
              <div className="flex justify-center items-center space-x-4 mt-8">
                <motion.button
                  onClick={() => setCurrentFeature((prev) => (prev - 1 + 6) % 6)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-12 h-12 bg-white/60 backdrop-blur-sm rounded-full border border-white/30 text-slate-700 hover:bg-white/80 transition-all duration-300"
                >
                  <ChevronLeftIcon className="w-6 h-6 mx-auto" />
                </motion.button>
                
                <div className="flex space-x-2">
                  {features.map((_, index) => (
                    <motion.button
                      key={index}
                      onClick={() => setCurrentFeature(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        currentFeature === index 
                          ? 'bg-violet-500 scale-125' 
                          : 'bg-slate-300 hover:bg-slate-400'
                      }`}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                    />
                  ))}
                </div>
                
                <motion.button
                  onClick={() => setCurrentFeature((prev) => (prev + 1) % 6)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-12 h-12 bg-white/60 backdrop-blur-sm rounded-full border border-white/30 text-slate-700 hover:bg-white/80 transition-all duration-300"
                >
                  <ChevronRightIcon className="w-6 h-6 mx-auto" />
                </motion.button>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
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

        {/* Testimonials Section */}
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
                What Our Customers Say
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                Join thousands of businesses that trust Mindware POS
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <motion.div 
                  key={index} 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -10 }}
                  className="group relative"
                >
                  <div className="bg-gradient-to-br from-white/80 to-slate-50/80 backdrop-blur-xl rounded-3xl p-8 border border-white/20 hover:border-white/40 transition-all duration-300 hover:shadow-2xl hover:shadow-black/10">
                    <div className="flex items-center mb-6">
                      <div className="w-14 h-14 bg-gradient-to-br from-violet-100 to-purple-100 rounded-full flex items-center justify-center border border-violet-200/50">
                        <span className="text-violet-600 font-bold text-xl">{testimonial.avatar}</span>
                      </div>
                      <div className="ml-4">
                        <p className="font-bold text-slate-800 text-lg">{testimonial.author}</p>
                        <p className="text-violet-600 text-sm font-medium">{testimonial.company}</p>
                      </div>
                    </div>
                    <div className="flex items-center mb-6">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <StarIcon key={i} className="w-6 h-6 text-yellow-400 mr-1" fill="currentColor" />
                      ))}
                    </div>
                    <p className="text-slate-700 text-lg leading-relaxed italic">"{testimonial.quote}"</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
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
                    Ready to Experience the Future?
              </h2>
                  <p className="text-xl text-white/90 mb-10 max-w-3xl mx-auto leading-relaxed">
                    Start your free trial today and discover how Mindware POS can transform your business
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
                  href="/contact"
                        className="group text-white border-2 border-white/50 bg-white/10 backdrop-blur-sm px-10 py-4 rounded-2xl text-lg font-bold hover:border-white hover:bg-white/20 transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-3"
                >
                        <span>Schedule Demo</span>
                        <ArrowLeftIcon className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
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
