'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Lock, Mail, Shield, Store } from 'lucide-react'
import { useAdminAuthStore } from '@/lib/admin-auth-store'
import { useNavigationStore } from '@/lib/store'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAdminAuthStore()
  const { navigate } = useNavigationStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    // Simulate a brief delay for UX
    await new Promise((resolve) => setTimeout(resolve, 800))

    const success = login(email, password)
    if (success) {
      navigate('admin')
    } else {
      setError('Invalid email or password. Please try again.')
    }
    setIsLoading(false)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-navy via-navy-dark to-navy p-4">
      {/* Background decorative elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-gold/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-gold/5 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/[0.03] blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-md"
      >
        <Card className="border-white/10 bg-white/[0.03] shadow-2xl backdrop-blur-xl">
          <CardHeader className="space-y-6 pb-2 text-center">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mx-auto flex flex-col items-center gap-3"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl gold-gradient shadow-lg shadow-gold/20">
                <Store className="h-8 w-8 text-navy" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  Murlidhar Offset
                </h1>
                <p className="mt-1 text-sm text-white/50">Printing Solutions</p>
              </div>
            </motion.div>

            {/* Admin Panel Badge */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="flex items-center justify-center gap-2"
            >
              <div className="flex items-center gap-1.5 rounded-full bg-gold/10 px-4 py-1.5 ring-1 ring-gold/20">
                <Shield className="h-3.5 w-3.5 text-gold" />
                <span className="text-xs font-semibold tracking-wider text-gold uppercase">
                  Admin Panel
                </span>
              </div>
            </motion.div>
          </CardHeader>

          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Field */}
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.4 }}
                className="space-y-2"
              >
                <Label
                  htmlFor="email"
                  className="text-sm font-medium text-white/70"
                >
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@murlidhar.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      setError('')
                    }}
                    className="h-11 border-white/10 bg-white/[0.05] pl-10 text-white placeholder:text-white/25 focus:border-gold/50 focus:ring-gold/20"
                    autoComplete="email"
                    required
                  />
                </div>
              </motion.div>

              {/* Password Field */}
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.4 }}
                className="space-y-2"
              >
                <Label
                  htmlFor="password"
                  className="text-sm font-medium text-white/70"
                >
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      setError('')
                    }}
                    className="h-11 border-white/10 bg-white/[0.05] pl-10 pr-11 text-white placeholder:text-white/25 focus:border-gold/50 focus:ring-gold/20"
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 transition-colors hover:text-white/60"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </motion.div>

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3"
                >
                  <p className="text-sm text-red-400">{error}</p>
                </motion.div>
              )}

              {/* Submit Button */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.4 }}
              >
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="h-11 w-full gold-gradient text-navy font-semibold text-base shadow-lg shadow-gold/20 transition-all hover:shadow-xl hover:shadow-gold/30 disabled:opacity-60"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <svg
                        className="h-4 w-4 animate-spin"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Signing In...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Lock className="h-4 w-4" />
                      Sign In
                    </span>
                  )}
                </Button>
              </motion.div>
            </form>

            {/* Footer Note */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.5 }}
              className="mt-8 text-center"
            >
              <p className="text-[11px] text-white/20">
                Secure admin access for Murlidhar Offset
              </p>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
