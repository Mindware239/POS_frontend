'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDownIcon } from '@heroicons/react/24/outline'

interface DropdownItem {
  label: string
  href?: string
  onClick?: () => void
  icon?: React.ReactNode
  description?: string
  disabled?: boolean
}

interface DropdownProps {
  trigger: React.ReactNode
  items: DropdownItem[]
  className?: string
  align?: 'left' | 'right' | 'center'
  width?: 'sm' | 'md' | 'lg' | 'xl'
}

export default function Dropdown({
  trigger,
  items,
  className = '',
  align = 'left',
  width = 'md'
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const widthClasses = {
    sm: 'w-48',
    md: 'w-64',
    lg: 'w-80',
    xl: 'w-96'
  }

  const alignClasses = {
    left: 'left-0',
    right: 'right-0',
    center: 'left-1/2 transform -translate-x-1/2'
  }

  return (
    <div className={`relative inline-block ${className}`} ref={dropdownRef}>
      {/* Trigger */}
      <div
        className="cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        {trigger}
      </div>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={`absolute top-full mt-2 ${widthClasses[width]} ${alignClasses[align]} z-50`}
          >
            <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
              <div className="py-2">
                {items.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                  >
                    {item.href ? (
                      <a
                        href={item.href}
                        className={`flex items-center space-x-3 px-4 py-3 text-sm hover:bg-blue-50 transition-colors ${
                          item.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                        }`}
                        onClick={() => setIsOpen(false)}
                      >
                        {item.icon && <span className="text-blue-600">{item.icon}</span>}
                        <div>
                          <div className="font-medium text-slate-800">{item.label}</div>
                          {item.description && (
                            <div className="text-xs text-slate-500">{item.description}</div>
                          )}
                        </div>
                      </a>
                    ) : (
                      <button
                        onClick={() => {
                          item.onClick?.()
                          setIsOpen(false)
                        }}
                        disabled={item.disabled}
                        className={`w-full flex items-center space-x-3 px-4 py-3 text-sm hover:bg-blue-50 transition-colors text-left ${
                          item.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                        }`}
                      >
                        {item.icon && <span className="text-blue-600">{item.icon}</span>}
                        <div>
                          <div className="font-medium text-slate-800">{item.label}</div>
                          {item.description && (
                            <div className="text-xs text-slate-500">{item.description}</div>
                          )}
                        </div>
                      </button>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
