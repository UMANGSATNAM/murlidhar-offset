'use client'

import React from 'react'
import { motion } from 'framer-motion'
import {
  Shield,
  FileText,
  RotateCcw,
  ChevronRight,
  ArrowRight,
  Phone,
  Mail,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { useNavigationStore } from '@/lib/store'

type PolicyType = 'privacy' | 'terms' | 'refund'

interface PolicyPageProps {
  type: PolicyType
}

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
}

const policyConfig: Record<PolicyType, {
  title: string
  subtitle: string
  badge: string
  icon: React.ElementType
  lastUpdated: string
}> = {
  privacy: {
    title: 'Privacy Policy',
    subtitle: 'How we collect, use, and protect your personal information',
    badge: 'YOUR DATA MATTERS',
    icon: Shield,
    lastUpdated: 'March 1, 2025',
  },
  terms: {
    title: 'Terms of Service',
    subtitle: 'The terms and conditions governing your use of our services',
    badge: 'LEGAL AGREEMENT',
    icon: FileText,
    lastUpdated: 'March 1, 2025',
  },
  refund: {
    title: 'Refund Policy',
    subtitle: 'Our commitment to fair returns, refunds, and exchanges',
    badge: 'CUSTOMER FIRST',
    icon: RotateCcw,
    lastUpdated: 'March 1, 2025',
  },
}

const privacySections = [
  {
    title: '1. Information We Collect',
    content: [
      'We collect information you provide directly to us when you place an order, create an account, subscribe to our newsletter, or contact our support team. This includes your name, email address, phone number, shipping address, billing address, and GST information.',
      'When you upload artwork or design files for printing, we temporarily store these files on our secure servers to process your order. Files are retained for 30 days after order completion for reprint purposes, after which they are permanently deleted.',
      'We also automatically collect certain information when you visit our website, including your IP address, browser type, device information, pages visited, and referring URL. This data helps us improve our website performance and user experience.',
    ],
  },
  {
    title: '2. How We Use Your Information',
    content: [
      'Process and fulfill your printing orders, including production, quality checks, and delivery coordination.',
      'Communicate order status updates via SMS, email, and WhatsApp as your order progresses through production stages.',
      'Generate GST-compliant invoices and maintain financial records as required by Indian tax regulations.',
      'Improve our products, services, and website based on customer feedback and usage patterns.',
      'Send promotional communications about new products, seasonal offers, and printing tips (with your consent).',
      'Respond to your inquiries, provide customer support, and resolve any issues related to your orders.',
    ],
  },
  {
    title: '3. Cookies & Tracking',
    content: [
      'Our website uses essential cookies to maintain your shopping cart, wishlist, and login session. These cookies are necessary for the website to function properly and cannot be disabled.',
      'We use analytics cookies (Google Analytics) to understand how visitors interact with our website. This helps us improve page load times, navigation flow, and content relevance.',
      'Marketing cookies may be used to show you relevant advertisements on other platforms. You can opt out of non-essential cookies through the cookie consent banner on your first visit.',
    ],
  },
  {
    title: '4. Third-Party Sharing',
    content: [
      'We share your shipping information with our logistics partners (DTDC, Delhivery, India Post) solely for the purpose of delivering your orders. These partners are contractually obligated to handle your data securely.',
      'Payment processing is handled through Razorpay/Stripe, who maintain their own security certifications (PCI DSS compliant). We do not store your complete credit/debit card details on our servers.',
      'We do not sell, rent, or trade your personal information to any third parties for marketing purposes.',
    ],
  },
  {
    title: '5. Your Rights',
    content: [
      'Access: You can request a copy of all personal data we hold about you at any time.',
      'Correction: You can update or correct your personal information through your account dashboard or by contacting us.',
      'Deletion: You can request deletion of your account and associated data. Note that certain transaction records must be retained per Indian tax laws.',
      'Opt-out: You can unsubscribe from marketing communications at any time via the link in our emails or by contacting us directly.',
    ],
  },
  {
    title: '6. Data Security',
    content: [
      'We implement industry-standard security measures including SSL/TLS encryption, secure server infrastructure, and regular security audits to protect your data.',
      'All payment transactions are processed through PCI DSS-compliant payment gateways. Your financial data never touches our servers directly.',
      'In the event of a data breach, we will notify affected users within 72 hours as required by applicable Indian data protection regulations.',
    ],
  },
  {
    title: '7. Contact Us',
    content: [
      'For any privacy-related questions or concerns, please contact our Data Protection Officer:',
      'Email: privacy@murlidharoffset.com',
      'Phone: +91 98765 43210',
      'Address: Plot No. 45, GIDC Industrial Estate, Rajkot, Gujarat 360002, India',
    ],
  },
]

