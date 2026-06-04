'use client'

import React from 'react'
import { motion } from 'framer-motion'
import {
  Printer,
  Phone,
  Mail,
  MapPin,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  ArrowRight,
} from 'lucide-react'
import { useNavigationStore } from '@/lib/store'

const quickLinks = [
  { label: 'All Products', page: 'products' as const },
  { label: 'Business Cards', page: 'products' as const, categorySlug: 'business-cards' },
  { label: 'Wedding Cards', page: 'products' as const, categorySlug: 'wedding-cards' },
  { label: 'Brochures & Flyers', page: 'products' as const, categorySlug: 'brochures' },
  { label: 'Packaging', page: 'products' as const, categorySlug: 'packaging' },
]

const services = [
  'Offset Printing',
  'Digital Printing',
  'Custom Design',
  'Bulk Orders',
  'GST Invoicing',
  'Pan-India Delivery',
]

const socialLinks = [
  { icon: Facebook, href: '#', label: 'Facebook' },
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
  { icon: Twitter, href: '#', label: 'Twitter' },
]

export default function Footer() {
  const { navigate } = useNavigationStore()

  return (
    <footer className="bg-navy-dark text-white mt-auto">
      {/* Gold divider */}
      <div className="gold-divider" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main footer content */}
        <div className="py-12 md:py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Brand column */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-10 h-10 rounded-lg gold-gradient flex items-center justify-center premium-shadow">
                <Printer className="size-5 text-navy" />
              </div>
              <div>
                <h3 className="font-bold text-lg leading-tight">Murlidhar</h3>
                <span className="text-gold text-xs tracking-[0.2em] uppercase font-medium">
                  Offset
                </span>
              </div>
            </div>
            <p className="text-white/60 text-sm leading-relaxed mb-6">
              Where Every Print Tells a Story. Gujarat&apos;s trusted printing
              press delivering premium quality offset and digital printing
              solutions since 2009.
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-gold hover:border-gold/30 hover:bg-gold/5 transition-all duration-200"
                >
                  <social.icon className="size-4" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-gold font-semibold text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
              Quick Links
              <span className="flex-1 h-px bg-gradient-to-r from-gold/30 to-transparent" />
            </h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() =>
                      navigate(link.page, {
                        categorySlug: link.categorySlug ?? null,
                      })
                    }
                    className="text-white/60 text-sm hover:text-gold transition-colors duration-200 flex items-center gap-1.5 group"
                  >
                    <ArrowRight className="size-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200 text-gold" />
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-gold font-semibold text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
              Our Services
              <span className="flex-1 h-px bg-gradient-to-r from-gold/30 to-transparent" />
            </h4>
            <ul className="space-y-2.5">
              {services.map((service) => (
                <li key={service}>
                  <span className="text-white/60 text-sm flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-gold/50" />
                    {service}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-gold font-semibold text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
              Contact Us
              <span className="flex-1 h-px bg-gradient-to-r from-gold/30 to-transparent" />
            </h4>
            <ul className="space-y-3.5">
              <li className="flex items-start gap-3">
                <MapPin className="size-4 text-gold shrink-0 mt-0.5" />
                <span className="text-white/60 text-sm leading-relaxed">
                  Industrial Area, Rajkot,
                  <br />
                  Gujarat, India - 360002
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="size-4 text-gold shrink-0" />
                <a
                  href="tel:+919876543210"
                  className="text-white/60 text-sm hover:text-gold transition-colors"
                >
                  +91 98765 43210
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="size-4 text-gold shrink-0" />
                <a
                  href="mailto:info@murlidharoffset.com"
                  className="text-white/60 text-sm hover:text-gold transition-colors"
                >
                  info@murlidharoffset.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/40 text-xs">
            © {new Date().getFullYear()} Murlidhar Offset. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-white/40 text-xs">
            <button className="hover:text-gold transition-colors">
              Privacy Policy
            </button>
            <span>|</span>
            <button className="hover:text-gold transition-colors">
              Terms of Service
            </button>
            <span>|</span>
            <button className="hover:text-gold transition-colors">
              Refund Policy
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}
