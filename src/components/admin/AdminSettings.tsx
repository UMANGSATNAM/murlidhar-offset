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
  Bell,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Mail,
  MessageSquare,
  Smartphone,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'

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

interface SettingsFieldConfig {
  key: string
  label: string
  type: 'text' | 'number' | 'boolean' | 'textarea' | 'color'
  placeholder?: string
  description?: string
}

// Tab configurations
const tabs = [
  { value: 'general', label: 'General', icon: Globe },
  { value: 'payment', label: 'Payment', icon: CreditCard },
  { value: 'shipping', label: 'Shipping', icon: Truck },
  { value: 'tax', label: 'Tax', icon: Percent },
  { value: 'notifications', label: 'Notifications', icon: Bell },
] as const

const fieldConfigs: Record<string, SettingsFieldConfig[]> = {
  general: [
    { key: 'site_name', label: 'Site Name', type: 'text', placeholder: 'Murlidhar Offset' },
    { key: 'tagline', label: 'Tagline', type: 'text', placeholder: 'Premium Offset Printing' },
    { key: 'logo_url', label: 'Logo URL', type: 'text', placeholder: '/logo.svg' },
    { key: 'favicon_url', label: 'Favicon URL', type: 'text', placeholder: '/favicon.ico' },
    { key: 'phone', label: 'Phone', type: 'text', placeholder: '+91 98765 43210' },
    { key: 'email', label: 'Email', type: 'text', placeholder: 'info@murlidharoffset.com' },
    { key: 'address', label: 'Address', type: 'textarea', placeholder: 'Full address...' },
    { key: 'whatsapp', label: 'WhatsApp Number', type: 'text', placeholder: '+91 98765 43210' },
  ],
  payment: [
    { key: 'razorpay_key', label: 'Razorpay Key ID', type: 'text', placeholder: 'rzp_live_xxxxxxxx' },
    { key: 'razorpay_secret', label: 'Razorpay Secret', type: 'text', placeholder: '••••••••' },
    { key: 'stripe_key', label: 'Stripe Publishable Key', type: 'text', placeholder: 'pk_live_xxxxxxxx' },
    { key: 'stripe_secret', label: 'Stripe Secret Key', type: 'text', placeholder: '••••••••' },
    { key: 'enable_razorpay', label: 'Enable Razorpay', type: 'boolean', description: 'Accept payments via Razorpay' },
    { key: 'enable_stripe', label: 'Enable Stripe', type: 'boolean', description: 'Accept payments via Stripe' },
    { key: 'enable_cod', label: 'Enable Cash on Delivery', type: 'boolean', description: 'Allow customers to pay on delivery' },
  ],
  shipping: [
    { key: 'default_shipping_cost', label: 'Flat Rate Shipping (₹)', type: 'number', placeholder: '99' },
    { key: 'free_shipping_threshold', label: 'Free Shipping Threshold (₹)', type: 'number', placeholder: '999', description: 'Orders above this amount get free shipping' },
    { key: 'delivery_zone_local', label: 'Local Delivery Zone (Rajkot)', type: 'text', placeholder: 'Within 20km radius' },
    { key: 'delivery_zone_state', label: 'Statewide Delivery (Gujarat)', type: 'text', placeholder: '2-4 business days' },
    { key: 'delivery_zone_national', label: 'National Delivery', type: 'text', placeholder: '5-7 business days' },
    { key: 'shipping_zones', label: 'Shipping Zones (JSON)', type: 'textarea', placeholder: '[]' },
  ],
  tax: [
    { key: 'gst_percentage', label: 'GST Rate (%)', type: 'number', placeholder: '18' },
    { key: 'cgst_percentage', label: 'CGST Rate (%)', type: 'number', placeholder: '9' },
    { key: 'sgst_percentage', label: 'SGST Rate (%)', type: 'number', placeholder: '9' },
    { key: 'igst_percentage', label: 'IGST Rate (%)', type: 'number', placeholder: '18', description: 'For interstate supply' },
    { key: 'gst_number', label: 'GSTIN', type: 'text', placeholder: '29AAACM1234A1Z5' },
    { key: 'hsn_code', label: 'HSN Code', type: 'text', placeholder: '4911' },
    { key: 'tax_inclusive', label: 'Tax Inclusive Pricing', type: 'boolean', description: 'Show prices including GST (vs. exclusive)' },
    { key: 'enable_gst', label: 'Enable GST', type: 'boolean', description: 'Charge GST on all orders' },
  ],
  notifications: [
    { key: 'email_notifications', label: 'Email Notifications', type: 'boolean', description: 'Send order confirmations & updates via email' },
    { key: 'smtp_host', label: 'SMTP Host', type: 'text', placeholder: 'smtp.gmail.com' },
    { key: 'smtp_port', label: 'SMTP Port', type: 'number', placeholder: '587' },
    { key: 'smtp_user', label: 'SMTP Username', type: 'text', placeholder: 'your@email.com' },
    { key: 'smtp_password', label: 'SMTP Password', type: 'text', placeholder: '••••••••' },
    { key: 'sms_notifications', label: 'SMS Notifications', type: 'boolean', description: 'Send order updates via SMS' },
    { key: 'sms_api_key', label: 'SMS API Key', type: 'text', placeholder: 'your-sms-api-key' },
    { key: 'sms_sender_id', label: 'SMS Sender ID', type: 'text', placeholder: 'MURLOF' },
    { key: 'whatsapp_notifications', label: 'WhatsApp Business Notifications', type: 'boolean', description: 'Send updates via WhatsApp Business API' },
    { key: 'whatsapp_api_key', label: 'WhatsApp API Key', type: 'text', placeholder: 'your-whatsapp-api-key' },
    { key: 'whatsapp_phone_id', label: 'WhatsApp Phone Number ID', type: 'text', placeholder: '1234567890' },
  ],
}

