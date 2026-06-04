'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Mail,
  Lock,
  User,
  Phone,
  Building2,
  Eye,
  EyeOff,
  Loader2,
  ChevronRight,
  ArrowLeft,
  Fingerprint,
  Palette,
  Truck,
  IndianRupee,
  FileText,
  ShieldCheck,
} from 'lucide-react'
import { useNavigationStore } from '@/lib/store'
import { useAuthStore } from '@/lib/auth-store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Label } from '@/components/ui/label'

type AuthTab = 'login' | 'register'

const BENEFITS = [
  { icon: Palette, title: 'Free Design Support', desc: 'Professional design assistance at no extra cost' },
  { icon: Truck, title: 'Order Tracking', desc: 'Real-time updates on your print orders' },
  { icon: IndianRupee, title: 'Bulk Discounts', desc: 'Save up to 40% on large quantity orders' },
  { icon: FileText, title: 'GST Invoicing', desc: 'Automatic GST-compliant invoices for businesses' },
]

export default function AuthPage() {
  const { navigate } = useNavigationStore()
  const { login } = useAuthStore()
  const [tab, setTab] = useState<AuthTab>('login')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({})

  // Login form
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')

  // Register form
  const [regName, setRegName] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regPhone, setRegPhone] = useState('')
  const [regPassword, setRegPassword] = useState('')
  const [regConfirmPassword, setRegConfirmPassword] = useState('')
  const [regGst, setRegGst] = useState('')

  const markTouched = (field: string) => {
    setTouchedFields((prev) => ({ ...prev, [field]: true }))
  }

  const getFieldError = (field: string, value: string, validation?: (v: string) => string | null) => {
    if (!touchedFields[field]) return null
    if (!value.trim()) return 'This field is required'
    if (validation) return validation(value)
    return null
  }

  const emailValidation = (v: string) => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return 'Invalid email address'
    return null
  }

  const passwordValidation = (v: string) => {
    if (v.length < 6) return 'Password must be at least 6 characters'
    return null
  }

  const phoneValidation = (v: string) => {
    if (v && !/^\d{10}$/.test(v)) return 'Enter a valid 10-digit number'
    return null
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Mark all fields as touched
    setTouchedFields({ loginEmail: true, loginPassword: true })

    if (!loginEmail || !loginPassword) {
      setError('Please fill in all fields')
      return
    }

    if (emailValidation(loginEmail) || passwordValidation(loginPassword)) {
      setError('Please correct the errors below')
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: loginEmail,
          password: loginPassword,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        login(data.user)
        if (data.user.role === 'admin' || data.user.role === 'super_admin') {
          navigate('admin')
        } else {
          navigate('dashboard')
        }
      } else {
        setError(data.error || 'Login failed')
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Mark all fields as touched
    setTouchedFields({ regName: true, regEmail: true, regPassword: true, regConfirmPassword: true })

    if (!regName || !regEmail || !regPassword) {
      setError('Please fill in all required fields')
      return
    }

    if (regPassword.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    if (regPassword !== regConfirmPassword) {
      setError('Passwords do not match')
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'register',
          name: regName,
          email: regEmail,
          phone: regPhone,
          password: regPassword,
          gstNumber: regGst,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        login(data.user)
        navigate('dashboard')
      } else {
        setError(data.error || 'Registration failed')
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGuestContinue = () => {
    navigate('products')
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Premium Background Pattern */}
      <div className="absolute inset-0 animate-dot-pattern opacity-40" />
      <div className="absolute inset-0 bg-gradient-to-br from-navy/5 via-transparent to-gold/5" />

      {/* Decorative floating elements */}
      <motion.div
        className="absolute top-20 left-10 w-64 h-64 rounded-full bg-gold/5 blur-3xl"
        animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-navy/5 blur-3xl"
        animate={{ y: [0, 15, 0], x: [0, -10, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-5xl flex flex-col lg:flex-row gap-8 items-center">
          {/* LEFT: Auth Card */}
          <div className="w-full max-w-md">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Back button */}
              <button
                onClick={() => navigate('home')}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-gold transition-colors mb-6"
              >
                <ArrowLeft className="size-4" />
                Back to Home
              </button>

              {/* Animated Logo */}
              <div className="text-center mb-8">
                <motion.div
                  className="w-20 h-20 rounded-2xl bg-navy mx-auto flex items-center justify-center mb-4 navy-shadow"
                  initial={{ scale: 0.8, rotate: -10 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                >
                  <motion.span
                    className="text-3xl font-bold text-gold"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    M
                  </motion.span>
                </motion.div>
                <motion.h1
                  className="text-2xl font-bold text-foreground"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  Murlidhar Offset
                </motion.h1>
                <motion.p
                  className="text-sm text-muted-foreground mt-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  Premium Offset Printing Solutions
                </motion.p>
              </div>

              <Card className="premium-shadow-lg overflow-hidden">
                {/* Tabs with improved animation */}
                <div className="flex border-b bg-muted/20">
                  <button
                    onClick={() => { setTab('login'); setError(''); setTouchedFields({}) }}
                    className={`flex-1 py-3.5 text-sm font-semibold transition-all relative ${
                      tab === 'login'
                        ? 'text-gold'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Login
                    {tab === 'login' && (
                      <motion.div
                        layoutId="authTabIndicator"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold"
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      />
                    )}
                  </button>
                  <button
                    onClick={() => { setTab('register'); setError(''); setTouchedFields({}) }}
                    className={`flex-1 py-3.5 text-sm font-semibold transition-all relative ${
                      tab === 'register'
                        ? 'text-gold'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Register
                    {tab === 'register' && (
                      <motion.div
                        layoutId="authTabIndicator"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold"
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      />
                    )}
                  </button>
                </div>

                <CardContent className="p-6">
                  <AnimatePresence mode="wait">
                    {/* Login Form */}
                    {tab === 'login' && (
                      <motion.form
                        key="login"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.25 }}
                        onSubmit={handleLogin}
                        className="space-y-4"
                      >
                        <div>
                          <Label className="text-sm font-medium mb-1.5 block">Email Address *</Label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                            <Input
                              type="email"
                              placeholder="you@example.com"
                              value={loginEmail}
                              onChange={(e) => setLoginEmail(e.target.value)}
                              onBlur={() => markTouched('loginEmail')}
                              className={`pl-10 ${
                                getFieldError('loginEmail', loginEmail, emailValidation)
                                  ? 'border-red-400 focus-visible:border-red-500 focus-visible:ring-red-200'
                                  : touchedFields.loginEmail && loginEmail
                                    ? 'border-green-400 focus-visible:border-green-500 focus-visible:ring-green-200'
                                    : ''
                              }`}
                              autoComplete="email"
                            />
                          </div>
                          {getFieldError('loginEmail', loginEmail, emailValidation) && (
                            <p className="text-xs text-red-500 mt-1">{getFieldError('loginEmail', loginEmail, emailValidation)}</p>
                          )}
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <Label className="text-sm font-medium">Password *</Label>
                            <button type="button" className="text-xs text-gold hover:underline">
                              Forgot Password?
                            </button>
                          </div>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                            <Input
                              type={showPassword ? 'text' : 'password'}
                              placeholder="Enter your password"
                              value={loginPassword}
                              onChange={(e) => setLoginPassword(e.target.value)}
                              onBlur={() => markTouched('loginPassword')}
                              className={`pl-10 pr-10 ${
                                getFieldError('loginPassword', loginPassword, passwordValidation)
                                  ? 'border-red-400 focus-visible:border-red-500 focus-visible:ring-red-200'
                                  : touchedFields.loginPassword && loginPassword
                                    ? 'border-green-400 focus-visible:border-green-500 focus-visible:ring-green-200'
                                    : ''
                              }`}
                              autoComplete="current-password"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                            </button>
                          </div>
                          {getFieldError('loginPassword', loginPassword, passwordValidation) && (
                            <p className="text-xs text-red-500 mt-1">{getFieldError('loginPassword', loginPassword, passwordValidation)}</p>
                          )}
                        </div>

                        {error && (
                          <motion.div
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg"
                          >
                            {error}
                          </motion.div>
                        )}

                        <Button
                          type="submit"
                          disabled={isLoading}
                          className="w-full gold-gradient gold-shadow hover:opacity-90 font-semibold h-11"
                        >
                          {isLoading ? (
                            <Loader2 className="size-5 animate-spin mr-2" />
                          ) : (
                            'Login'
                          )}
                          {!isLoading && <ChevronRight className="size-4 ml-1" />}
                        </Button>
                      </motion.form>
                    )}

                    {/* Register Form */}
                    {tab === 'register' && (
                      <motion.form
                        key="register"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.25 }}
                        onSubmit={handleRegister}
                        className="space-y-4"
                      >
                        <div>
                          <Label className="text-sm font-medium mb-1.5 block">Full Name *</Label>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                            <Input
                              placeholder="Your full name"
                              value={regName}
                              onChange={(e) => setRegName(e.target.value)}
                              onBlur={() => markTouched('regName')}
                              className={`pl-10 ${
                                getFieldError('regName', regName)
                                  ? 'border-red-400 focus-visible:border-red-500 focus-visible:ring-red-200'
                                  : touchedFields.regName && regName
                                    ? 'border-green-400 focus-visible:border-green-500 focus-visible:ring-green-200'
                                    : ''
                              }`}
                            />
                          </div>
                          {getFieldError('regName', regName) && (
                            <p className="text-xs text-red-500 mt-1">{getFieldError('regName', regName)}</p>
                          )}
                        </div>

                        <div>
                          <Label className="text-sm font-medium mb-1.5 block">Email Address *</Label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                            <Input
                              type="email"
                              placeholder="you@example.com"
                              value={regEmail}
                              onChange={(e) => setRegEmail(e.target.value)}
                              onBlur={() => markTouched('regEmail')}
                              className={`pl-10 ${
                                getFieldError('regEmail', regEmail, emailValidation)
                                  ? 'border-red-400 focus-visible:border-red-500 focus-visible:ring-red-200'
                                  : touchedFields.regEmail && regEmail
                                    ? 'border-green-400 focus-visible:border-green-500 focus-visible:ring-green-200'
                                    : ''
                              }`}
                              autoComplete="email"
                            />
                          </div>
                          {getFieldError('regEmail', regEmail, emailValidation) && (
                            <p className="text-xs text-red-500 mt-1">{getFieldError('regEmail', regEmail, emailValidation)}</p>
                          )}
                        </div>

                        <div>
                          <Label className="text-sm font-medium mb-1.5 block">Phone Number</Label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                            <Input
                              type="tel"
                              placeholder="10-digit mobile number"
                              value={regPhone}
                              onChange={(e) => setRegPhone(e.target.value)}
                              onBlur={() => markTouched('regPhone')}
                              className={`pl-10 ${
                                getFieldError('regPhone', regPhone, phoneValidation)
                                  ? 'border-red-400 focus-visible:border-red-500 focus-visible:ring-red-200'
                                  : ''
                              }`}
                              maxLength={10}
                            />
                          </div>
                          {getFieldError('regPhone', regPhone, phoneValidation) && (
                            <p className="text-xs text-red-500 mt-1">{getFieldError('regPhone', regPhone, phoneValidation)}</p>
                          )}
                        </div>

                        <div>
                          <Label className="text-sm font-medium mb-1.5 block">Password *</Label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                            <Input
                              type={showPassword ? 'text' : 'password'}
                              placeholder="Min 6 characters"
                              value={regPassword}
                              onChange={(e) => setRegPassword(e.target.value)}
                              onBlur={() => markTouched('regPassword')}
                              className={`pl-10 pr-10 ${
                                getFieldError('regPassword', regPassword, passwordValidation)
                                  ? 'border-red-400 focus-visible:border-red-500 focus-visible:ring-red-200'
                                  : touchedFields.regPassword && regPassword
                                    ? 'border-green-400 focus-visible:border-green-500 focus-visible:ring-green-200'
                                    : ''
                              }`}
                              autoComplete="new-password"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                            </button>
                          </div>
                          {getFieldError('regPassword', regPassword, passwordValidation) && (
                            <p className="text-xs text-red-500 mt-1">{getFieldError('regPassword', regPassword, passwordValidation)}</p>
                          )}
                          {/* Password strength indicator */}
                          {regPassword.length > 0 && (
                            <div className="flex gap-1 mt-2">
                              {[1, 2, 3, 4].map((level) => (
                                <div
                                  key={level}
                                  className={`h-1 flex-1 rounded-full transition-colors ${
                                    regPassword.length >= level * 3
                                      ? regPassword.length >= 10
                                        ? 'bg-green-500'
                                        : regPassword.length >= 6
                                          ? 'bg-yellow-500'
                                          : 'bg-red-400'
                                      : 'bg-muted'
                                  }`}
                                />
                              ))}
                            </div>
                          )}
                        </div>

                        <div>
                          <Label className="text-sm font-medium mb-1.5 block">Confirm Password *</Label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                            <Input
                              type={showConfirmPassword ? 'text' : 'password'}
                              placeholder="Re-enter password"
                              value={regConfirmPassword}
                              onChange={(e) => setRegConfirmPassword(e.target.value)}
                              onBlur={() => markTouched('regConfirmPassword')}
                              className={`pl-10 pr-10 ${
                                touchedFields.regConfirmPassword && regConfirmPassword && regPassword !== regConfirmPassword
                                  ? 'border-red-400 focus-visible:border-red-500 focus-visible:ring-red-200'
                                  : touchedFields.regConfirmPassword && regConfirmPassword && regPassword === regConfirmPassword
                                    ? 'border-green-400 focus-visible:border-green-500 focus-visible:ring-green-200'
                                    : ''
                              }`}
                              autoComplete="new-password"
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                              {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                            </button>
                          </div>
                          {touchedFields.regConfirmPassword && regConfirmPassword && regPassword !== regConfirmPassword && (
                            <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
                          )}
                        </div>

                        <div>
                          <Label className="text-sm font-medium mb-1.5 block">GST Number (Optional)</Label>
                          <div className="relative">
                            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                            <Input
                              placeholder="22AAAAA0000A1Z5"
                              value={regGst}
                              onChange={(e) => setRegGst(e.target.value.toUpperCase())}
                              className="pl-10"
                              maxLength={15}
                            />
                          </div>
                        </div>

                        {error && (
                          <motion.div
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg"
                          >
                            {error}
                          </motion.div>
                        )}

                        <Button
                          type="submit"
                          disabled={isLoading}
                          className="w-full gold-gradient gold-shadow hover:opacity-90 font-semibold h-11"
                        >
                          {isLoading ? (
                            <Loader2 className="size-5 animate-spin mr-2" />
                          ) : (
                            'Create Account'
                          )}
                          {!isLoading && <ChevronRight className="size-4 ml-1" />}
                        </Button>
                      </motion.form>
                    )}
                  </AnimatePresence>

                  {/* Social Login & Guest */}
                  <div className="mt-6">
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <Separator />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3 mt-4">
                      {/* Google */}
                      <Button
                        variant="outline"
                        className="h-10 hover:border-[#4285F4]/30 hover:bg-[#4285F4]/5"
                        onClick={() => setError('Google login is coming soon!')}
                      >
                        <svg className="size-4 mr-1.5" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        <span className="text-xs">Google</span>
                      </Button>
                      {/* Facebook */}
                      <Button
                        variant="outline"
                        className="h-10 hover:border-[#1877F2]/30 hover:bg-[#1877F2]/5"
                        onClick={() => setError('Facebook login is coming soon!')}
                      >
                        <svg className="size-4 mr-1.5" viewBox="0 0 24 24" fill="#1877F2">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                        </svg>
                        <span className="text-xs">Facebook</span>
                      </Button>
                      {/* Guest */}
                      <Button
                        variant="outline"
                        className="h-10"
                        onClick={handleGuestContinue}
                      >
                        <Fingerprint className="size-4 mr-1.5 text-muted-foreground" />
                        <span className="text-xs">Guest</span>
                      </Button>
                    </div>

                    <Button
                      variant="ghost"
                      className="w-full mt-4 text-muted-foreground hover:text-gold"
                      onClick={handleGuestContinue}
                    >
                      Continue as Guest →
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <p className="text-center text-xs text-muted-foreground mt-6">
                By continuing, you agree to our{' '}
                <span className="text-gold cursor-pointer hover:underline">Terms of Service</span>
                {' '}and{' '}
                <span className="text-gold cursor-pointer hover:underline">Privacy Policy</span>
              </p>
            </motion.div>
          </div>

          {/* RIGHT: Benefits Section (Desktop only) */}
          <motion.div
            className="hidden lg:flex flex-col gap-6 flex-1 max-w-sm"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="text-center lg:text-left mb-4">
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Why join{' '}
                <span className="text-gradient-animate">Murlidhar Offset</span>?
              </h2>
              <p className="text-muted-foreground text-sm">
                Get exclusive benefits when you create an account
              </p>
            </div>

            <div className="space-y-4">
              {BENEFITS.map((benefit, idx) => (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 + idx * 0.1 }}
                >
                  <Card className="premium-shadow hover-lift gold-glow-hover overflow-hidden">
                    <CardContent className="p-4 flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-gold-muted flex items-center justify-center shrink-0">
                        <benefit.icon className="size-5 text-gold" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-foreground">{benefit.title}</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">{benefit.desc}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Trust indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="flex items-center justify-center gap-2 mt-4 p-3 rounded-lg bg-gold/5 border border-gold/10"
            >
              <ShieldCheck className="size-4 text-gold" />
              <span className="text-xs text-muted-foreground">
                Trusted by <span className="text-gold font-semibold">10,000+</span> businesses across India
              </span>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
