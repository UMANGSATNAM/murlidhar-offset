'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  X,
  Clock,
  TrendingUp,
  ArrowRight,
  Printer,
  CreditCard,
  Gift,
  Package,
  FileText,
  Mail,
  Layers,
  Tag,
  Trash2,
} from 'lucide-react'
import { useNavigationStore } from '@/lib/store'

const RECENT_SEARCHES_KEY = 'murlidhar-offset-recent-searches'

const popularCategories = [
  { name: 'Business Cards', slug: 'business-cards', icon: CreditCard },
  { name: 'Wedding Cards', slug: 'wedding-cards', icon: Gift },
  { name: 'Letterheads', slug: 'letterheads', icon: FileText },
  { name: 'Brochures', slug: 'brochures', icon: Layers },
  { name: 'Packaging', slug: 'packaging', icon: Package },
  { name: 'Stickers', slug: 'stickers', icon: Tag },
  { name: 'Banners', slug: 'banners', icon: Printer },
  { name: 'Envelopes', slug: 'envelopes', icon: Mail },
]

const quickLinks = [
  { label: 'Track My Order', page: 'dashboard' as const },
  { label: 'Get Custom Quote', page: 'home' as const },
  { label: 'Bulk Orders', page: 'products' as const },
  { label: 'My Account', page: 'auth' as const },
]

const trendingSearches = [
  'Business Cards',
  'Wedding Cards',
  'Brochures',
  'Custom Packaging',
]

function loadRecentSearches(): string[] {
  if (typeof window === 'undefined') return []
  try {
    const stored = localStorage.getItem(RECENT_SEARCHES_KEY)
    if (stored) {
      return JSON.parse(stored) as string[]
    }
  } catch {
    // ignore
  }
  return []
}

function saveRecentSearches(searches: string[]) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(searches))
  } catch {
    // ignore
  }
}

