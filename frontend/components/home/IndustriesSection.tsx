'use client'

import { motion } from 'framer-motion'
import { 
  BuildingStorefrontIcon,
  ClipboardDocumentListIcon,
  CubeIcon,
  StarIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline'

export default function IndustriesSection() {
  const industries = [
    { 
      name: 'Retail & Supermarkets', 
      icon: BuildingStorefrontIcon, 
      description: 'High-volume transactions with AI inventory management',
      color: 'from-blue-400 via-cyan-400 to-teal-400',
      bgColor: 'from-blue-50/60 to-cyan-50/60'
    },
    { 
      name: 'Restaurants & QSR', 
      icon: ClipboardDocumentListIcon, 
      description: 'Table management, kitchen integration, order customization',
      color: 'from-orange-400 via-red-400 to-pink-400',
      bgColor: 'from-orange-50/60 to-red-50/60'
    },
    { 
      name: 'Pharmacy & Healthcare', 
      icon: CubeIcon, 
      description: 'Prescription management, drug interactions, compliance',
      color: 'from-green-400 via-emerald-400 to-teal-400',
      bgColor: 'from-green-50/60 to-emerald-50/60'
    },
    { 
      name: 'Jewelry & Luxury', 
      icon: StarIcon, 
      description: 'Serial number tracking, repair management, customization',
      color: 'from-purple-400 via-pink-400 to-rose-400',
      bgColor: 'from-purple-50/60 to-pink-50/60'
    },
    { 
      name: 'Service Providers', 
      icon: UserGroupIcon, 
      description: 'Appointment scheduling, membership management, packages',
      color: 'from-indigo-400 via-blue-400 to-cyan-400',
      bgColor: 'from-indigo-50/60 to-blue-50/60'
    }
  ]

  return (
    <section className="py-20 relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-slate-900 mb-6"
          >
            Built for{' '}
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Every Industry
            </span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-xl text-slate-600 max-w-3xl mx-auto"
          >
            Tailored solutions designed to meet the unique challenges and requirements of your specific industry
          </motion.p>
        </div>

        {/* Industries Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {industries.map((industry, index) => (
            <motion.div
              key={industry.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group relative bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-white/60 hover:border-white/80 transition-all duration-300 hover:shadow-xl hover:shadow-black/20 hover:-translate-y-2"
            >
              {/* Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${industry.bgColor} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
              
              {/* Content */}
              <div className="relative z-10">
                {/* Icon */}
                <div className={`w-16 h-16 bg-gradient-to-r ${industry.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <industry.icon className="w-8 h-8 text-white" />
                </div>
                
                {/* Title */}
                <h3 className="text-xl font-bold text-slate-800 mb-4 group-hover:text-slate-900 transition-colors">
                  {industry.name}
                </h3>
                
                {/* Description */}
                <p className="text-slate-600 leading-relaxed group-hover:text-slate-700 transition-colors">
                  {industry.description}
                </p>
                
                {/* Hover Effect */}
                <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-white/20 transition-all duration-300"></div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Ready to Transform Your Business?</h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Join thousands of businesses already using Mindware POS to streamline operations and boost profitability
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <button className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-colors">
                Get Started Today
              </button>
              <button className="px-8 py-3 border-2 border-white/30 text-white font-semibold rounded-xl hover:bg-white/10 transition-colors">
                Schedule Demo
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
