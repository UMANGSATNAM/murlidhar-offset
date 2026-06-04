'use client'

import React from 'react'
import { motion } from 'framer-motion'
import {
  Award,
  Lightbulb,
  Shield,
  Users,
  Leaf,
  Gem,
  ArrowRight,
  Printer,
  Target,
  Eye,
  CheckCircle2,
  Building2,
  Calendar,
  Sparkles,
  Factory,
  Trophy,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useNavigationStore } from '@/lib/store'

const coreValues = [
  {
    icon: Award,
    title: 'Quality',
    description:
      'Uncompromising quality in every print — from paper selection to color accuracy, we deliver excellence.',
    color: 'from-blue-500 to-blue-600',
  },
  {
    icon: Lightbulb,
    title: 'Innovation',
    description:
      'Embracing cutting-edge printing technology and creative solutions to stay ahead of the curve.',
    color: 'from-amber-500 to-amber-600',
  },
  {
    icon: Shield,
    title: 'Reliability',
    description:
      'Consistent results, on-time delivery, and dependable service — every single time you work with us.',
    color: 'from-emerald-500 to-emerald-600',
  },
  {
    icon: Users,
    title: 'Customer-First',
    description:
      'Your success is our priority. We listen, understand, and deliver solutions tailored to your needs.',
    color: 'from-rose-500 to-rose-600',
  },
  {
    icon: Leaf,
    title: 'Sustainability',
    description:
      'Eco-friendly practices and sustainable materials — because great printing shouldn\'t cost the earth.',
    color: 'from-green-500 to-green-600',
  },
  {
    icon: Gem,
    title: 'Craftsmanship',
    description:
      'Meticulous attention to detail and artisan-level finishing that elevates every printed piece.',
    color: 'from-purple-500 to-purple-600',
  },
]

const milestones = [
  {
    year: '2009',
    title: 'Founded in Rajkot',
    description: 'Started as a small offset printing press with a vision to deliver premium quality.',
    icon: Printer,
  },
  {
    year: '2012',
    title: 'Expanded Operations',
    description: 'Doubled production capacity and added new product lines including packaging and labels.',
    icon: Building2,
  },
  {
    year: '2015',
    title: 'Digital Integration',
    description: 'Introduced digital printing technology alongside traditional offset for versatile solutions.',
    icon: Sparkles,
  },
  {
    year: '2019',
    title: 'New Facility',
    description: 'Moved to a state-of-the-art facility in GIDC Industrial Estate with advanced machinery.',
    icon: Factory,
  },
  {
    year: '2024',
    title: '15 Years Strong',
    description: 'Celebrating 15 years of excellence, serving 5000+ clients across India with pride.',
    icon: Trophy,
  },
]

const teamMembers = [
  {
    name: 'Murlidhar Patel',
    role: 'Founder & CEO',
    description: 'Visionary leader with 30+ years in the printing industry.',
    initials: 'MP',
  },
  {
    name: 'Rajesh Kumar',
    role: 'Head of Operations',
    description: 'Ensures every project runs smoothly from order to delivery.',
    initials: 'RK',
  },
  {
    name: 'Priya Shah',
    role: 'Creative Director',
    description: 'Transforms ideas into stunning visual designs and layouts.',
    initials: 'PS',
  },
  {
    name: 'Amit Desai',
    role: 'Production Manager',
    description: 'Master of print technology with an eye for color perfection.',
    initials: 'AD',
  },
]

const certifications = [
  'ISO 9001:2015',
  'ISO 14001:2015',
  'FSC Certified',
  'G7 Master',
  'BIS Certified',
]

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
}

