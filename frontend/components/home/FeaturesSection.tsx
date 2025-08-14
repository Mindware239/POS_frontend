'use client'

import { motion } from 'framer-motion'
import { 
  CpuChipIcon,
  BoltIcon,
  ShieldCheckIcon,
  GlobeAltIcon,
  BuildingStorefrontIcon,
  TruckIcon,
  CogIcon,
  ChartBarIcon,
  CreditCardIcon,
  UserGroupIcon,
  CheckIcon
} from '@heroicons/react/24/outline'

export default function FeaturesSection() {
  const headerFeatures = [
    {
      icon: CpuChipIcon,
      title: "AI-Powered Intelligence",
      description: "Machine learning algorithms that predict demand, optimize inventory, and provide personalized customer insights.",
      color: "from-violet-400 to-purple-500",
      bgColor: "from-violet-50/80 to-purple-50/80",
      isNew: true
    },
    {
      icon: BoltIcon,
      title: "Lightning Fast Performance",
      description: "Process transactions in milliseconds with our optimized interface designed for maximum speed and efficiency.",
      color: "from-blue-400 to-cyan-500",
      bgColor: "from-blue-50/80 to-cyan-50/80",
      isNew: false
    },
    {
      icon: ShieldCheckIcon,
      title: "Advanced Security",
      description: "Enterprise-grade security with real-time fraud detection and encrypted data protection.",
      color: "from-emerald-400 to-green-500",
      bgColor: "from-emerald-50/80 to-green-50/80",
      isNew: true
    },
    {
      icon: GlobeAltIcon,
      title: "Cloud-Native Architecture",
      description: "Access your business from anywhere with real-time synchronization and unlimited scalability.",
      color: "from-indigo-400 to-blue-500",
      bgColor: "from-indigo-50/80 to-blue-50/80",
      isNew: false
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
    <section className="py-20 relative">
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
              <CpuChipIcon className="w-10 h-10 text-white" />
            </div>
          </div>

          {/* Main Headline with DARK TEXT for PERFECT VISIBILITY */}
          <h2 className="text-5xl md:text-6xl font-black mb-4 leading-tight">
            <span className="text-slate-900 drop-shadow-sm">
              Drive Your Business
            </span>
            <br />
            <span className="text-violet-800 drop-shadow-sm">
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
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
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
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
