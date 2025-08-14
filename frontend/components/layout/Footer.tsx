'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  CpuChipIcon,
  StarIcon,
  BuildingStorefrontIcon,
  UserGroupIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  GlobeAltIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon
} from '@heroicons/react/24/outline'

export default function Footer() {
  return (
    <motion.footer 
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      viewport={{ once: true }}
      className="bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white relative overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 2px, transparent 2px)',
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Company Info */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-500 rounded-xl flex items-center justify-center">
                  <CpuChipIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
                    Mindware
                  </h3>
                  <p className="text-sm text-slate-300">The Future of Business</p>
                </div>
              </div>
              
              <p className="text-slate-300 leading-relaxed">
                Revolutionizing business operations with AI-powered POS solutions, cloud-native architecture, and enterprise-grade security.
              </p>
              
              <div className="flex items-center space-x-2">
                <div className="flex -space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <StarIcon key={star} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <span className="text-sm text-slate-300">5.0 Rating</span>
              </div>
            </div>

            {/* Solutions */}
            <div className="space-y-6">
              <h4 className="text-lg font-semibold text-white">Solutions</h4>
              <ul className="space-y-3">
                <li>
                  <Link href="/pos" className="text-slate-300 hover:text-blue-400 transition-colors flex items-center space-x-2">
                    <BuildingStorefrontIcon className="w-4 h-4" />
                    <span>POS System</span>
                  </Link>
                </li>
                <li>
                  <Link href="/erp" className="text-slate-300 hover:text-blue-400 transition-colors flex items-center space-x-2">
                    <ChartBarIcon className="w-4 h-4" />
                    <span>ERP System</span>
                  </Link>
                </li>
                <li>
                  <Link href="/crm" className="text-slate-300 hover:text-blue-400 transition-colors flex items-center space-x-2">
                    <UserGroupIcon className="w-4 h-4" />
                    <span>CRM System</span>
                  </Link>
                </li>
                <li>
                  <Link href="/inventory" className="text-slate-300 hover:text-blue-400 transition-colors flex items-center space-x-2">
                    <ChartBarIcon className="w-4 h-4" />
                    <span>Inventory Management</span>
                  </Link>
                </li>
                <li>
                  <Link href="/cloud" className="text-slate-300 hover:text-blue-400 transition-colors flex items-center space-x-2">
                    <GlobeAltIcon className="w-4 h-4" />
                    <span>Cloud Solutions</span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Industries */}
            <div className="space-y-6">
              <h4 className="text-lg font-semibold text-white">Industries</h4>
              <ul className="space-y-3">
                <li>
                  <Link href="/retail" className="text-slate-300 hover:text-blue-400 transition-colors">
                    Retail & Supermarkets
                  </Link>
                </li>
                <li>
                  <Link href="/restaurants" className="text-slate-300 hover:text-blue-400 transition-colors">
                    Restaurants & QSR
                  </Link>
                </li>
                <li>
                  <Link href="/pharmacy" className="text-slate-300 hover:text-blue-400 transition-colors">
                    Pharmacy & Healthcare
                  </Link>
                </li>
                <li>
                  <Link href="/jewelry" className="text-slate-300 hover:text-blue-400 transition-colors">
                    Jewelry & Luxury
                  </Link>
                </li>
                <li>
                  <Link href="/services" className="text-slate-300 hover:text-blue-400 transition-colors">
                    Service Providers
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact & Support */}
            <div className="space-y-6">
              <h4 className="text-lg font-semibold text-white">Contact & Support</h4>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <PhoneIcon className="w-5 h-5 text-blue-400" />
                  <div>
                    <p className="text-white font-medium">24/7 Support</p>
                    <p className="text-slate-300 text-sm">+1 (555) 123-4567</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <EnvelopeIcon className="w-5 h-5 text-blue-400" />
                  <div>
                    <p className="text-white font-medium">Email Us</p>
                    <p className="text-slate-300 text-sm">support@mindware.com</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <MapPinIcon className="w-5 h-5 text-blue-400" />
                  <div>
                    <p className="text-white font-medium">Headquarters</p>
                    <p className="text-slate-300 text-sm">Silicon Valley, CA</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-700 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-6">
              <p className="text-slate-400 text-sm">
                © 2024 Mindware Technologies. All rights reserved.
              </p>
              <div className="flex items-center space-x-4">
                <Link href="/privacy" className="text-slate-400 hover:text-blue-400 transition-colors text-sm">
                  Privacy Policy
                </Link>
                <Link href="/terms" className="text-slate-400 hover:text-blue-400 transition-colors text-sm">
                  Terms of Service
                </Link>
                <Link href="/cookies" className="text-slate-400 hover:text-blue-400 transition-colors text-sm">
                  Cookie Policy
                </Link>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-slate-400 text-sm">99.9% Uptime</span>
              </div>
              <div className="flex items-center space-x-2">
                <ShieldCheckIcon className="w-4 h-4 text-green-400" />
                <span className="text-slate-400 text-sm">Enterprise Security</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.footer>
  )
}
