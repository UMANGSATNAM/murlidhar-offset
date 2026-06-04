'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronRight,
  MapPin,
  CreditCard,
  ClipboardCheck,
  CheckCircle2,
  Home,
  ShoppingCart,
  Truck,
  Package,
  ArrowLeft,
  Loader2,
  Banknote,
  Wallet,
  Shield,
  Lock,
  RotateCcw,
  Phone,
  Tag,
} from 'lucide-react'
import { useCartStore, useCartSubtotal, useCartGstAmount } from '@/lib/cart-store'
import { useNavigationStore } from '@/lib/store'
import { useAuthStore } from '@/lib/auth-store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'

const STEPS = [
  { id: 1, label: 'Address', icon: MapPin },
  { id: 2, label: 'Payment', icon: CreditCard },
  { id: 3, label: 'Review', icon: ClipboardCheck },
  { id: 4, label: 'Confirmation', icon: CheckCircle2 },
]

interface AddressForm {
  fullName: string
  phone: string
  address1: string
  address2: string
  city: string
  state: string
  pincode: string
  saveAddress: boolean
}

const INITIAL_ADDRESS: AddressForm = {
  fullName: '',
  phone: '',
  address1: '',
  address2: '',
  city: '',
  state: '',
  pincode: '',
  saveAddress: false,
}

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Chandigarh',
]