const termsSections = [
  {
    title: '1. Acceptance of Terms',
    content: [
      'By accessing or using the Murlidhar Offset website and placing orders, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you should not use our services.',
      'These terms apply to all customers, including individuals, businesses, and resellers. By placing an order, you confirm that you have the legal authority to do so.',
      'We reserve the right to update these terms at any time. Continued use of our services after changes constitutes acceptance of the revised terms.',
    ],
  },
  {
    title: '2. Orders & Production',
    content: [
      'All orders are subject to acceptance and availability. We reserve the right to refuse or cancel orders for any reason, including pricing errors or suspected fraud.',
      'Production timelines are estimates and may vary based on order complexity, quantity, and current workload. Standard orders typically take 3-5 business days; bulk orders may take 7-10 business days.',
      'Once an order enters production, it cannot be cancelled or modified. Changes requested before production starts are subject to review and may incur additional charges.',
      'Custom-printed products are manufactured to your specifications. Color variations of up to 10% from screen displays are considered acceptable in the printing industry.',
    ],
  },
  {
    title: '3. Pricing & Payment',
    content: [
      'All prices are displayed in Indian Rupees (₹) and are inclusive of applicable taxes unless stated otherwise. Prices are subject to change without prior notice.',
      'GST (Goods and Services Tax) at 18% is applicable on all printing services as per Indian tax regulations. GST invoices are provided for all orders.',
      'Payment must be made in full before production begins, unless prior credit arrangements have been approved in writing.',
      'We accept UPI, net banking, credit/debit cards, and bank transfers. Cash on Delivery (COD) may be available for select orders within Gujarat.',
    ],
  },
  {
    title: '4. Artwork & Design',
    content: [
      'You are responsible for ensuring that all artwork, designs, and content submitted for printing do not infringe on any third-party intellectual property rights, trademarks, or copyrights.',
      'Murlidhar Offset reserves the right to refuse printing any content that is illegal, defamatory, obscene, or violates any applicable Indian laws.',
      'By submitting artwork for printing, you grant Murlidhar Offset a limited, non-exclusive license to reproduce the artwork solely for fulfilling your order.',
      'Our design team may suggest modifications to ensure print quality. Major design changes require your written approval before production.',
    ],
  },
  {
    title: '5. Intellectual Property',
    content: [
      'All content on the Murlidhar Offset website, including text, graphics, logos, and images, is the property of Murlidhar Offset and is protected by Indian copyright laws.',
      'Our proprietary printing processes, templates, and design methodologies are trade secrets and may not be reproduced or used without written permission.',
      'Customer artwork and designs remain the property of the respective customers. We do not claim ownership of your submitted designs.',
    ],
  },
  {
    title: '6. Shipping & Delivery',
    content: [
      'We ship across India via trusted logistics partners. Shipping charges are calculated based on weight, dimensions, and delivery pincode.',
      'Delivery timelines are estimates and may vary due to factors beyond our control, including weather, strikes, or logistics partner delays.',
      'Risk of loss transfers to the customer upon handover to the logistics partner. We provide tracking information for all shipments.',
      'Free shipping is available on orders above ₹5,000 within Gujarat and ₹10,000 for other states.',
    ],
  },
  {
    title: '7. Limitation of Liability',
    content: [
      'Murlidhar Offset\'s total liability for any claim arising from or related to your order shall not exceed the amount paid for the specific order in question.',
      'We are not liable for indirect, incidental, consequential, or punitive damages, including loss of profits, data, or business opportunities.',
      'We are not responsible for delays or failures caused by events beyond our reasonable control (force majeure), including natural disasters, pandemics, or government actions.',
    ],
  },
  {
    title: '8. Governing Law',
    content: [
      'These terms are governed by and construed in accordance with the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in Rajkot, Gujarat.',
      'We encourage customers to contact us first to resolve any disputes amicably before pursuing legal action.',
    ],
  },
]

