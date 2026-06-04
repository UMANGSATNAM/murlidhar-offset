'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MessageCircle,
  X,
  Send,
  Minus,
  Printer,
} from 'lucide-react'

interface ChatMessage {
  id: string
  sender: 'user' | 'bot'
  text: string
  timestamp: number
}

const STORAGE_KEY = 'murlidhar-offset-chat'

const quickReplies = [
  'Product Inquiry',
  'Get a Quote',
  'Track Order',
  'Custom Design',
]

const botResponses: Record<string, string> = {
  'Product Inquiry':
    "We'd love to help! Browse our products or tell us what you need. Our team typically responds within 5 minutes during business hours (9 AM - 7 PM IST).",
  'Get a Quote':
    'For custom quotes, please share: 1) Product type, 2) Quantity, 3) Any special requirements. Or call us at +91 98765 43210 for instant pricing!',
  'Track Order':
    'Please share your order number (format: MO-XXXX) and we\'ll look it up for you right away.',
  'Custom Design':
    'Our design team can help! Share your requirements and we\'ll create a custom design. Design charges start at ₹500.',
}

const defaultResponse =
  'Thank you for reaching out! Our team will respond shortly. For urgent queries, call +91 98765 43210'

const welcomeMessage: ChatMessage = {
  id: 'welcome',
  sender: 'bot',
  text: 'Welcome to Murlidhar Offset! 👋 How can we help you today?',
  timestamp: Date.now(),
}

function loadChat(): ChatMessage[] {
  if (typeof window === 'undefined') return [welcomeMessage]
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored) as ChatMessage[]
      if (parsed.length > 0) return parsed
    }
  } catch {
    // ignore
  }
  return [welcomeMessage]
}

function saveChat(messages: ChatMessage[]) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages))
  } catch {
    // ignore
  }
}

