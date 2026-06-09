'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BookOpen,
  Megaphone,
  BookMarked,
  CalendarDays,
  CreditCard,
  FileText,
  Mail,
  Receipt,
  Package,
  Tag,
  Sticker,
  Heart,
  PartyPopper,
  Maximize2,
  Palette,
  Shirt,
  ChevronDown,
  Check,
  Filter,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu'

// ─── Service Data ───────────────────────────────────────────

type ServiceCategory = 'all' | 'commercial' | 'stationery' | 'packaging' | 'events' | 'branding'

interface Service {
  id: number
  title: string
  description: string
  icon: React.ElementType
  category: ServiceCategory[]
}

const services: Service[] = [
  {
    id: 1,
    title: 'Brochure Printing',
    description: 'Bi-fold, tri-fold, gate-fold and saddle-stitched — for product catalogues, corporate decks and showcase booklets.',
    icon: BookOpen,
    category: ['all', 'commercial'],
  },
  {
    id: 2,
    title: 'Flyers & Pamphlets',
    description: 'Single-leaf and folded leaflets for promotions, festivals, real-estate launches and door-drop campaigns.',
    icon: Megaphone,
    category: ['all', 'commercial'],
  },
  {
    id: 3,
    title: 'Catalogues & Books',
    description: 'Perfect-bound product catalogues, lookbooks and annual reports printed on premium paper stocks.',
    icon: BookMarked,
    category: ['all', 'commercial'],
  },
  {
    id: 4,
    title: 'Festival & Promo Posters',
    description: 'Diwali, Navratri, brand campaigns and storefront posters — printed at striking sizes with vivid colour.',
    icon: CalendarDays,
    category: ['all', 'events'],
  },
  {
    id: 5,
    title: 'Visiting Cards',
    description: 'From clean matte business cards to rounded-corner, foil-stamped, suede-laminated calling cards.',
    icon: CreditCard,
    category: ['all', 'stationery'],
  },
  {
    id: 6,
    title: 'Letterheads',
    description: 'A4 corporate letterheads on Bond, Conqueror or executive-grade paper — single or two-colour pre-print.',
    icon: FileText,
    category: ['all', 'stationery'],
  },
  {
    id: 7,
    title: 'Envelopes',
    description: 'Window, regular, cloth-lined and custom-size envelopes — printed and pasted in-house.',
    icon: Mail,
    category: ['all', 'stationery'],
  },
  {
    id: 8,
    title: 'Bill Books & Invoices',
    description: 'Carbonless duplicate & triplicate bill books, numbered, perforated and bound for daily business use.',
    icon: Receipt,
    category: ['all', 'commercial'],
  },
  {
    id: 9,
    title: 'Mono Cartons & Boxes',
    description: 'Folding cartons and product boxes for FMCG, pharma and beauty — die-cut, glued and quality-checked.',
    icon: Package,
    category: ['all', 'packaging'],
  },
  {
    id: 10,
    title: 'Product Labels',
    description: 'High-resolution paper, vinyl and metallised labels — pharmaceutical, food, beverage and industrial use.',
    icon: Tag,
    category: ['all', 'packaging'],
  },
  {
    id: 11,
    title: 'Stickers',
    description: 'Die-cut, kiss-cut and roll-form stickers — gloss, matte, transparent and holographic finishes.',
    icon: Sticker,
    category: ['all', 'packaging'],
  },
  {
    id: 12,
    title: 'Wedding Cards',
    description: 'Traditional, modern, foil-stamped and laser-cut wedding stationery — set in Gujarati, Hindi or English.',
    icon: Heart,
    category: ['all', 'events'],
  },
  {
    id: 13,
    title: 'Invitation Cards',
    description: 'Engagement, housewarming, mundan, satsang & corporate invitations — printed on premium card stock.',
    icon: PartyPopper,
    category: ['all', 'events'],
  },
  {
    id: 14,
    title: 'Flex & Vinyl Banners',
    description: 'Hoardings, store backdrops, wedding stage banners — large-format prints in vivid weather-tough colour.',
    icon: Maximize2,
    category: ['all', 'events'],
  },
  {
    id: 15,
    title: 'Logo & Identity Design',
    description: 'Brand marks, full identity systems and print-ready artwork — ready for every surface that follows.',
    icon: Palette,
    category: ['all', 'branding'],
  },
  {
    id: 16,
    title: 'T-Shirt Printing',
    description: 'Screen, DTF and sublimation printing for staff uniforms, event tees, college merch and brand drops.',
    icon: Shirt,
    category: ['all', 'branding'],
  },
]

const categoryTabs: { key: ServiceCategory; label: string }[] = [
  { key: 'all', label: 'All Services' },
  { key: 'commercial', label: 'Commercial' },
  { key: 'stationery', label: 'Stationery' },
  { key: 'packaging', label: 'Packaging' },
  { key: 'events', label: 'Events' },
  { key: 'branding', label: 'Branding' },
]

// ─── Animation Variants ─────────────────────────────────────

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.1,
    },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1],
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.2 },
  },
}

// ─── Component ──────────────────────────────────────────────

