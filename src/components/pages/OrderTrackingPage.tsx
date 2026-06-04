'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Package,
  Search,
  CheckCircle2,
  Circle,
  Clock,
  Truck,
  CreditCard,
  MapPin,
  ChevronRight,
  ArrowRight,
  FileText,
  Printer,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useNavigationStore } from '@/lib/store'

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
}

interface TrackingStep {
  id: number
  label: string
  description: string
  date?: string
  time?: string
  status: 'completed' | 'current' | 'upcoming'
  icon: React.ElementType
}

const mockOrderData = {
  orderNumber: 'MO-1042',
  placedDate: 'February 28, 2025',
  estimatedDelivery: 'March 10, 2025',
  items: [
    {
      name: 'Premium Business Cards (1000 pcs)',
      variant: 'Matt Laminated, 350 GSM',
      price: 2499,
      qty: 1,
    },
    {
      name: 'A4 Brochures (500 pcs)',
      variant: 'Glossy Finish, 170 GSM',
      price: 4750,
      qty: 1,
    },
    {
      name: 'Letterheads (250 pcs)',
      variant: 'Bond Paper, 100 GSM',
      price: 1800,
      qty: 1,
    },
  ],
  shippingAddress: 'Murlidhar Enterprises, Plot No. 45, GIDC Industrial Estate, Rajkot, Gujarat 360002',
  paymentMethod: 'UPI — PhonePe (txn_id: MO28FEB25)',
  subtotal: 9049,
  gst: 1628.82,
  total: 10677.82,
}

const getMockSteps = (): TrackingStep[] => [
  {
    id: 1,
    label: 'Order Placed',
    description: 'Your order has been confirmed and payment received',
    date: 'Feb 28, 2025',
    time: '2:35 PM',
    status: 'completed',
    icon: FileText,
  },
  {
    id: 2,
    label: 'Design Review',
    description: 'Our team has reviewed and approved your artwork',
    date: 'Mar 1, 2025',
    time: '10:15 AM',
    status: 'completed',
    icon: CheckCircle2,
  },
  {
    id: 3,
    label: 'In Production',
    description: 'Your order is currently being printed',
    status: 'current',
    icon: Printer,
  },
  {
    id: 4,
    label: 'Quality Check',
    description: 'Final quality inspection and packaging',
    status: 'upcoming',
    icon: CheckCircle2,
  },
  {
    id: 5,
    label: 'Shipped',
    description: 'Order dispatched via courier partner',
    status: 'upcoming',
    icon: Truck,
  },
  {
    id: 6,
    label: 'Delivered',
    description: 'Package delivered to your address',
    status: 'upcoming',
    icon: Package,
  },
]