export default function LiveChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    if (typeof window === 'undefined') return [welcomeMessage]
    return loadChat()
  })
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [unreadCount, setUnreadCount] = useState(() => {
    if (typeof window === 'undefined') return 0
    const loaded = loadChat()
    const lastUserIdx = loaded.reduce(
      (acc, m, i) => (m.sender === 'user' ? i : acc),
      -1
    )
    return loaded.filter(
      (m, i) => m.sender === 'bot' && i > lastUserIdx && i > 0
    ).length
  })
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const chatPanelRef = useRef<HTMLDivElement>(null)

  // Save chat to localStorage when messages change
  useEffect(() => {
    saveChat(messages)
  }, [messages])

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300)
      setUnreadCount(0)
    }
  }, [isOpen])

  // Close chat when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        isOpen &&
        chatPanelRef.current &&
        !chatPanelRef.current.contains(e.target as Node)
      ) {
        const target = e.target as HTMLElement
        // Don't close if clicking the chat bubble button itself
        if (target.closest('[data-chat-bubble]')) return
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  const addBotResponse = useCallback((userMessage: string) => {
    setIsTyping(true)
    const delay = 1500

    setTimeout(() => {
      setIsTyping(false)
      // Check if the user message matches a quick reply
      const matchedKey = quickReplies.find(
        (key) =>
          userMessage.toLowerCase().includes(key.toLowerCase()) ||
          key.toLowerCase().includes(userMessage.toLowerCase())
      )
      const responseText = matchedKey
        ? botResponses[matchedKey]
        : defaultResponse

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: responseText,
        timestamp: Date.now(),
      }
      setMessages((prev) => {
        const updated = [...prev, botMsg]
        saveChat(updated)
        return updated
      })
      // Increment unread if chat is closed
      setIsOpen((prevIsOpen) => {
        if (!prevIsOpen) {
          setUnreadCount((c) => c + 1)
        }
        return prevIsOpen
      })
    }, delay)
  }, [])

  const handleSend = useCallback(() => {
    const trimmed = input.trim()
    if (!trimmed || isTyping) return

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: trimmed,
      timestamp: Date.now(),
    }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    addBotResponse(trimmed)
  }, [input, isTyping, addBotResponse])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleQuickReply = (reply: string) => {
    if (isTyping) return
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: reply,
      timestamp: Date.now(),
    }
    setMessages((prev) => [...prev, userMsg])
    addBotResponse(reply)
  }

  const formatTime = (ts: number) => {
    const d = new Date(ts)
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <>
      {/* Chat Bubble Button */}
      <motion.button
        data-chat-bubble
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-24 right-6 z-50 w-14 h-14 rounded-full gold-gradient flex items-center justify-center premium-shadow-lg hover:scale-105 transition-transform"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 2, type: 'spring', stiffness: 200 }}
        aria-label="Open live chat"
      >
        {isOpen ? (
          <Minus className="size-6 text-navy" />
        ) : (
          <MessageCircle className="size-6 text-navy" />
        )}

        {/* Unread badge */}
        <AnimatePresence>
          {!isOpen && unreadCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={chatPanelRef}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-40 right-6 z-50 w-[340px] sm:w-[400px] md:w-[460px] h-[480px] sm:h-[500px] rounded-2xl overflow-hidden premium-shadow-xl gold-border flex flex-col"
            style={{
              background: 'var(--card)',
            }}
          >
            {/* Header */}
            <div className="navy-gradient px-4 py-3 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg gold-gradient flex items-center justify-center">
                  <Printer className="size-4 text-navy" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-sm">
                    Murlidhar Offset
                  </h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-white/60 text-[10px]">
                      Online • Typically replies in 5 min
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/50 hover:text-white transition-colors p-1 rounded-md hover:bg-white/10"
                aria-label="Close chat"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-background/50">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex ${
                    msg.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      msg.sender === 'user'
                        ? 'gold-gradient text-navy rounded-br-md'
                        : 'bg-card text-foreground border border-border rounded-bl-md'
                    }`}
                  >
                    <p>{msg.text}</p>
                    <p
                      className={`text-[9px] mt-1 ${
                        msg.sender === 'user'
                          ? 'text-navy/50'
                          : 'text-muted-foreground'
                      }`}
                    >
                      {formatTime(msg.timestamp)}
                    </p>
                  </div>
                </motion.div>
              ))}

              {/* Typing indicator */}
              <AnimatePresence>
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="flex justify-start"
                  >
                    <div className="bg-card text-foreground border border-border px-4 py-3 rounded-2xl rounded-bl-md">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-gold/60 animate-bounce" />
                        <span
                          className="w-2 h-2 rounded-full bg-gold/60 animate-bounce"
                          style={{ animationDelay: '0.15s' }}
                        />
                        <span
                          className="w-2 h-2 rounded-full bg-gold/60 animate-bounce"
                          style={{ animationDelay: '0.3s' }}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Replies */}
            {messages.length <= 2 && !isTyping && (
              <div className="px-4 py-2 border-t border-border bg-background/50 shrink-0">
                <div className="flex flex-wrap gap-1.5">
                  {quickReplies.map((reply) => (
                    <button
                      key={reply}
                      onClick={() => handleQuickReply(reply)}
                      className="px-3 py-1.5 rounded-full text-xs font-medium border border-gold/30 text-gold hover:bg-gold/10 transition-colors"
                    >
                      {reply}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Area */}
            <div className="px-4 py-3 border-t border-border bg-background shrink-0">
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a message..."
                  disabled={isTyping}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-secondary text-foreground text-sm placeholder:text-muted-foreground outline-none border border-border focus:border-gold/50 focus:ring-1 focus:ring-gold/20 transition-colors disabled:opacity-50"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isTyping}
                  className="w-10 h-10 rounded-xl gold-gradient flex items-center justify-center text-navy hover:opacity-90 transition-opacity disabled:opacity-40"
                  aria-label="Send message"
                >
                  <Send className="size-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