export default function CheckoutPage() {
  const items = useCartStore((s) => s.items)
  const clearCart = useCartStore((s) => s.clearCart)
  const { navigate } = useNavigationStore()
  const { user, isLoggedIn } = useAuthStore()
  const [currentStep, setCurrentStep] = useState(1)
  const [mounted, setMounted] = useState(false)
  const [isPlacing, setIsPlacing] = useState(false)

  const [address, setAddress] = useState<AddressForm>(INITIAL_ADDRESS)
  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'cod'>('razorpay')
  const [orderNotes, setOrderNotes] = useState('')
  const [savedAddresses, setSavedAddresses] = useState<AddressForm[]>([])
  const [selectedSavedAddress, setSelectedSavedAddress] = useState<number>(-1)

  // Coupon code in review step
  const [couponCode, setCouponCode] = useState('')
  const [discount, setDiscount] = useState(0)
  const [couponApplied, setCouponApplied] = useState(false)
  const [couponError, setCouponError] = useState('')

  // Confirmation state
  const [orderNumber, setOrderNumber] = useState('')
  const [estimatedDelivery, setEstimatedDelivery] = useState('')

  useEffect(() => {
    useCartStore.getState()._hydrate()
    if (isLoggedIn && user) {
      setAddress(prev => ({
        ...prev,
        fullName: user.name || '',
        phone: user.phone || '',
      }))
    }
    requestAnimationFrame(() => setMounted(true))
  }, [isLoggedIn, user])

  const subtotalVal = useCartSubtotal()
  const gstVal = useCartGstAmount()
  const shipping = subtotalVal >= 999 ? 0 : 99
  const totalVal = subtotalVal + gstVal + shipping - discount

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="size-8 text-gold animate-spin" />
      </div>
    )
  }

  // Redirect to cart if empty
  if (items.length === 0 && currentStep < 4) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <ShoppingCart className="size-16 text-gold mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Your cart is empty</h2>
          <p className="text-muted-foreground mb-6">Add items to your cart before checkout</p>
          <Button onClick={() => navigate('products')} className="gold-gradient gold-shadow">
            Browse Products
          </Button>
        </motion.div>
      </div>
    )
  }

  const validateAddress = (): boolean => {
    return !!(
      address.fullName.trim() &&
      address.phone.trim() &&
      address.address1.trim() &&
      address.city.trim() &&
      address.state.trim() &&
      address.pincode.trim()
    )
  }

  const handleApplyCoupon = () => {
    setCouponError('')
    if (!couponCode.trim()) {
      setCouponError('Please enter a coupon code')
      return
    }
    const code = couponCode.toUpperCase().trim()
    if (code === 'WELCOME10') {
      const disc = Math.min(subtotalVal * 0.1, 500)
      setDiscount(disc)
      setCouponApplied(true)
    } else if (code === 'PRINT50') {
      setDiscount(50)
      setCouponApplied(true)
    } else {
      setCouponError('Invalid coupon code')
      setDiscount(0)
      setCouponApplied(false)
    }
  }

  const handleRemoveCoupon = () => {
    setCouponCode('')
    setDiscount(0)
    setCouponApplied(false)
    setCouponError('')
  }

  const handlePlaceOrder = async () => {
    setIsPlacing(true)
    try {
      const userId = user?.id || `guest-${Date.now()}`
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          items: items.map(item => ({
            productId: item.productId,
            variantId: item.variantId,
            quantity: item.quantity,
            price: item.price,
            attrs: item.attrs,
            name: item.name,
          })),
          shippingAddress: {
            name: address.fullName,
            phone: address.phone,
            address1: address.address1,
            address2: address.address2,
            city: address.city,
            state: address.state,
            pincode: address.pincode,
            country: 'India',
          },
          billingAddress: {
            name: address.fullName,
            phone: address.phone,
            address1: address.address1,
            address2: address.address2,
            city: address.city,
            state: address.state,
            pincode: address.pincode,
            country: 'India',
          },
          paymentMethod,
          notes: orderNotes,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setOrderNumber(data.order.orderNumber)
        const delDate = new Date()
        delDate.setDate(delDate.getDate() + 5)
        setEstimatedDelivery(delDate.toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric' }))
        clearCart()
        setCurrentStep(4)
      } else {
        alert(data.error || 'Failed to place order. Please try again.')
      }
    } catch {
      alert('Something went wrong. Please try again.')
    } finally {
      setIsPlacing(false)
    }
  }

  // Order Summary Sidebar (shown on steps 1-3)
  const OrderSummarySidebar = () => (
    <div className="sticky top-24">
      <Card className="premium-shadow overflow-hidden">
        <CardHeader className="bg-navy text-white pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <ShoppingCart className="size-4 text-gold" />
            Order Summary ({items.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 space-y-3">
          {/* Items mini-list */}
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-2">
                <div className="w-8 h-8 rounded bg-muted flex items-center justify-center shrink-0 overflow-hidden">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <Package className="size-3 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate">{item.name}</p>
                  <p className="text-[10px] text-muted-foreground">× {item.quantity}</p>
                </div>
                <p className="text-xs font-medium">₹{(item.price * item.quantity).toLocaleString()}</p>
              </div>
            ))}
          </div>

          <Separator />

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>₹{subtotalVal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">GST (18%)</span>
              <span>₹{gstVal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Shipping</span>
              <span className={shipping === 0 ? 'text-green-600 font-medium' : ''}>
                {shipping === 0 ? 'FREE' : `₹${shipping}`}
              </span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span>-₹{discount.toLocaleString()}</span>
              </div>
            )}
          </div>

          <Separator />

          <div className="flex justify-between items-center">
            <span className="font-semibold">Total</span>
            <span className="text-lg font-bold gold-gradient-text">₹{totalVal.toLocaleString()}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <button onClick={() => navigate('home')} className="hover:text-gold transition-colors">Home</button>
          <ChevronRight className="size-3" />
          <button onClick={() => navigate('cart')} className="hover:text-gold transition-colors">Cart</button>
          <ChevronRight className="size-3" />
          <span className="text-foreground font-medium">Checkout</span>
        </nav>

        {/* Step Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between max-w-lg mx-auto">
            {STEPS.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                      currentStep > step.id
                        ? 'bg-green-500 text-white'
                        : currentStep === step.id
                          ? 'bg-navy text-gold gold-shadow'
                          : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {currentStep > step.id ? (
                      <CheckCircle2 className="size-5" />
                    ) : (
                      <step.icon className="size-5" />
                    )}
                  </div>
                  <span className={`text-[10px] sm:text-xs mt-1 font-medium ${
                    currentStep >= step.id ? 'text-foreground' : 'text-muted-foreground'
                  }`}>
                    {step.label}
                  </span>
                </div>
                {index < STEPS.length - 1 && (
                  <div className={`w-8 sm:w-16 h-0.5 mx-2 mb-5 transition-all duration-300 ${
                    currentStep > step.id ? 'bg-green-500' : 'bg-border'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {/* STEP 1: Address */}
          {currentStep === 1 && (
            <motion.div
              key="address"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col lg:flex-row gap-8"
            >
              <div className="flex-1">
                <Card className="premium-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="size-5 text-gold" />
                      Shipping Address
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Saved Addresses */}
                    {savedAddresses.length > 0 && (
                      <div className="mb-6">
                        <Label className="text-sm font-medium mb-3 block">Saved Addresses</Label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {savedAddresses.map((addr, idx) => (
                            <button
                              key={idx}
                              onClick={() => { setSelectedSavedAddress(idx); setAddress(addr) }}
                              className={`text-left p-3 rounded-lg border transition-all ${
                                selectedSavedAddress === idx
                                  ? 'border-gold bg-gold-muted'
                                  : 'border-border hover:border-gold/50'
                              }`}
                            >
                              <p className="font-medium text-sm">{addr.fullName}</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {addr.address1}, {addr.city}, {addr.state} - {addr.pincode}
                              </p>
                            </button>
                          ))}
                        </div>
                        <Separator className="my-4" />
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium mb-1.5 block">Full Name *</Label>
                        <Input
                          placeholder="Enter your full name"
                          value={address.fullName}
                          onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label className="text-sm font-medium mb-1.5 block">Phone Number *</Label>
                        <Input
                          placeholder="10-digit mobile number"
                          value={address.phone}
                          onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                          maxLength={10}
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium mb-1.5 block">Address Line 1 *</Label>
                      <Input
                        placeholder="House No., Building, Street"
                        value={address.address1}
                        onChange={(e) => setAddress({ ...address, address1: e.target.value })}
                      />
                    </div>

                    <div>
                      <Label className="text-sm font-medium mb-1.5 block">Address Line 2</Label>
                      <Input
                        placeholder="Area, Colony, Landmark (Optional)"
                        value={address.address2}
                        onChange={(e) => setAddress({ ...address, address2: e.target.value })}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <Label className="text-sm font-medium mb-1.5 block">City *</Label>
                        <Input
                          placeholder="City"
                          value={address.city}
                          onChange={(e) => setAddress({ ...address, city: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label className="text-sm font-medium mb-1.5 block">State *</Label>
                        <select
                          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                          value={address.state}
                          onChange={(e) => setAddress({ ...address, state: e.target.value })}
                        >
                          <option value="">Select State</option>
                          {INDIAN_STATES.map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <Label className="text-sm font-medium mb-1.5 block">Pincode *</Label>
                        <Input
                          placeholder="6-digit pincode"
                          value={address.pincode}
                          onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                          maxLength={6}
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <Checkbox
                        id="save-address"
                        checked={address.saveAddress}
                        onCheckedChange={(checked) => setAddress({ ...address, saveAddress: checked === true })}
                      />
                      <Label htmlFor="save-address" className="text-sm text-muted-foreground cursor-pointer">
                        Save this address for future orders
                      </Label>
                    </div>

                    <div className="flex justify-between pt-4">
                      <Button variant="ghost" onClick={() => navigate('cart')}>
                        <ArrowLeft className="size-4 mr-2" />
                        Back to Cart
                      </Button>
                      <Button
                        onClick={() => {
                          if (address.saveAddress) {
                            setSavedAddresses([...savedAddresses, address])
                          }
                          setCurrentStep(2)
                        }}
                        disabled={!validateAddress()}
                        className="gold-gradient gold-shadow hover:opacity-90 font-semibold"
                      >
                        Continue to Payment
                        <ChevronRight className="size-4 ml-1" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sticky Sidebar */}
              <div className="hidden lg:block w-80 shrink-0">
                <OrderSummarySidebar />
              </div>
            </motion.div>
          )}

          {/* STEP 2: Payment */}
          {currentStep === 2 && (
            <motion.div
              key="payment"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col lg:flex-row gap-8"
            >
              <div className="flex-1">
                <Card className="premium-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="size-5 text-gold" />
                      Payment Method
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Razorpay - Brand Color */}
                    <button
                      onClick={() => setPaymentMethod('razorpay')}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                        paymentMethod === 'razorpay'
                          ? 'border-[#072654] bg-[#072654]/5 gold-border-glow'
                          : 'border-border hover:border-[#072654]/30'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                          paymentMethod === 'razorpay' ? 'bg-[#072654]' : 'bg-muted'
                        }`}>
                          <Wallet className={`size-6 ${paymentMethod === 'razorpay' ? 'text-[#0066FF]' : 'text-muted-foreground'}`} />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-foreground">Razorpay</p>
                          <p className="text-xs text-muted-foreground">Credit/Debit Card, UPI, Wallets, Net Banking</p>
                          <div className="flex gap-1 mt-1">
                            {['💳', '🏦', '📱'].map((icon, i) => (
                              <span key={i} className="text-xs">{icon}</span>
                            ))}
                          </div>
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          paymentMethod === 'razorpay' ? 'border-[#072654]' : 'border-muted-foreground'
                        }`}>
                          {paymentMethod === 'razorpay' && <div className="w-2.5 h-2.5 rounded-full bg-[#072654]" />}
                        </div>
                      </div>
                    </button>

                    {/* COD - Brand Color */}
                    <button
                      onClick={() => setPaymentMethod('cod')}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                        paymentMethod === 'cod'
                          ? 'border-green-600 bg-green-50'
                          : 'border-border hover:border-green-600/30'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                          paymentMethod === 'cod' ? 'bg-green-600' : 'bg-muted'
                        }`}>
                          <Banknote className={`size-6 ${paymentMethod === 'cod' ? 'text-white' : 'text-muted-foreground'}`} />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-foreground">Cash on Delivery</p>
                          <p className="text-xs text-muted-foreground">Pay when your order is delivered</p>
                          {paymentMethod === 'cod' && (
                            <Badge className="mt-1 bg-green-100 text-green-700 border-0 text-[10px]">
                              Additional ₹50 COD fee may apply
                            </Badge>
                          )}
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          paymentMethod === 'cod' ? 'border-green-600' : 'border-muted-foreground'
                        }`}>
                          {paymentMethod === 'cod' && <div className="w-2.5 h-2.5 rounded-full bg-green-600" />}
                        </div>
                      </div>
                    </button>

                    {/* Order Notes */}
                    <div className="pt-2">
                      <Label className="text-sm font-medium mb-1.5 block">Order Notes (Optional)</Label>
                      <Textarea
                        placeholder="Any special instructions for your order..."
                        value={orderNotes}
                        onChange={(e) => setOrderNotes(e.target.value)}
                        className="min-h-[80px]"
                      />
                    </div>

                    <div className="flex justify-between pt-4">
                      <Button variant="ghost" onClick={() => setCurrentStep(1)}>
                        <ArrowLeft className="size-4 mr-2" />
                        Back to Address
                      </Button>
                      <Button
                        onClick={() => setCurrentStep(3)}
                        className="gold-gradient gold-shadow hover:opacity-90 font-semibold"
                      >
                        Continue to Review
                        <ChevronRight className="size-4 ml-1" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sticky Sidebar */}
              <div className="hidden lg:block w-80 shrink-0">
                <OrderSummarySidebar />
              </div>
            </motion.div>
          )}

          {/* STEP 3: Review */}
          {currentStep === 3 && (
            <motion.div
              key="review"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Order Items */}
              <Card className="premium-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Package className="size-5 text-gold" />
                    Order Items ({items.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                    {items.map((item) => (
                      <div key={item.id} className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted flex-shrink-0 border border-border">
                          {item.image ? (
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="size-5 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{item.name}</p>
                          <p className="text-xs text-muted-foreground">{item.variantName} × {item.quantity}</p>
                        </div>
                        <p className="text-sm font-semibold">₹{(item.price * item.quantity).toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Address & Payment Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Address Summary */}
                <Card className="premium-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <MapPin className="size-5 text-gold" />
                      Shipping Address
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="font-medium">{address.fullName}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {address.address1}
                      {address.address2 && `, ${address.address2}`}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {address.city}, {address.state} - {address.pincode}
                    </p>
                    <p className="text-sm text-muted-foreground">Phone: {address.phone}</p>
                  </CardContent>
                </Card>

                {/* Payment Summary */}
                <Card className="premium-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <CreditCard className="size-5 text-gold" />
                      Payment Method
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Badge variant="secondary" className="text-sm">
                      {paymentMethod === 'razorpay' ? '💳 Razorpay (Online Payment)' : '💵 Cash on Delivery'}
                    </Badge>
                    {orderNotes && (
                      <div className="mt-3">
                        <p className="text-xs text-muted-foreground font-medium">Order Notes:</p>
                        <p className="text-sm text-muted-foreground">{orderNotes}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Total Breakdown + Coupon */}
              <Card className="premium-shadow border-gold/20">
                <CardHeader className="bg-navy text-white pb-4">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Truck className="size-5 text-gold" />
                    Order Total
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>₹{subtotalVal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">GST (18%)</span>
                    <span>₹{gstVal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className={shipping === 0 ? 'text-green-600 font-medium' : ''}>
                      {shipping === 0 ? 'FREE' : `₹${shipping}`}
                    </span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Discount</span>
                      <span>-₹{discount.toLocaleString()}</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-lg">Total</span>
                    <span className="text-xl font-bold gold-gradient-text">₹{totalVal.toLocaleString()}</span>
                  </div>

                  {/* Coupon Code in Review */}
                  <Separator />
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Have a coupon?</label>
                    {couponApplied ? (
                      <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg p-2.5">
                        <Tag className="size-4 text-green-600" />
                        <span className="text-sm font-medium text-green-700 flex-1">{couponCode.toUpperCase()}</span>
                        <button onClick={handleRemoveCoupon} className="text-xs text-red-500 hover:text-red-700 font-medium">Remove</button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <Input
                          placeholder="Enter coupon code"
                          value={couponCode}
                          onChange={(e) => { setCouponCode(e.target.value); setCouponError('') }}
                          className="h-9 text-sm flex-1"
                          onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                        />
                        <Button variant="outline" size="sm" onClick={handleApplyCoupon} className="h-9 px-3 border-gold/30 text-gold hover:bg-gold/10">
                          Apply
                        </Button>
                      </div>
                    )}
                    {couponError && <p className="text-xs text-destructive mt-1">{couponError}</p>}
                  </div>
                </CardContent>
              </Card>

              <div className="flex flex-col sm:flex-row justify-between gap-4 pt-2">
                <Button variant="ghost" onClick={() => setCurrentStep(2)}>
                  <ArrowLeft className="size-4 mr-2" />
                  Back to Payment
                </Button>
                <div className="flex flex-col items-stretch sm:items-end gap-3">
                  <Button
                    onClick={handlePlaceOrder}
                    disabled={isPlacing}
                    className="gold-gradient gold-shadow hover:opacity-90 font-semibold px-8 h-12 text-base"
                  >
                    {isPlacing ? (
                      <>
                        <Loader2 className="size-5 mr-2 animate-spin" />
                        Placing Order...
                      </>
                    ) : (
                      <>
                        Place Order
                        <CheckCircle2 className="size-5 ml-2" />
                      </>
                    )}
                  </Button>

                  {/* Trust Badges */}
                  <div className="flex items-center gap-4">
                    {[
                      { icon: Shield, label: 'Secure Payment' },
                      { icon: Lock, label: 'SSL Encrypted' },
                      { icon: RotateCcw, label: 'Money Back' },
                    ].map((badge) => (
                      <div key={badge.label} className="flex items-center gap-1 text-muted-foreground">
                        <badge.icon className="size-3.5 text-gold" />
                        <span className="text-[10px]">{badge.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Need Help */}
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground py-4">
                <Phone className="size-4 text-gold" />
                <span>Need help? Call us at</span>
                <a href="tel:+919876543210" className="text-gold font-semibold hover:underline">+91 98765 43210</a>
              </div>
            </motion.div>
          )}

          {/* STEP 4: Confirmation */}
          {currentStep === 4 && (
            <motion.div
              key="confirmation"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="premium-shadow-lg text-center overflow-hidden">
                <div className="bg-navy py-10 px-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                    className="w-20 h-20 rounded-full bg-green-500 mx-auto flex items-center justify-center mb-6"
                  >
                    <CheckCircle2 className="size-10 text-white" />
                  </motion.div>
                  <motion.h2
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-2xl md:text-3xl font-bold text-white mb-2"
                  >
                    Order Placed Successfully!
                  </motion.h2>
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="text-gold-light text-lg"
                  >
                    Thank you for your order
                  </motion.p>
                </div>

                <CardContent className="p-8 space-y-6">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="space-y-4"
                  >
                    <div className="bg-gold-muted rounded-xl p-6 inline-block">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Order Number</p>
                      <p className="text-2xl font-bold gold-gradient-text">{orderNumber}</p>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground">Estimated Delivery</p>
                      <p className="text-lg font-semibold text-foreground flex items-center justify-center gap-2">
                        <Truck className="size-5 text-gold" />
                        {estimatedDelivery}
                      </p>
                    </div>

                    <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
                      <span>A confirmation email has been sent to</span>
                      <span className="font-medium text-foreground">{user?.email || 'your email'}</span>
                    </div>
                  </motion.div>

                  <Separator />

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="flex flex-col sm:flex-row gap-3 justify-center"
                  >
                    <Button
                      onClick={() => navigate('dashboard')}
                      className="gold-gradient gold-shadow hover:opacity-90 font-semibold px-6"
                    >
                      <Package className="size-4 mr-2" />
                      Track Order
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => navigate('products')}
                      className="px-6"
                    >
                      <ShoppingCart className="size-4 mr-2" />
                      Continue Shopping
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
