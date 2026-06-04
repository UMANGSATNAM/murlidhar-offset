'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Package,
  ClipboardList,
  Truck,
  Check,
  CreditCard,
  Shield,
  Clock,
  MessageCircle,
  ChevronRight,
  Star,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'

const sampleProducts = [
  { id: 'p1', name: 'Business Cards', image: '/products/business-cards.jpg', emoji: '💳' },
  { id: 'p2', name: 'Wedding Cards', image: '/products/wedding-cards.jpg', emoji: '💒' },
  { id: 'p3', name: 'Letterheads', image: '/products/letterheads.jpg', emoji: '📄' },
  { id: 'p4', name: 'Brochures', image: '/products/brochures.jpg', emoji: '📰' },
  { id: 'p5', name: 'Packaging Boxes', image: '/products/packaging.jpg', emoji: '📦' },
  { id: 'p6', name: 'Stickers', image: '/products/stickers.jpg', emoji: '🏷️' },
  { id: 'p7', name: 'Banners', image: '/products/banners.jpg', emoji: '🚩' },
  { id: 'p8', name: 'Envelopes', image: '/products/envelopes.jpg', emoji: '✉️' },
]

const indianStates = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Chandigarh', 'Puducherry',
]

const purposeOptions = ['Personal', 'Business', 'Corporate', 'Event', 'Other']

const steps = [
  {
    icon: ClipboardList,
    title: 'Choose Products',
    desc: 'Select up to 3 products',
    step: 1,
  },
  {
    icon: Package,
    title: 'Fill Details',
    desc: 'Enter your shipping info',
    step: 2,
  },
  {
    icon: Truck,
    title: 'Receive Samples',
    desc: 'Delivered in 3-5 days',
    step: 3,
  },
]

