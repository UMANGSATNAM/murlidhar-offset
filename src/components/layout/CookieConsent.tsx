'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useNavigationStore } from '@/lib/store'

const CONSENT_KEY = 'murlidhar-offset-cookie-consent'

interface CookiePreferences {
  essential: boolean
  analytics: boolean
  marketing: boolean
  accepted: boolean
  timestamp: string
}

function getStoredConsent(): CookiePreferences | null {
  if (typeof window === 'undefined') return null
  try {
    const stored = localStorage.getItem(CONSENT_KEY)
    return stored ? JSON.parse(stored) : null
  } catch {
    return null
  }
}

function storeConsent(prefs: CookiePreferences) {
  try {
    localStorage.setItem(CONSENT_KEY, JSON.stringify(prefs))
  } catch {
    // localStorage unavailable
  }
}

export default function CookieConsent() {
  const { navigate } = useNavigationStore()
  const [visible, setVisible] = useState(false)
  const [showCustomize, setShowCustomize] = useState(false)
  const [analytics, setAnalytics] = useState(false)
  const [marketing, setMarketing] = useState(false)

  useEffect(() => {
    const stored = getStoredConsent()
    if (!stored || !stored.accepted) {
      // Show banner after a short delay for better UX
      const timer = setTimeout(() => setVisible(true), 1200)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleAcceptAll = () => {
    storeConsent({
      essential: true,
      analytics: true,
      marketing: true,
      accepted: true,
      timestamp: new Date().toISOString(),
    })
    setVisible(false)
  }

  const handleSavePreferences = () => {
    storeConsent({
      essential: true,
      analytics,
      marketing,
      accepted: true,
      timestamp: new Date().toISOString(),
    })
    setVisible(false)
  }

  const handleDismiss = () => {
    setVisible(false)
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed bottom-0 left-0 right-0 z-[60] p-4 sm:p-6"
        >
          <div className="max-w-4xl mx-auto bg-navy rounded-2xl premium-shadow-xl border border-gold/15 overflow-hidden relative">
            {/* Close button */}
            <button
              onClick={handleDismiss}
              className="absolute top-3 right-3 text-white/50 hover:text-white transition-colors z-10"
              aria-label="Close cookie banner"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="p-5 sm:p-6">
              {/* Main content */}
              <div className="flex items-start gap-3 mb-4">
                <Shield className="h-5 w-5 text-gold shrink-0 mt-0.5" />
                <p className="text-sm text-white/80 leading-relaxed">
                  We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.{' '}
                  <button
                    onClick={() => navigate('privacy')}
                    className="text-gold hover:text-gold-light underline underline-offset-2 transition-colors"
                  >
                    Privacy Policy
                  </button>
                </p>
              </div>

              {/* Customize panel */}
              <AnimatePresence>
                {showCustomize && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="bg-white/5 rounded-xl p-4 mb-4 space-y-3">
                      <h4 className="text-xs font-semibold text-gold uppercase tracking-wider">
                        Cookie Preferences
                      </h4>
                      {/* Essential */}
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-white font-medium">Essential</p>
                          <p className="text-[11px] text-white/50">Required for the site to function</p>
                        </div>
                        <div className="w-10 h-5 rounded-full bg-gold flex items-center justify-end px-0.5">
                          <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
                        </div>
                      </div>
                      {/* Analytics */}
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-white font-medium">Analytics</p>
                          <p className="text-[11px] text-white/50">Help us improve our website</p>
                        </div>
                        <button
                          onClick={() => setAnalytics(!analytics)}
                          className={`w-10 h-5 rounded-full flex items-center px-0.5 transition-colors ${
                            analytics ? 'bg-gold justify-end' : 'bg-white/20 justify-start'
                          }`}
                        >
                          <div className="w-4 h-4 rounded-full bg-white shadow-sm transition-transform" />
                        </button>
                      </div>
                      {/* Marketing */}
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-white font-medium">Marketing</p>
                          <p className="text-[11px] text-white/50">Personalized content & ads</p>
                        </div>
                        <button
                          onClick={() => setMarketing(!marketing)}
                          className={`w-10 h-5 rounded-full flex items-center px-0.5 transition-colors ${
                            marketing ? 'bg-gold justify-end' : 'bg-white/20 justify-start'
                          }`}
                        >
                          <div className="w-4 h-4 rounded-full bg-white shadow-sm transition-transform" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <Button
                  onClick={handleAcceptAll}
                  className="gold-gradient hover:opacity-90 text-navy font-bold rounded-xl h-10 px-6"
                >
                  Accept All
                </Button>
                {!showCustomize ? (
                  <Button
                    variant="outline"
                    onClick={() => setShowCustomize(true)}
                    className="border-gold/30 text-gold hover:bg-gold/10 hover:text-gold rounded-xl h-10"
                  >
                    Customize
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    onClick={handleSavePreferences}
                    className="border-gold/30 text-gold hover:bg-gold/10 hover:text-gold rounded-xl h-10"
                  >
                    Save Preferences
                  </Button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
