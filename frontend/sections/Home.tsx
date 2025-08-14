'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { 
  ShoppingCartIcon, 
  UserGroupIcon, 
  ChartBarIcon,
  ArrowRightIcon,
  CheckIcon,
  StarIcon,
  BuildingStorefrontIcon,
  BanknotesIcon,
  DevicePhoneMobileIcon,
  ShieldCheckIcon,
  ClipboardDocumentListIcon,
  CubeIcon,
  CreditCardIcon,
  SparklesIcon,
  RocketLaunchIcon,
  LightBulbIcon,
  FireIcon,
  BoltIcon,
  HeartIcon,
  CpuChipIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  TruckIcon,
  CogIcon
} from '@heroicons/react/24/outline'

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  const heroSlides = [
    {
      title: "AI-Powered POS Revolution",
      subtitle: "The Future of Retail Management",
      description: "Experience lightning-fast transactions, intelligent inventory management, and real-time business insights powered by cutting-edge AI technology.",
      color: "from-violet-500 via-purple-500 to-indigo-500",
      bgColor: "from-violet-100/20 via-purple-100/20 to-indigo-100/20"
    },
    {
      title: "Cloud-Native Excellence",
      subtitle: "Access Anywhere, Anytime",
      description: "Built for the modern business with cloud-first architecture, real-time synchronization, and unlimited scalability across all your locations.",
      color: "from-blue-500 via-cyan-500 to-teal-500",
      bgColor: "from-blue-100/20 via-cyan-100/20 to-teal-100/20"
    },
    {
      title: "Enterprise-Grade Security",
      subtitle: "Your Business, Protected",
      description: "Bank-level security with advanced fraud detection, encrypted data transmission, and comprehensive compliance for peace of mind.",
      color: "from-emerald-500 via-green-500 to-teal-500",
      bgColor: "from-emerald-100/20 via-green-100/20 to-teal-100/20"
    }
  ]

  const bannerFeatures = [
    {
      icon: BuildingStorefrontIcon,
      title: "Retail Solutions",
      description: "Complete retail management with AI-powered insights",
      color: "from-blue-400 via-cyan-400 to-teal-400",
      bgColor: "from-blue-50/60 to-cyan-50/60",
      features: ["Smart Inventory", "Customer Analytics", "Multi-location", "Real-time Sync"]
    },
    {
      icon: TruckIcon,
      title: "Distribution",
      description: "Streamlined distribution and supply chain management",
      color: "from-green-400 via-emerald-400 to-teal-400",
      bgColor: "from-green-50/60 to-emerald-50/60",
      features: ["Route Optimization", "Fleet Management", "Warehouse Control", "Order Tracking"]
    },
    {
      icon: CogIcon,
      title: "Manufacturing",
      description: "Advanced manufacturing and production control",
      color: "from-orange-400 via-red-400 to-pink-400",
      bgColor: "from-orange-50/60 to-red-50/60",
      features: ["Production Planning", "Quality Control", "Resource Management", "Performance Analytics"]
    },
    {
      icon: ChartBarIcon,
      title: "ERP Solutions",
      description: "Comprehensive enterprise resource planning",
      color: "from-purple-400 via-pink-400 to-rose-400",
      bgColor: "from-purple-50/60 to-pink-50/60",
      features: ["Financial Management", "HR & Payroll", "Project Management", "Business Intelligence"]
    },
    {
      icon: CreditCardIcon,
      title: "Payment Processing",
      description: "Seamless payment and reconciliation",
      color: "from-indigo-400 via-blue-400 to-cyan-400",
      bgColor: "from-indigo-50/60 to-blue-50/60",
      features: ["Multi-payment", "Auto-reconciliation", "Fraud Detection", "Real-time Reports"]
    },
    {
      icon: UserGroupIcon,
      title: "Sales Force",
      description: "Automated sales force management",
      color: "from-emerald-400 via-green-400 to-teal-400",
      bgColor: "from-emerald-50/60 to-green-50/60",
      features: ["Lead Management", "Performance Tracking", "Territory Management", "Commission Calculation"]
    }
  ]

  return (
    <main className="pt-24 relative">
      {/* Hero Carousel Section */}
      <div className="relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="relative"
          >
            <div className={`min-h-screen flex items-center justify-center bg-gradient-to-br ${heroSlides[currentSlide].bgColor} relative overflow-hidden`}>
              {/* Advanced Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                  backgroundImage: `radial-gradient(circle at 25% 25%, ${heroSlides[currentSlide].color.split(' ')[1]} 2px, transparent 2px)`,
                  backgroundSize: '50px 50px'
                }}></div>
              </div>

              {/* STUNNING HERO BANNER IMAGES */}
              <div className="absolute inset-0 overflow-hidden">
                {/* Real POS Interface Screenshot - Left Side */}
                <div className="absolute left-10 top-1/4 w-80 h-80 opacity-90">
                  <div className="w-full h-full bg-white rounded-3xl shadow-2xl transform rotate-12 relative overflow-hidden border-4 border-white">
                    {/* POS Dashboard Interface */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-3xl">
                      {/* Header Bar */}
                      <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-t-3xl flex items-center justify-between px-3">
                        <div className="flex space-x-2">
                          <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                          <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                          <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                        </div>
                        <span className="text-white text-xs font-bold">Mindware POS</span>
                      </div>
                      
                      {/* Main Content */}
                      <div className="absolute top-8 left-0 right-0 bottom-0 p-3">
                        {/* Sales Chart */}
                        <div className="bg-white rounded-lg p-2 mb-2 shadow-sm">
                          <div className="flex items-end justify-between h-12 space-x-1">
                            <div className="w-2 bg-blue-400 rounded-t" style={{height: '60%'}}></div>
                            <div className="w-2 bg-blue-500 rounded-t" style={{height: '80%'}}></div>
                            <div className="w-2 bg-blue-600 rounded-t" style={{height: '40%'}}></div>
                            <div className="w-2 bg-indigo-500 rounded-t" style={{height: '90%'}}></div>
                            <div className="w-2 bg-indigo-600 rounded-t" style={{height: '70%'}}></div>
                          </div>
                        </div>
                        
                        {/* Quick Actions */}
                        <div className="grid grid-cols-2 gap-2">
                          <div className="bg-gradient-to-r from-green-400 to-emerald-500 rounded-lg p-2 text-center">
                            <span className="text-white text-xs font-bold">SALE</span>
                          </div>
                          <div className="bg-gradient-to-r from-purple-400 to-pink-500 rounded-lg p-2 text-center">
                            <span className="text-white text-xs font-bold">INVENTORY</span>
                          </div>
                        </div>
                        
                        {/* Recent Transactions */}
                        <div className="mt-2 space-y-1">
                          <div className="bg-white rounded p-1 shadow-sm">
                            <div className="flex justify-between text-xs">
                              <span className="text-gray-600">#1234</span>
                              <span className="text-green-600 font-bold">$45.99</span>
                            </div>
                          </div>
                          <div className="bg-white rounded p-1 shadow-sm">
                            <div className="flex justify-between text-xs">
                              <span className="text-gray-600">#1235</span>
                              <span className="text-green-600 font-bold">$32.50</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Real Mobile POS App - Right Side */}
                <div className="absolute right-10 top-1/3 w-72 h-72 opacity-90">
                  <div className="w-full h-full bg-white rounded-3xl shadow-2xl transform -rotate-12 relative overflow-hidden border-4 border-white">
                    {/* Mobile App Interface */}
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-teal-100 rounded-3xl">
                      {/* Status Bar */}
                      <div className="absolute top-0 left-0 right-0 h-6 bg-black rounded-t-3xl flex items-center justify-between px-3">
                        <span className="text-white text-xs">9:41</span>
                        <div className="flex items-center space-x-1">
                          <div className="w-1 h-1 bg-white rounded-full"></div>
                          <div className="w-1 h-1 bg-white rounded-full"></div>
                          <div className="w-1 h-1 bg-white rounded-full"></div>
                        </div>
                      </div>
                      
                      {/* App Content */}
                      <div className="absolute top-6 left-0 right-0 bottom-0 p-3">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg p-2 mb-3 text-center">
                          <span className="text-white text-sm font-bold">Quick Sale</span>
                        </div>
                        
                        {/* Product Search */}
                        <div className="bg-white rounded-lg p-2 mb-2 shadow-sm">
                          <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 bg-gray-300 rounded"></div>
                            <span className="text-gray-500 text-xs">Search products...</span>
                          </div>
                        </div>
                        
                        {/* Recent Items */}
                        <div className="space-y-2">
                          <div className="bg-white rounded-lg p-2 shadow-sm">
                            <div className="flex justify-between items-center">
                              <div className="w-8 h-8 bg-blue-400 rounded"></div>
                              <div className="flex-1 ml-2">
                                <div className="text-xs font-bold text-gray-800">Product Name</div>
                                <div className="text-xs text-gray-500">$12.99</div>
                              </div>
                              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-xs">+</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Total */}
                        <div className="absolute bottom-3 left-3 right-3 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg p-2 text-center">
                          <span className="text-white text-sm font-bold">Total: $0.00</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Real Business Dashboard - Bottom Center */}
                <div className="absolute left-1/2 bottom-20 transform -translate-x-1/2 w-96 h-64 opacity-90">
                  <div className="w-full h-full bg-white rounded-3xl shadow-2xl transform rotate-6 relative overflow-hidden border-4 border-white">
                    {/* Dashboard Interface */}
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-red-100 rounded-3xl">
                      {/* Header */}
                      <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-r from-orange-500 to-red-600 rounded-t-3xl flex items-center justify-between px-3">
                        <span className="text-white text-xs font-bold">Business Analytics</span>
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      </div>
                      
                      {/* Dashboard Content */}
                      <div className="absolute top-8 left-0 right-0 bottom-0 p-3">
                        {/* KPI Cards */}
                        <div className="grid grid-cols-2 gap-2 mb-3">
                          <div className="bg-white rounded-lg p-2 shadow-sm text-center">
                            <div className="text-lg font-bold text-green-600">$2,450</div>
                            <div className="text-xs text-gray-600">Today's Sales</div>
                          </div>
                          <div className="bg-white rounded-lg p-2 shadow-sm text-center">
                            <div className="text-lg font-bold text-blue-600">156</div>
                            <div className="text-xs text-gray-600">Transactions</div>
                          </div>
                        </div>
                        
                        {/* Chart */}
                        <div className="bg-white rounded-lg p-2 shadow-sm">
                          <div className="text-xs text-gray-600 mb-2">Weekly Revenue</div>
                          <div className="flex items-end justify-between h-16 space-x-1">
                            <div className="w-3 bg-orange-400 rounded-t" style={{height: '60%'}}></div>
                            <div className="w-3 bg-orange-500 rounded-t" style={{height: '80%'}}></div>
                            <div className="w-3 bg-red-500 rounded-t" style={{height: '40%'}}></div>
                            <div className="w-3 bg-red-600 rounded-t" style={{height: '90%'}}></div>
                            <div className="w-3 bg-orange-600 rounded-t" style={{height: '70%'}}></div>
                            <div className="w-3 bg-red-400 rounded-t" style={{height: '85%'}}></div>
                            <div className="w-3 bg-orange-500 rounded-t" style={{height: '95%'}}></div>
                          </div>
                        </div>
                        
                        {/* Bottom Stats */}
                        <div className="absolute bottom-3 left-3 right-3 flex justify-between text-xs text-gray-600">
                          <span>Mon</span>
                          <span>Tue</span>
                          <span>Wed</span>
                          <span>Thu</span>
                          <span>Fri</span>
                          <span>Sat</span>
                          <span>Sun</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Real Product Icons Around */}
                <div className="absolute top-20 left-1/4 w-16 h-16 opacity-90">
                  <div className="w-full h-full bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full shadow-lg flex items-center justify-center border-2 border-white">
                    <BoltIcon className="w-8 h-8 text-white" />
                  </div>
                </div>

                <div className="absolute top-32 right-1/4 w-12 h-12 opacity-90">
                  <div className="w-full h-full bg-gradient-to-br from-pink-400 to-rose-500 rounded-full shadow-lg flex items-center justify-center border-2 border-white">
                    <HeartIcon className="w-6 h-6 text-white" />
                  </div>
                </div>

                <div className="absolute bottom-32 left-1/3 w-14 h-14 opacity-90">
                  <div className="w-full h-full bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full shadow-lg flex items-center justify-center border-2 border-white">
                    <SparklesIcon className="w-7 h-7 text-white" />
                  </div>
                </div>

                {/* Additional Real Product Images */}
                <div className="absolute top-40 left-1/2 transform -translate-x-1/2 w-20 h-20 opacity-80">
                  <div className="w-full h-full bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl shadow-lg flex items-center justify-center border-2 border-white transform rotate-12">
                    <ShoppingCartIcon className="w-10 h-10 text-white" />
                  </div>
                </div>

                <div className="absolute bottom-40 right-1/4 w-18 h-18 opacity-80">
                  <div className="w-full h-full bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl shadow-lg flex items-center justify-center border-2 border-white transform -rotate-12">
                    <ChartBarIcon className="w-9 h-9 text-white" />
                  </div>
                </div>
              </div>
              
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
                <div className="text-center">
                  {/* Hero Badge */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="mb-8"
                  >
                    <div className="inline-flex items-center justify-center px-6 py-3 bg-white/90 backdrop-blur-xl rounded-full border border-white/50 shadow-2xl shadow-black/10">
                      <SparklesIcon className="w-5 h-5 text-purple-600 mr-2" />
                      <span className="text-slate-800 font-bold text-sm">
                        The Future of POS is Here
                      </span>
                    </div>
                  </motion.div>

                  {/* Main Headline with PERFECT VISIBILITY */}
                  <motion.h1 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-6xl md:text-7xl font-bold mb-6 leading-tight"
                  >
                    <span className="text-slate-900 drop-shadow-2xl font-black">
                      {heroSlides[currentSlide].title}
                    </span>
                    <div className={`bg-gradient-to-r ${heroSlides[currentSlide].color} bg-clip-text text-transparent drop-shadow-2xl font-black`}>
                      {heroSlides[currentSlide].subtitle}
                    </div>
                  </motion.h1>
                  
                  {/* Subtitle with PERFECT VISIBILITY */}
                  <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="text-xl text-slate-800 mb-12 max-w-4xl mx-auto leading-relaxed drop-shadow-2xl font-semibold"
                  >
                    {heroSlides[currentSlide].description}
                  </motion.p>

                  {/* CTA Buttons with STUNNING COLORS */}
                  <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="flex flex-col sm:flex-row gap-6 justify-center mb-16"
                  >
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link 
                        href="/demo"
                        className="group bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-600 text-white border-2 border-blue-400/30 px-12 py-4 rounded-2xl text-lg font-bold hover:from-blue-600 hover:via-purple-600 hover:to-indigo-700 hover:border-blue-300/50 transition-all duration-300 flex items-center justify-center space-x-3 shadow-2xl shadow-blue-500/25 hover:shadow-2xl hover:shadow-blue-500/40 hover:scale-105"
                      >
                        <RocketLaunchIcon className="w-6 h-6 group-hover:animate-bounce text-white" />
                        <span>See AI in Action</span>
                        <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </motion.div>
                    
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link 
                        href="/pricing"
                        className="group bg-gradient-to-r from-emerald-500 via-green-500 to-teal-600 text-white border-2 border-emerald-400/30 px-12 py-4 rounded-2xl text-lg font-bold hover:from-emerald-600 hover:via-green-600 hover:to-teal-700 hover:border-emerald-300/50 transition-all duration-300 flex items-center justify-center space-x-3 shadow-2xl shadow-emerald-500/25 hover:shadow-2xl hover:shadow-emerald-500/40 hover:scale-105"
                      >
                        <FireIcon className="w-6 h-6 group-hover:text-yellow-300 transition-colors" />
                        <span>View Pricing</span>
                      </Link>
                    </motion.div>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Carousel Navigation */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-4 z-20">
          {heroSlides.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                currentSlide === index 
                  ? 'bg-white scale-125' 
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            />
          ))}
        </div>

        {/* Carousel Arrows */}
        <motion.button
          onClick={() => setCurrentSlide((prev) => (prev - 1 + 3) % 3)}
          className="absolute left-8 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-xl rounded-full border border-white/30 text-white hover:bg-white/30 transition-all duration-300 z-20"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ChevronLeftIcon className="w-6 h-6 mx-auto" />
        </motion.button>
        
        <motion.button
          onClick={() => setCurrentSlide((prev) => (prev + 1) % 3)}
          className="absolute right-8 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-xl rounded-full border border-white/30 text-white hover:bg-white/30 transition-all duration-300 z-20"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ChevronRightIcon className="w-6 h-6 mx-auto" />
        </motion.button>
      </div>

      {/* Lightning Fast Banner Features Section with STUNNING IMAGES */}
      <section className="py-16 relative">
        {/* Background with STUNNING IMAGES */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Main Background Image */}
          <div className="absolute inset-0 bg-gradient-to-br from-violet-50/80 via-purple-50/70 to-indigo-50/80"></div>
          
          {/* Floating Product Images */}
          <div className="absolute top-10 left-10 w-64 h-64 opacity-20">
            <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 rounded-3xl shadow-2xl transform rotate-12"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-3xl"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <BuildingStorefrontIcon className="w-20 h-20 text-white/80" />
            </div>
          </div>
          
          <div className="absolute top-20 right-20 w-56 h-56 opacity-20">
            <div className="w-full h-full bg-gradient-to-br from-green-400 to-teal-500 rounded-3xl shadow-2xl transform -rotate-12"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-3xl"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <ChartBarIcon className="w-16 h-16 text-white/80" />
            </div>
          </div>
          
          <div className="absolute bottom-20 left-1/3 w-48 h-48 opacity-20">
            <div className="w-full h-full bg-gradient-to-br from-orange-400 to-red-500 rounded-3xl shadow-2xl transform rotate-6"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-3xl"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <CpuChipIcon className="w-14 h-14 text-white/80" />
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Fast Header with PERFECT TEXT VISIBILITY */}
          <div className="text-center mb-12">
            {/* Simple Icon */}
            <div className="mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-violet-500 via-purple-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto shadow-lg">
                <LightBulbIcon className="w-10 h-10 text-white" />
              </div>
            </div>

            {/* Main Headline with DARK TEXT for PERFECT VISIBILITY */}
            <h2 className="text-5xl md:text-6xl font-black mb-4 leading-tight">
              <span className="text-slate-900 drop-shadow-sm">
                Drive Your Business
              </span>
              <br />
              <span className="text-slate-800 drop-shadow-sm">
                with Mindware POS
              </span>
            </h2>
            <div className="w-32 h-1 bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500 rounded-full mx-auto shadow-lg"></div>

            {/* Subtitle with DARK TEXT for PERFECT VISIBILITY */}
            <p className="text-xl text-slate-800 max-w-3xl mx-auto leading-relaxed font-semibold mb-8 mt-6 drop-shadow-sm">
              Comprehensive solutions for every industry with cutting-edge technology
            </p>

            {/* Simple Stats with DARK TEXT */}
            <div className="flex flex-wrap justify-center gap-8 mb-12">
              {[
                { number: '50K+', label: 'Businesses', color: 'from-violet-500 to-purple-500' },
                { number: '99.9%', label: 'Uptime', color: 'from-emerald-500 to-green-500' },
                { number: '24/7', label: 'Support', color: 'from-blue-500 to-cyan-500' },
                { number: '10x', label: 'Faster', color: 'from-orange-500 to-red-500' }
              ].map((stat, index) => (
                <div key={stat.label} className="text-center">
                  <div className={`w-16 h-16 bg-gradient-to-r ${stat.color} rounded-2xl flex items-center justify-center mb-2 shadow-lg`}>
                    <span className="text-white font-black text-lg">{stat.number}</span>
                  </div>
                  <p className="text-slate-800 font-semibold text-sm drop-shadow-sm">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Fast Feature Cards Grid with STUNNING IMAGES */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {bannerFeatures.map((feature, index) => (
              <div
                key={feature.title}
                className="group relative bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-white/60 hover:border-white/80 transition-all duration-300 hover:shadow-xl hover:shadow-black/20 hover:-translate-y-2 overflow-hidden"
              >
                {/* Background Image Pattern */}
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute inset-0" style={{
                    backgroundImage: `radial-gradient(circle at 25% 25%, ${feature.color.split(' ')[1]} 2px, transparent 2px)`,
                    backgroundSize: '50px 50px'
                  }}></div>
                </div>
                
                {/* Feature Icon */}
                <div className="relative z-10">
                  <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-4 shadow-lg`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-slate-800 mb-2">{feature.title}</h3>
                  <p className="text-slate-600 mb-4">{feature.description}</p>
                  
                  {/* Feature List */}
                  <div className="space-y-2">
                    {feature.features.map((feat, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <CheckIcon className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-slate-700">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
