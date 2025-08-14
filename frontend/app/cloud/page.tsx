'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  CloudIcon,
  ServerIcon,
  GlobeAltIcon,
  ShieldCheckIcon,
  BoltIcon,
  ChartBarIcon,
  CogIcon,
  UserGroupIcon,
  BuildingStorefrontIcon,
  TruckIcon,
  CreditCardIcon,
  DocumentTextIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  ArrowRightIcon,
  SparklesIcon,
  StarIcon,
  HeartIcon,
  RocketLaunchIcon,
  FireIcon,
  LightBulbIcon,
  PuzzlePieceIcon,
  CpuChipIcon,
  EyeIcon,
  EyeSlashIcon,
  CheckIcon,
  WrenchScrewdriverIcon,
  ClipboardDocumentListIcon,
  CubeIcon,
  BanknotesIcon,
  ServerStackIcon,
  CloudArrowUpIcon,
  LockClosedIcon,
  WifiIcon
} from '@heroicons/react/24/outline'
import Link from 'next/link'

export default function CloudPage() {
  const [activeTab, setActiveTab] = useState('overview')
  const [isVisible, setIsVisible] = useState(false)

  const cloudFeatures = [
    {
      icon: ServerStackIcon,
      title: "Global Infrastructure",
      description: "Deployed across 50+ data centers worldwide for lightning-fast performance and 99.99% uptime.",
      color: "from-blue-400 to-cyan-500",
      bgColor: "from-blue-50/80 to-cyan-50/80",
      stats: "50+ Data Centers"
    },
    {
      icon: CloudArrowUpIcon,
      title: "Auto Scaling",
      description: "Intelligent scaling that automatically adjusts resources based on demand, ensuring optimal performance.",
      color: "from-green-400 to-emerald-500",
      bgColor: "from-green-50/80 to-emerald-50/80",
      stats: "0-1000% Scaling"
    },
    {
      icon: LockClosedIcon,
      title: "Enterprise Security",
      description: "Bank-level security with end-to-end encryption, multi-factor authentication, and compliance certifications.",
      color: "from-purple-400 to-indigo-500",
      bgColor: "from-purple-50/80 to-indigo-50/80",
      stats: "256-bit Encryption"
    },
    {
      icon: WifiIcon,
      title: "Real-time Sync",
      description: "Instant synchronization across all devices and locations with real-time data consistency.",
      color: "from-orange-400 to-red-500",
      bgColor: "from-orange-50/80 to-red-50/80",
      stats: "<100ms Sync"
    }
  ]

  const cloudPlans = [
    {
      name: "Starter Cloud",
      price: "₹2,999",
      period: "/month",
      description: "Perfect for small businesses getting started with cloud solutions",
      features: [
        "5GB Storage",
        "Basic Analytics",
        "Email Support",
        "Daily Backups",
        "Mobile App Access"
      ],
      color: "from-blue-400 to-cyan-500",
      popular: false
    },
    {
      name: "Professional Cloud",
      price: "₹7,999",
      period: "/month",
      description: "Advanced features for growing businesses with multiple locations",
      features: [
        "50GB Storage",
        "Advanced Analytics",
        "Priority Support",
        "Hourly Backups",
        "API Access",
        "Custom Integrations",
        "Multi-location Support"
      ],
      color: "from-purple-400 to-indigo-500",
      popular: true
    },
    {
      name: "Enterprise Cloud",
      price: "₹19,999",
      period: "/month",
      description: "Full-featured solution for large enterprises with complex requirements",
      features: [
        "Unlimited Storage",
        "AI-Powered Analytics",
        "24/7 Dedicated Support",
        "Real-time Backups",
        "Custom Development",
        "White-label Solutions",
        "Advanced Security",
        "Compliance Certifications"
      ],
      color: "from-emerald-400 to-green-500",
      popular: false
    }
  ]

  const cloudBenefits = [
    {
      icon: BoltIcon,
      title: "Lightning Fast Performance",
      description: "Optimized infrastructure delivers sub-second response times for all operations.",
      metrics: "0.8s Average Response"
    },
    {
      icon: ShieldCheckIcon,
      title: "Bank-Level Security",
      description: "Enterprise-grade security with SOC 2, ISO 27001, and GDPR compliance.",
      metrics: "99.99% Security Score"
    },
    {
      icon: GlobeAltIcon,
      title: "Global Availability",
      description: "Access your business from anywhere with our worldwide data center network.",
      metrics: "50+ Countries"
    },
    {
      icon: ChartBarIcon,
      title: "Real-time Analytics",
      description: "Live business insights with AI-powered analytics and predictive modeling.",
      metrics: "Real-time Updates"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30">
      {/* Floating Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-br from-blue-200/30 via-cyan-200/30 to-teal-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-80 h-80 bg-gradient-to-br from-purple-200/30 via-indigo-200/30 to-blue-200/30 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-gradient-to-br from-emerald-200/30 via-green-200/30 to-teal-200/30 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Header */}
      <motion.header 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 bg-white/10 backdrop-blur-2xl border-b border-white/20 shadow-2xl shadow-black/5"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <motion.div 
              className="flex items-center"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/25">
                <CloudIcon className="w-7 h-7 text-white" />
              </div>
              <h1 className="ml-3 text-2xl font-bold bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-700 bg-clip-text text-transparent">
                Mindware Cloud
              </h1>
            </motion.div>
            
            <nav className="hidden md:flex space-x-8">
              {['Overview', 'Features', 'Pricing', 'Security', 'Support'].map((item, index) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Link 
                    href={`#${item.toLowerCase()}`} 
                    className="text-slate-700 hover:text-blue-600 font-medium transition-all duration-300 relative group"
                  >
                    {item}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500 transition-all duration-300 group-hover:w-full"></span>
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
                  className="text-slate-700 hover:text-blue-600 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 hover:bg-white/20 backdrop-blur-sm"
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
                  className="bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-600 text-white px-6 py-3 rounded-2xl text-sm font-semibold hover:from-blue-600 hover:via-cyan-600 hover:to-teal-700 transition-all duration-300 shadow-2xl shadow-blue-500/25 hover:shadow-2xl hover:shadow-blue-500/30"
                >
                  Start Free Trial
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-700 bg-clip-text text-transparent">
              The Future of Business is in the Cloud
            </h1>
            <p className="text-xl text-slate-700 mb-8 max-w-3xl mx-auto leading-relaxed">
              Experience lightning-fast performance, enterprise-grade security, and unlimited scalability with Mindware Cloud. 
              Access your business from anywhere, anytime, with 99.99% uptime guarantee.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link 
                  href="#features"
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-600 text-white text-lg font-semibold rounded-2xl hover:from-blue-600 hover:via-cyan-600 hover:to-teal-700 transition-all duration-300 shadow-2xl shadow-blue-500/25 hover:shadow-2xl hover:shadow-blue-500/30"
                >
                  Explore Features
                  <ArrowRightIcon className="ml-2 w-5 h-5" />
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link 
                  href="#pricing"
                  className="inline-flex items-center px-8 py-4 bg-white/20 backdrop-blur-xl text-slate-800 border border-white/30 px-8 py-4 rounded-2xl text-lg font-semibold hover:bg-white/30 transition-all duration-300 shadow-2xl shadow-black/10"
                >
                  View Pricing
                </Link>
              </motion.div>
            </div>
          </motion.div>

          {/* Cloud Stats */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20"
          >
            {[
              { number: "99.99%", label: "Uptime Guarantee", icon: ServerIcon, color: "from-blue-400 to-cyan-500" },
              { number: "50+", label: "Global Data Centers", icon: GlobeAltIcon, color: "from-green-400 to-emerald-500" },
              { number: "0.8s", label: "Average Response", icon: BoltIcon, color: "from-yellow-400 to-orange-500" },
              { number: "256-bit", label: "Encryption", icon: ShieldCheckIcon, color: "from-purple-400 to-indigo-500" }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-slate-800 mb-2">{stat.number}</div>
                <div className="text-slate-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Cloud Features */}
      <section id="features" className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-700 bg-clip-text text-transparent">
              Cloud Features That Power Your Business
            </h2>
            <p className="text-xl text-slate-700 max-w-3xl mx-auto">
              Built for the modern business with enterprise-grade infrastructure and intelligent automation.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {cloudFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className={`bg-gradient-to-br ${feature.bgColor} backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl shadow-black/10`}
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-4">{feature.title}</h3>
                <p className="text-slate-700 mb-4 leading-relaxed">{feature.description}</p>
                <div className="text-sm font-semibold text-slate-600">{feature.stats}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Cloud Benefits */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-700 bg-clip-text text-transparent">
              Why Choose Mindware Cloud?
            </h2>
            <p className="text-xl text-slate-700 max-w-3xl mx-auto">
              Experience the advantages that make Mindware Cloud the preferred choice for businesses worldwide.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {cloudBenefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl shadow-black/10 hover:shadow-2xl hover:shadow-black/20 transition-all duration-300"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                    <benefit.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-slate-800 mb-3">{benefit.title}</h3>
                    <p className="text-slate-700 mb-4 leading-relaxed">{benefit.description}</p>
                    <div className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-semibold">
                      {benefit.metrics}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Cloud Pricing */}
      <section id="pricing" className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-700 bg-clip-text text-transparent">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-slate-700 max-w-3xl mx-auto">
              Choose the perfect plan for your business with no hidden fees or surprises.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {cloudPlans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className={`relative bg-white/80 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl shadow-black/10 hover:shadow-2xl hover:shadow-black/20 transition-all duration-300 ${
                  plan.popular ? 'ring-2 ring-blue-500 ring-offset-4' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                      Most Popular
                    </div>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-slate-800 mb-4">{plan.name}</h3>
                  <div className="flex items-baseline justify-center mb-2">
                    <span className="text-4xl font-bold text-slate-800">{plan.price}</span>
                    <span className="text-slate-600 ml-1">{plan.period}</span>
                  </div>
                  <p className="text-slate-600">{plan.description}</p>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center space-x-3">
                      <CheckIcon className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-slate-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link 
                  href={`/cloud/signup?plan=${plan.name.toLowerCase().replace(' ', '-')}`}
                  className={`inline-flex items-center justify-center w-full px-6 py-3 bg-gradient-to-r ${plan.color} text-white font-semibold rounded-xl hover:scale-105 transition-all duration-300 shadow-lg`}
                >
                  Get Started
                  <ArrowRightIcon className="ml-2 w-4 h-4" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900/95 backdrop-blur-xl text-white mt-24 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-600 rounded-xl flex items-center justify-center">
                  <CloudIcon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold">Mindware Cloud</h3>
              </div>
              <p className="text-slate-400 mb-6">
                The future of business technology, powered by cloud innovation and AI intelligence.
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center hover:bg-slate-700 transition-colors cursor-pointer">
                  <span className="text-white">📱</span>
                </div>
                <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center hover:bg-slate-700 transition-colors cursor-pointer">
                  <span className="text-white">💬</span>
                </div>
                <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center hover:bg-slate-700 transition-colors cursor-pointer">
                  <span className="text-white">📧</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-6">Cloud Services</h4>
              <ul className="space-y-3">
                <li><Link href="/cloud/pos" className="text-slate-400 hover:text-white transition-colors">Cloud POS</Link></li>
                <li><Link href="/cloud/erp" className="text-slate-400 hover:text-white transition-colors">Cloud ERP</Link></li>
                <li><Link href="/cloud/analytics" className="text-slate-400 hover:text-white transition-colors">Cloud Analytics</Link></li>
                <li><Link href="/cloud/security" className="text-slate-400 hover:text-white transition-colors">Cloud Security</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-6">Resources</h4>
              <ul className="space-y-3">
                <li><Link href="/cloud/documentation" className="text-slate-400 hover:text-white transition-colors">Documentation</Link></li>
                <li><Link href="/cloud/api" className="text-slate-400 hover:text-white transition-colors">API Reference</Link></li>
                <li><Link href="/cloud/status" className="text-slate-400 hover:text-white transition-colors">System Status</Link></li>
                <li><Link href="/cloud/support" className="text-slate-400 hover:text-white transition-colors">Support</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-6">Company</h4>
              <ul className="space-y-3">
                <li><Link href="/about" className="text-slate-400 hover:text-white transition-colors">About Us</Link></li>
                <li><Link href="/careers" className="text-slate-400 hover:text-white transition-colors">Careers</Link></li>
                <li><Link href="/partners" className="text-slate-400 hover:text-white transition-colors">Partners</Link></li>
                <li><Link href="/contact" className="text-slate-400 hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-800 mt-12 pt-8 text-center">
            <p className="text-slate-400">
              © 2024 Mindware Technologies. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