export default function OrderTrackingPage() {
  const navigate = useNavigationStore((s) => s.navigate)
  const [orderInput, setOrderInput] = useState('')
  const [isTracking, setIsTracking] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const steps = getMockSteps()
  const currentStepIndex = steps.findIndex((s) => s.status === 'current')

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = orderInput.trim().toUpperCase()
    if (!trimmed) {
      setError('Please enter an order number')
      return
    }
    if (!/^MO-\d{4}$/.test(trimmed)) {
      setError('Order number format should be MO-XXXX (e.g., MO-1042)')
      return
    }
    setError('')
    setIsLoading(true)
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1500))
    setIsLoading(false)
    setIsTracking(true)
  }

  const handleQuickTrack = () => {
    setOrderInput('MO-1042')
    setError('')
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      setIsTracking(true)
    }, 1000)
  }

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="navy-gradient-deep relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-gold/3 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-gold text-gold text-xs font-semibold mb-6"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-gold" />
              ORDER TRACKING
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight"
            >
              Track Your{' '}
              <span className="gold-gradient-text">Order</span>
            </motion.h1>

            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.2 }}
              className="w-24 h-0.5 gold-gradient mb-6 origin-left"
            />

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-white/60 text-lg md:text-xl max-w-2xl"
            >
              Enter your order number to check the current status of your printing order in real-time.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-12 md:py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Card className="border-border/50 premium-shadow overflow-hidden max-w-2xl mx-auto">
              <CardContent className="p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl gold-gradient flex items-center justify-center premium-shadow">
                    <Search className="size-6 text-navy" />
                  </div>
                  <div>
                    <h3 className="font-bold text-navy text-lg">Find Your Order</h3>
                    <p className="text-muted-foreground text-sm">Enter the order number from your confirmation email</p>
                  </div>
                </div>

                <form onSubmit={handleTrack} className="space-y-4">
                  <div className="flex gap-3">
                    <div className="flex-1 relative">
                      <Input
                        value={orderInput}
                        onChange={(e) => {
                          setOrderInput(e.target.value)
                          if (error) setError('')
                        }}
                        placeholder="Enter order number (e.g., MO-1042)"
                        className={`h-12 text-base border-border/50 focus:border-gold/50 pl-4 ${error ? 'border-destructive' : ''}`}
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="gold-gradient text-navy font-semibold h-12 px-6 hover:opacity-90 transition-opacity"
                    >
                      {isLoading ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          className="size-5 border-2 border-navy/30 border-t-navy rounded-full"
                        />
                      ) : (
                        <>
                          <Package className="size-4 mr-2" />
                          Track
                        </>
                      )}
                    </Button>
                  </div>
                  {error && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-destructive text-sm"
                    >
                      {error}
                    </motion.p>
                  )}
                </form>

                <div className="mt-4 pt-4 border-t border-border/50">
                  <p className="text-muted-foreground text-xs mb-2">Quick demo:</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleQuickTrack}
                    className="border-gold/30 text-gold hover:bg-gold/10 text-xs"
                  >
                    <ArrowRight className="size-3 mr-1" />
                    Try with sample order MO-1042
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Tracking Results */}
      <AnimatePresence mode="wait">
        {isTracking && (
          <motion.section
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="pb-16 md:pb-20 bg-muted/30"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Order Header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mb-8"
              >
                <Card className="border-border/50 premium-shadow overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl gold-gradient flex items-center justify-center premium-shadow shrink-0">
                          <Package className="size-7 text-navy" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h2 className="text-xl font-bold text-navy">Order #{mockOrderData.orderNumber}</h2>
                            <Badge className="bg-gold/10 text-gold border-gold/20 text-xs font-semibold">
                              In Production
                            </Badge>
                          </div>
                          <p className="text-muted-foreground text-sm mt-0.5">
                            Placed on {mockOrderData.placedDate}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="size-4 text-gold" />
                        <span className="text-muted-foreground">Est. Delivery:</span>
                        <span className="font-semibold text-navy">{mockOrderData.estimatedDelivery}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Progress Bar */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-8"
              >
                <Card className="border-border/50 premium-shadow overflow-hidden">
                  <CardContent className="p-6 md:p-8">
                    <h3 className="font-bold text-navy text-lg mb-6 flex items-center gap-2">
                      <Truck className="size-5 text-gold" />
                      Order Progress
                    </h3>

                    {/* Visual progress bar */}
                    <div className="relative mb-8">
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${((currentStepIndex) / (steps.length - 1)) * 100}%` }}
                          transition={{ duration: 1.2, delay: 0.5, ease: 'easeOut' }}
                          className="h-full gold-gradient rounded-full"
                        />
                      </div>
                    </div>

                    {/* Timeline Steps */}
                    <div className="relative">
                      {/* Connecting line (desktop) */}
                      <div className="hidden md:block absolute left-6 top-6 bottom-6 w-0.5 bg-border/50" />
                      <div
                        className="hidden md:block absolute left-6 top-6 w-0.5 gold-gradient transition-all duration-1000"
                        style={{ height: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
                      />

                      <div className="space-y-0">
                        {steps.map((step, index) => (
                          <motion.div
                            key={step.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 + index * 0.1, duration: 0.4 }}
                            className="relative flex items-start gap-4 pb-8 last:pb-0"
                          >
                            {/* Step indicator */}
                            <div className="relative z-10 shrink-0">
                              {step.status === 'completed' ? (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={{ delay: 0.4 + index * 0.1, type: 'spring' }}
                                  className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center premium-shadow"
                                >
                                  <CheckCircle2 className="size-6 text-white" />
                                </motion.div>
                              ) : step.status === 'current' ? (
                                <motion.div
                                  animate={{ boxShadow: [
                                    '0 0 0 0 rgba(212, 175, 55, 0.4)',
                                    '0 0 0 12px rgba(212, 175, 55, 0)',
                                  ] }}
                                  transition={{ duration: 1.5, repeat: Infinity }}
                                  className="w-12 h-12 rounded-full gold-gradient flex items-center justify-center premium-shadow"
                                >
                                  <step.icon className="size-6 text-navy" />
                                </motion.div>
                              ) : (
                                <div className="w-12 h-12 rounded-full bg-muted border-2 border-border flex items-center justify-center">
                                  <step.icon className="size-5 text-muted-foreground" />
                                </div>
                              )}
                            </div>

                            {/* Step content */}
                            <div className="flex-1 pt-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h4 className={`font-semibold ${
                                  step.status === 'completed'
                                    ? 'text-emerald-600'
                                    : step.status === 'current'
                                      ? 'text-navy'
                                      : 'text-muted-foreground'
                                }`}>
                                  {step.label}
                                </h4>
                                {step.status === 'current' && (
                                  <Badge className="gold-gradient text-navy font-bold text-[10px] border-0 animate-pulse">
                                    IN PROGRESS
                                  </Badge>
                                )}
                                {step.status === 'completed' && (
                                  <Badge className="bg-emerald-100 text-emerald-700 text-[10px] border-0 font-semibold">
                                    COMPLETED
                                  </Badge>
                                )}
                              </div>
                              <p className="text-muted-foreground text-sm mt-0.5">
                                {step.description}
                              </p>
                              {step.date && (
                                <p className="text-xs text-muted-foreground/70 mt-1 flex items-center gap-1">
                                  <Clock className="size-3" />
                                  {step.date} at {step.time}
                                </p>
                              )}
                              {step.status === 'current' && (
                                <motion.div
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  transition={{ delay: 0.8 }}
                                  className="mt-2 p-3 rounded-lg bg-gold/5 border border-gold/10"
                                >
                                  <p className="text-xs text-gold font-medium flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
                                    Your order is being printed on our Heidelberg offset press
                                  </p>
                                </motion.div>
                              )}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Order Details */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Order Items */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="lg:col-span-2"
                >
                  <Card className="border-border/50 premium-shadow overflow-hidden h-full">
                    <CardContent className="p-6">
                      <h3 className="font-bold text-navy text-lg mb-4 flex items-center gap-2">
                        <FileText className="size-5 text-gold" />
                        Order Items
                      </h3>
                      <div className="space-y-4">
                        {mockOrderData.items.map((item, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 + index * 0.1 }}
                          >
                            <div className="flex items-start justify-between gap-4 py-3">
                              <div className="flex-1">
                                <h4 className="font-medium text-foreground text-sm">{item.name}</h4>
                                <p className="text-muted-foreground text-xs mt-0.5">{item.variant}</p>
                                <p className="text-muted-foreground text-xs mt-0.5">Qty: {item.qty}</p>
                              </div>
                              <span className="font-semibold text-navy text-sm whitespace-nowrap">
                                ₹{item.price.toLocaleString('en-IN')}
                              </span>
                            </div>
                            {index < mockOrderData.items.length - 1 && (
                              <Separator className="bg-border/50" />
                            )}
                          </motion.div>
                        ))}
                      </div>

                      <Separator className="bg-border/50 my-4" />

                      {/* Totals */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Subtotal</span>
                          <span className="text-foreground">₹{mockOrderData.subtotal.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">GST (18%)</span>
                          <span className="text-foreground">₹{mockOrderData.gst.toLocaleString('en-IN')}</span>
                        </div>
                        <Separator className="bg-border/50" />
                        <div className="flex justify-between font-bold">
                          <span className="text-navy">Total</span>
                          <span className="gold-gradient-text text-lg">₹{mockOrderData.total.toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Shipping & Payment Info */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="space-y-6"
                >
                  {/* Shipping Address */}
                  <Card className="border-border/50 premium-shadow overflow-hidden">
                    <CardContent className="p-6">
                      <h4 className="font-bold text-navy mb-3 flex items-center gap-2">
                        <MapPin className="size-4 text-gold" />
                        Shipping Address
                      </h4>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {mockOrderData.shippingAddress}
                      </p>
                    </CardContent>
                  </Card>

                  {/* Payment Method */}
                  <Card className="border-border/50 premium-shadow overflow-hidden">
                    <CardContent className="p-6">
                      <h4 className="font-bold text-navy mb-3 flex items-center gap-2">
                        <CreditCard className="size-4 text-gold" />
                        Payment Method
                      </h4>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {mockOrderData.paymentMethod}
                      </p>
                      <Badge className="mt-2 bg-emerald-100 text-emerald-700 text-[10px] border-0 font-semibold">
                        PAID
                      </Badge>
                    </CardContent>
                  </Card>

                  {/* Need Help */}
                  <Card className="border-gold/20 bg-gold/5 overflow-hidden">
                    <CardContent className="p-6">
                      <h4 className="font-bold text-navy mb-2 flex items-center gap-2">
                        Need Help?
                      </h4>
                      <p className="text-muted-foreground text-sm mb-4">
                        Have questions about your order? Our support team is here to help.
                      </p>
                      <div className="space-y-2">
                        <Button
                          className="w-full gold-gradient text-navy font-semibold hover:opacity-90 transition-opacity"
                          size="sm"
                          onClick={() => navigate('contact')}
                        >
                          Contact Support
                          <ArrowRight className="size-4 ml-1" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full border-gold/30 text-gold hover:bg-gold/10"
                          asChild
                        >
                          <a
                            href="https://wa.me/919876543210"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Chat on WhatsApp
                          </a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>

              {/* Back CTA */}
              <motion.div
                {...fadeUp}
                className="mt-8 text-center"
              >
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsTracking(false)
                    setOrderInput('')
                  }}
                  className="border-gold/30 text-gold hover:bg-gold/10 font-semibold"
                >
                  Track Another Order
                </Button>
              </motion.div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* How It Works Section (shown when not tracking) */}
      {!isTracking && (
        <section className="py-16 md:py-20 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              {...fadeUp}
              className="text-center mb-12"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-gold text-gold text-xs font-semibold mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-gold" />
                HOW IT WORKS
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-navy mb-3">
                Track in <span className="gold-gradient-text">3 Easy Steps</span>
              </h2>
              <div className="w-20 h-0.5 gold-gradient mx-auto mb-4" />
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Stay informed about your order status from production to delivery
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {[
                {
                  step: '1',
                  title: 'Enter Order Number',
                  description: 'Find your order number in the confirmation email or SMS (format: MO-XXXX)',
                  icon: Search,
                },
                {
                  step: '2',
                  title: 'View Live Status',
                  description: 'See real-time updates on production, quality check, and shipping progress',
                  icon: Package,
                },
                {
                  step: '3',
                  title: 'Get Notified',
                  description: 'Receive SMS and email notifications at every stage of your order',
                  icon: CheckCircle2,
                },
              ].map((item, index) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 }}
                >
                  <Card className="border-border/50 h-full text-center hover:border-gold/30 transition-all duration-300 hover:premium-shadow-lg">
                    <CardContent className="p-6">
                      <div className="w-14 h-14 rounded-2xl gold-gradient flex items-center justify-center mx-auto mb-4 premium-shadow">
                        <span className="text-navy font-bold text-xl">{item.step}</span>
                      </div>
                      <h3 className="font-bold text-navy mb-2">{item.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto mt-12">
              <motion.div {...fadeUp}>
                <Card className="border-border/50 h-full">
                  <CardContent className="p-6 flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
                      <Clock className="size-6 text-emerald-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-navy text-sm mb-1">Production Timeline</h4>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        Most orders are completed within 3-5 business days. Bulk orders may take 7-10 days.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
              <motion.div {...fadeUp} transition={{ delay: 0.1 }}>
                <Card className="border-border/50 h-full">
                  <CardContent className="p-6 flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
                      <Truck className="size-6 text-amber-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-navy text-sm mb-1">Shipping Partners</h4>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        We ship via DTDC, Delhivery, and India Post. Pan-India delivery with tracking.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {/* Bottom CTA */}
      <section className="py-12 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            {...fadeUp}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <p className="text-muted-foreground text-sm">
              Need help with an existing order?
            </p>
            <Button
              variant="link"
              className="text-gold hover:text-gold-dark p-0 h-auto"
              onClick={() => navigate('contact')}
            >
              Contact our support team
              <ChevronRight className="size-3 ml-1" />
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
