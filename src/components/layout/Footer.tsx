'use client'

import React from 'react'
import { Phone, Mail, MapPin } from 'lucide-react'
import { useNavigationStore } from '@/lib/store'

const services = [
  'Brochures & Catalogues',
  'Wedding Cards',
  'Mono Cartons',
  'Visiting Cards',
  'Bill Books',
  'T-Shirt Printing',
]

const specialties = [
  'Foil Stamping',
  'Embossing',
  'UV & Spot UV',
  'Lamination',
  'Die-Cutting',
  'Binding',
]

export default function Footer() {
  const { navigate } = useNavigationStore()

  return (
    <footer className="mt-auto relative" style={{ backgroundColor: '#0B1628' }}>
      {/* Subtle gold gradient top border */}
      <div
        className="h-px"
        style={{
          background:
            'linear-gradient(to right, transparent, #C9A227, transparent)',
        }}
      />

      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-12 md:py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Column 1: Brand Info */}
          <div className="sm:col-span-2 lg:col-span-1">
            {/* Brand name */}
            <h3
              className="text-2xl font-bold tracking-tight mb-1"
              style={{
                fontFamily: 'var(--font-display), "Playfair Display", Georgia, serif',
                color: '#E2E8F0',
              }}
            >
              Murlidhar Offset
            </h3>

            {/* Tagline */}
            <p
              className="text-xs uppercase tracking-[0.25em] mb-5"
              style={{ color: '#C9A227' }}
            >
              The Craft of Print
            </p>

            {/* Quote */}
            <p
              className="text-sm italic leading-relaxed mb-4"
              style={{
                fontFamily: 'var(--font-display), "Playfair Display", Georgia, serif',
                color: '#94A3B8',
              }}
            >
              &ldquo;Where ink meets intention, and paper becomes a keepsake.&rdquo;
            </p>

            {/* Description */}
            <p className="text-sm leading-relaxed" style={{ color: '#64748B' }}>
              A Gujarat-based offset printing house, serving Indian businesses
              with patience and precision.
            </p>
          </div>

          {/* Column 2: Services */}
          <div>
            <h4
              className="text-xs uppercase tracking-[0.2em] font-semibold mb-5"
              style={{ color: '#C9A227' }}
            >
              Services
            </h4>
            <ul className="space-y-2.5">
              {services.map((service) => (
                <li key={service}>
                  <button
                    onClick={() => navigate('products')}
                    className="text-sm transition-colors duration-200 hover:text-[#E2E8F0] text-left"
                    style={{ color: '#94A3B8' }}
                  >
                    {service}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Specialty */}
          <div>
            <h4
              className="text-xs uppercase tracking-[0.2em] font-semibold mb-5"
              style={{ color: '#C9A227' }}
            >
              Specialty
            </h4>
            <ul className="space-y-2.5">
              {specialties.map((specialty) => (
                <li key={specialty}>
                  <button
                    onClick={() => navigate('products')}
                    className="text-sm transition-colors duration-200 hover:text-[#E2E8F0] text-left"
                    style={{ color: '#94A3B8' }}
                  >
                    {specialty}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Get In Touch */}
          <div>
            <h4
              className="text-xs uppercase tracking-[0.2em] font-semibold mb-5"
              style={{ color: '#C9A227' }}
            >
              Get In Touch
            </h4>
            <ul className="space-y-4">
              {/* Phone */}
              <li className="flex items-start gap-3">
                <Phone
                  className="size-4 shrink-0 mt-0.5"
                  style={{ color: '#C9A227' }}
                />
                <div>
                  <a
                    href="tel:+919510737852"
                    className="text-sm transition-colors duration-200 hover:text-[#E2E8F0] block"
                    style={{ color: '#94A3B8' }}
                  >
                    +91 95107 37852
                  </a>
                  <span className="text-xs" style={{ color: '#64748B' }}>
                    Call or WhatsApp
                  </span>
                </div>
              </li>

              {/* Email */}
              <li className="flex items-start gap-3">
                <Mail
                  className="size-4 shrink-0 mt-0.5"
                  style={{ color: '#C9A227' }}
                />
                <div>
                  <a
                    href="mailto:murlidharoffset84@gmail.com"
                    className="text-sm transition-colors duration-200 hover:text-[#E2E8F0] block"
                    style={{ color: '#94A3B8' }}
                  >
                    murlidharoffset84@gmail.com
                  </a>
                  <span className="text-xs" style={{ color: '#64748B' }}>
                    Send your brief
                  </span>
                </div>
              </li>

              {/* Location */}
              <li className="flex items-start gap-3">
                <MapPin
                  className="size-4 shrink-0 mt-0.5"
                  style={{ color: '#C9A227' }}
                />
                <div>
                  <p className="text-sm" style={{ color: '#94A3B8' }}>
                    Gujarat, India
                  </p>
                  <span className="text-xs" style={{ color: '#64748B' }}>
                    Visit us by appointment
                  </span>
                </div>
              </li>
            </ul>

            {/* Internal navigation links */}
            <div className="mt-6 pt-5" style={{ borderTop: '1px solid #1E3048' }}>
              <div className="flex flex-wrap gap-x-4 gap-y-1.5">
                <button
                  onClick={() => navigate('about')}
                  className="text-xs transition-colors duration-200 hover:text-[#E2E8F0]"
                  style={{ color: '#64748B' }}
                >
                  About
                </button>
                <button
                  onClick={() => navigate('contact')}
                  className="text-xs transition-colors duration-200 hover:text-[#E2E8F0]"
                  style={{ color: '#64748B' }}
                >
                  Contact
                </button>
                <button
                  onClick={() => navigate('products')}
                  className="text-xs transition-colors duration-200 hover:text-[#E2E8F0]"
                  style={{ color: '#64748B' }}
                >
                  Products
                </button>
                <button
                  onClick={() => navigate('order-tracking')}
                  className="text-xs transition-colors duration-200 hover:text-[#E2E8F0]"
                  style={{ color: '#64748B' }}
                >
                  Track Order
                </button>
                <button
                  onClick={() => navigate('admin')}
                  className="text-xs transition-colors duration-200 hover:text-[#E2E8F0]"
                  style={{ color: '#64748B' }}
                >
                  Admin
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="py-5 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-0"
          style={{ borderTop: '1px solid #1E3048' }}
        >
          <p className="text-xs" style={{ color: '#64748B' }}>
            © 2026 Murlidhar Offset. All rights reserved. Crafted with care ·
            Made in Gujarat
          </p>
        </div>
      </div>
    </footer>
  )
}
