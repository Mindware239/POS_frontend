'use client'

import { motion } from 'framer-motion'

export default function FloatingElements() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      <motion.div
        animate={{ 
          y: [0, -30, 0],
          rotate: [0, 10, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{ 
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-20 left-10 w-40 h-40 bg-gradient-to-br from-violet-200/30 via-purple-200/30 to-indigo-200/30 rounded-full blur-3xl"
      />
      <motion.div
        animate={{ 
          y: [0, 25, 0],
          rotate: [0, -8, 0],
          scale: [1, 0.9, 1]
        }}
        transition={{ 
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-40 right-20 w-32 h-32 bg-gradient-to-br from-green-200/30 via-cyan-200/30 to-blue-200/30 rounded-full blur-3xl"
      />
      <motion.div
        animate={{ 
          y: [0, -20, 0],
          scale: [1, 1.2, 1],
          rotate: [0, 5, 0]
        }}
        transition={{ 
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute bottom-20 left-1/4 w-28 h-28 bg-gradient-to-br from-orange-200/30 via-red-200/30 to-pink-200/30 rounded-full blur-3xl"
      />
      <motion.div
        animate={{ 
          y: [0, 15, 0],
          rotate: [0, -3, 0],
          scale: [1, 0.8, 1]
        }}
        transition={{ 
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-1/2 right-1/3 w-24 h-24 bg-gradient-to-br from-indigo-200/20 via-blue-200/20 to-cyan-200/20 rounded-full blur-3xl"
      />
    </div>
  )
}