const refundSections = [
  {
    title: '1. Eligibility for Returns & Refunds',
    content: [
      'You may request a return or refund within 7 days of receiving your order if the product has manufacturing defects, printing errors, or is significantly different from the approved design proof.',
      'Custom-printed products with accurate specifications and approved artwork are not eligible for return unless there is a verifiable production defect.',
      'To be eligible, the product must be unused, in its original packaging, and in the same condition as received.',
      'Products damaged during shipping must be reported within 48 hours of delivery with photographic evidence.',
    ],
  },
  {
    title: '2. Refund Process',
    content: [
      'Step 1: Contact our support team via email (orders@murlidharoffset.com), phone (+91 98765 43210), or WhatsApp with your order number and photos of the issue.',
      'Step 2: Our quality team will review your claim within 24-48 business hours and may request additional information or photos.',
      'Step 3: If approved, we will arrange a pickup or reprint. For refunds, the amount will be credited to your original payment method within 7-10 business days.',
      'Step 4: You will receive a confirmation email/SMS once the refund has been processed by our payment partner.',
    ],
  },
  {
    title: '3. Non-Refundable Items',
    content: [
      'Custom-designed products with approved artwork proofs where the final print matches the proof.',
      'Products that have been used, altered, or damaged by the customer after delivery.',
      'Orders cancelled after production has begun. Once printing starts, materials and resources have been committed.',
      'Digital design services, file preparation charges, and rush order surcharges.',
      'Products purchased during clearance or final sale promotions (clearly marked at the time of purchase).',
    ],
  },
  {
    title: '4. Return Shipping',
    content: [
      'If the return is due to a manufacturing defect or our error, we will arrange and bear the cost of return shipping.',
      'If the return is due to a change of mind or customer error (e.g., wrong specifications provided), the customer is responsible for return shipping costs.',
      'Return pickups are available within Gujarat. For other states, customers may need to ship the product back to our facility in Rajkot.',
      'We recommend using a trackable shipping service for returns. We are not responsible for items lost in transit during return shipping.',
    ],
  },
  {
    title: '5. Replacement & Reprint',
    content: [
      'For production defects, we offer a free reprint as the first option. The reprint will be given priority in our production queue.',
      'If a reprint is not feasible (e.g., time-sensitive event materials), a full refund will be issued instead.',
      'Reprints will be produced to the same specifications as the original order. Any requested changes to the reprint will be treated as a new order.',
    ],
  },
  {
    title: '6. Refund Timeline',
    content: [
      'Refund requests are reviewed within 1-2 business days of receiving the returned product.',
      'Approved refunds are processed within 3-5 business days through our payment gateway.',
      'The refund amount will reflect in your account within 7-10 business days, depending on your bank or payment provider.',
      'Refunds for UPI payments are typically faster (2-3 business days), while credit card refunds may take 5-7 business days.',
    ],
  },
  {
    title: '7. Partial Refunds',
    content: [
      'Partial refunds may be offered in cases where the defect is minor and does not significantly affect the usability of the product.',
      'The partial refund amount is determined on a case-by-case basis, typically ranging from 10-50% of the order value.',
      'Color variation within industry-standard tolerance (up to 10% from screen display) does not qualify for a partial refund.',
    ],
  },
  {
    title: '8. Contact for Returns',
    content: [
      'Email: orders@murlidharoffset.com',
      'Phone: +91 98765 43210 (Mon-Sat, 9 AM - 7 PM IST)',
      'WhatsApp: +91 98765 43210',
      'Address: Plot No. 45, GIDC Industrial Estate, Rajkot, Gujarat 360002, India',
    ],
  },
]

const sectionsMap: Record<PolicyType, typeof privacySections> = {
  privacy: privacySections,
  terms: termsSections,
  refund: refundSections,
}

