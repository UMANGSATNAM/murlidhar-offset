'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { MessageCircle } from 'lucide-react'

export default function WhatsAppButton() {
  const whatsappNumber = '919876543210'
  const message = encodeURIComponent(
    'Hello! I am interested in your printing services. Can you help me?'
  )

  return (
    <motion.a
      href={`https://wa.me/${whatsappNumber}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1.5, type: 'spring', stiffness: 200 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      {/* Pulse ring */}
      <span className="absolute inset-0 rounded-full bg-green-500/40 animate-ping" />
      <span className="absolute inset-0 rounded-full bg-green-500/20 animate-pulse" />

      {/* Button */}
      <span className="relative w-14 h-14 rounded-full bg-green-500 flex items-center justify-center shadow-lg hover:shadow-green-500/30 transition-shadow duration-300">
        <MessageCircle className="size-7 text-white fill-white" />
      </span>

      {/* Tooltip */}
      <span className="absolute right-full mr-3 bg-white text-navy text-xs font-medium px-3 py-1.5 rounded-lg premium-shadow whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
        Chat with us!
      </span>
    </motion.a>
  )
}
