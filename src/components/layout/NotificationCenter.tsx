'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Bell,
  X,
  ShoppingCart,
  Tag,
  Info,
  CheckCheck,
  Trash2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

type NotificationType = 'order' | 'promo' | 'system'

interface Notification {
  id: string
  type: NotificationType
  title: string
  description: string
  timestamp: number
  read: boolean
}

const STORAGE_KEY = 'murlidhar-offset-notifications'

const defaultNotifications: Notification[] = [
  {
    id: 'n1',
    type: 'system',
    title: 'Welcome to Murlidhar Offset! 🎉',
    description: 'Start exploring our premium printing services.',
    timestamp: Date.now() - 3600000,
    read: false,
  },
  {
    id: 'n2',
    type: 'promo',
    title: 'Special Offer: 20% Off Wedding Cards',
    description: 'Limited time offer on our premium collection.',
    timestamp: Date.now() - 7200000,
    read: false,
  },
  {
    id: 'n3',
    type: 'order',
    title: 'Free Shipping on orders above ₹999',
    description: 'No minimum order quantity required.',
    timestamp: Date.now() - 86400000,
    read: false,
  },
]

const typeIcons: Record<NotificationType, typeof Info> = {
  order: ShoppingCart,
  promo: Tag,
  system: Info,
}

const typeColors: Record<NotificationType, string> = {
  order: 'text-green-500',
  promo: 'text-gold',
  system: 'text-blue-400',
}

const typeBgColors: Record<NotificationType, string> = {
  order: 'bg-green-500/10',
  promo: 'bg-gold/10',
  system: 'bg-blue-400/10',
}

function loadNotifications(): Notification[] {
  if (typeof window === 'undefined') return defaultNotifications
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored) as Notification[]
      if (parsed.length > 0) return parsed
    }
  } catch {
    // ignore
  }
  return defaultNotifications
}

function saveNotifications(notifications: Notification[]) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications))
  } catch {
    // ignore
  }
}

function formatTimestamp(ts: number): string {
  const diff = Date.now() - ts
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  return new Date(ts).toLocaleDateString()
}

export default function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    if (typeof window === 'undefined') return defaultNotifications
    return loadNotifications()
  })
  const panelRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  // Save notifications to localStorage when they change
  useEffect(() => {
    saveNotifications(notifications)
  }, [notifications])

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        isOpen &&
        panelRef.current &&
        !panelRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  const unreadCount = notifications.filter((n) => !n.read).length

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
  }, [])

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }, [])

  const clearAll = useCallback(() => {
    setNotifications([])
  }, [])

  return (
    <div className="relative">
      {/* Bell Button */}
      <Button
        ref={buttonRef}
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="relative text-white/80 hover:text-gold hover:bg-white/10"
        aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
      >
        <Bell className="size-5" />
        <AnimatePresence>
          {unreadCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-0.5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </motion.span>
          )}
        </AnimatePresence>
      </Button>

      {/* Dropdown Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={panelRef}
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-card rounded-xl premium-shadow-xl border border-border overflow-hidden z-[60]"
          >
            {/* Header */}
            <div className="px-4 py-3 border-b border-border flex items-center justify-between">
              <h3 className="font-semibold text-foreground text-sm">
                Notifications
              </h3>
              <div className="flex items-center gap-1">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="flex items-center gap-1 text-xs text-gold hover:text-gold-dark transition-colors px-2 py-1 rounded-md hover:bg-gold/5"
                    aria-label="Mark all as read"
                  >
                    <CheckCheck className="size-3" />
                    <span className="hidden sm:inline">Mark all read</span>
                  </button>
                )}
                {notifications.length > 0 && (
                  <button
                    onClick={clearAll}
                    className="flex items-center gap-1 text-xs text-muted-foreground hover:text-red-500 transition-colors px-2 py-1 rounded-md hover:bg-red-500/5"
                    aria-label="Clear all notifications"
                  >
                    <Trash2 className="size-3" />
                    <span className="hidden sm:inline">Clear</span>
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md hover:bg-secondary"
                  aria-label="Close notifications"
                >
                  <X className="size-3.5" />
                </button>
              </div>
            </div>

            {/* Notifications List */}
            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="py-12 text-center">
                  <Bell className="size-8 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">
                    No notifications yet
                  </p>
                  <p className="text-xs text-muted-foreground/60 mt-1">
                    We&apos;ll let you know when something comes up!
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {notifications.map((notification) => {
                    const Icon = typeIcons[notification.type]
                    return (
                      <motion.button
                        key={notification.id}
                        onClick={() => markAsRead(notification.id)}
                        className={`w-full text-left px-4 py-3 flex items-start gap-3 transition-colors hover:bg-secondary/50 ${
                          !notification.read ? 'bg-gold/[0.03]' : ''
                        }`}
                        whileHover={{ x: 2 }}
                        transition={{ duration: 0.15 }}
                      >
                        {/* Icon */}
                        <div
                          className={`w-8 h-8 rounded-lg ${typeBgColors[notification.type]} flex items-center justify-center shrink-0 mt-0.5`}
                        >
                          <Icon
                            className={`size-4 ${typeColors[notification.type]}`}
                          />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p
                              className={`text-sm font-medium truncate ${
                                !notification.read
                                  ? 'text-foreground'
                                  : 'text-muted-foreground'
                              }`}
                            >
                              {notification.title}
                            </p>
                            {!notification.read && (
                              <span className="w-2 h-2 rounded-full bg-gold shrink-0" />
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                            {notification.description}
                          </p>
                          <p className="text-[10px] text-muted-foreground/60 mt-1">
                            {formatTimestamp(notification.timestamp)}
                          </p>
                        </div>
                      </motion.button>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="px-4 py-2.5 border-t border-border">
                <p className="text-[10px] text-muted-foreground/50 text-center">
                  Murlidhar Offset Notifications
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
