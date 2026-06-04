'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Plus,
  Save,
  Trash2,
  GripVertical,
  Eye,
  EyeOff,
  Edit,
  X,
  Image as ImageIcon,
  FileText,
  Star,
  MessageSquare,
  HelpCircle,
  Layout,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Separator } from '@/components/ui/separator'

interface CmsItem {
  id: string
  section: string
  key: string
  title: string | null
  subtitle: string | null
  content: string | null
  image: string | null
  metadata: Record<string, unknown>
  sortOrder: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

interface SectionConfig {
  key: string
  label: string
  icon: React.ElementType
  description: string
}

const sections: SectionConfig[] = [
  { key: 'hero', label: 'Hero', icon: Layout, description: 'Homepage hero banner' },
  { key: 'banner', label: 'Banners', icon: Star, description: 'Promotional banners' },
  { key: 'testimonial', label: 'Testimonials', icon: MessageSquare, description: 'Customer reviews' },
  { key: 'faq', label: 'FAQs', icon: HelpCircle, description: 'Frequently asked questions' },
  { key: 'footer', label: 'Footer', icon: FileText, description: 'Footer content' },
]

const emptyCmsItem = {
  section: '',
  key: '',
  title: '',
  subtitle: '',
  content: '',
  image: '',
  metadata: {},
  sortOrder: 0,
  isActive: true,
}

export default function AdminCMS() {
  const [activeSection, setActiveSection] = useState('hero')
  const [items, setItems] = useState<CmsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Edit dialog
  const [showDialog, setShowDialog] = useState(false)
  const [editItem, setEditItem] = useState<typeof emptyCmsItem>(emptyCmsItem)
  const [editingId, setEditingId] = useState<string | null>(null)

  // Delete dialog
  const [deleteId, setDeleteId] = useState<string | null>(null)

  // Active section config
  const sectionConfig = sections.find((s) => s.key === activeSection) || sections[0]

  useEffect(() => {
    fetchSection(activeSection)
  }, [activeSection])

  const fetchSection = async (section: string) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/cms?section=${section}`)
      if (res.ok) {
        const data = await res.json()
        setItems(data.contents || [])
      }
    } catch (err) {
      console.error('Failed to fetch CMS:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleOpenCreate = () => {
    setEditingId(null)
    setEditItem({
      ...emptyCmsItem,
      section: activeSection,
      key: `${activeSection}_item_${Date.now()}`,
      sortOrder: items.length,
    })
    setShowDialog(true)
  }

  const handleOpenEdit = (item: CmsItem) => {
    setEditingId(item.id)
    setEditItem({
      section: item.section,
      key: item.key,
      title: item.title || '',
      subtitle: item.subtitle || '',
      content: item.content || '',
      image: item.image || '',
      metadata: item.metadata,
      sortOrder: item.sortOrder,
      isActive: item.isActive,
    })
    setShowDialog(true)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/cms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editItem),
      })
      if (res.ok) {
        setShowDialog(false)
        fetchSection(activeSection)
      }
    } catch (err) {
      console.error('Failed to save CMS:', err)
    } finally {
      setSaving(false)
    }
  }

  const handleToggleActive = async (item: CmsItem) => {
    try {
      await fetch('/api/cms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          section: item.section,
          key: item.key,
          isActive: !item.isActive,
        }),
      })
      fetchSection(activeSection)
    } catch (err) {
      console.error('Failed to toggle CMS item:', err)
    }
  }

  const handleDelete = async () => {
    // Since there's no DELETE endpoint in the CMS API, we'll deactivate
    // In production, you'd add a DELETE endpoint
    setDeleteId(null)
  }

  const handleReorder = (index: number, direction: 'up' | 'down') => {
    const newItems = [...items]
    const swapIndex = direction === 'up' ? index - 1 : index + 1
    if (swapIndex < 0 || swapIndex >= newItems.length) return
    ;[newItems[index], newItems[swapIndex]] = [newItems[swapIndex], newItems[index]]
    setItems(newItems)

    // Update sort order for swapped items
    newItems.forEach((item, i) => {
      if (i === index || i === swapIndex) {
        fetch('/api/cms', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            section: item.section,
            key: item.key,
            sortOrder: i,
          }),
        })
      }
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-navy">Content Management</h2>
          <p className="text-sm text-muted-foreground">Manage website content sections</p>
        </div>
        <Button
          onClick={handleOpenCreate}
          className="gold-gradient text-navy font-semibold hover:opacity-90"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Content
        </Button>
      </div>

      {/* Section Tabs */}
      <Tabs value={activeSection} onValueChange={setActiveSection}>
        <TabsList className="bg-white premium-shadow border-0 h-auto p-1">
          {sections.map((section) => {
            const Icon = section.icon
            return (
              <TabsTrigger
                key={section.key}
                value={section.key}
                className="data-[state=active]:bg-navy data-[state=active]:text-white px-4 py-2 text-sm"
              >
                <Icon className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">{section.label}</span>
              </TabsTrigger>
            )
          })}
        </TabsList>

        {sections.map((section) => (
          <TabsContent key={section.key} value={section.key} className="mt-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Section Info */}
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="secondary" className="bg-navy/5 text-navy text-xs">
                  {section.label}
                </Badge>
                <span className="text-sm text-muted-foreground">{section.description}</span>
                <Badge variant="outline" className="ml-auto text-xs">
                  {items.length} item{items.length !== 1 ? 's' : ''}
                </Badge>
              </div>

              {/* Content Items */}
              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <Card key={i} className="animate-pulse">
                      <CardContent className="p-4">
                        <div className="h-20 bg-gray-200 rounded" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : items.length === 0 ? (
                <Card className="premium-shadow border-0">
                  <CardContent className="p-12">
                    <div className="flex flex-col items-center gap-3 text-muted-foreground">
                      <FileText className="h-10 w-10" />
                      <p className="text-sm">No content items in this section</p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleOpenCreate}
                        className="text-gold border-gold/30 hover:bg-gold/10"
                      >
                        <Plus className="mr-1 h-3.5 w-3.5" />
                        Add first item
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3">
                  {items.map((item, index) => (
                    <Card
                      key={item.id}
                      className={`premium-shadow border-0 transition-all ${
                        !item.isActive ? 'opacity-60' : ''
                      }`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          {/* Reorder Controls */}
                          <div className="flex flex-col gap-1 pt-1">
                            <button
                              className="rounded p-0.5 hover:bg-gray-100 disabled:opacity-30"
                              disabled={index === 0}
                              onClick={() => handleReorder(index, 'up')}
                            >
                              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                <path d="M6 2L2 6h8L6 2z" fill="currentColor" />
                              </svg>
                            </button>
                            <button
                              className="rounded p-0.5 hover:bg-gray-100 disabled:opacity-30"
                              disabled={index === items.length - 1}
                              onClick={() => handleReorder(index, 'down')}
                            >
                              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                <path d="M6 10L2 6h8L6 10z" fill="currentColor" />
                              </svg>
                            </button>
                          </div>

                          {/* Content Preview */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="text-sm font-semibold text-navy truncate">
                                {item.title || item.key}
                              </h4>
                              {item.subtitle && (
                                <span className="text-xs text-muted-foreground truncate">
                                  — {item.subtitle}
                                </span>
                              )}
                              {!item.isActive && (
                                <Badge className="text-[9px] bg-gray-100 text-gray-500 px-1.5 py-0">
                                  Inactive
                                </Badge>
                              )}
                            </div>
                            {item.content && (
                              <p className="text-xs text-muted-foreground line-clamp-2">
                                {item.content.replace(/<[^>]*>/g, '').substring(0, 150)}
                              </p>
                            )}
                            {item.image && (
                              <div className="mt-2 flex items-center gap-1 text-xs text-gold">
                                <ImageIcon className="h-3 w-3" />
                                Has image
                              </div>
                            )}
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                                key: {item.key}
                              </Badge>
                              <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                                order: {item.sortOrder}
                              </Badge>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleToggleActive(item)}
                              title={item.isActive ? 'Deactivate' : 'Activate'}
                            >
                              {item.isActive ? (
                                <Eye className="h-4 w-4 text-green-500" />
                              ) : (
                                <EyeOff className="h-4 w-4 text-gray-400" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-gold hover:text-gold-dark"
                              onClick={() => handleOpenEdit(item)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-red-400 hover:text-red-600"
                              onClick={() => setDeleteId(item.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </motion.div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Edit/Create Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-navy text-lg">
              {editingId ? 'Edit Content' : 'Add Content'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm">Section</Label>
                <Input
                  value={editItem.section}
                  disabled
                  className="bg-gray-50"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm">Key *</Label>
                <Input
                  value={editItem.key}
                  onChange={(e) => setEditItem({ ...editItem, key: e.target.value })}
                  placeholder="unique-key"
                  className="focus:border-gold"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm">Title</Label>
              <Input
                value={editItem.title}
                onChange={(e) => setEditItem({ ...editItem, title: e.target.value })}
                placeholder="Content title"
                className="focus:border-gold"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm">Subtitle</Label>
              <Input
                value={editItem.subtitle}
                onChange={(e) => setEditItem({ ...editItem, subtitle: e.target.value })}
                placeholder="Subtitle or tagline"
                className="focus:border-gold"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm">Content</Label>
              <Textarea
                value={editItem.content}
                onChange={(e) => setEditItem({ ...editItem, content: e.target.value })}
                placeholder="Main content (HTML supported)"
                rows={6}
                className="focus:border-gold"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm">Image URL</Label>
              <Input
                value={editItem.image}
                onChange={(e) => setEditItem({ ...editItem, image: e.target.value })}
                placeholder="https://example.com/image.jpg"
                className="focus:border-gold"
              />
              {editItem.image && (
                <div className="mt-2 h-32 rounded-lg border overflow-hidden bg-gray-50">
                  <img
                    src={editItem.image}
                    alt="Preview"
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      ;(e.target as HTMLImageElement).style.display = 'none'
                    }}
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm">Sort Order</Label>
                <Input
                  type="number"
                  value={editItem.sortOrder}
                  onChange={(e) =>
                    setEditItem({ ...editItem, sortOrder: parseInt(e.target.value) || 0 })
                  }
                  className="focus:border-gold"
                />
              </div>
              <div className="flex items-center gap-2 pt-6">
                <Switch
                  checked={editItem.isActive}
                  onCheckedChange={(v) => setEditItem({ ...editItem, isActive: v })}
                />
                <Label className="text-sm">Active</Label>
              </div>
            </div>
          </div>

          <DialogFooter className="border-t pt-4">
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving || !editItem.key}
              className="gold-gradient text-navy font-semibold hover:opacity-90"
            >
              <Save className="mr-2 h-4 w-4" />
              {saving ? 'Saving...' : 'Save Content'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Content Item?</AlertDialogTitle>
            <AlertDialogDescription>
              This will deactivate this content item. It can be reactivated later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Deactivate
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
