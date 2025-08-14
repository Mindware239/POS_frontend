'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  variant?: 'default' | 'glass' | 'gradient' | 'elevated'
  className?: string
  hover?: boolean
  onClick?: () => void
  href?: string
}

export default function Card({
  children,
  variant = 'default',
  className = '',
  hover = true,
  onClick,
  href
}: CardProps) {
  const baseClasses = "relative overflow-hidden transition-all duration-300"
  
  const variants = {
    default: "bg-white border border-slate-200 shadow-sm hover:shadow-md",
    glass: "bg-white/80 backdrop-blur-sm border border-white/60 hover:border-white/80",
    gradient: "bg-gradient-to-br from-white/90 to-slate-50/90 border border-white/60",
    elevated: "bg-white shadow-lg hover:shadow-xl border border-slate-100"
  }
  
  const hoverClasses = hover ? "hover:-translate-y-1 hover:shadow-xl" : ""
  const classes = `${baseClasses} ${variants[variant]} ${hoverClasses} ${className}`
  
  const content = (
    <motion.div
      className={classes}
      whileHover={hover ? { scale: 1.02 } : {}}
      whileTap={onClick ? { scale: 0.98 } : {}}
      onClick={onClick}
    >
      {children}
    </motion.div>
  )
  
  if (href) {
    return (
      <motion.a
        href={href}
        className={classes}
        whileHover={hover ? { scale: 1.02 } : {}}
        whileTap={{ scale: 0.98 }}
      >
        {children}
      </motion.a>
    )
  }
  
  return content
}
