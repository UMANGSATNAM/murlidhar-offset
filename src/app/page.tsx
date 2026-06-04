'use client'

import React from 'react'
import dynamic from 'next/dynamic'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigationStore } from '@/lib/store'

// Layout components - eagerly loaded
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import WhatsAppButton from '@/components/layout/WhatsAppButton'

// New layout components
import AnnouncementBar from '@/components/home/AnnouncementBar'
import SearchModal from '@/components/layout/SearchModal'
import NotificationPopup from '@/components/layout/NotificationPopup'
import SectionDivider from '@/components/ui/SectionDivider'

// Home sections - dynamic imports for performance
const HeroSection = dynamic(
  () => import('@/components/home/HeroSection'),
  { ssr: false }
)
const FeaturedProducts = dynamic(
  () => import('@/components/home/FeaturedProducts'),
  { ssr: false }
)
const TrustStrip = dynamic(
  () => import('@/components/home/TrustStrip'),
  { ssr: false }
)
const PopularCategories = dynamic(
  () => import('@/components/home/PopularCategories'),
  { ssr: false }
)
const CTABanner = dynamic(
  () => import('@/components/home/CTABanner'),
  { ssr: false }
)
const WhyChooseUs = dynamic(
  () => import('@/components/home/WhyChooseUs'),
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
const BulkOrderCTA = dynamic(
  () => import('@/components/home/BulkOrderCTA'),
  { ssr: false }
)
const FAQSection = dynamic(
  () => import('@/components/home/FAQSection'),
  { ssr: false }
)
const RecentlyViewedSection = dynamic(
  () => import('@/components/home/RecentlyViewedSection'),
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

// Placeholder for pages not yet built
function PlaceholderPage({ name }: { name: string }) {
  return (
    <div className="flex-1 flex items-center justify-center py-20">
      <div className="text-center">
        <div className="w-16 h-16 rounded-2xl gold-gradient flex items-center justify-center mx-auto mb-4 premium-shadow">
          <span className="text-navy font-bold text-xl">MO</span>
        </div>
        <h2 className="text-2xl font-bold text-navy mb-2">{name}</h2>
        <p className="text-muted-foreground">
          This page is coming soon. Stay tuned!
        </p>
      </div>
    </div>
  )
}

function HomePageContent() {
  return (
    <>
      <HeroSection />
      <SectionDivider direction="dark-to-light" />
      <TrustStrip />
      <SectionDivider direction="light-to-light" />
      <FeaturedProducts />
      <RecentlyViewedSection />
      <PopularCategories />
      <SectionDivider direction="light-to-dark" />
      <CTABanner />
      <WhyChooseUs />
      <SectionDivider direction="dark-to-light" />
      <TestimonialsSection />
      <SectionDivider direction="light-to-dark" />
      <PrintingProcess />
      <SectionDivider direction="light-to-dark" />
      <BulkOrderCTA />
      <SectionDivider direction="dark-to-light" />
      <FAQSection />
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
            {/* AI Quote Estimator - positioned as a floating sidebar on desktop */}
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
      {/* Announcement Bar - above header */}
      <AnnouncementBar />

      {/* Header */}
      <Header />

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

      {/* Global modals & popups */}
      <SearchModal />
      <NotificationPopup />
    </div>
  )
}
