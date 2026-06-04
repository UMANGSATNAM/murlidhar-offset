'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Menu,
  X,
  Search,
  ShoppingCart,
  User,
  ChevronDown,
  Phone,
  Printer,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { useNavigationStore } from '@/lib/store'
import { useCartStore } from '@/lib/cart-store'

const navLinks = [
  { label: 'Home', page: 'home' as const },
  { label: 'Products', page: 'products' as const },
]

const categoryLinks = [
  'Business Cards',
  'Wedding Cards',
  'Letterheads',
  'Brochures',
  'Packaging',
  'Stickers',
  'Banners',
  'Envelopes',
]

export default function Header() {
  const { navigate, page, setSearchQuery, searchQuery } =
    useNavigationStore()
  const { itemCount, _hydrate } = useCartStore()
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [catDropdown, setCatDropdown] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [cartCount, setCartCount] = useState(0)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    _hydrate()
  }, [_hydrate])

  useEffect(() => {
    setCartCount(itemCount())
  }, [itemCount, useCartStore.getState().items])

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setCatDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate('products')
      setSearchOpen(false)
    }
  }

  const handleNavClick = (p: 'home' | 'products') => {
    navigate(p)
    setMobileOpen(false)
  }

  return (
    <>
      {/* Top bar */}
      <div className="hidden md:block bg-navy-dark text-white/70 text-xs">
        <div className="max-w-7xl mx-auto px-4 py-1.5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <Phone className="size-3" />
              +91 98765 43210
            </span>
            <span>info@murlidharoffset.com</span>
          </div>
          <div className="flex items-center gap-3">
            <span>GST Invoicing Available</span>
            <span className="text-gold">|</span>
            <span>Pan-India Delivery</span>
          </div>
        </div>
      </div>

      {/* Main header */}
      <motion.header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'glass-navy premium-shadow'
            : 'bg-navy/95 backdrop-blur-sm'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <div className="max-w-7xl mx-auto px-4 h-16 md:h-18 flex items-center justify-between gap-4">
          {/* Logo */}
          <motion.button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2 shrink-0 group"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="w-9 h-9 rounded-lg gold-gradient flex items-center justify-center premium-shadow">
              <Printer className="size-5 text-navy" />
            </div>
            <div className="flex flex-col">
              <span className="text-white font-bold text-base md:text-lg leading-tight tracking-tight">
                Murlidhar
              </span>
              <span className="text-gold text-[10px] md:text-xs font-medium -mt-0.5 tracking-widest uppercase">
                Offset
              </span>
            </div>
          </motion.button>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.page}
                onClick={() => handleNavClick(link.page)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 gold-underline-hover ${
                  page === link.page
                    ? 'text-gold'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                {link.label}
              </button>
            ))}

            {/* Categories dropdown */}
            <div ref={dropdownRef} className="relative">
              <button
                onClick={() => setCatDropdown(!catDropdown)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-1 gold-underline-hover ${
                  page === 'products'
                    ? 'text-gold'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                Categories
                <ChevronDown
                  className={`size-3.5 transition-transform duration-200 ${
                    catDropdown ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <AnimatePresence>
                {catDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl premium-shadow-lg border border-border/50 overflow-hidden py-2"
                  >
                    {categoryLinks.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => {
                          navigate('products', { categorySlug: cat.toLowerCase().replace(/\s+/g, '-') })
                          setCatDropdown(false)
                        }}
                        className="w-full px-4 py-2.5 text-left text-sm text-navy hover:bg-gold-muted hover:text-gold-dark transition-colors flex items-center justify-between group"
                      >
                        {cat}
                        <span className="text-xs text-muted-foreground group-hover:text-gold-dark">
                          →
                        </span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              onClick={() => navigate('home')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 gold-underline-hover ${
                page === 'home' && false
                  ? 'text-gold'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              About
            </button>
            <button
              onClick={() => navigate('home')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 gold-underline-hover text-white/80 hover:text-white`}
            >
              Contact
            </button>
          </nav>

          {/* Right section */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* Desktop search */}
            <form
              onSubmit={handleSearch}
              className="hidden md:flex items-center relative"
            >
              {searchOpen ? (
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 220, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  className="flex items-center"
                >
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    className="h-9 bg-white/10 border-gold/20 text-white placeholder:text-white/40 focus:border-gold/50 text-sm pr-8"
                    autoFocus
                    onBlur={() => {
                      if (!searchQuery) setSearchOpen(false)
                    }}
                  />
                  <button
                    type="submit"
                    className="absolute right-2 text-white/60 hover:text-gold"
                  >
                    <Search className="size-4" />
                  </button>
                </motion.div>
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSearchOpen(true)}
                  className="text-white/80 hover:text-gold hover:bg-white/10"
                >
                  <Search className="size-5" />
                </Button>
              )}
            </form>

            {/* Cart */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('cart')}
              className="relative text-white/80 hover:text-gold hover:bg-white/10"
            >
              <ShoppingCart className="size-5" />
              {cartCount > 0 && (
                <Badge className="absolute -top-1 -right-1 size-5 p-0 flex items-center justify-center gold-gradient text-navy font-bold text-[10px] border-0">
                  {cartCount}
                </Badge>
              )}
            </Button>

            {/* User */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('auth')}
              className="hidden md:flex text-white/80 hover:text-gold hover:bg-white/10"
            >
              <User className="size-5" />
            </Button>

            {/* Mobile menu */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden text-white/80 hover:text-gold hover:bg-white/10"
                >
                  <Menu className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="bg-navy text-white border-gold/10 w-80"
              >
                <SheetHeader>
                  <SheetTitle className="text-white flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg gold-gradient flex items-center justify-center">
                      <Printer className="size-4 text-navy" />
                    </div>
                    <span>
                      Murlidhar <span className="text-gold">Offset</span>
                    </span>
                  </SheetTitle>
                </SheetHeader>

                <div className="mt-6 flex flex-col gap-1 px-2">
                  {/* Mobile search */}
                  <form onSubmit={handleSearch} className="mb-4">
                    <div className="relative">
                      <Input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search products..."
                        className="bg-white/10 border-gold/20 text-white placeholder:text-white/40 h-10 pl-10"
                      />
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-white/40" />
                    </div>
                  </form>

                  {navLinks.map((link) => (
                    <button
                      key={link.page}
                      onClick={() => handleNavClick(link.page)}
                      className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                        page === link.page
                          ? 'bg-gold/15 text-gold'
                          : 'text-white/80 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      {link.label}
                    </button>
                  ))}

                  <div className="border-t border-white/10 my-2" />

                  <p className="px-4 py-2 text-xs font-semibold text-gold uppercase tracking-wider">
                    Categories
                  </p>
                  {categoryLinks.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        navigate('products', {
                          categorySlug: cat
                            .toLowerCase()
                            .replace(/\s+/g, '-'),
                        })
                        setMobileOpen(false)
                      }}
                      className="w-full text-left px-4 py-2.5 rounded-lg text-sm text-white/70 hover:bg-white/5 hover:text-white transition-all"
                    >
                      {cat}
                    </button>
                  ))}

                  <div className="border-t border-white/10 my-2" />

                  <button
                    onClick={() => {
                      navigate('cart')
                      setMobileOpen(false)
                    }}
                    className="w-full text-left px-4 py-3 rounded-lg text-sm font-medium text-white/80 hover:bg-white/5 hover:text-white transition-all flex items-center justify-between"
                  >
                    <span>Cart</span>
                    {cartCount > 0 && (
                      <Badge className="gold-gradient text-navy font-bold text-[10px] border-0">
                        {cartCount} items
                      </Badge>
                    )}
                  </button>

                  <button
                    onClick={() => {
                      navigate('auth')
                      setMobileOpen(false)
                    }}
                    className="w-full text-left px-4 py-3 rounded-lg text-sm font-medium text-white/80 hover:bg-white/5 hover:text-white transition-all flex items-center gap-2"
                  >
                    <User className="size-4" />
                    <span>Login / Register</span>
                  </button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </motion.header>
    </>
  )
}
