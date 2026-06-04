'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Save,
  Globe,
  Phone,
  CreditCard,
  Truck,
  Percent,
  Search,
  Palette,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

interface SettingField {
  value: string | number | boolean
  label: string
  type: string
}

interface SettingsGroup {
  [key: string]: SettingField
}

interface SettingsData {
  [group: string]: SettingsGroup
}

interface SettingsGroupConfig {
  key: string
  label: string
  icon: React.ElementType
  description: string
  fields: SettingsFieldConfig[]
}

interface SettingsFieldConfig {
  key: string
  label: string
  type: 'text' | 'number' | 'boolean' | 'textarea' | 'color'
  placeholder?: string
  description?: string
}

const settingsGroups: SettingsGroupConfig[] = [
  {
    key: 'general',
    label: 'General',
    icon: Globe,
    description: 'Basic site information',
    fields: [
      { key: 'site_name', label: 'Site Name', type: 'text', placeholder: 'Murlidhar Offset' },
      { key: 'tagline', label: 'Tagline', type: 'text', placeholder: 'Premium Offset Printing' },
      { key: 'logo_url', label: 'Logo URL', type: 'text', placeholder: '/logo.svg' },
      { key: 'favicon_url', label: 'Favicon URL', type: 'text', placeholder: '/favicon.ico' },
    ],
  },
  {
    key: 'contact',
    label: 'Contact',
    icon: Phone,
    description: 'Contact information',
    fields: [
      { key: 'phone', label: 'Phone', type: 'text', placeholder: '+91 98765 43210' },
      { key: 'email', label: 'Email', type: 'text', placeholder: 'info@murlidharoffset.com' },
      { key: 'address', label: 'Address', type: 'textarea', placeholder: 'Full address...' },
      { key: 'whatsapp', label: 'WhatsApp Number', type: 'text', placeholder: '+91 98765 43210' },
    ],
  },
  {
    key: 'payment',
    label: 'Payment',
    icon: CreditCard,
    description: 'Payment gateway settings',
    fields: [
      { key: 'razorpay_key', label: 'Razorpay Key ID', type: 'text', placeholder: 'rzp_live_xxxxxxxx' },
      { key: 'razorpay_secret', label: 'Razorpay Secret', type: 'text', placeholder: '••••••••' },
      { key: 'stripe_key', label: 'Stripe Publishable Key', type: 'text', placeholder: 'pk_live_xxxxxxxx' },
      { key: 'stripe_secret', label: 'Stripe Secret Key', type: 'text', placeholder: '••••••••' },
      { key: 'enable_razorpay', label: 'Enable Razorpay', type: 'boolean' },
      { key: 'enable_stripe', label: 'Enable Stripe', type: 'boolean' },
      { key: 'enable_cod', label: 'Enable Cash on Delivery', type: 'boolean' },
    ],
  },
  {
    key: 'shipping',
    label: 'Shipping',
    icon: Truck,
    description: 'Shipping configuration',
    fields: [
      { key: 'default_shipping_cost', label: 'Default Shipping Cost (₹)', type: 'number', placeholder: '99' },
      { key: 'free_shipping_threshold', label: 'Free Shipping Threshold (₹)', type: 'number', placeholder: '999' },
      { key: 'shipping_zones', label: 'Shipping Zones (JSON)', type: 'textarea', placeholder: '[]' },
    ],
  },
  {
    key: 'tax',
    label: 'Tax',
    icon: Percent,
    description: 'Tax & GST settings',
    fields: [
      { key: 'gst_percentage', label: 'GST Percentage', type: 'number', placeholder: '18' },
      { key: 'hsn_code', label: 'HSN Code', type: 'text', placeholder: '4911' },
      { key: 'gst_number', label: 'GST Number', type: 'text', placeholder: '29AAACM1234A1Z5' },
      { key: 'enable_gst', label: 'Enable GST', type: 'boolean' },
    ],
  },
  {
    key: 'seo',
    label: 'SEO',
    icon: Search,
    description: 'Search engine optimization',
    fields: [
      { key: 'default_title', label: 'Default Title', type: 'text', placeholder: 'Murlidhar Offset - Premium Printing' },
      { key: 'default_description', label: 'Default Description', type: 'textarea', placeholder: 'Meta description...' },
      { key: 'default_keywords', label: 'Default Keywords', type: 'textarea', placeholder: 'offset, printing, cards...' },
      { key: 'google_analytics_id', label: 'Google Analytics ID', type: 'text', placeholder: 'G-XXXXXXXXXX' },
    ],
  },
  {
    key: 'theme',
    label: 'Theme',
    icon: Palette,
    description: 'Visual customization',
    fields: [
      { key: 'primary_color', label: 'Primary Color', type: 'color', placeholder: '#0D1B3D' },
      { key: 'accent_color', label: 'Accent Color', type: 'color', placeholder: '#C9A227' },
      { key: 'custom_css', label: 'Custom CSS', type: 'textarea', placeholder: '/* Custom styles */' },
    ],
  },
]

