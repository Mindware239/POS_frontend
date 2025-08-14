'use client'

import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import HeroSection from '@/components/home/HeroSection'
import FeaturesSection from '@/components/home/FeaturesSection'
import IndustriesSection from '@/components/home/IndustriesSection'
import TestimonialsSection from '@/components/home/TestimonialsSection'
import FloatingElements from '@/components/home/FloatingElements'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 relative overflow-hidden">
      {/* Background Floating Elements */}
      <FloatingElements />
      
      {/* Header */}
      <Header />
      
      {/* Main Content */}
      <main className="pt-16 relative">
        {/* Hero Section */}
        <HeroSection />
        
        {/* Features Section */}
        <FeaturesSection />
        
        {/* Industries Section */}
        <IndustriesSection />
        
        {/* Testimonials Section */}
        <TestimonialsSection />
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  )
}