export default function PopularCategories() {
  const [activeCategory, setActiveCategory] = useState<ServiceCategory>('all')

  const filteredServices =
    activeCategory === 'all'
      ? services
      : services.filter((s) => s.category.includes(activeCategory))

  return (
    <section
      className="py-16 md:py-24 relative"
      style={{ backgroundColor: '#0D1A2E' }}
    >
      {/* Top ink-line divider */}
      <div className="absolute top-0 left-0 right-0 ink-line" />

      {/* Subtle background pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            'radial-gradient(circle, rgba(201,162,39,0.5) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* ── Section Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-12 md:mb-16"
        >
          {/* Small gold label */}
          <div className="inline-flex items-center gap-2 mb-5">
            <span className="h-px w-8 bg-gradient-to-r from-transparent to-[#C9A227]/60" />
            <span className="text-[#C9A227] text-xs font-semibold uppercase tracking-[0.2em]">
              Our Services
            </span>
            <span className="h-px w-8 bg-gradient-to-l from-transparent to-[#C9A227]/60" />
          </div>

          {/* Heading — Playfair Display serif */}
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#E2E8F0] mb-5"
            style={{ fontFamily: "var(--font-display), 'Playfair Display', ui-serif, Georgia, serif" }}
          >
            What We Print
          </h2>

          {/* Gold underline accent */}
          <div className="flex justify-center mb-6">
            <div className="h-[2px] w-16 bg-gradient-to-r from-transparent via-[#C9A227] to-transparent" />
          </div>

          {/* Subheading */}
          <p className="text-[#94A3B8] text-sm sm:text-base md:text-lg max-w-3xl mx-auto leading-relaxed">
            A complete printing studio, under one roof. From the smallest visiting card to a
            thousand-unit packaging run, our services cover every category an Indian business
            needs — designed, printed, and finished in-house.
          </p>
        </motion.div>

        {/* ── Category Filter Dropdown ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="flex justify-center mb-10 md:mb-14"
        >
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="
                  group inline-flex items-center gap-2.5 px-5 sm:px-6 py-2.5 sm:py-3
                  rounded-full text-sm sm:text-base font-medium cursor-pointer
                  bg-[#162032] border border-[#1E3048]
                  hover:border-[#C9A227]/50
                  transition-all duration-300
                  focus:outline-none focus:ring-2 focus:ring-[#C9A227]/30 focus:ring-offset-2 focus:ring-offset-[#0D1A2E]
                "
              >
                <Filter className="w-4 h-4 text-[#C9A227]" />
                <span className="text-[#E2E8F0]">
                  {categoryTabs.find((t) => t.key === activeCategory)?.label || 'All Services'}
                </span>
                <ChevronDown className="w-4 h-4 text-[#94A3B8] group-data-[state=open]:rotate-180 transition-transform duration-200" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="center"
              className="w-56 bg-[#162032] border-[#1E3048] rounded-xl shadow-xl shadow-black/40 p-1.5"
            >
              <DropdownMenuLabel className="text-[#64748B] text-xs uppercase tracking-widest px-2.5 py-2">
                Filter by Category
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-[#1E3048]" />
              {categoryTabs.map((tab) => {
                const isActive = activeCategory === tab.key
                return (
                  <DropdownMenuItem
                    key={tab.key}
                    onClick={() => setActiveCategory(tab.key)}
                    className={`
                      flex items-center justify-between rounded-lg px-3 py-2.5 my-0.5 cursor-pointer
                      transition-colors duration-150
                      ${
                        isActive
                          ? 'bg-[#C9A227]/15 text-[#C9A227] focus:bg-[#C9A227]/20 focus:text-[#C9A227]'
                          : 'text-[#94A3B8] hover:bg-[#1E3048]/60 hover:text-[#E2E8F0] focus:bg-[#1E3048]/60 focus:text-[#E2E8F0]'
                      }
                    `}
                  >
                    <span className="text-sm font-medium">{tab.label}</span>
                    {isActive && (
                      <Check className="w-4 h-4 text-[#C9A227]" />
                    )}
                  </DropdownMenuItem>
                )
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </motion.div>

        {/* ── Service Cards Grid ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5"
          >
            {filteredServices.map((service) => {
              const Icon = service.icon
              return (
                <motion.div
                  key={service.id}
                  variants={cardVariants}
                  layout
                  whileHover={{ y: -4, transition: { duration: 0.25 } }}
                  className="group relative rounded-lg overflow-hidden cursor-pointer
                    bg-[#162032] border border-[#1E3048]/60
                    hover:border-[#C9A227]/30
                    transition-colors duration-300"
                >
                  {/* Gold left border accent on hover */}
                  <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#C9A227] scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-top rounded-l-lg" />

                  {/* Subtle hover glow */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{
                      background: 'radial-gradient(ellipse at 10% 50%, rgba(201,162,39,0.06) 0%, transparent 70%)',
                    }}
                  />

                  <div className="p-5 md:p-6 relative">
                    {/* Icon */}
                    <div className="flex items-start gap-4 mb-3">
                      <div
                        className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center
                          bg-[#1E3048]/60 group-hover:bg-[#C9A227]/15
                          transition-colors duration-300"
                      >
                        <Icon className="w-5 h-5 text-[#94A3B8] group-hover:text-[#C9A227] transition-colors duration-300" />
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-[#E2E8F0] font-semibold text-sm md:text-base mb-2 group-hover:text-white transition-colors duration-300">
                      {service.title}
                    </h3>

                    {/* Description */}
                    <p className="text-[#64748B] text-xs sm:text-[13px] leading-relaxed line-clamp-3">
                      {service.description}
                    </p>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        </AnimatePresence>

        {/* ── Bottom subtle accent ── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="flex justify-center mt-12 md:mt-16"
        >
          <div className="h-px w-32 bg-gradient-to-r from-transparent via-[#1E3048] to-transparent" />
        </motion.div>
      </div>
    </section>
  )
}