// Default values for settings
const defaultSettings: Record<string, Record<string, string>> = {
  general: {
    site_name: 'Murlidhar Offset',
    tagline: 'Premium Offset Printing Solutions',
    logo_url: '/logo.svg',
    favicon_url: '/favicon.ico',
  },
  contact: {
    phone: '+91 98765 43210',
    email: 'info@murlidharoffset.com',
    address: 'Murlidhar Offset Press, Industrial Area, India',
    whatsapp: '+91 98765 43210',
  },
  payment: {
    razorpay_key: '',
    razorpay_secret: '',
    stripe_key: '',
    stripe_secret: '',
    enable_razorpay: 'true',
    enable_stripe: 'false',
    enable_cod: 'true',
  },
  shipping: {
    default_shipping_cost: '99',
    free_shipping_threshold: '999',
    shipping_zones: '[]',
  },
  tax: {
    gst_percentage: '18',
    hsn_code: '4911',
    gst_number: '',
    enable_gst: 'true',
  },
  seo: {
    default_title: 'Murlidhar Offset - Premium Offset Printing',
    default_description: 'India\'s premier offset printing company for business cards, wedding cards, brochures, and more.',
    default_keywords: 'offset printing, business cards, wedding cards, brochures',
    google_analytics_id: '',
  },
  theme: {
    primary_color: '#0D1B3D',
    accent_color: '#C9A227',
    custom_css: '',
  },
}

