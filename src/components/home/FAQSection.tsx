'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

interface FAQ {
  id: string
  title: string | null
  content: string | null
  key: string
}

const fallbackFAQs: FAQ[] = [
  {
    id: '1',
    title: 'What types of printing services do you offer?',
    content:
      'We offer a comprehensive range of printing services including offset printing, digital printing, large format printing, and specialty printing. Our services cover business cards, wedding cards, brochures, packaging, stickers, banners, letterheads, envelopes, and much more.',
    key: 'services',
  },
  {
    id: '2',
    title: 'What is the typical turnaround time?',
    content:
      'Our standard turnaround time is 24-48 hours for most products. For bulk orders or specialty items, it may take 3-5 business days. Rush delivery options are available for urgent orders at an additional charge.',
    key: 'turnaround',
  },
  {
    id: '3',
    title: 'Do you provide GST invoicing?',
    content:
      'Yes, we provide fully compliant GST invoices for all business orders. Our GST number is included on all invoices, making it easy for you to claim input tax credit.',
    key: 'gst',
  },
  {
    id: '4',
    title: 'What file formats do you accept for printing?',
    content:
      'We accept most common file formats including PDF, CDR (CorelDRAW), AI (Adobe Illustrator), PSD (Photoshop), and high-resolution JPG/PNG. For best results, we recommend submitting files in PDF format with at least 300 DPI resolution.',
    key: 'file-formats',
  },
  {
    id: '5',
    title: 'Do you offer design services?',
    content:
      'Yes! Our in-house design team can create custom designs for any product. You can also choose from our extensive template library. Design services start at ₹500 depending on the complexity of the design.',
    key: 'design',
  },
  {
    id: '6',
    title: 'What are your payment options?',
    content:
      'We accept multiple payment methods including UPI, bank transfer (NEFT/RTGS/IMPS), credit/debit cards, and cash. For bulk orders, we also offer partial payment options with the balance due upon delivery.',
    key: 'payment',
  },
  {
    id: '7',
    title: 'Do you deliver across India?',
    content:
      'Yes, we deliver across India! We partner with reliable courier services to ensure safe and timely delivery. Shipping charges vary based on the delivery location and order weight. Free shipping is available on orders above ₹2,000.',
    key: 'delivery',
  },
  {
    id: '8',
    title: 'What is your return/refund policy?',
    content:
      'We stand behind the quality of our prints. If there are any manufacturing defects or the product doesn\'t match the approved design, we will reprint and replace it at no extra charge. Due to the custom nature of printing, returns are not accepted for design errors approved by the customer.',
    key: 'returns',
  },
]

export default function FAQSection() {
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [openItem, setOpenItem] = useState<string | null>(null)

  useEffect(() => {
    async function fetchFAQs() {
      try {
        const res = await fetch('/api/cms?section=faq')
        const data = await res.json()
        if (data.contents && data.contents.length > 0) {
          setFaqs(data.contents)
        } else {
          setFaqs(fallbackFAQs)
        }
      } catch {
        setFaqs(fallbackFAQs)
      }
    }
    fetchFAQs()
  }, [])

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-white to-muted/30">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-muted text-gold text-xs font-semibold mb-4"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-gold" />
            FAQ
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-bold text-navy mb-3"
          >
            Frequently Asked Questions
          </motion.h2>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="w-20 h-0.5 gold-gradient mx-auto"
          />
        </div>

        {/* FAQ Accordion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <Accordion
            type="single"
            collapsible
            className="w-full"
            onValueChange={(val) => setOpenItem(val || null)}
          >
            {faqs.map((faq, index) => (
              <AccordionItem
                key={faq.id}
                value={faq.id}
                className={`border-border/60 transition-all duration-300 ${
                  openItem === faq.id
                    ? 'border-gold/30 bg-gold/[0.03] rounded-lg gold-border-glow mb-2'
                    : 'hover:border-gold/20 mb-1'
                }`}
              >
                <AccordionTrigger className="text-navy font-medium text-sm md:text-base hover:text-gold-dark hover:no-underline py-5 transition-colors px-4">
                  <span className="text-left flex items-center gap-3">
                    <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 transition-all duration-300 ${
                      openItem === faq.id
                        ? 'gold-gradient text-navy'
                        : 'bg-gold/10 text-gold'
                    }`}>
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    {faq.title}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm leading-relaxed pl-10 pr-4 pb-5">
                  <AnimatePresence>
                    {openItem === faq.id && (
                      <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.2 }}
                      >
                        {faq.content}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  )
}