export default function SearchModal() {
  const { navigate, setSearchQuery } = useNavigationStore()
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    if (typeof window === 'undefined') return []
    return loadRecentSearches()
  })
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)

  // Save recent searches to localStorage when they change
  useEffect(() => {
    saveRecentSearches(recentSearches)
  }, [recentSearches])

  // Callbacks for open/close with focus management and query reset
  const openModal = useCallback(() => {
    setIsOpen(true)
    setSelectedIndex(-1)
    setTimeout(() => inputRef.current?.focus(), 100)
  }, [])

  const closeModal = useCallback(() => {
    setIsOpen(false)
    setQuery('')
    setSelectedIndex(-1)
  }, [])

  // Keyboard shortcut: Ctrl+K or Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen((prev) => {
          if (!prev) setTimeout(() => inputRef.current?.focus(), 100)
          return !prev
        })
      }
      if (e.key === 'Escape') {
        closeModal()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [closeModal])

  // Expose open function via custom event
  useEffect(() => {
    const handleOpenSearch = () => openModal()
    window.addEventListener('open-search-modal', handleOpenSearch)
    return () => window.removeEventListener('open-search-modal', handleOpenSearch)
  }, [openModal])

  const handleSearch = useCallback(
    (searchTerm: string) => {
      const trimmed = searchTerm.trim()
      if (!trimmed) return

      // Add to recent searches
      setRecentSearches((prev) => {
        const filtered = prev.filter((s) => s !== trimmed)
        return [trimmed, ...filtered].slice(0, 5)
      })

      setSearchQuery(trimmed)
      navigate('products')
      setIsOpen(false)
    },
    [navigate, setSearchQuery]
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSearch(query)
  }

  const handleCategoryClick = (slug: string) => {
    navigate('products', { categorySlug: slug })
    setIsOpen(false)
  }

  const handleQuickLinkClick = (page: 'dashboard' | 'home' | 'products' | 'auth') => {
    navigate(page)
    setIsOpen(false)
  }

  const removeRecentSearch = (search: string) => {
    setRecentSearches((prev) => prev.filter((s) => s !== search))
  }

  const clearRecentSearches = () => {
    setRecentSearches([])
  }

  // Build list of selectable items for keyboard navigation
  const selectableItems = (() => {
    const items: Array<{ type: 'recent' | 'trending' | 'category' | 'action'; value: string }> = []

    if (!query) {
      // Recent searches
      recentSearches.forEach((s) =>
        items.push({ type: 'recent', value: s })
      )
      // Trending searches
      trendingSearches.forEach((s) =>
        items.push({ type: 'trending', value: s })
      )
    }

    // Categories (filtered)
    const filteredCategories = query
      ? popularCategories.filter((c) =>
          c.name.toLowerCase().includes(query.toLowerCase())
        )
      : popularCategories

    filteredCategories.forEach((c) =>
      items.push({ type: 'category', value: c.slug })
    )

    // Search action
    if (query.trim()) {
      items.push({ type: 'action', value: query })
    }

    return items
  })()

  // Filter categories based on query
  const filteredCategories = query
    ? popularCategories.filter((c) =>
        c.name.toLowerCase().includes(query.toLowerCase())
      )
    : popularCategories

  const filteredCount = query ? filteredCategories.length : 0

  // Keyboard navigation within the modal
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((prev) =>
        prev < selectableItems.length - 1 ? prev + 1 : 0
      )
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((prev) =>
        prev > 0 ? prev - 1 : selectableItems.length - 1
      )
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault()
      const item = selectableItems[selectedIndex]
      if (item) {
        if (item.type === 'category') {
          handleCategoryClick(item.value)
        } else {
          handleSearch(item.value)
        }
      }
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Dark overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
            onClick={() => closeModal()}
          />

          {/* Search modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[101] flex items-start justify-center pt-[10vh] sm:pt-[15vh] px-4 pointer-events-none"
          >
            <div className="w-full max-w-xl pointer-events-auto">
              <div className="glass-navy rounded-2xl overflow-hidden premium-shadow-xl gold-border-glow">
                {/* Search input */}
                <form onSubmit={handleSubmit} className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gold/60" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => {
                      setQuery(e.target.value)
                      setSelectedIndex(-1)
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder="Search products, categories, or pages..."
                    className="w-full pl-12 pr-12 py-4 bg-transparent text-white text-base placeholder:text-white/30 outline-none border-b border-gold/10"
                  />
                  <button
                    type="button"
                    onClick={() => closeModal()}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors p-1"
                    aria-label="Close search"
                  >
                    <X className="size-5" />
                  </button>
                </form>

                {/* Content area */}
                <div className="max-h-[50vh] overflow-y-auto p-4">
                  {/* Recent searches */}
                  {recentSearches.length > 0 && !query && (
                    <div className="mb-5">
                      <h4 className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-2 flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <Clock className="size-3" />
                          Recent Searches
                        </span>
                        <button
                          onClick={clearRecentSearches}
                          className="text-white/25 hover:text-white/50 transition-colors flex items-center gap-1 normal-case text-[10px] font-normal"
                          aria-label="Clear recent searches"
                        >
                          <Trash2 className="size-2.5" />
                          Clear
                        </button>
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {recentSearches.map((search, idx) => {
                          const globalIdx = idx
                          return (
                            <button
                              key={search}
                              onClick={() => handleSearch(search)}
                              className={`group flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border text-white/70 text-xs transition-all ${
                                selectedIndex === globalIdx
                                  ? 'border-gold/40 bg-gold/10 text-gold'
                                  : 'border-white/10 hover:bg-gold/10 hover:border-gold/20 hover:text-gold'
                              }`}
                            >
                              <span>{search}</span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  removeRecentSearch(search)
                                }}
                                className="opacity-0 group-hover:opacity-100 text-white/30 hover:text-white/60 transition-opacity"
                                aria-label={`Remove ${search}`}
                              >
                                <X className="size-2.5" />
                              </button>
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {/* Trending searches */}
                  {!query && (
                    <div className="mb-5">
                      <h4 className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <TrendingUp className="size-3" />
                        Trending Searches
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {trendingSearches.map((search, idx) => {
                          const globalIdx = recentSearches.length + idx
                          return (
                            <button
                              key={search}
                              onClick={() => handleSearch(search)}
                              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-white/70 text-xs transition-all ${
                                selectedIndex === globalIdx
                                  ? 'bg-gold/10 border border-gold/40 text-gold'
                                  : 'bg-white/[0.03] border border-transparent hover:bg-gold/10 hover:border-gold/20 hover:text-gold'
                              }`}
                            >
                              <TrendingUp className="size-2.5 text-gold/40" />
                              <span>{search}</span>
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {/* Popular categories */}
                  <div className="mb-5">
                    <h4 className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <TrendingUp className="size-3" />
                      {query ? 'Matching Categories' : 'Popular Categories'}
                      {query && filteredCount > 0 && (
                        <span className="ml-auto normal-case font-normal text-white/20">
                          {filteredCount} result{filteredCount !== 1 ? 's' : ''}
                        </span>
                      )}
                    </h4>
                    <div className="grid grid-cols-2 gap-1.5">
                      {filteredCategories.map((cat, idx) => {
                        const trendingOffset = query ? 0 : recentSearches.length + trendingSearches.length
                        const globalIdx = trendingOffset + idx
                        return (
                          <button
                            key={cat.slug}
                            onClick={() => handleCategoryClick(cat.slug)}
                            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-white/70 hover:text-gold text-sm transition-all group ${
                              selectedIndex === globalIdx
                                ? 'bg-gold/10 border border-gold/20 text-gold'
                                : 'bg-white/[0.03] hover:bg-gold/10 border border-transparent hover:border-gold/20'
                            }`}
                          >
                            <cat.icon className={`size-4 shrink-0 transition-colors ${
                              selectedIndex === globalIdx
                                ? 'text-gold'
                                : 'text-gold/40 group-hover:text-gold'
                            }`} />
                            <span className="truncate">{cat.name}</span>
                            <ArrowRight className="size-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                          </button>
                        )
                      })}
                    </div>
                    {filteredCategories.length === 0 && query && (
                      <p className="text-white/30 text-sm text-center py-4">
                        No categories match &ldquo;{query}&rdquo;
                      </p>
                    )}
                  </div>

                  {/* Quick links */}
                  {!query && (
                    <div>
                      <h4 className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-2">
                        Quick Links
                      </h4>
                      <div className="flex flex-col gap-0.5">
                        {quickLinks.map((link) => (
                          <button
                            key={link.label}
                            onClick={() => handleQuickLinkClick(link.page)}
                            className="flex items-center justify-between px-3 py-2.5 rounded-lg text-white/70 hover:text-gold hover:bg-gold/10 text-sm transition-all group"
                          >
                            <span>{link.label}</span>
                            <ArrowRight className="size-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Search action */}
                  {query.trim() && (
                    <div className="pt-3 border-t border-gold/10">
                      <button
                        onClick={() => handleSearch(query)}
                        className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold text-sm transition-all ${
                          selectedIndex === selectableItems.length - 1
                            ? 'gold-gradient-shimmer text-navy'
                            : 'gold-gradient text-navy hover:opacity-90'
                        }`}
                      >
                        <Search className="size-4" />
                        Search for &ldquo;{query}&rdquo;
                      </button>
                    </div>
                  )}
                </div>

                {/* Footer with keyboard shortcut hints */}
                <div className="px-4 py-2.5 border-t border-gold/10 flex items-center justify-between">
                  <div className="flex items-center gap-3 text-white/25 text-[10px]">
                    <span className="flex items-center gap-1">
                      <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[9px] font-mono">
                        ↑↓
                      </kbd>
                      navigate
                    </span>
                    <span className="flex items-center gap-1">
                      <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[9px] font-mono">
                        ↵
                      </kbd>
                      to select
                    </span>
                    <span className="flex items-center gap-1">
                      <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[9px] font-mono">
                        ESC
                      </kbd>
                      to close
                    </span>
                  </div>
                  <span className="text-white/20 text-[10px]">
                    Powered by Murlidhar Offset
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
