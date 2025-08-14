'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { 
  RocketLaunchIcon,
  EyeIcon,
  BuildingStorefrontIcon,
  ChartBarIcon,
  CpuChipIcon
} from '@heroicons/react/24/outline'

export default function HeroSection() {
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

  return (
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
          <div className={`min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-br ${heroSlides[currentSlide].bgColor} relative overflow-hidden`}>
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
              <div className="absolute left-4 md:left-10 top-1/4 w-64 md:w-80 h-64 md:h-80 opacity-90">
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
              <div className="absolute right-4 md:right-10 top-1/3 w-56 md:w-72 h-56 md:h-72 opacity-90">
                <div className="w-full h-full bg-white rounded-3xl shadow-2xl transform -rotate-12 relative overflow-hidden border-4 border-white">
                  {/* Mobile App Interface */}
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-teal-100 rounded-3xl">
                    {/* Header Bar */}
                    <div className="absolute top-0 left-0 right-0 h-6 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-t-3xl flex items-center justify-center">
                      <span className="text-white text-xs font-bold">Quick Sale</span>
                    </div>
                    
                    {/* Main Content */}
                    <div className="absolute top-6 left-0 right-0 bottom-0 p-3">
                      {/* Search Bar */}
                      <div className="bg-white rounded-lg p-2 mb-3 shadow-sm">
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 bg-gray-300 rounded"></div>
                          <span className="text-xs text-gray-500">Search products...</span>
                        </div>
                      </div>
                      
                      {/* Product List */}
                      <div className="space-y-2">
                        <div className="bg-white rounded p-2 shadow-sm">
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-700">Product Name</span>
                            <span className="text-xs font-bold text-emerald-600">$12.99</span>
                          </div>
                        </div>
                        <div className="bg-white rounded p-2 shadow-sm">
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-700">Another Product</span>
                            <span className="text-xs font-bold text-emerald-600">$8.50</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Total */}
                      <div className="absolute bottom-3 left-3 right-3">
                        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg p-2 text-center">
                          <span className="text-white text-xs font-bold">Total: $0.00</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Central Content */}
            <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
              {/* Main Headline with DARK TEXT for PERFECT VISIBILITY */}
              <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-4xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight"
              >
                <span className={`bg-gradient-to-r ${heroSlides[currentSlide].color} bg-clip-text text-transparent drop-shadow-2xl`}>
                  {heroSlides[currentSlide].title}
                </span>
              </motion.h1>

              {/* Subtitle with DARK TEXT for PERFECT VISIBILITY */}
              <motion.p 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-xl md:text-2xl lg:text-3xl font-bold mb-6 text-slate-800 drop-shadow-2xl"
              >
                {heroSlides[currentSlide].subtitle}
              </motion.p>

              {/* Description with DARK TEXT for PERFECT VISIBILITY */}
              <motion.p 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="text-base md:text-lg lg:text-xl text-slate-800 max-w-3xl mx-auto leading-relaxed mb-8 font-semibold drop-shadow-2xl"
              >
                {heroSlides[currentSlide].description}
              </motion.p>

              {/* Hero Badge */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="inline-flex items-center space-x-3 bg-white/90 backdrop-blur-xl px-6 py-3 rounded-full shadow-2xl mb-8"
              >
                <CpuChipIcon className="w-6 h-6 text-purple-600" />
                <span className="text-slate-800 font-semibold">The Future of POS is Here</span>
              </motion.div>

              {/* CTA Buttons */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.0 }}
                className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6"
              >
                <Link 
                  href="/demo" 
                  className="inline-flex items-center px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-600 text-white text-base md:text-lg font-bold rounded-xl hover:from-blue-600 hover:via-purple-600 hover:to-indigo-700 transition-all duration-300 shadow-2xl hover:shadow-blue-500/25 border-2 border-blue-400/30"
                >
                  <RocketLaunchIcon className="w-5 h-5 md:w-6 md:h-6 mr-3" />
                  See AI in Action
                  <RocketLaunchIcon className="w-4 h-4 md:w-5 md:h-5 ml-2 transform rotate-45" />
                </Link>
                
                <Link 
                  href="/pricing" 
                  className="inline-flex items-center px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-600 text-white text-base md:text-lg font-bold rounded-xl hover:from-green-600 hover:via-emerald-600 hover:to-teal-700 transition-all duration-300 shadow-2xl hover:shadow-green-500/25 border-2 border-green-400/30"
                >
                  <EyeIcon className="w-5 h-5 md:w-6 md:h-6 mr-3" />
                  View Pricing
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Dots */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
        {[0, 1, 2].map((index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              currentSlide === index 
                ? 'bg-white scale-125 shadow-lg' 
                : 'bg-white/50 hover:bg-white/75'
            }`}
          />
        ))}
      </div>

      {/* Navigation Arrows */}
      <motion.button
        onClick={() => setCurrentSlide((prev) => (prev - 1 + 3) % 3)}
        className="absolute left-4 md:left-8 top-1/2 transform -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-white/20 backdrop-blur-xl rounded-full border border-white/30 text-white hover:bg-white/30 transition-all duration-300 z-20"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <svg className="w-5 h-5 md:w-6 md:h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </motion.button>
      
      <motion.button
        onClick={() => setCurrentSlide((prev) => (prev + 1) % 3)}
        className="absolute right-4 md:right-8 top-1/2 transform -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-white/20 backdrop-blur-xl rounded-full border border-white/30 text-white hover:bg-white/30 transition-all duration-300 z-20"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <svg className="w-5 h-5 md:w-6 md:h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </motion.button>
    </div>
  )
}
