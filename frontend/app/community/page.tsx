'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  UserGroupIcon,
  ChatBubbleLeftRightIcon,
  AcademicCapIcon,
  StarIcon,
  HeartIcon,
  RocketLaunchIcon,
  FireIcon,
  LightBulbIcon,
  PuzzlePieceIcon,
  GlobeAltIcon,
  CpuChipIcon,
  BuildingStorefrontIcon,
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
  EyeIcon,
  EyeSlashIcon,
  CheckIcon,
  WrenchScrewdriverIcon,
  ClipboardDocumentListIcon,
  CubeIcon,
  BanknotesIcon,
  CalendarDaysIcon
} from '@heroicons/react/24/outline'
import Link from 'next/link'

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState('forums')
  const [isVisible, setIsVisible] = useState(false)

  const communityFeatures = [
    {
      icon: ChatBubbleLeftRightIcon,
      title: "Community Forums",
      description: "Connect with fellow business owners, share experiences, and get expert advice.",
      color: "from-blue-400 to-cyan-500",
      bgColor: "from-blue-50/80 to-cyan-50/80",
      stats: "10,000+ Members"
    },
    {
      icon: AcademicCapIcon,
      title: "Learning Hub",
      description: "Access exclusive training materials, webinars, and certification programs.",
      color: "from-green-400 to-emerald-500",
      bgColor: "from-green-50/80 to-emerald-50/80",
      stats: "500+ Courses"
    },
    {
      icon: StarIcon,
      title: "Expert Network",
      description: "Connect with industry experts, consultants, and certified professionals.",
      color: "from-yellow-400 to-orange-500",
      bgColor: "from-yellow-50/80 to-orange-50/80",
      stats: "200+ Experts"
    },
    {
      icon: RocketLaunchIcon,
      title: "Innovation Lab",
      description: "Collaborate on new features, beta test, and shape the future of Mindware.",
      color: "from-purple-400 to-indigo-500",
      bgColor: "from-purple-50/80 to-indigo-50/80",
      stats: "50+ Beta Features"
    }
  ]

  const forumCategories = [
    {
      name: "POS Solutions",
      description: "Discuss POS implementation, best practices, and troubleshooting",
      members: "3,200",
      topics: "1,450",
      posts: "8,900",
      color: "from-blue-400 to-cyan-500"
    },
    {
      name: "Business Management",
      description: "Share business strategies, growth tips, and management insights",
      members: "2,800",
      topics: "980",
      posts: "5,600",
      color: "from-green-400 to-emerald-500"
    },
    {
      name: "AI & Technology",
      description: "Explore AI features, automation, and technological innovations",
      members: "1,900",
      topics: "650",
      posts: "3,200",
      color: "from-purple-400 to-indigo-500"
    },
    {
      name: "Industry Solutions",
      description: "Industry-specific discussions and specialized use cases",
      members: "2,100",
      topics: "720",
      posts: "4,100",
      color: "from-orange-400 to-red-500"
    }
  ]

  const upcomingEvents = [
    {
      title: "Mindware AI Summit 2024",
      date: "March 15-17, 2024",
      location: "Virtual + Mumbai, India",
      description: "Join industry leaders for 3 days of AI innovation, networking, and insights.",
      attendees: "500+",
      color: "from-blue-500 to-purple-600"
    },
    {
      title: "POS Masterclass Series",
      date: "Every Tuesday, 7 PM IST",
      location: "Online Webinar",
      description: "Weekly deep-dive sessions on advanced POS features and optimization.",
      attendees: "200+",
      color: "from-green-500 to-emerald-600"
    },
    {
      title: "Business Growth Workshop",
      date: "April 5-6, 2024",
      location: "Delhi, Bangalore, Chennai",
      description: "Hands-on workshops for business owners looking to scale operations.",
      attendees: "150+",
      color: "from-orange-500 to-red-600"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30">
      {/* Floating Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-br from-violet-200/30 via-purple-200/30 to-indigo-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-80 h-80 bg-gradient-to-br from-blue-200/30 via-cyan-200/30 to-teal-200/30 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
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
              <div className="w-12 h-12 bg-gradient-to-br from-violet-500 via-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-purple-500/25">
                <CpuChipIcon className="w-7 h-7 text-white" />
              </div>
              <h1 className="ml-3 text-2xl font-bold bg-gradient-to-r from-slate-800 via-purple-800 to-indigo-800 bg-clip-text text-transparent">
                Mindware Community
              </h1>
            </motion.div>
            
            <nav className="hidden md:flex space-x-8">
              {['Home', 'Forums', 'Events', 'Learning', 'Experts'].map((item, index) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Link 
                    href={`#${item.toLowerCase()}`} 
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
                  Join Community
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
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-slate-900 via-purple-800 to-indigo-800 bg-clip-text text-transparent">
              Join the Mindware Community
            </h1>
            <p className="text-xl text-slate-700 mb-8 max-w-3xl mx-auto leading-relaxed">
              Connect with 50,000+ business owners, learn from experts, and shape the future of business technology together.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link 
                  href="#forums"
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-600 text-white text-lg font-semibold rounded-2xl hover:from-blue-600 hover:via-purple-600 hover:to-indigo-700 transition-all duration-300 shadow-2xl shadow-purple-500/25 hover:shadow-2xl hover:shadow-purple-500/30"
                >
                  Explore Forums
                  <ArrowRightIcon className="ml-2 w-5 h-5" />
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link 
                  href="#events"
                  className="inline-flex items-center px-8 py-4 bg-white/20 backdrop-blur-xl text-slate-800 border border-white/30 px-8 py-4 rounded-2xl text-lg font-semibold hover:bg-white/30 transition-all duration-300 shadow-2xl shadow-black/10"
                >
                  View Events
                </Link>
              </motion.div>
            </div>
          </motion.div>

          {/* Community Stats */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20"
          >
            {[
              { number: "50,000+", label: "Community Members", icon: UserGroupIcon, color: "from-blue-400 to-cyan-500" },
              { number: "1,000+", label: "Expert Contributors", icon: StarIcon, color: "from-yellow-400 to-orange-500" },
              { number: "500+", label: "Learning Resources", icon: AcademicCapIcon, color: "from-green-400 to-emerald-500" },
              { number: "24/7", label: "Active Support", icon: ChatBubbleLeftRightIcon, color: "from-purple-400 to-indigo-500" }
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

      {/* Community Features */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-slate-900 via-purple-800 to-indigo-800 bg-clip-text text-transparent">
              What You'll Find Here
            </h2>
            <p className="text-xl text-slate-700 max-w-3xl mx-auto">
              Discover a world of knowledge, connections, and opportunities in the Mindware community.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {communityFeatures.map((feature, index) => (
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

      {/* Forum Categories */}
      <section id="forums" className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-slate-900 via-purple-800 to-indigo-800 bg-clip-text text-transparent">
              Community Forums
            </h2>
            <p className="text-xl text-slate-700 max-w-3xl mx-auto">
              Join discussions, ask questions, and share your expertise in our specialized community forums.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {forumCategories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl shadow-black/10 hover:shadow-2xl hover:shadow-black/20 transition-all duration-300"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${category.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg`}>
                  <ChatBubbleLeftRightIcon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-3">{category.name}</h3>
                <p className="text-slate-700 mb-6 leading-relaxed">{category.description}</p>
                
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-slate-800">{category.members}</div>
                    <div className="text-sm text-slate-600">Members</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-slate-800">{category.topics}</div>
                    <div className="text-sm text-slate-600">Topics</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-slate-800">{category.posts}</div>
                    <div className="text-sm text-slate-600">Posts</div>
                  </div>
                </div>

                <Link 
                  href={`/forums/${category.name.toLowerCase().replace(' ', '-')}`}
                  className="inline-flex items-center justify-center w-full px-6 py-3 bg-gradient-to-r from-slate-700 to-slate-800 text-white font-semibold rounded-xl hover:from-slate-800 hover:to-slate-900 transition-all duration-300"
                >
                  Join Discussion
                  <ArrowRightIcon className="ml-2 w-4 h-4" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section id="events" className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-slate-900 via-purple-800 to-indigo-800 bg-clip-text text-transparent">
              Upcoming Events
            </h2>
            <p className="text-xl text-slate-700 max-w-3xl mx-auto">
              Don't miss out on exclusive events, workshops, and networking opportunities.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {upcomingEvents.map((event, index) => (
              <motion.div
                key={event.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl shadow-black/10 hover:shadow-2xl hover:shadow-black/20 transition-all duration-300"
              >
                <div className={`w-full h-32 bg-gradient-to-br ${event.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg`}>
                  <CalendarDaysIcon className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">{event.title}</h3>
                <div className="flex items-center space-x-2 mb-2">
                  <CalendarDaysIcon className="w-4 h-4 text-slate-600" />
                  <span className="text-sm text-slate-600">{event.date}</span>
                </div>
                <div className="flex items-center space-x-2 mb-4">
                  <MapPinIcon className="w-4 h-4 text-slate-600" />
                  <span className="text-sm text-slate-600">{event.location}</span>
                </div>
                <p className="text-slate-700 mb-4 leading-relaxed">{event.description}</p>
                <div className="flex items-center justify-between mb-6">
                  <span className="text-sm text-slate-600">{event.attendees} attending</span>
                  <span className="text-sm font-semibold text-green-600">Free</span>
                </div>
                <Link 
                  href={`/events/${event.title.toLowerCase().replace(/ /g, '-')}`}
                  className="inline-flex items-center justify-center w-full px-6 py-3 bg-gradient-to-r from-slate-700 to-slate-800 text-white font-semibold rounded-xl hover:from-slate-800 hover:to-slate-900 transition-all duration-300"
                >
                  Register Now
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
                <div className="w-10 h-10 bg-gradient-to-br from-violet-500 via-purple-500 to-indigo-600 rounded-xl flex items-center justify-center">
                  <CpuChipIcon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold">Mindware</h3>
              </div>
              <p className="text-slate-400 mb-6">
                Building the future of business technology with AI-powered solutions.
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
              <h4 className="text-lg font-semibold mb-6">Community</h4>
              <ul className="space-y-3">
                <li><Link href="/forums" className="text-slate-400 hover:text-white transition-colors">Forums</Link></li>
                <li><Link href="/events" className="text-slate-400 hover:text-white transition-colors">Events</Link></li>
                <li><Link href="/experts" className="text-slate-400 hover:text-white transition-colors">Expert Network</Link></li>
                <li><Link href="/learning" className="text-slate-400 hover:text-white transition-colors">Learning Hub</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-6">Resources</h4>
              <ul className="space-y-3">
                <li><Link href="/documentation" className="text-slate-400 hover:text-white transition-colors">Documentation</Link></li>
                <li><Link href="/tutorials" className="text-slate-400 hover:text-white transition-colors">Video Tutorials</Link></li>
                <li><Link href="/blog" className="text-slate-400 hover:text-white transition-colors">Blog</Link></li>
                <li><Link href="/support" className="text-slate-400 hover:text-white transition-colors">Support</Link></li>
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
