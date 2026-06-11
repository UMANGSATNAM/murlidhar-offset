'use client'

import React from 'react'
import { Skeleton } from '@/components/ui/skeleton'

export default function ProductCardSkeleton() {
  return (
    <div className="rounded-xl border border-border/40 bg-card overflow-hidden">
      {/* Image skeleton */}
      <div className="relative aspect-[4/3] bg-gradient-to-br from-navy/5 to-gold/5 overflow-hidden">
        <Skeleton className="absolute inset-0 bg-gradient-to-br from-muted/60 to-muted/30" />
        {/* Badge skeleton */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          <Skeleton className="h-5 w-20 rounded-full" />
          <Skeleton className="h-4 w-16 rounded-full" />
        </div>
        {/* Action buttons skeleton */}
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </div>

      {/* Content skeleton */}
      <div className="p-4 space-y-3">
        {/* Category badge */}
        <Skeleton className="h-4 w-24 rounded-full" />
        {/* Title */}
        <Skeleton className="h-4 w-3/4" />
        {/* Description */}
        <Skeleton className="h-3 w-full" />
        {/* Rating */}
        <div className="flex items-center gap-1.5">
          <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-3 w-3 rounded-sm" />
            ))}
          </div>
          <Skeleton className="h-3 w-8" />
        </div>
        {/* Price row */}
        <div className="flex items-center justify-between pt-2">
          <div className="space-y-1">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-5 w-20" />
          </div>
          <Skeleton className="h-8 w-8 rounded-lg gold-gradient opacity-40" />
        </div>
      </div>
    </div>
  )
}