export default function PolicyPage({ type }: PolicyPageProps) {
  const navigate = useNavigationStore((s) => s.navigate)
  const config = policyConfig[type]
  const sections = sectionsMap[type]
  const Icon = config.icon

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
              {config.badge}
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight"
            >
              {config.title.split(' ').map((word, i, arr) =>
                i === arr.length - 1 ? (
                  <span key={i} className="gold-gradient-text">{word}</span>
                ) : (
                  <span key={i}>{word} </span>
                )
              )}
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
              {config.subtitle}
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-4 flex items-center gap-2 text-white/40 text-sm"
            >
              <Icon className="size-4" />
              Last Updated: {config.lastUpdated}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Quick Navigation */}
      <section className="py-6 bg-background border-b border-border/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <span className="text-muted-foreground text-xs font-medium shrink-0">Jump to:</span>
            {sections.map((section, index) => (
              <a
                key={index}
                href={`#section-${index}`}
                className="text-xs text-muted-foreground hover:text-gold transition-colors whitespace-nowrap shrink-0 px-2 py-1 rounded-md hover:bg-gold/5"
              >
                {section.title}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Policy Content */}
      <section className="py-12 md:py-16 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {sections.map((section, index) => (
              <motion.div
                key={index}
                id={`section-${index}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="border-border/50 hover:border-gold/20 transition-colors duration-300 overflow-hidden">
                  <CardContent className="p-6 md:p-8">
                    <h2 className="text-xl md:text-2xl font-bold text-navy mb-4 flex items-center gap-3">
                      <span className="w-8 h-8 rounded-lg gold-gradient flex items-center justify-center shrink-0">
                        <span className="text-navy font-bold text-sm">{index + 1}</span>
                      </span>
                      {section.title.replace(/^\d+\.\s/, '')}
                    </h2>
                    <div className="space-y-3 pl-11">
                      {section.content.map((paragraph, pIndex) => (
                        <p
                          key={pIndex}
                          className="text-muted-foreground text-sm leading-relaxed"
                        >
                          {paragraph.startsWith('Step') || paragraph.startsWith('Email') || paragraph.startsWith('Phone') || paragraph.startsWith('WhatsApp') || paragraph.startsWith('Address') ? (
                            <span className="text-foreground font-medium">{paragraph}</span>
                          ) : (
                            paragraph
                          )}
                        </p>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Additional Policies Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12"
          >
            <Separator className="bg-border/50 mb-8" />
            <h3 className="text-lg font-bold text-navy mb-4">Related Policies</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {(['privacy', 'terms', 'refund'] as PolicyType[])
                .filter((p) => p !== type)
                .map((policyType) => {
                  const pConfig = policyConfig[policyType]
                  const PIcon = pConfig.icon
                  return (
                    <motion.button
                      key={policyType}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => navigate(policyType)}
                      className="flex items-center gap-3 p-4 rounded-xl border border-border/50 hover:border-gold/30 hover:bg-gold/5 transition-all duration-200 text-left"
                    >
                      <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center shrink-0">
                        <PIcon className="size-5 text-gold" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-foreground text-sm">{pConfig.title}</p>
                        <p className="text-muted-foreground text-xs truncate">{pConfig.subtitle}</p>
                      </div>
                      <ChevronRight className="size-4 text-muted-foreground shrink-0" />
                    </motion.button>
                  )
                })}
            </div>
          </motion.div>

          {/* Contact CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12"
          >
            <Card className="border-gold/20 bg-gold/5 overflow-hidden">
              <CardContent className="p-6 md:p-8">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                  <div className="w-14 h-14 rounded-2xl gold-gradient flex items-center justify-center premium-shadow shrink-0">
                    <Icon className="size-7 text-navy" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-navy text-lg mb-1">Questions About This Policy?</h3>
                    <p className="text-muted-foreground text-sm">
                      Our team is happy to clarify any aspect of our policies. Reach out to us anytime.
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                    <Button
                      onClick={() => navigate('contact')}
                      className="gold-gradient text-navy font-semibold hover:opacity-90 transition-opacity"
                    >
                      <Mail className="size-4 mr-2" />
                      Contact Us
                    </Button>
                    <Button
                      variant="outline"
                      className="border-gold/30 text-gold hover:bg-gold/10"
                      asChild
                    >
                      <a href="tel:+919876543210">
                        <Phone className="size-4 mr-2" />
                        Call Us
                      </a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