export default function AdminSettings() {
  const [settings, setSettings] = useState<SettingsData>({})
  const [loading, setLoading] = useState(true)
  const [savingGroup, setSavingGroup] = useState<string | null>(null)
  const [saveStatus, setSaveStatus] = useState<Record<string, 'success' | 'error' | null>>({})

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/settings')
      if (res.ok) {
        const data = await res.json()
        setSettings(data.settings || {})
      }
    } catch (err) {
      console.error('Failed to fetch settings:', err)
    } finally {
      setLoading(false)
    }
  }

  const getSettingValue = (group: string, key: string, type: string): string | number | boolean => {
    if (settings[group] && settings[group][key]) {
      return settings[group][key].value
    }
    // Return default
    const defaultVal = defaultSettings[group]?.[key]
    if (type === 'boolean') return defaultVal === 'true'
    if (type === 'number') return Number(defaultVal) || 0
    return defaultVal || ''
  }

  const handleFieldChange = (group: string, key: string, value: string | number | boolean) => {
    setSettings((prev) => {
      const groupSettings = prev[group] || {}
      const field = groupSettings[key] || { label: key, type: 'text' }
      return {
        ...prev,
        [group]: {
          ...groupSettings,
          [key]: { ...field, value },
        },
      }
    })
    // Clear save status
    setSaveStatus((prev) => ({ ...prev, [group]: null }))
  }

  const handleSaveGroup = async (groupKey: string) => {
    setSavingGroup(groupKey)
    try {
      const groupSettings = settings[groupKey] || {}
      const groupDefault = defaultSettings[groupKey] || {}
      const groupConfig = settingsGroups.find((g) => g.key === groupKey)
      if (!groupConfig) return

      const updates = groupConfig.fields.map((field) => {
        const currentVal = groupSettings[field.key]?.value ?? groupDefault[field.key] ?? ''
        return {
          key: field.key,
          value: String(currentVal),
          group: groupKey,
          label: field.label,
          type: field.type,
        }
      })

      const res = await fetch('/api/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings: updates }),
      })

      if (res.ok) {
        setSaveStatus((prev) => ({ ...prev, [groupKey]: 'success' }))
        setTimeout(() => {
          setSaveStatus((prev) => ({ ...prev, [groupKey]: null }))
        }, 3000)
      } else {
        setSaveStatus((prev) => ({ ...prev, [groupKey]: 'error' }))
      }
    } catch (err) {
      console.error('Failed to save settings:', err)
      setSaveStatus((prev) => ({ ...prev, [groupKey]: 'error' }))
    } finally {
      setSavingGroup(null)
    }
  }

  const renderField = (groupKey: string, field: SettingsFieldConfig) => {
    const value = getSettingValue(groupKey, field.key, field.type)

    switch (field.type) {
      case 'boolean':
        return (
          <div className="flex items-center justify-between py-2">
            <div>
              <Label className="text-sm font-medium text-navy">{field.label}</Label>
              {field.description && (
                <p className="text-xs text-muted-foreground">{field.description}</p>
              )}
            </div>
            <Switch
              checked={value as boolean}
              onCheckedChange={(checked) => handleFieldChange(groupKey, field.key, checked)}
            />
          </div>
        )

      case 'textarea':
        return (
          <div className="space-y-2">
            <Label className="text-sm font-medium text-navy">{field.label}</Label>
            <Textarea
              value={String(value)}
              onChange={(e) => handleFieldChange(groupKey, field.key, e.target.value)}
              placeholder={field.placeholder}
              rows={3}
              className="focus:border-gold"
            />
          </div>
        )

      case 'number':
        return (
          <div className="space-y-2">
            <Label className="text-sm font-medium text-navy">{field.label}</Label>
            <Input
              type="number"
              value={String(value)}
              onChange={(e) => handleFieldChange(groupKey, field.key, parseFloat(e.target.value) || 0)}
              placeholder={field.placeholder}
              className="focus:border-gold"
            />
          </div>
        )

      case 'color':
        return (
          <div className="space-y-2">
            <Label className="text-sm font-medium text-navy">{field.label}</Label>
            <div className="flex items-center gap-3">
              <div className="relative">
                <input
                  type="color"
                  value={String(value) || field.placeholder}
                  onChange={(e) => handleFieldChange(groupKey, field.key, e.target.value)}
                  className="h-9 w-9 rounded border cursor-pointer"
                />
              </div>
              <Input
                value={String(value)}
                onChange={(e) => handleFieldChange(groupKey, field.key, e.target.value)}
                placeholder={field.placeholder}
                className="focus:border-gold flex-1"
              />
            </div>
          </div>
        )

      default:
        return (
          <div className="space-y-2">
            <Label className="text-sm font-medium text-navy">{field.label}</Label>
            <Input
              type={field.key.includes('secret') || field.key.includes('password') ? 'password' : 'text'}
              value={String(value)}
              onChange={(e) => handleFieldChange(groupKey, field.key, e.target.value)}
              placeholder={field.placeholder}
              className="focus:border-gold"
            />
          </div>
        )
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse premium-shadow border-0">
            <CardContent className="p-6">
              <div className="h-40 bg-gray-200 rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-navy">Settings</h2>
        <p className="text-sm text-muted-foreground">Manage your store configuration</p>
      </div>

      {/* Settings Groups */}
      <div className="space-y-6">
        {settingsGroups.map((group, groupIndex) => {
          const Icon = group.icon
          const isSaving = savingGroup === group.key
          const status = saveStatus[group.key]

          return (
            <motion.div
              key={group.key}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: groupIndex * 0.05, duration: 0.3 }}
            >
              <Card className="premium-shadow border-0 overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-navy/5 to-transparent pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-navy/10 p-2">
                        <Icon className="h-5 w-5 text-navy" />
                      </div>
                      <div>
                        <CardTitle className="text-navy text-base">{group.label}</CardTitle>
                        <p className="text-xs text-muted-foreground">{group.description}</p>
                      </div>
                    </div>
                    {status === 'success' && (
                      <Badge className="bg-green-100 text-green-700 border-0 text-xs">
                        <CheckCircle2 className="mr-1 h-3 w-3" />
                        Saved
                      </Badge>
                    )}
                    {status === 'error' && (
                      <Badge className="bg-red-100 text-red-700 border-0 text-xs">
                        <AlertCircle className="mr-1 h-3 w-3" />
                        Error
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {group.fields.map((field) => (
                      <div key={field.key}>
                        {renderField(group.key, field)}
                        {field.type !== 'boolean' && field !== group.fields[group.fields.length - 1] && (
                          <Separator className="mt-4" />
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 flex justify-end">
                    <Button
                      onClick={() => handleSaveGroup(group.key)}
                      disabled={isSaving}
                      className="gold-gradient text-navy font-semibold hover:opacity-90"
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Save {group.label}
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
