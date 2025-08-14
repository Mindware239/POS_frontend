'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  ArrowLeftIcon,
  SparklesIcon,
  RocketLaunchIcon,
  HeartIcon,
  LightBulbIcon,
  ShieldCheckIcon,
  GlobeAltIcon,
  UserGroupIcon,
  TrophyIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline'

export default function AboutPage() {
  const values = [
    {
      icon: LightBulbIcon,
      title: 'Innovation',
      description: 'We constantly push the boundaries of what\'s possible in retail technology, bringing cutting-edge AI and machine learning to everyday business operations.'
    },
    {
      icon: HeartIcon,
      title: 'Customer First',
      description: 'Every feature we build starts with understanding our customers\' needs. Your success is our success, and we\'re committed to your growth.'
    },
    {
      icon: ShieldCheckIcon,
      title: 'Trust & Security',
      description: 'Your business data is sacred. We employ enterprise-grade security measures to ensure your information is always protected.'
    },
    {
      icon: GlobeAltIcon,
      title: 'Accessibility',
      description: 'We believe powerful technology should be accessible to businesses of all sizes, from corner stores to enterprise chains.'
    }
  ]

  const stats = [
    { number: '10,000+', label: 'Happy Customers' },
    { number: '50M+', label: 'Transactions Processed' },
    { number: '99.9%', label: 'Uptime Guarantee' },
    { number: '24/7', label: 'Support Available' }
  ]

  const team = [
    {
      name: 'Sarah Chen',
      role: 'CEO & Co-founder',
      description: 'Former VP at Microsoft with 15+ years in enterprise software. Passionate about empowering small businesses.',
      image: '/team/sarah.jpg'
    },
    {
      name: 'Marcus Rodriguez',
      role: 'CTO & Co-founder',
      description: 'Ex-Google engineer specialized in AI/ML. Led teams that built systems processing billions of transactions.',
      image: '/team/marcus.jpg'
    },
    {
      name: 'Priya Patel',
      role: 'Head of Product',
      description: 'Former Shopify product lead. Expert in retail technology and user experience design.',
      image: '/team/priya.jpg'
    },
    {
      name: 'David Kim',
      role: 'Head of Engineering',
      description: 'Previously at Stripe and Square. Specialist in payment systems and financial technology.',
      image: '/team/david.jpg'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 relative overflow-hidden">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Link href="/" className="flex items-center group">
                <ArrowLeftIcon className="w-5 h-5 text-gray-700 mr-2 group-hover:text-blue-600 transition-colors" />
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">M</span>
                </div>
                <h1 className="ml-3 text-xl font-bold text-gray-900">Mindware POS</h1>
              </Link>
            </div>
            <nav className="hidden md:flex space-x-6">
              <Link href="/" className="text-gray-700 hover:text-blue-600 font-medium transition-all duration-300">Home</Link>
              <Link href="/features" className="text-gray-700 hover:text-blue-600 font-medium transition-all duration-300">Features</Link>
              <Link href="/pricing" className="text-gray-700 hover:text-blue-600 font-medium transition-all duration-300">Pricing</Link>
              <Link href="/contact" className="text-gray-700 hover:text-blue-600 font-medium transition-all duration-300">Contact</Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-8"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full mb-6">
              <SparklesIcon className="w-10 h-10 text-blue-600" />
            </div>
          </motion.div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gray-900">
            <span className="text-gray-900">
              Empowering Retail
            </span>
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent block">
              Since 2019
            </div>
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            We're on a mission to democratize powerful retail technology, making enterprise-grade POS systems accessible to businesses of all sizes. From corner stores to large chains, we're transforming how retail works.
          </p>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-24"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
              className="text-center bg-white rounded-2xl p-6 border border-gray-200 shadow-lg"
            >
              <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">
                {stat.number}
              </div>
              <div className="text-gray-700 font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Story Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="grid md:grid-cols-2 gap-16 items-center mb-24"
        >
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Our Story
            </h2>
            <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
              <p>
                Mindware POS was born from a simple observation: while large retailers had access to sophisticated technology, small and medium businesses were stuck with outdated, expensive, and inflexible systems.
              </p>
              <p>
                Our founders, having worked at companies like Google, Microsoft, and Stripe, saw an opportunity to change this. They combined their expertise in AI, payments, and enterprise software to create a POS system that rivals the best enterprise solutions while being accessible to businesses of all sizes.
              </p>
              <p>
                Today, we serve over <span className="text-blue-600 font-semibold">10,000+ businesses</span> across <span className="text-indigo-600 font-semibold">25+ countries</span>, processing millions of transactions daily and helping retailers increase their efficiency by an average of <span className="text-green-600 font-semibold">35%</span>.
              </p>
            </div>
          </div>
          <div className="relative">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
              <div className="relative">
                <RocketLaunchIcon className="w-20 h-20 text-white mx-auto mb-6" />
                <div className="text-center">
                  <div className="text-2xl font-bold text-white mb-2">Our Mission</div>
                  <p className="text-blue-100">
                    To make powerful retail technology accessible to every business, regardless of size or budget.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Values Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mb-24"
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Our Values
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              These core principles guide every decision we make and every feature we build.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.0 + index * 0.1 }}
                className="group bg-white rounded-2xl p-8 border border-gray-200 hover:border-blue-300 transition-all duration-300 hover:shadow-xl hover:shadow-blue-100 hover:scale-105"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <value.icon className="w-8 h-8 text-blue-600 group-hover:text-blue-700 transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                  {value.title}
                </h3>
                <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Team Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="mb-24"
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Meet Our Leadership
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our team combines decades of experience from leading technology companies with deep retail domain expertise.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.4 + index * 0.1 }}
                className="group bg-white rounded-2xl p-6 border border-gray-200 hover:border-blue-300 transition-all duration-300 hover:shadow-xl hover:shadow-blue-100 hover:scale-105 text-center"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <UserGroupIcon className="w-10 h-10 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">{member.name}</h3>
                <p className="text-blue-600 font-medium text-sm mb-3">{member.role}</p>
                <p className="text-gray-600 text-sm leading-relaxed">{member.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.6 }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-12 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-white rounded-full opacity-10 blur-3xl"></div>
            <div className="relative">
              <TrophyIcon className="w-16 h-16 text-white mx-auto mb-8 animate-pulse" />
              <h2 className="text-4xl font-bold text-white mb-6">
                Join Our Success Story
              </h2>
              <p className="text-xl text-blue-100 mb-10 max-w-3xl mx-auto leading-relaxed">
                Be part of the retail revolution. Join thousands of businesses that have already transformed their operations with Mindware POS.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link
                  href="/register"
                  className="group bg-white text-blue-600 px-10 py-4 rounded-xl text-lg font-bold hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center space-x-3"
                >
                  <RocketLaunchIcon className="w-6 h-6 group-hover:animate-bounce" />
                  <span>Get Started Today</span>
                </Link>
                <Link
                  href="/contact"
                  className="group text-white border-2 border-white/50 bg-white/10 backdrop-blur-sm px-10 py-4 rounded-xl text-lg font-bold hover:border-white hover:bg-white/20 transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-3"
                >
                  <span>Contact Us</span>
                  <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  )
}