export default function SampleRequestPage() {
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    pincode: '',
    purpose: '',
    notes: '',
  })

  const toggleProduct = (id: string) => {
    setSelectedProducts((prev) => {
      if (prev.includes(id)) {
        return prev.filter((p) => p !== id)
      }
      if (prev.length >= 3) return prev
      return [...prev, id]
    })
  }

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedProducts.length === 0) return
    setIsSubmitting(true)
    // Simulate submission
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsSubmitting(false)
    setIsSubmitted(true)
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md mx-auto px-4"
        >
          <div className="w-20 h-20 rounded-full gold-gradient flex items-center justify-center mx-auto mb-6 premium-shadow-lg">
            <Check className="size-10 text-navy" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-3">
            Sample Request Submitted!
          </h2>
          <p className="text-muted-foreground mb-6">
            Thank you for your interest! Your samples will be shipped within 3-5
            business days. You&apos;ll receive a confirmation email shortly.
          </p>
          <div className="flex items-center justify-center gap-2 text-gold text-sm">
            <Truck className="size-4" />
            <span>Estimated delivery: 3-5 business days</span>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="navy-gradient-deep py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="gold-gradient text-navy font-semibold text-xs border-0 mb-4">
              <Star className="size-3 mr-1" />
              FREE SAMPLES
            </Badge>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3">
              Request Free Samples
            </h1>
            <p className="text-white/60 text-base sm:text-lg max-w-xl mx-auto">
              Try before you buy — Get physical samples delivered to your doorstep
            </p>
            <div className="h-0.5 w-16 gold-gradient rounded-full mx-auto mt-6" />
          </motion.div>
        </div>
      </div>

      {/* Steps Section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="grid grid-cols-3 gap-3 sm:gap-6 max-w-2xl mx-auto">
          {steps.map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 }}
              className="bg-card rounded-xl p-3 sm:p-5 text-center premium-shadow gold-border"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full gold-gradient flex items-center justify-center mx-auto mb-2 sm:mb-3">
                <step.icon className="size-5 sm:size-6 text-navy" />
              </div>
              <h3 className="text-foreground font-semibold text-xs sm:text-sm mb-1">
                {step.title}
              </h3>
              <p className="text-muted-foreground text-[10px] sm:text-xs">
                {step.desc}
              </p>
              {i < steps.length - 1 && (
                <ChevronRight className="hidden sm:block size-4 text-gold/40 absolute top-1/2 -right-3 -translate-y-1/2" />
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8">
          {/* Product Selection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-foreground">
                Select Products
              </h2>
              <Badge
                className={`font-semibold text-xs border-0 ${
                  selectedProducts.length >= 3
                    ? 'bg-red-500/10 text-red-500'
                    : 'gold-gradient text-navy'
                }`}
              >
                {selectedProducts.length}/3 samples selected
              </Badge>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {sampleProducts.map((product) => {
                const isSelected = selectedProducts.includes(product.id)
                const isDisabled = !isSelected && selectedProducts.length >= 3
                return (
                  <motion.button
                    key={product.id}
                    type="button"
                    onClick={() => toggleProduct(product.id)}
                    disabled={isDisabled}
                    className={`relative p-4 rounded-xl border-2 transition-all text-center group ${
                      isSelected
                        ? 'border-gold bg-gold/5 gold-shadow'
                        : isDisabled
                          ? 'border-border/50 opacity-50 cursor-not-allowed'
                          : 'border-border hover:border-gold/30 hover:bg-gold/5'
                    }`}
                    whileHover={!isDisabled ? { scale: 1.02 } : {}}
                    whileTap={!isDisabled ? { scale: 0.98 } : {}}
                  >
                    {/* Checkbox indicator */}
                    <div
                      className={`absolute top-2 right-2 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                        isSelected
                          ? 'gold-gradient border-gold'
                          : 'border-border'
                      }`}
                    >
                      {isSelected && <Check className="size-3 text-navy" />}
                    </div>

                    <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center mx-auto mb-2 text-2xl">
                      {product.emoji}
                    </div>
                    <p className="text-sm font-medium text-foreground">
                      {product.name}
                    </p>
                  </motion.button>
                )
              })}
            </div>

            {selectedProducts.length === 0 && (
              <p className="text-sm text-red-500 mt-2">
                Please select at least one product to continue
              </p>
            )}
          </motion.div>

          {/* Form Fields */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-card rounded-2xl p-6 premium-shadow"
          >
            <h2 className="text-xl font-bold text-foreground mb-6">
              Shipping Details
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <Input
                  name="fullName"
                  value={form.fullName}
                  onChange={handleFormChange}
                  placeholder="John Doe"
                  required
                  className="border-gold/20 focus:border-gold/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Email <span className="text-red-500">*</span>
                </label>
                <Input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleFormChange}
                  placeholder="john@example.com"
                  required
                  className="border-gold/20 focus:border-gold/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Phone <span className="text-red-500">*</span>
                </label>
                <Input
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleFormChange}
                  placeholder="+91 98765 43210"
                  required
                  className="border-gold/20 focus:border-gold/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Purpose
                </label>
                <select
                  name="purpose"
                  value={form.purpose}
                  onChange={handleFormChange}
                  className="w-full h-9 rounded-md border border-gold/20 bg-transparent px-3 py-1 text-sm text-foreground focus:border-gold/50 focus:ring-1 focus:ring-gold/20 outline-none transition-colors"
                >
                  <option value="">Select purpose</option>
                  {purposeOptions.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Address Line 1 <span className="text-red-500">*</span>
                </label>
                <Input
                  name="address1"
                  value={form.address1}
                  onChange={handleFormChange}
                  placeholder="House/Flat No., Building Name"
                  required
                  className="border-gold/20 focus:border-gold/50"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Address Line 2
                </label>
                <Input
                  name="address2"
                  value={form.address2}
                  onChange={handleFormChange}
                  placeholder="Street, Area, Landmark"
                  className="border-gold/20 focus:border-gold/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  City <span className="text-red-500">*</span>
                </label>
                <Input
                  name="city"
                  value={form.city}
                  onChange={handleFormChange}
                  placeholder="Mumbai"
                  required
                  className="border-gold/20 focus:border-gold/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  State <span className="text-red-500">*</span>
                </label>
                <select
                  name="state"
                  value={form.state}
                  onChange={handleFormChange}
                  required
                  className="w-full h-9 rounded-md border border-gold/20 bg-transparent px-3 py-1 text-sm text-foreground focus:border-gold/50 focus:ring-1 focus:ring-gold/20 outline-none transition-colors"
                >
                  <option value="">Select state</option>
                  {indianStates.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Pincode <span className="text-red-500">*</span>
                </label>
                <Input
                  name="pincode"
                  value={form.pincode}
                  onChange={handleFormChange}
                  placeholder="400001"
                  required
                  className="border-gold/20 focus:border-gold/50"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Additional Notes
                </label>
                <Textarea
                  name="notes"
                  value={form.notes}
                  onChange={handleFormChange}
                  placeholder="Any specific requirements or questions..."
                  rows={3}
                  className="border-gold/20 focus:border-gold/50 resize-none"
                />
              </div>
            </div>
          </motion.div>

          {/* Pricing Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-card rounded-2xl p-6 premium-shadow"
          >
            <h2 className="text-lg font-bold text-foreground mb-4">
              Order Summary
            </h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>
                  Samples ({selectedProducts.length} × Free)
                </span>
                <span>₹0</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Shipping Charge</span>
                <span>₹50</span>
              </div>
              <div className="border-t border-border pt-2 flex justify-between font-semibold text-foreground">
                <span>Total</span>
                <span className="text-gold">₹50</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              First 3 samples are completely FREE. Only ₹50 shipping applies.
            </p>
          </motion.div>

          {/* Trust Badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="grid grid-cols-3 gap-3"
          >
            <div className="bg-card rounded-xl p-4 text-center premium-shadow">
              <CreditCard className="size-6 text-gold mx-auto mb-2" />
              <p className="text-xs font-semibold text-foreground">
                No Credit Card
              </p>
              <p className="text-[10px] text-muted-foreground">Required</p>
            </div>
            <div className="bg-card rounded-xl p-4 text-center premium-shadow">
              <Clock className="size-6 text-gold mx-auto mb-2" />
              <p className="text-xs font-semibold text-foreground">
                Delivered in
              </p>
              <p className="text-[10px] text-muted-foreground">3-5 Days</p>
            </div>
            <div className="bg-card rounded-xl p-4 text-center premium-shadow">
              <Shield className="size-6 text-gold mx-auto mb-2" />
              <p className="text-xs font-semibold text-foreground">100% Free</p>
              <p className="text-[10px] text-muted-foreground">Samples</p>
            </div>
          </motion.div>

          {/* Submit Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Button
              type="submit"
              disabled={selectedProducts.length === 0 || isSubmitting}
              className="w-full h-12 gold-gradient text-navy font-bold text-base rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-navy/30 border-t-navy rounded-full animate-spin" />
                  Processing...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Package className="size-5" />
                  Request Free Samples — ₹50 Shipping
                </div>
              )}
            </Button>
          </motion.div>

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            className="text-center py-4"
          >
            <p className="text-muted-foreground text-sm mb-2">
              Not sure what you need?
            </p>
            <button
              type="button"
              onClick={() =>
                window.dispatchEvent(new Event('open-live-chat'))
              }
              className="inline-flex items-center gap-2 text-gold font-semibold text-sm hover:underline"
            >
              <MessageCircle className="size-4" />
              Chat with our experts
            </button>
          </motion.div>
        </form>
      </div>
    </div>
  )
}
