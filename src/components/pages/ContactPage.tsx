'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageSquare,
  Send,
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  CheckCircle2,
  ArrowRight,
  Globe,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useNavigationStore } from '@/lib/store'

const contactInfo = [
  {
    icon: Phone,
    title: 'Phone',
    details: ['+91 98765 43210', '+91 79322 12345'],
    description: 'Mon-Sat, 9AM-7PM IST',
    color: 'from-blue-500 to-blue-600',
  },
  {
    icon: Mail,
    title: 'Email',
    details: ['info@murlidharoffset.com', 'orders@murlidharoffset.com'],
    description: 'We reply within 2 hours',
    color: 'from-emerald-500 to-emerald-600',
  },
  {
    icon: MapPin,
    title: 'Address',
    details: ['Plot No. 45, GIDC Industrial Estate', 'Rajkot, Gujarat 360002'],
    description: 'Visit our printing facility',
    color: 'from-amber-500 to-amber-600',
  },
  {
    icon: Clock,
    title: 'Business Hours',
    details: ['Mon - Sat: 9:00 AM - 7:00 PM', 'Sunday: 10:00 AM - 2:00 PM'],
    description: 'IST (Indian Standard Time)',
    color: 'from-purple-500 to-purple-600',
  },
]

const subjectOptions = [
  'General Inquiry',
  'Custom Quote',
  'Order Support',
  'Design Help',
  'Partnership',
]

const socialLinks = [
  { icon: Instagram, label: 'Instagram', href: '#', handle: '@murlidharoffset' },
  { icon: Facebook, label: 'Facebook', href: '#', handle: '/murlidharoffset' },
  { icon: Twitter, label: 'Twitter', href: '#', handle: '@murlidhar_print' },
  { icon: Linkedin, label: 'LinkedIn', href: '#', handle: '/murlidhar-offset' },
]

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
}

