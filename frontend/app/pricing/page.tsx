'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { 
  CheckIcon,
  XMarkIcon,
  StarIcon,
  CurrencyRupeeIcon,
  ShoppingCartIcon,
  BuildingStorefrontIcon,
  ArrowLeftIcon,
  SparklesIcon,
  RocketLaunchIcon
} from '@heroicons/react/24/outline'
import Link from 'next/link'

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(true)
  const plans = [
    {
      name: 'Starter',
      icon: ShoppingCartIcon,
      monthlyPrice: 29,
      annualPrice: 24,
      description: 'Perfect for small retail shops and startups',
      features: [
        'Up to 1,000 transactions/month',
        'Basic POS billing',
        'Inventory management',
        'Customer management',
        'Email support',
        'Basic reports',
        'Single location',
        'Mobile app access'
      ],
      notIncluded: [
        'Multi-location support',
        'Advanced analytics',
        'AI fraud detection',
        'Priority support'
      ],
      popular: false,
      color: 'blue'
    },
    {
      name: 'Professional',
      icon: BuildingStorefrontIcon,
      monthlyPrice: 79,
      annualPrice: 65,
      description: 'Ideal for growing businesses with multiple features',
      features: [
        'Up to 10,000 transactions/month',
        'Advanced POS features',
        'Complete inventory management',
        'Customer loyalty programs',
        'Priority email support',
        'Advanced reporting & analytics',
        'Up to 3 locations',
        'Mobile app access',
        'GST compliance',
        'Payment gateway integration',
        'Staff management',
        'Barcode scanning'
      ],
      notIncluded: [
        'AI fraud detection',
        'Custom integrations',
        'Dedicated account manager'
      ],
      popular: true,
      color: 'purple'
    },
    {
      name: 'Enterprise',
      icon: RocketLaunchIcon,
      monthlyPrice: 199,
      annualPrice: 165,
      description: 'Complete solution for large businesses and chains',
      features: [
        'Unlimited transactions',
        'All Professional features',
        'AI-powered fraud detection',
        'Multi-store management',
        'Advanced analytics & insights',
        '24/7 phone & chat support',
        'Unlimited locations',
        'Custom integrations',
        'API access',
        'Dedicated account manager',
        'Custom training sessions',
        'White-label options',
        'Advanced security features',
        'Data export & backup'
      ],
      notIncluded: [],
      popular: false,
      color: 'gradient'
    }
  ]

  const faqs = [
    {
      question: 'Is there a free trial available?',
      answer: 'Yes! We offer a 14-day free trial for all plans. No credit card required to get started.'
    },
    {
      question: 'Can I upgrade or downgrade my plan anytime?',
      answer: 'Absolutely! You can change your plan at any time. Upgrades take effect immediately, and downgrades take effect at the next billing cycle.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards, debit cards, UPI, and bank transfers. All payments are processed securely.'
    },
    {
      question: 'Is there any setup fee or hidden charges?',
      answer: 'No setup fees or hidden charges. The price you see is what you pay. We believe in transparent pricing.'
    },
    {
      question: 'Do you offer discounts for annual billing?',
      answer: 'Yes! Save 20% when you choose annual billing. Contact our sales team for enterprise discounts.'
    },
    {
      question: 'What kind of support do you provide?',
      answer: 'We provide email support for Starter, priority email for Professional, and 24/7 phone & chat support for Enterprise customers.'
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
              <Link href="/contact" className="text-gray-700 hover:text-blue-600 font-medium transition-all duration-300">Contact</Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-8"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full mb-6">
              <CurrencyRupeeIcon className="w-10 h-10 text-blue-600" />
            </div>
          </motion.div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-12">
            Choose the perfect plan for your business. All plans include our core POS features with no hidden fees or setup costs.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center mb-12">
            <span className={`mr-3 text-lg font-medium ${!isAnnual ? 'text-gray-900' : 'text-gray-500'}`}>Monthly</span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isAnnual ? 'bg-blue-600' : 'bg-gray-400'
              }`}
            >
              <span
                className={`${
                  isAnnual ? 'translate-x-6' : 'translate-x-1'
                } inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out`}
              />
            </button>
            <span className={`ml-3 text-lg font-medium ${isAnnual ? 'text-gray-900' : 'text-gray-500'}`}>
              Annual 
              <span className="ml-1 text-sm bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent font-bold">
                (Save 20%)
              </span>
            </span>
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid lg:grid-cols-3 gap-8 mb-20">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
              className={`relative bg-white rounded-2xl p-8 border ${
                plan.popular 
                  ? 'border-blue-400 ring-2 ring-blue-200' 
                  : 'border-gray-200'
              } hover:border-blue-300 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-100`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-full text-sm font-bold flex items-center">
                    <StarIcon className="w-4 h-4 mr-2" />
                    Most Popular
                  </div>
                </div>
              )}

              <div className="text-center mb-8">
                <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center ${
                  plan.color === 'gradient' 
                    ? 'bg-gradient-to-br from-blue-100 to-indigo-100' 
                    : `bg-${plan.color}-100`
                }`}>
                  <plan.icon className={`w-8 h-8 ${
                    plan.color === 'gradient' ? 'text-blue-600' : `text-${plan.color}-600`
                  }`} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-gray-600 text-sm mb-6">{plan.description}</p>
                
                <div className="mb-6">
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl font-bold text-blue-600">
                      ${isAnnual ? plan.annualPrice : plan.monthlyPrice}
                    </span>
                    <span className="text-gray-600 ml-2">/month</span>
                  </div>
                  {isAnnual && plan.monthlyPrice !== plan.annualPrice && (
                    <p className="text-sm text-gray-500 mt-2">
                      Billed annually (${plan.annualPrice * 12}/year)
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-center">
                    <CheckIcon className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
                {plan.notIncluded.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-center opacity-50">
                    <XMarkIcon className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
                    <span className="text-gray-500">{feature}</span>
                  </div>
                ))}
              </div>

              <button
                className={`w-full py-4 px-6 rounded-xl font-semibold transition-all duration-300 ${
                  plan.popular
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl'
                    : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200 hover:border-blue-300'
                } hover:scale-105`}
              >
                Get Started
              </button>
            </motion.div>
          ))}
        </div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-12">
            Frequently Asked Questions
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8 text-left max-w-4xl mx-auto">
            {faqs.slice(0, 4).map((faq, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 border border-gray-200 hover:border-blue-300 transition-all duration-300 hover:shadow-lg">
                <h3 className="text-gray-900 font-semibold text-lg mb-3">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-12 text-white shadow-2xl">
            <SparklesIcon className="w-16 h-16 text-white mx-auto mb-6" />
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of businesses already using Mindware POS. Start your free trial today!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="bg-white text-blue-600 px-10 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
              >
                Start Free Trial
              </Link>
              <Link
                href="/demo"
                className="bg-white/10 backdrop-blur-sm text-white px-10 py-4 rounded-xl font-semibold border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105"
              >
                Request Demo
              </Link>
            </div>
          </div>
        </motion.div>
      </main>

    </div>
  )
}
