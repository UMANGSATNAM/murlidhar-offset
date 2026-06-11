'use client'

import React from 'react'
import dynamic from 'next/dynamic'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigationStore } from '@/lib/store'

// Layout components - eagerly loaded
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import WhatsAppButton from '@/components/layout/WhatsAppButton'

// Layout utilities
import SearchModal from '@/components/layout/SearchModal'
import NotificationPopup from '@/components/layout/NotificationPopup'
import Breadcrumb from '@/components/layout/Breadcrumb'
import SectionDivider from '@/components/ui/SectionDivider'

// Home sections - dynamic imports for performance
// Order matches reference site: Hero → Heritage → Services → Finishes → Process → Who We Print For → Gallery → CTA
const HeroSection = dynamic(
  () => import('@/components/home/HeroSection'),
  { ssr: false }
)
const WhyChooseUs = dynamic(
  () => import('@/components/home/WhyChooseUs'),
  { ssr: false }
)
const PopularCategories = dynamic(
  () => import('@/components/home/PopularCategories'),
  { ssr: false }
)
const TestimonialsSection = dynamic(
  () => import('@/components/home/TestimonialsSection'),
  { ssr: false }
)
const PrintingProcess = dynamic(
  () => import('@/components/home/PrintingProcess'),
  { ssr: false }
)
const CTABanner = dynamic(
  () => import('@/components/home/CTABanner'),
  { ssr: false }
)
const FeaturedProducts = dynamic(
  () => import('@/components/home/FeaturedProducts'),
  { ssr: false }
)
const BulkOrderCTA = dynamic(
  () => import('@/components/home/BulkOrderCTA'),
  { ssr: false }
)

// Product pages - dynamic imports
const ProductCatalog = dynamic(
  () => import('@/components/products/ProductCatalog'),
  { ssr: false }
)
const ProductDetail = dynamic(
  () => import('@/components/products/ProductDetail'),
  { ssr: false }
)
const AIQuoteEstimator = dynamic(
  () => import('@/components/products/AIQuoteEstimator'),
  { ssr: false }
)

// Cart, Checkout, Auth, Dashboard - dynamic imports
const CartPage = dynamic(
  () => import('@/components/cart/CartPage'),
  { ssr: false }
)
const CheckoutPage = dynamic(
  () => import('@/components/checkout/CheckoutPage'),
  { ssr: false }
)
const AuthPage = dynamic(
  () => import('@/components/auth/AuthPage'),
  { ssr: false }
)
const UserDashboard = dynamic(
  () => import('@/components/dashboard/UserDashboard'),
  { ssr: false }
)

// Wishlist - dynamic import
const WishlistPage = dynamic(
  () => import('@/components/pages/WishlistPage'),
  { ssr: false }
)

// Contact & About pages - dynamic imports
const ContactPage = dynamic(
  () => import('@/components/pages/ContactPage'),
  { ssr: false }
)
const AboutPage = dynamic(
  () => import('@/components/pages/AboutPage'),
  { ssr: false }
)

// Order Tracking page - dynamic import
const OrderTrackingPage = dynamic(
  () => import('@/components/pages/OrderTrackingPage'),
  { ssr: false }
)

// Compare page - dynamic import
const ComparePage = dynamic(
  () => import('@/components/pages/ComparePage'),
  { ssr: false }
)

// Sample Request page - dynamic import
const SampleRequestPage = dynamic(
  () => import('@/components/pages/SampleRequestPage'),
  { ssr: false }
)

// Live Chat Widget - dynamic import
const LiveChatWidget = dynamic(
  () => import('@/components/layout/LiveChatWidget'),
  { ssr: false }
)

// Cookie Consent - dynamic import
const CookieConsent = dynamic(
  () => import('@/components/layout/CookieConsent'),
  { ssr: false }
)

// Scroll Progress - dynamic import
const ScrollProgress = dynamic(
  () => import('@/components/layout/ScrollProgress'),
  { ssr: false }
)

// Policy pages - dynamic import
const PolicyPage = dynamic(
  () => import('@/components/pages/PolicyPage'),
  { ssr: false }
)

// Admin - dynamic import
const AdminLayout = dynamic(
  () => import('@/components/admin/AdminLayout'),
  { ssr: false }
)

function HomePageContent() {
  return (
    <>
      {/* Hero - Where ink meets intention */}
      <HeroSection />

      <SectionDivider direction="light-to-light" />

      {/* Heritage - Our story & values */}
      <WhyChooseUs />

      <SectionDivider direction="light-to-light" />

      {/* What We Print - Services grid */}
      <PopularCategories />

      <SectionDivider direction="light-to-light" />

      {/* Specialty Finishes - Foil, emboss, UV, etc. */}
      <TestimonialsSection />

      <SectionDivider direction="light-to-light" />

      {/* How We Work - 4-step process */}
      <PrintingProcess />

      <SectionDivider direction="light-to-light" />

      {/* Who We Print For - Industry cards + stats */}
      <CTABanner />

      <SectionDivider direction="light-to-light" />

      {/* Recent Work - Gallery showcase */}
      <FeaturedProducts />

      <SectionDivider direction="light-to-light" />

      {/* Start a Print - CTA / Contact */}
      <BulkOrderCTA />
    </>
  )
}

const adminPages = ['admin', 'admin-products', 'admin-orders', 'admin-cms', 'admin-settings', 'admin-customers']

export default function Home() {
  const { page } = useNavigationStore()

  const isAdmin = adminPages.includes(page)

  // Render content based on current page
  const renderContent = () => {
    switch (page) {
      case 'home':
        return <HomePageContent />
      case 'products':
        return (
          <div className="relative">
            <ProductCatalog />
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-8">
              <div className="max-w-md mx-auto lg:mx-0 lg:absolute lg:right-8 lg:top-8 lg:w-96">
                <AIQuoteEstimator />
              </div>
            </div>
          </div>
        )
      case 'product-detail':
        return <ProductDetail />
      case 'cart':
        return <CartPage />
      case 'checkout':
        return <CheckoutPage />
      case 'auth':
        return <AuthPage />
      case 'dashboard':
        return <UserDashboard />
      case 'wishlist':
        return <WishlistPage />
      case 'contact':
        return <ContactPage />
      case 'about':
        return <AboutPage />
      case 'order-tracking':
        return <OrderTrackingPage />
      case 'compare':
        return <ComparePage />
      case 'sample-request':
        return <SampleRequestPage />
      case 'privacy':
        return <PolicyPage type="privacy" />
      case 'terms':
        return <PolicyPage type="terms" />
      case 'refund':
        return <PolicyPage type="refund" />
      default:
        return <HomePageContent />
    }
  }

  // Admin pages get their own full layout
  if (isAdmin) {
    return <AdminLayout />
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Scroll Progress */}
      <ScrollProgress />

      {/* Header */}
      <Header />

      {/* Breadcrumb - only for non-home and non-admin pages */}
      {page !== 'home' && !isAdmin && <Breadcrumb />}

      {/* Main content */}
      <main className="flex-1 flex flex-col">
        <AnimatePresence mode="wait">
          <motion.div
            key={page}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="flex-1 flex flex-col"
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <Footer />

      {/* WhatsApp button */}
      <WhatsAppButton />

      {/* Live Chat Widget */}
      <LiveChatWidget />

      {/* Cookie Consent Banner */}
      <CookieConsent />

      {/* Global modals & popups */}
      <SearchModal />
      <NotificationPopup />
    </div>
  )
}