// Default values for settings
const defaultSettings: Record<string, Record<string, string>> = {
  general: {
    site_name: 'Murlidhar Offset',
    tagline: 'Premium Offset Printing Solutions',
    logo_url: '/logo.svg',
    favicon_url: '/favicon.ico',
    phone: '+91 98765 43210',
    email: 'info@murlidharoffset.com',
    address: 'Murlidhar Offset Press, Industrial Area, Rajkot, Gujarat, India',
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
    delivery_zone_local: 'Within 20km radius - Same day',
    delivery_zone_state: 'Gujarat - 2-4 business days',
    delivery_zone_national: 'All India - 5-7 business days',
    shipping_zones: '[]',
  },
  tax: {
    gst_percentage: '18',
    cgst_percentage: '9',
    sgst_percentage: '9',
    igst_percentage: '18',
    gst_number: '',
    hsn_code: '4911',
    tax_inclusive: 'false',
    enable_gst: 'true',
  },
  notifications: {
    email_notifications: 'true',
    smtp_host: 'smtp.gmail.com',
    smtp_port: '587',
    smtp_user: '',
    smtp_password: '',
    sms_notifications: 'false',
    sms_api_key: '',
    sms_sender_id: 'MURLOF',
    whatsapp_notifications: 'false',
    whatsapp_api_key: '',
    whatsapp_phone_id: '',
  },
}

