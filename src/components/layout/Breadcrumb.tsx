'use client'

import { motion } from 'framer-motion'
import { ChevronRight, Home } from 'lucide-react'
import { useNavigationStore, type PageName } from '@/lib/store'

interface BreadcrumbItem {
  label: string
  page: PageName
  params?: { productId?: string | null; categorySlug?: string | null }
}

const pageLabels: Record<string, string> = {
  home: 'Home',
  products: 'Products',
  'product-detail': 'Product',
  cart: 'Cart',
  checkout: 'Checkout',
  auth: 'Sign In',
  dashboard: 'My Account',
  wishlist: 'Wishlist',
  about: 'About Us',
  contact: 'Contact',
  'order-tracking': 'Track Order',
  compare: 'Compare',
  'sample-request': 'Sample Request',
  privacy: 'Privacy Policy',
  terms: 'Terms & Conditions',
  refund: 'Refund Policy',
}

function getBreadcrumbItems(page: PageName, _categorySlug: string | null): BreadcrumbItem[] {
  const items: BreadcrumbItem[] = []

  switch (page) {
    case 'products':
      items.push({ label: 'Products', page: 'products' })
      break
    case 'product-detail':
      items.push({ label: 'Products', page: 'products', params: { categorySlug: _categorySlug } })
      items.push({ label: 'Product', page: 'product-detail' })
      break
    case 'cart':
      items.push({ label: 'Cart', page: 'cart' })
      break
    case 'checkout':
      items.push({ label: 'Cart', page: 'cart' })
      items.push({ label: 'Checkout', page: 'checkout' })
      break
    case 'auth':
      items.push({ label: 'Sign In', page: 'auth' })
      break
    case 'dashboard':
      items.push({ label: 'My Account', page: 'dashboard' })
      break
    case 'wishlist':
      items.push({ label: 'Wishlist', page: 'wishlist' })
      break
    case 'about':
      items.push({ label: 'About Us', page: 'about' })
      break
    case 'contact':
      items.push({ label: 'Contact', page: 'contact' })
      break
    case 'order-tracking':
      items.push({ label: 'Track Order', page: 'order-tracking' })
      break
    case 'compare':
      items.push({ label: 'Compare', page: 'compare' })
      break
    case 'sample-request':
      items.push({ label: 'Sample Request', page: 'sample-request' })
      break
    case 'privacy':
      items.push({ label: 'Privacy Policy', page: 'privacy' })
      break
    case 'terms':
      items.push({ label: 'Terms & Conditions', page: 'terms' })
      break
    case 'refund':
      items.push({ label: 'Refund Policy', page: 'refund' })
      break
    default:
      break
  }

  return items
}

export default function Breadcrumb() {
  const { page, categorySlug, navigate } = useNavigationStore()
  const items = getBreadcrumbItems(page, categorySlug)

  // Don't render on home page
  if (page === 'home') return null

  // Mobile: show abbreviated breadcrumb (Home > ... > Current)
  const isMobileShort = items.length > 2
  const mobileItems = isMobileShort
    ? [items[0], items[items.length - 1]]
    : items

  const currentLabel = pageLabels[page] || page

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="bg-white/50 backdrop-blur-sm border-b border-gold/10"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3">
        {/* Desktop breadcrumb */}
        <nav className="hidden sm:flex items-center gap-1.5 text-sm" aria-label="Breadcrumb">
          <button
            onClick={() => navigate('home')}
            className="flex items-center gap-1 text-navy/60 hover:text-gold transition-colors font-medium"
          >
            <Home className="h-3.5 w-3.5" />
            <span>Home</span>
          </button>
          {items.map((item, index) => {
            const isLast = index === items.length - 1
            return (
              <div key={`${item.page}-${index}`} className="flex items-center gap-1.5">
                <ChevronRight className="h-3 w-3 text-gold/50" />
                {isLast ? (
                  <span className="text-gold font-semibold">{item.label}</span>
                ) : (
                  <button
                    onClick={() => navigate(item.page, item.params || undefined)}
                    className="text-navy/60 hover:text-gold transition-colors font-medium"
                  >
                    {item.label}
                  </button>
                )}
              </div>
            )
          })}
        </nav>

        {/* Mobile breadcrumb - abbreviated */}
        <nav className="flex sm:hidden items-center gap-1.5 text-xs" aria-label="Breadcrumb">
          <button
            onClick={() => navigate('home')}
            className="flex items-center gap-1 text-navy/60 hover:text-gold transition-colors font-medium"
          >
            <Home className="h-3.5 w-3.5" />
            <span>Home</span>
          </button>
          {isMobileShort && (
            <>
              <ChevronRight className="h-3 w-3 text-gold/50" />
              <span className="text-navy/40">...</span>
            </>
          )}
          <ChevronRight className="h-3 w-3 text-gold/50" />
          <span className="text-gold font-semibold truncate max-w-[180px]">{currentLabel}</span>
        </nav>
      </div>
    </motion.div>
  )
}