export default function ContactPage() {
  const navigate = useNavigationStore((s) => s.navigate)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSending(true)
    // Simulate sending
    await new Promise((r) => setTimeout(r, 1500))
    setSending(false)
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
    }, 4000)
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="navy-gradient-deep relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-gold/3 rounded-full blur-3xl" />
          <div className="absolute top-1/2 right-0 w-64 h-64 bg-gold/4 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-gold text-gold text-xs font-semibold mb-6"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-gold" />
              GET IN TOUCH
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight"
            >
              Let&apos;s Create Something{' '}
              <span className="gold-gradient-text">Remarkable</span>
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
              Whether you need a custom quote, design assistance, or have a
              question — our team is ready to help bring your vision to life.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16 md:py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info, index) => (
              <motion.div
                key={info.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="group h-full border-border/50 hover:border-gold/30 transition-all duration-300 hover:premium-shadow-lg overflow-hidden">
                  <CardContent className="p-6">
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${info.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <info.icon className="size-6 text-white" />
                    </div>
                    <h3 className="text-navy font-semibold text-lg mb-2">
                      {info.title}
                    </h3>
                    {info.details.map((detail, i) => (
                      <p
                        key={i}
                        className="text-foreground/80 text-sm leading-relaxed"
                      >
                        {detail}
                      </p>
                    ))}
                    <p className="text-muted-foreground text-xs mt-2">
                      {info.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form + Map Section */}
      <section className="py-16 md:py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-12">
            <motion.div
              {...fadeUp}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-gold text-gold text-xs font-semibold mb-4"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-gold" />
              SEND US A MESSAGE
            </motion.div>
            <motion.h2
              {...fadeUp}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-4xl font-bold text-navy mb-3"
            >
              We&apos;d Love to <span className="gold-gradient-text">Hear From You</span>
            </motion.h2>
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="w-20 h-0.5 gold-gradient mx-auto mb-4"
            />
            <motion.p
              {...fadeUp}
              transition={{ delay: 0.2 }}
              className="text-muted-foreground max-w-2xl mx-auto"
            >
              Fill out the form below and our team will get back to you within 2
              business hours.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-3"
            >
              <Card className="border-border/50 premium-shadow overflow-hidden">
                <CardContent className="p-6 md:p-8">
                  {submitted ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex flex-col items-center justify-center py-16 text-center"
                    >
                      <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
                        <CheckCircle2 className="size-8 text-emerald-600" />
                      </div>
                      <h3 className="text-xl font-bold text-navy mb-2">
                        Message Sent Successfully!
                      </h3>
                      <p className="text-muted-foreground max-w-sm">
                        Thank you for reaching out. Our team will get back to
                        you within 2 business hours.
                      </p>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name *</Label>
                          <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="John Doe"
                            required
                            className="border-border/50 focus:border-gold/50"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address *</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="john@example.com"
                            required
                            className="border-border/50 focus:border-gold/50"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="+91 98765 43210"
                            className="border-border/50 focus:border-gold/50"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="subject">Subject *</Label>
                          <select
                            id="subject"
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            required
                            className="flex h-10 w-full rounded-md border border-border/50 bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/30 focus-visible:ring-offset-2 focus-visible:border-gold/50"
                          >
                            <option value="">Select a subject</option>
                            {subjectOptions.map((opt) => (
                              <option key={opt} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="message">Message *</Label>
                        <Textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          placeholder="Tell us about your project, requirements, or any questions you have..."
                          required
                          rows={5}
                          className="border-border/50 focus:border-gold/50 resize-none"
                        />
                      </div>

                      <Button
                        type="submit"
                        disabled={sending}
                        className="w-full sm:w-auto gold-gradient text-navy font-semibold hover:opacity-90 transition-opacity"
                        size="lg"
                      >
                        {sending ? (
                          <>
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{
                                duration: 1,
                                repeat: Infinity,
                                ease: 'linear',
                              }}
                              className="size-4 border-2 border-navy/30 border-t-navy rounded-full"
                            />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="size-4 mr-2" />
                            Send Message
                          </>
                        )}
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Map + Quick Contact */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-2 space-y-6"
            >
              {/* Map Placeholder */}
              <Card className="border-border/50 overflow-hidden premium-shadow">
                <div className="relative h-64 bg-gradient-to-br from-navy/5 to-navy/10 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-full gold-gradient flex items-center justify-center mx-auto mb-3 premium-shadow">
                      <MapPin className="size-5 text-navy" />
                    </div>
                    <h4 className="font-semibold text-navy mb-1">
                      Murlidhar Offset
                    </h4>
                    <p className="text-muted-foreground text-sm">
                      GIDC Industrial Estate, Rajkot
                    </p>
                    <Badge className="mt-2 gold-border text-gold text-[10px]">
                      Gujarat, India
                    </Badge>
                  </div>
                  {/* Decorative map grid */}
                  <div className="absolute inset-0 opacity-5">
                    <div className="w-full h-full" style={{
                      backgroundImage: 'linear-gradient(#0D1B3D 1px, transparent 1px), linear-gradient(90deg, #0D1B3D 1px, transparent 1px)',
                      backgroundSize: '30px 30px',
                    }} />
                  </div>
                </div>
              </Card>

              {/* Quick Contact */}
              <Card className="border-border/50 premium-shadow overflow-hidden">
                <CardContent className="p-6">
                  <h4 className="font-semibold text-navy mb-4 flex items-center gap-2">
                    <MessageSquare className="size-4 text-gold" />
                    Quick Connect
                  </h4>
                  <div className="space-y-3">
                    <Button
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white justify-start"
                      size="lg"
                      asChild
                    >
                      <a
                        href="https://wa.me/919876543210"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <MessageSquare className="size-4 mr-2" />
                        Chat on WhatsApp
                      </a>
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full border-gold/30 text-gold hover:bg-gold/5 justify-start"
                      size="lg"
                      asChild
                    >
                      <a href="tel:+919876543210">
                        <Phone className="size-4 mr-2" />
                        Call Us Directly
                      </a>
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full border-border/50 text-foreground hover:bg-muted/50 justify-start"
                      size="lg"
                      asChild
                    >
                      <a href="mailto:info@murlidharoffset.com">
                        <Mail className="size-4 mr-2" />
                        Send an Email
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Social Media + WhatsApp CTA */}
      <section className="py-16 md:py-20 bg-navy relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/3 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gold/3 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Section Header */}
          <div className="text-center mb-12">
            <motion.div
              {...fadeUp}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-gold text-gold text-xs font-semibold mb-4"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-gold" />
              STAY CONNECTED
            </motion.div>
            <motion.h2
              {...fadeUp}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-4xl font-bold text-white mb-3"
            >
              Follow Us on <span className="gold-gradient-text">Social Media</span>
            </motion.h2>
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="w-20 h-0.5 gold-gradient mx-auto mb-4"
            />
            <motion.p
              {...fadeUp}
              transition={{ delay: 0.2 }}
              className="text-white/60 max-w-2xl mx-auto"
            >
              Stay updated with our latest work, printing tips, and special
              offers. Join our growing community!
            </motion.p>
          </div>

          {/* Social Links */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {socialLinks.map((social, index) => (
              <motion.a
                key={social.label}
                href={social.href}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -4, scale: 1.02 }}
                className="group flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-gold/30 hover:bg-white/[0.08] transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-lg gold-gradient flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <social.icon className="size-5 text-navy" />
                </div>
                <div>
                  <p className="text-white text-sm font-medium">
                    {social.label}
                  </p>
                  <p className="text-white/40 text-xs">{social.handle}</p>
                </div>
              </motion.a>
            ))}
          </div>

          <Separator className="bg-white/10 mb-12" />

          {/* WhatsApp CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="max-w-2xl mx-auto">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 flex items-center justify-center mx-auto mb-6">
                <MessageSquare className="size-8 text-emerald-400" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Prefer WhatsApp?
              </h3>
              <p className="text-white/60 mb-6">
                Get instant responses and personalized assistance on WhatsApp.
                Our team is online during business hours.
              </p>
              <Button
                size="lg"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                asChild
              >
                <a
                  href="https://wa.me/919876543210?text=Hi%20Murlidhar%20Offset%2C%20I%27d%20like%20to%20inquire%20about..."
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageSquare className="size-5 mr-2" />
                  Start WhatsApp Chat
                  <ArrowRight className="size-4 ml-2" />
                </a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-12 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            {...fadeUp}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <div className="flex items-center gap-2 text-muted-foreground">
              <Globe className="size-4" />
              <span className="text-sm">Serving customers across India since 2009</span>
            </div>
            <Separator orientation="vertical" className="hidden sm:block h-4" />
            <Button
              variant="link"
              className="text-gold hover:text-gold-dark p-0 h-auto"
              onClick={() => navigate('about')}
            >
              Learn more about us
              <ArrowRight className="size-3 ml-1" />
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