export default function AboutPage() {
  const navigate = useNavigationStore((s) => s.navigate)

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
              ABOUT US
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight"
            >
              Crafting Prints That{' '}
              <span className="gold-gradient-text">Tell Stories</span>
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
              Since 2009, Murlidhar Offset has been transforming ideas into
              tangible, premium-quality prints that leave lasting impressions.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Story Visual */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden premium-shadow-lg">
                {/* Placeholder for company image */}
                <div className="aspect-[4/3] navy-gradient flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-20 h-20 rounded-2xl gold-gradient flex items-center justify-center mx-auto mb-4 premium-shadow-lg">
                      <Printer className="size-10 text-navy" />
                    </div>
                    <p className="text-white font-bold text-xl">Murlidhar Offset</p>
                    <p className="text-gold text-sm mt-1">Since 2009</p>
                  </div>
                </div>
                {/* Gold corner accent */}
                <div className="absolute top-0 right-0 w-24 h-24 overflow-hidden">
                  <div className="absolute top-0 right-0 w-12 h-12 bg-gold/10 transform rotate-45 translate-x-6 -translate-y-6" />
                </div>
              </div>
              {/* Floating stat card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="absolute -bottom-6 -right-2 md:right-4"
              >
                <Card className="gold-border bg-background premium-shadow-lg">
                  <CardContent className="p-4 text-center">
                    <p className="text-3xl font-bold gold-gradient-text">15+</p>
                    <p className="text-xs text-muted-foreground font-medium">
                      Years of Excellence
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>

            {/* Story Text */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-gold text-gold text-xs font-semibold mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-gold" />
                OUR STORY
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">
                From a Small Press to a{' '}
                <span className="gold-gradient-text">Printing Powerhouse</span>
              </h2>
              <div className="w-16 h-0.5 gold-gradient mb-6" />
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Founded in 2009 in the heart of Rajkot, Gujarat, Murlidhar
                  Offset began as a humble printing press with a bold ambition —
                  to redefine what quality printing means in India.
                </p>
                <p>
                  What started with a single offset machine and a team of three
                  has grown into a full-scale printing facility equipped with
                  state-of-the-art technology, serving over 5,000 clients
                  across the nation.
                </p>
                <p>
                  Our founder, Mr. Murlidhar Patel, believed that every piece of
                  printed material tells a story — from a business card that
                  opens doors to wedding invitations that celebrate life&apos;s
                  most precious moments. That belief continues to drive
                  everything we do.
                </p>
              </div>
              <div className="flex flex-wrap gap-3 mt-6">
                <Badge className="gold-border text-gold">Est. 2009</Badge>
                <Badge className="gold-border text-gold">Rajkot, Gujarat</Badge>
                <Badge className="gold-border text-gold">5000+ Clients</Badge>
                <Badge className="gold-border text-gold">Pan-India</Badge>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 md:py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-12">
            <motion.div
              {...fadeUp}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-gold text-gold text-xs font-semibold mb-4"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-gold" />
              OUR PURPOSE
            </motion.div>
            <motion.h2
              {...fadeUp}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-4xl font-bold text-navy mb-3"
            >
              Mission & <span className="gold-gradient-text">Vision</span>
            </motion.h2>
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="w-20 h-0.5 gold-gradient mx-auto mb-4"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Mission */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Card className="h-full border-border/50 hover:border-gold/30 transition-all duration-300 premium-shadow overflow-hidden">
                <CardContent className="p-8">
                  <div className="w-14 h-14 rounded-xl gold-gradient flex items-center justify-center mb-6">
                    <Target className="size-7 text-navy" />
                  </div>
                  <h3 className="text-2xl font-bold text-navy mb-4">
                    Our Mission
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    To deliver exceptional printing solutions that combine
                    traditional craftsmanship with modern technology, empowering
                    businesses and individuals to communicate their stories with
                    impact and distinction. We strive to make premium printing
                    accessible, reliable, and sustainable for every client.
                  </p>
                  <div className="mt-6 space-y-2">
                    {[
                      'Deliver unmatched print quality',
                      'Embrace sustainable practices',
                      'Provide exceptional customer service',
                    ].map((item) => (
                      <div
                        key={item}
                        className="flex items-center gap-2 text-sm"
                      >
                        <CheckCircle2 className="size-4 text-gold shrink-0" />
                        <span className="text-muted-foreground">{item}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Vision */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
            >
              <Card className="h-full border-border/50 hover:border-gold/30 transition-all duration-300 premium-shadow overflow-hidden">
                <CardContent className="p-8">
                  <div className="w-14 h-14 rounded-xl navy-gradient flex items-center justify-center mb-6">
                    <Eye className="size-7 text-gold" />
                  </div>
                  <h3 className="text-2xl font-bold text-navy mb-4">
                    Our Vision
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    To become India&apos;s most trusted and innovative printing
                    partner, recognized for our commitment to quality,
                    sustainability, and customer delight. We envision a future
                    where every printed piece carries the mark of excellence.
                  </p>
                  <div className="mt-6 space-y-2">
                    {[
                      'India\'s leading printing partner',
                      'Pioneer in print technology',
                      'Benchmark for quality & sustainability',
                    ].map((item) => (
                      <div
                        key={item}
                        className="flex items-center gap-2 text-sm"
                      >
                        <CheckCircle2 className="size-4 text-gold shrink-0" />
                        <span className="text-muted-foreground">{item}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 md:py-24 bg-navy relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gold/3 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Section Header */}
          <div className="text-center mb-12 md:mb-16">
            <motion.div
              {...fadeUp}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-gold text-gold text-xs font-semibold mb-4"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-gold" />
              CORE VALUES
            </motion.div>
            <motion.h2
              {...fadeUp}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-4xl font-bold text-white mb-3"
            >
              What We <span className="gold-gradient-text">Stand For</span>
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
              These values aren&apos;t just words on a wall — they guide every
              decision, every print, and every interaction.
            </motion.p>
          </div>

          {/* Values Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coreValues.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                whileHover={{ y: -4 }}
                className="group relative p-6 md:p-7 rounded-xl bg-white/5 border border-white/10 hover:border-gold/30 transition-all duration-300 hover:bg-white/[0.08]"
              >
                {/* Gold accent corner */}
                <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden rounded-tr-xl">
                  <div className="absolute top-0 right-0 w-8 h-8 bg-gold/10 transform rotate-45 translate-x-4 -translate-y-4 group-hover:bg-gold/20 transition-colors" />
                </div>
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${value.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  <value.icon className="size-6 text-white" />
                </div>
                <h3 className="text-white font-semibold text-lg mb-2 group-hover:text-gold-light transition-colors">
                  {value.title}
                </h3>
                <p className="text-white/50 text-sm leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-12">
            <motion.div
              {...fadeUp}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-gold text-gold text-xs font-semibold mb-4"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-gold" />
              OUR TEAM
            </motion.div>
            <motion.h2
              {...fadeUp}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-4xl font-bold text-navy mb-3"
            >
              The People Behind the{' '}
              <span className="gold-gradient-text">Prints</span>
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
              A dedicated team of professionals who bring passion and expertise
              to every project.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="group text-center border-border/50 hover:border-gold/30 transition-all duration-300 hover:premium-shadow-lg overflow-hidden">
                  <CardContent className="p-6">
                    <div className="w-20 h-20 rounded-full navy-gradient flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 premium-shadow">
                      <span className="text-gold font-bold text-xl">
                        {member.initials}
                      </span>
                    </div>
                    <h4 className="font-semibold text-navy text-lg mb-1">
                      {member.name}
                    </h4>
                    <p className="text-gold text-sm font-medium mb-3">
                      {member.role}
                    </p>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {member.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline / Milestones */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-12">
            <motion.div
              {...fadeUp}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-gold text-gold text-xs font-semibold mb-4"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-gold" />
              OUR JOURNEY
            </motion.div>
            <motion.h2
              {...fadeUp}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-4xl font-bold text-navy mb-3"
            >
              Milestones That{' '}
              <span className="gold-gradient-text">Define Us</span>
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
              Every milestone marks a chapter of growth, innovation, and
              unwavering commitment to excellence.
            </motion.p>
          </div>

          {/* Timeline */}
          <div className="relative">
            {/* Center line - desktop */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-gold/20 via-gold/40 to-gold/20 -translate-x-1/2" />
            {/* Left line - mobile */}
            <div className="md:hidden absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-gold/20 via-gold/40 to-gold/20" />

            <div className="space-y-8 md:space-y-12">
              {milestones.map((milestone, index) => {
                const isLeft = index % 2 === 0
                return (
                  <motion.div
                    key={milestone.year}
                    initial={{
                      opacity: 0,
                      x: isLeft ? -30 : 30,
                    }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className={`relative flex items-center gap-4 md:gap-8 ${
                      isLeft ? 'md:flex-row' : 'md:flex-row-reverse'
                    }`}
                  >
                    {/* Content */}
                    <div
                      className={`flex-1 ml-12 md:ml-0 ${
                        isLeft ? 'md:text-right' : 'md:text-left'
                      }`}
                    >
                      <Card className="inline-block border-border/50 hover:border-gold/30 transition-all duration-300 premium-shadow">
                        <CardContent className="p-5 md:p-6">
                          <div
                            className={`flex items-center gap-3 mb-2 ${
                              isLeft ? 'md:justify-end' : ''
                            }`}
                          >
                            <div className="w-9 h-9 rounded-lg gold-gradient flex items-center justify-center shrink-0">
                              <milestone.icon className="size-4 text-navy" />
                            </div>
                            <Badge className="gold-gradient text-navy font-bold text-xs border-0">
                              {milestone.year}
                            </Badge>
                          </div>
                          <h4 className="font-semibold text-navy text-lg mb-1">
                            {milestone.title}
                          </h4>
                          <p className="text-muted-foreground text-sm leading-relaxed">
                            {milestone.description}
                          </p>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Center dot - desktop */}
                    <div className="hidden md:flex w-10 h-10 rounded-full gold-gradient items-center justify-center shrink-0 premium-shadow z-10">
                      <Calendar className="size-4 text-navy" />
                    </div>

                    {/* Mobile dot */}
                    <div className="md:hidden absolute left-3.5 w-5 h-5 rounded-full gold-gradient flex items-center justify-center premium-shadow z-10">
                      <div className="w-2 h-2 rounded-full bg-navy" />
                    </div>

                    {/* Empty space for alignment */}
                    <div className="hidden md:block flex-1" />
                  </motion.div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Certifications & Partnerships */}
      <section className="py-16 md:py-20 bg-navy relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/3 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Section Header */}
          <div className="text-center mb-12">
            <motion.div
              {...fadeUp}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-gold text-gold text-xs font-semibold mb-4"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-gold" />
              CERTIFICATIONS
            </motion.div>
            <motion.h2
              {...fadeUp}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-4xl font-bold text-white mb-3"
            >
              Certified <span className="gold-gradient-text">Excellence</span>
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
              Our commitment to quality is backed by internationally recognized
              certifications and industry partnerships.
            </motion.p>
          </div>

          {/* Certifications Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {certifications.map((cert, index) => (
              <motion.div
                key={cert}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                whileHover={{ y: -4 }}
                className="group p-5 rounded-xl bg-white/5 border border-white/10 hover:border-gold/30 transition-all duration-300 hover:bg-white/[0.08] text-center"
              >
                <div className="w-12 h-12 rounded-full gold-gradient flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                  <Award className="size-5 text-navy" />
                </div>
                <p className="text-white text-sm font-semibold">{cert}</p>
              </motion.div>
            ))}
          </div>

          <Separator className="bg-white/10 my-10" />

          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: '15+', label: 'Years in Business' },
              { value: '5,000+', label: 'Happy Clients' },
              { value: '50,000+', label: 'Projects Delivered' },
              { value: '99.5%', label: 'Satisfaction Rate' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <p className="text-3xl md:text-4xl font-bold gold-gradient-text mb-1">
                  {stat.value}
                </p>
                <p className="text-white/50 text-sm">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA to Contact Page */}
      <section className="py-16 md:py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto"
          >
            <div className="w-16 h-16 rounded-2xl gold-gradient flex items-center justify-center mx-auto mb-6 premium-shadow">
              <Sparkles className="size-8 text-navy" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">
              Ready to Start Your <span className="gold-gradient-text">Project?</span>
            </h2>
            <p className="text-muted-foreground mb-8">
              Whether it&apos;s a custom quote, a design consultation, or just a
              friendly chat about your printing needs — we&apos;re here for you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="gold-gradient text-navy font-semibold hover:opacity-90 transition-opacity"
                onClick={() => navigate('contact')}
              >
                Contact Us
                <ArrowRight className="size-4 ml-2" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-gold/30 text-gold hover:bg-gold/5"
                onClick={() => navigate('products')}
              >
                Browse Products
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
