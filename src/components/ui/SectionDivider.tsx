'use client'

import React from 'react'

interface SectionDividerProps {
  direction: 'light-to-dark' | 'dark-to-light' | 'light-to-light'
  className?: string
}

/**
 * Premium SVG wave/curve divider between sections with contrasting backgrounds.
 * - light-to-dark: Upper section is light, lower section is dark. Light wave curves into dark navy.
 * - dark-to-light: Upper section is dark, lower section is light. Navy wave curves into light section.
 * - light-to-light: Subtle gold gradient line divider.
 */
export default function SectionDivider({ direction, className = '' }: SectionDividerProps) {
  if (direction === 'light-to-light') {
    return (
      <div className={`relative w-full ${className}`} aria-hidden="true">
        <div className="w-full h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
        <div className="w-full h-6 flex items-center justify-center">
          <div className="w-12 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
        </div>
      </div>
    )
  }

  if (direction === 'light-to-dark') {
    // Upper section is light/white, lower section is dark navy
    return (
      <div className={`relative w-full leading-[0] ${className}`} aria-hidden="true">
        <svg
          viewBox="0 0 1440 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto block"
          preserveAspectRatio="none"
        >
          {/* Light/white background matching upper section */}
          <rect width="1440" height="60" fill="white" fillOpacity="0.97" />
          {/* Dark navy wave rising from the bottom */}
          <path
            d="M0 38C160 42 320 50 480 46C640 42 800 30 960 28C1120 26 1280 34 1440 38L1440 60L0 60Z"
            fill="#0D1B3D"
          />
          {/* Subtle gold accent line along the wave */}
          <path
            d="M0 38C160 42 320 50 480 46C640 42 800 30 960 28C1120 26 1280 34 1440 38"
            stroke="#C9A227"
            strokeOpacity="0.18"
            strokeWidth="0.75"
            fill="none"
          />
        </svg>
      </div>
    )
  }

  // dark-to-light: Upper section is dark navy, lower section is light
  return (
    <div className={`relative w-full leading-[0] ${className}`} aria-hidden="true">
      <svg
        viewBox="0 0 1440 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto block"
        preserveAspectRatio="none"
      >
        {/* Navy background matching upper section */}
        <rect width="1440" height="60" fill="#0D1B3D" />
        {/* Light wave rising from the bottom */}
        <path
          d="M0 38C160 34 320 26 480 28C640 30 800 44 960 46C1120 48 1280 38 1440 34L1440 60L0 60Z"
          fill="white"
          fillOpacity="0.97"
        />
        {/* Subtle gold accent line along the wave */}
        <path
          d="M0 38C160 34 320 26 480 28C640 30 800 44 960 46C1120 48 1280 38 1440 34"
          stroke="#C9A227"
          strokeOpacity="0.2"
          strokeWidth="0.75"
          fill="none"
        />
      </svg>
    </div>
  )
}