export default function AdminSettings() {
  const [settings, setSettings] = useState<SettingsData>({})
  const [loading, setLoading] = useState(true)
  const [savingGroup, setSavingGroup] = useState<string | null>(null)
  const [saveStatus, setSaveStatus] = useState<Record<string, 'success' | 'error' | null>>({})
  const [activeTab, setActiveTab] = useState('general')

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
      const groupConfig = fieldConfigs[groupKey]
      if (!groupConfig) return

      const updates = groupConfig.map((field) => {
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
        toast.success('Settings Saved', {
          description: `${tabs.find((t) => t.value === groupKey)?.label || groupKey} settings have been saved successfully.`,
        })
        setTimeout(() => {
          setSaveStatus((prev) => ({ ...prev, [groupKey]: null }))
        }, 3000)
      } else {
        setSaveStatus((prev) => ({ ...prev, [groupKey]: 'error' }))
        toast.error('Save Failed', {
          description: 'Could not save settings. Please try again.',
        })
      }
    } catch (err) {
      console.error('Failed to save settings:', err)
      setSaveStatus((prev) => ({ ...prev, [groupKey]: 'error' }))
      toast.error('Save Failed', {
        description: 'An error occurred while saving settings.',
      })
    } finally {
      setSavingGroup(null)
    }
  }

  const renderField = (groupKey: string, field: SettingsFieldConfig) => {
    const value = getSettingValue(groupKey, field.key, field.type)

    switch (field.type) {
      case 'boolean':
        return (
          <div className="flex items-center justify-between py-3 px-4 rounded-lg bg-gray-50/50 border border-gray-100">
            <div className="flex-1">
              <Label className="text-sm font-medium text-navy">{field.label}</Label>
              {field.description && (
                <p className="text-xs text-muted-foreground mt-0.5">{field.description}</p>
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
            {field.description && (
              <p className="text-xs text-muted-foreground">{field.description}</p>
            )}
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
            {field.description && (
              <p className="text-xs text-muted-foreground">{field.description}</p>
            )}
            <Input
              type="number"
              value={String(value)}
              onChange={(e) => handleFieldChange(groupKey, field.key, parseFloat(e.target.value) || 0)}
              placeholder={field.placeholder}
              className="focus:border-gold"
            />
          </div>
        )

      default:
        return (
          <div className="space-y-2">
            <Label className="text-sm font-medium text-navy">{field.label}</Label>
            {field.description && (
              <p className="text-xs text-muted-foreground">{field.description}</p>
            )}
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

  const renderTabContent = (groupKey: string) => {
    const fields = fieldConfigs[groupKey] || []
    const isSaving = savingGroup === groupKey
    const status = saveStatus[groupKey]

    return (
      <div className="space-y-5">
        {fields.map((field, idx) => (
          <div key={field.key}>
            {renderField(groupKey, field)}
            {idx < fields.length - 1 && field.type !== 'boolean' && (
              <Separator className="mt-5" />
            )}
          </div>
        ))}

        <div className="pt-4 flex items-center justify-between border-t border-gray-100">
          <div>
            {status === 'success' && (
              <Badge className="bg-green-100 text-green-700 border-0 text-xs">
                <CheckCircle2 className="mr-1 h-3 w-3" />
                Saved successfully
              </Badge>
            )}
            {status === 'error' && (
              <Badge className="bg-red-100 text-red-700 border-0 text-xs">
                <AlertCircle className="mr-1 h-3 w-3" />
                Error saving
              </Badge>
            )}
          </div>
          <Button
            onClick={() => handleSaveGroup(groupKey)}
            disabled={isSaving}
            className="gold-gradient text-navy font-semibold hover:opacity-90 min-w-[140px]"
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-10 bg-gray-200 rounded-lg animate-pulse w-64" />
        <Card className="animate-pulse premium-shadow border-0">
          <CardContent className="p-6">
            <div className="h-80 bg-gray-200 rounded" />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="text-xl font-bold text-navy">Settings</h2>
        <p className="text-sm text-muted-foreground">Manage your store configuration</p>
      </motion.div>

      {/* Tabbed Settings */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.3 }}
      >
        <Card className="premium-shadow border-0 overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            {/* Tab Navigation */}
            <div className="border-b border-gray-100 px-2">
              <TabsList className="w-full flex h-auto p-1 bg-transparent gap-0 overflow-x-auto">
                {tabs.map((tab) => {
                  const TabIcon = tab.icon
                  return (
                    <TabsTrigger
                      key={tab.value}
                      value={tab.value}
                      className="flex items-center gap-2 data-[state=active]:bg-navy data-[state=active]:text-white data-[state=active]:shadow-md rounded-lg text-xs sm:text-sm py-2.5 px-3 sm:px-4 min-w-fit font-medium text-muted-foreground hover:text-navy transition-colors"
                    >
                      <TabIcon className="h-4 w-4" />
                      <span className="hidden sm:inline">{tab.label}</span>
                    </TabsTrigger>
                  )
                })}
              </TabsList>
            </div>

            {/* Tab Content */}
            <CardContent className="p-6">
              <TabsContent value="general" className="mt-0">
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="rounded-lg bg-navy/10 p-2">
                      <Globe className="h-5 w-5 text-navy" />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-navy">General Settings</h3>
                      <p className="text-xs text-muted-foreground">Site name, branding, and contact information</p>
                    </div>
                  </div>
                  <Separator className="mt-3" />
                </div>
                {renderTabContent('general')}
              </TabsContent>

              <TabsContent value="payment" className="mt-0">
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="rounded-lg bg-green-100 p-2">
                      <CreditCard className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-navy">Payment Settings</h3>
                      <p className="text-xs text-muted-foreground">Configure payment gateways and methods</p>
                    </div>
                  </div>
                  <Separator className="mt-3" />
                </div>
                {renderTabContent('payment')}
              </TabsContent>

              <TabsContent value="shipping" className="mt-0">
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="rounded-lg bg-cyan-100 p-2">
                      <Truck className="h-5 w-5 text-cyan-600" />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-navy">Shipping Settings</h3>
                      <p className="text-xs text-muted-foreground">Flat rates, free shipping thresholds, and delivery zones</p>
                    </div>
                  </div>
                  <Separator className="mt-3" />
                </div>
                {renderTabContent('shipping')}
              </TabsContent>

              <TabsContent value="tax" className="mt-0">
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="rounded-lg bg-amber-100 p-2">
                      <Percent className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-navy">Tax Settings</h3>
                      <p className="text-xs text-muted-foreground">GST rates, GSTIN, and tax inclusive/exclusive pricing</p>
                    </div>
                  </div>
                  <Separator className="mt-3" />
                </div>
                {renderTabContent('tax')}
              </TabsContent>

              <TabsContent value="notifications" className="mt-0">
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="rounded-lg bg-purple-100 p-2">
                      <Bell className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-navy">Notification Settings</h3>
                      <p className="text-xs text-muted-foreground">Email, SMS, and WhatsApp notification configuration</p>
                    </div>
                  </div>
                  <Separator className="mt-3" />
                </div>

                {/* Notification channels with distinct sub-sections */}
                <div className="space-y-6">
                  {/* Email Section */}
                  <div className="rounded-lg border border-gray-100 overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-50 to-transparent px-4 py-3 flex items-center gap-2 border-b border-gray-100">
                      <Mail className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-semibold text-navy">Email Channel</span>
                    </div>
                    <div className="p-4 space-y-4">
                      {fieldConfigs.notifications
                        .filter((f) => f.key.startsWith('email') || f.key.startsWith('smtp'))
                        .map((field) => (
                          <div key={field.key}>{renderField('notifications', field)}</div>
                        ))}
                    </div>
                  </div>

                  {/* SMS Section */}
                  <div className="rounded-lg border border-gray-100 overflow-hidden">
                    <div className="bg-gradient-to-r from-green-50 to-transparent px-4 py-3 flex items-center gap-2 border-b border-gray-100">
                      <Smartphone className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-semibold text-navy">SMS Channel</span>
                    </div>
                    <div className="p-4 space-y-4">
                      {fieldConfigs.notifications
                        .filter((f) => f.key.startsWith('sms'))
                        .map((field) => (
                          <div key={field.key}>{renderField('notifications', field)}</div>
                        ))}
                    </div>
                  </div>

                  {/* WhatsApp Section */}
                  <div className="rounded-lg border border-gray-100 overflow-hidden">
                    <div className="bg-gradient-to-r from-emerald-50 to-transparent px-4 py-3 flex items-center gap-2 border-b border-gray-100">
                      <MessageSquare className="h-4 w-4 text-emerald-600" />
                      <span className="text-sm font-semibold text-navy">WhatsApp Channel</span>
                    </div>
                    <div className="p-4 space-y-4">
                      {fieldConfigs.notifications
                        .filter((f) => f.key.startsWith('whatsapp'))
                        .map((field) => (
                          <div key={field.key}>{renderField('notifications', field)}</div>
                        ))}
                    </div>
                  </div>

                  {/* Save button */}
                  <div className="pt-4 flex items-center justify-between border-t border-gray-100">
                    <div>
                      {saveStatus['notifications'] === 'success' && (
                        <Badge className="bg-green-100 text-green-700 border-0 text-xs">
                          <CheckCircle2 className="mr-1 h-3 w-3" />
                          Saved successfully
                        </Badge>
                      )}
                      {saveStatus['notifications'] === 'error' && (
                        <Badge className="bg-red-100 text-red-700 border-0 text-xs">
                          <AlertCircle className="mr-1 h-3 w-3" />
                          Error saving
                        </Badge>
                      )}
                    </div>
                    <Button
                      onClick={() => handleSaveGroup('notifications')}
                      disabled={savingGroup === 'notifications'}
                      className="gold-gradient text-navy font-semibold hover:opacity-90 min-w-[140px]"
                    >
                      {savingGroup === 'notifications' ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      </motion.div>
    </div>
  )
}
