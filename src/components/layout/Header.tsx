'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Phone,
  Menu,
  X,
  ShoppingCart,
  Heart,
  Search,
  Bell,
  GitCompare,
  User,
  LayoutDashboard,
  LogIn,
  Package,
  ChevronRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useNavigationStore, type PageName } from '@/lib/store'
import { useCartStore, useCartItemCount } from '@/lib/cart-store'
import { useWishlistStore, useWishlistCount } from '@/lib/wishlist-store'
import { useCompareStore, useCompareCount } from '@/lib/compare-store'
import NotificationCenter from '@/components/layout/NotificationCenter'

/* ──────────────────────────────────────────────
   Reference-Site Navigation Links
   Heritage → about | Services → products | Finishes → products
   Process → about  | Gallery → home     | Contact → contact
   ────────────────────────────────────────────── */
const navLinks = [
  { label: 'Heritage', page: 'about' as PageName },
  { label: 'Services', page: 'products' as PageName },
  { label: 'Finishes', page: 'products' as PageName },
  { label: 'Process', page: 'about' as PageName },
  { label: 'Gallery', page: 'home' as PageName },
  { label: 'Contact', page: 'contact' as PageName },
]

export default function Header() {
  const { navigate, page } = useNavigationStore()
  const cartCount = useCartItemCount()
  const wishlistCount = useWishlistCount()
  const compareCount = useCompareCount()
  const _hydrate = useCartStore((s) => s._hydrate)
  const _hydrateWishlist = useWishlistStore((s) => s._hydrate)
  const _hydrateCompare = useCompareStore((s) => s._hydrate)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  // Hydrate stores from localStorage
  useEffect(() => {
    _hydrate()
    _hydrateWishlist()
    _hydrateCompare()
  }, [_hydrate, _hydrateWishlist, _hydrateCompare])

  // Scroll detection for header elevation
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const handleNavClick = (p: PageName) => {
    navigate(p)
    setMobileOpen(false)
  }

  /* Determine if a nav link is "active" based on current page */
  const isActive = (linkPage: PageName) => {
    if (linkPage === 'products') return page === 'products' || page === 'product-detail'
    if (linkPage === 'about') return page === 'about'
    if (linkPage === 'home') return page === 'home'
    if (linkPage === 'contact') return page === 'contact'
    return page === linkPage
  }

  /* ── Shared utility icon button style ── */
  const iconBtnClass =
    'relative text-white/60 hover:text-white hover:bg-white/[0.06] transition-colors duration-200'

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'bg-[#0B1628]/95 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.3)]'
            : 'bg-[#0B1628]/80 backdrop-blur-md'
        }`}
        style={{
          borderBottom: '1px solid',
          borderImage:
            'linear-gradient(90deg, transparent 0%, rgba(30,48,72,0.6) 15%, rgba(201,162,39,0.25) 50%, rgba(30,48,72,0.6) 85%, transparent 100%) 1',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-[72px]">
            {/* ── Logo ── */}
            <button
              onClick={() => handleNavClick('home')}
              className="flex items-center gap-3 shrink-0 group"
            >
              <div className="relative w-9 h-9 rounded-sm bg-[#C9A227] flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                <span className="text-[#0B1628] font-bold text-sm tracking-tight font-[family-name:var(--font-serif)]">
                  MO
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-white text-[15px] font-semibold leading-tight tracking-wide">
                  Murlidhar Offset
                </span>
                <span className="text-[#64748B] text-[10px] tracking-[0.2em] uppercase leading-tight mt-0.5">
                  The Craft of Print
                </span>
              </div>
            </button>

            {/* ── Desktop Navigation (center) ── */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => handleNavClick(link.page)}
                  className={`relative px-4 py-2 text-[13px] font-medium tracking-wide uppercase transition-colors duration-300 gold-underline-hover ${
                    isActive(link.page)
                      ? 'text-white'
                      : 'text-[#94A3B8] hover:text-white'
                  }`}
                >
                  {link.label}
                  {isActive(link.page) && (
                    <motion.span
                      layoutId="navActiveIndicator"
                      className="absolute bottom-0 left-4 right-4 h-[2px] bg-gradient-to-r from-[#C9A227] to-[#D4B54E]"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                </button>
              ))}
            </nav>

            {/* ── Right Section ── */}
            <div className="flex items-center gap-2 lg:gap-3">
              {/* Phone number — desktop only */}
              <a
                href="tel:+919510737852"
                className="hidden xl:flex items-center gap-2 text-white/70 hover:text-white transition-colors duration-200 group"
              >
                <Phone className="size-4 text-[#C9A227] group-hover:text-[#D4B54E] transition-colors" />
                <span className="text-[13px] font-medium tracking-wide">
                  95107 37852
                </span>
              </a>

              {/* Utility icons — desktop */}
              <div className="hidden md:flex items-center gap-0.5">
                {/* Search */}
                <Button
                  variant="ghost"
                  size="icon"
                  className={iconBtnClass}
                  onClick={() => window.dispatchEvent(new Event('open-search-modal'))}
                  aria-label="Search"
                >
                  <Search className="size-[18px]" />
                </Button>

                {/* Notifications */}
                <NotificationCenter />

                {/* Wishlist */}
                <Button
                  variant="ghost"
                  size="icon"
                  className={iconBtnClass}
                  onClick={() => navigate('wishlist')}
                >
                  <Heart className="size-[18px]" />
                  {wishlistCount > 0 && (
                    <Badge className="absolute -top-0.5 -right-0.5 size-4 p-0 flex items-center justify-center bg-[#C9A227] text-[#0B1628] font-bold text-[9px] border-0 rounded-full">
                      {wishlistCount}
                    </Badge>
                  )}
                </Button>

                {/* Compare */}
                {compareCount > 0 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className={iconBtnClass}
                    onClick={() => navigate('compare')}
                  >
                    <GitCompare className="size-[18px]" />
                    <Badge className="absolute -top-0.5 -right-0.5 size-4 p-0 flex items-center justify-center bg-[#C9A227] text-[#0B1628] font-bold text-[9px] border-0 rounded-full">
                      {compareCount}
                    </Badge>
                  </Button>
                )}

                {/* Cart */}
                <Button
                  variant="ghost"
                  size="icon"
                  className={iconBtnClass}
                  onClick={() => navigate('cart')}
                >
                  <ShoppingCart className="size-[18px]" />
                  {cartCount > 0 && (
                    <Badge className="absolute -top-0.5 -right-0.5 size-4 p-0 flex items-center justify-center bg-[#C9A227] text-[#0B1628] font-bold text-[9px] border-0 rounded-full">
                      {cartCount}
                    </Badge>
                  )}
                </Button>
              </div>

              {/* Get a Quote CTA — desktop */}
              <Button
                onClick={() => navigate('contact')}
                className="hidden lg:flex items-center gap-2 bg-[#C9A227] hover:bg-[#D4B54E] text-[#0B1628] text-[13px] font-semibold tracking-wide px-5 py-2 rounded-sm transition-all duration-300 hover:shadow-[0_4px_20px_rgba(201,162,39,0.3)]"
              >
                Get a Quote
                <ChevronRight className="size-3.5" />
              </Button>

              {/* Mobile cart icon (always visible) */}
              <Button
                variant="ghost"
                size="icon"
                className={`md:hidden ${iconBtnClass}`}
                onClick={() => navigate('cart')}
              >
                <ShoppingCart className="size-5" />
                {cartCount > 0 && (
                  <Badge className="absolute -top-0.5 -right-0.5 size-4 p-0 flex items-center justify-center bg-[#C9A227] text-[#0B1628] font-bold text-[9px] border-0 rounded-full">
                    {cartCount}
                  </Badge>
                )}
              </Button>

              {/* Mobile hamburger / close */}
              <Button
                variant="ghost"
                size="icon"
                className={`lg:hidden ${iconBtnClass}`}
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              >
                {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* ── Mobile Overlay Menu ── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileOpen(false)}
            />

            {/* Menu panel */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="fixed top-16 left-0 right-0 z-50 bg-[#0B1628] border-b border-[#1E3048] lg:hidden overflow-hidden"
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
                {/* Mobile nav links */}
                <nav className="flex flex-col gap-1 mb-6">
                  {navLinks.map((link, i) => (
                    <motion.button
                      key={link.label}
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 * i, duration: 0.3 }}
                      onClick={() => handleNavClick(link.page)}
                      className={`flex items-center justify-between px-4 py-3 rounded-sm text-left text-[15px] font-medium tracking-wide transition-all duration-200 ${
                        isActive(link.page)
                          ? 'text-white bg-white/[0.06] border-l-2 border-[#C9A227]'
                          : 'text-[#94A3B8] hover:text-white hover:bg-white/[0.03]'
                      }`}
                    >
                      {link.label}
                      <ChevronRight
                        className={`size-4 transition-colors ${
                          isActive(link.page) ? 'text-[#C9A227]' : 'text-[#64748B]'
                        }`}
                      />
                    </motion.button>
                  ))}
                </nav>

                {/* Divider */}
                <div className="h-px bg-gradient-to-r from-transparent via-[#1E3048] to-transparent mb-6" />

                {/* Mobile phone */}
                <a
                  href="tel:+919510737852"
                  className="flex items-center gap-3 px-4 py-3 text-white/70 hover:text-white transition-colors mb-4"
                >
                  <Phone className="size-4 text-[#C9A227]" />
                  <span className="text-[14px] font-medium tracking-wide">
                    95107 37852
                  </span>
                </a>

                {/* Get a Quote CTA */}
                <Button
                  onClick={() => handleNavClick('contact')}
                  className="w-full flex items-center justify-center gap-2 bg-[#C9A227] hover:bg-[#D4B54E] text-[#0B1628] text-[14px] font-semibold tracking-wide py-3 rounded-sm transition-all duration-300 hover:shadow-[0_4px_20px_rgba(201,162,39,0.3)] mb-6"
                >
                  Get a Quote
                  <ChevronRight className="size-4" />
                </Button>

                {/* Divider */}
                <div className="h-px bg-gradient-to-r from-transparent via-[#1E3048] to-transparent mb-4" />

                {/* Utility links */}
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => {
                      setMobileOpen(false)
                      setTimeout(
                        () => window.dispatchEvent(new Event('open-search-modal')),
                        300
                      )
                    }}
                    className="flex items-center gap-3 px-4 py-2.5 text-[13px] text-[#94A3B8] hover:text-white transition-colors"
                  >
                    <Search className="size-4" />
                    Search Products
                  </button>

                  <button
                    onClick={() => {
                      navigate('wishlist')
                      setMobileOpen(false)
                    }}
                    className="flex items-center justify-between px-4 py-2.5 text-[13px] text-[#94A3B8] hover:text-white transition-colors"
                  >
                    <span className="flex items-center gap-3">
                      <Heart className="size-4" />
                      Wishlist
                    </span>
                    {wishlistCount > 0 && (
                      <Badge className="bg-[#C9A227] text-[#0B1628] font-bold text-[10px] border-0 rounded-full px-1.5">
                        {wishlistCount}
                      </Badge>
                    )}
                  </button>

                  {compareCount > 0 && (
                    <button
                      onClick={() => {
                        navigate('compare')
                        setMobileOpen(false)
                      }}
                      className="flex items-center justify-between px-4 py-2.5 text-[13px] text-[#94A3B8] hover:text-white transition-colors"
                    >
                      <span className="flex items-center gap-3">
                        <GitCompare className="size-4" />
                        Compare
                      </span>
                      <Badge className="bg-[#C9A227] text-[#0B1628] font-bold text-[10px] border-0 rounded-full px-1.5">
                        {compareCount}
                      </Badge>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      navigate('sample-request')
                      setMobileOpen(false)
                    }}
                    className="flex items-center gap-3 px-4 py-2.5 text-[13px] text-[#94A3B8] hover:text-white transition-colors"
                  >
                    <Package className="size-4" />
                    Free Samples
                  </button>

                  <button
                    onClick={() => {
                      navigate('auth')
                      setMobileOpen(false)
                    }}
                    className="flex items-center gap-3 px-4 py-2.5 text-[13px] text-[#94A3B8] hover:text-white transition-colors"
                  >
                    <User className="size-4" />
                    Login / Register
                  </button>

                  <button
                    onClick={() => {
                      navigate('dashboard')
                      setMobileOpen(false)
                    }}
                    className="flex items-center gap-3 px-4 py-2.5 text-[13px] text-[#94A3B8] hover:text-white transition-colors"
                  >
                    <LayoutDashboard className="size-4" />
                    My Dashboard
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Spacer to push content below fixed header */}
      <div className="h-16 lg:h-[72px]" />
    </>
  )
}
