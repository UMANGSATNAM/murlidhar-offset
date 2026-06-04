# Task 3+4: Stores & API Routes - Work Record

## Agent: Main Agent
## Task ID: 3+4
## Status: COMPLETED

## Summary
Created client-side Zustand stores (navigation & cart) and 11 API route files for the Murlidhar Offset printing platform.

## Files Created

### Zustand Stores
1. **`/home/z/my-project/src/lib/store.ts`** - Navigation & UI Store
   - Page state management (home, products, product-detail, cart, checkout, auth, dashboard, admin variants)
   - `navigate()` function with params (productId, categorySlug)
   - Sidebar state, search query, goHome helper
   - Auto-scrolls to top on navigation

2. **`/home/z/my-project/src/lib/cart-store.ts`** - Cart Store
   - CartItem type with id, productId, name, quantity, price, image, variantName, variantId, attrs
   - addItem (merges same product+variant+attrs), removeItem, updateQuantity, clearCart
   - Computed values: subtotal, gstAmount (18% GST), totalAmount, itemCount
   - localStorage persistence with `_hydrate()` for SSR compatibility

### API Routes
3. **`/home/z/my-project/src/app/api/products/route.ts`** - GET: List products with filtering (category, search, featured, pagination, sorting)
4. **`/home/z/my-project/src/app/api/products/[id]/route.ts`** - GET: Single product with variants, variantOptions, quantityPrices, FAQs, reviews
5. **`/home/z/my-project/src/app/api/categories/route.ts`** - GET: Active categories with children and product counts
6. **`/home/z/my-project/src/app/api/cart/route.ts`** - GET (user cart), POST (add item), DELETE (remove item)
7. **`/home/z/my-project/src/app/api/orders/route.ts`** - GET (user orders), POST (create order with coupon support)
8. **`/home/z/my-project/src/app/api/admin/dashboard/route.ts`** - GET: Dashboard stats (revenue, orders, customers, monthly revenue, top products)
9. **`/home/z/my-project/src/app/api/admin/products/route.ts`** - GET (all products including inactive), POST (create with variants/options/qty prices)
10. **`/home/z/my-project/src/app/api/admin/orders/route.ts`** - GET (all orders with filters), PATCH (update status with timeline tracking)
11. **`/home/z/my-project/src/app/api/cms/route.ts`** - GET (by section/key), POST (upsert CMS content)
12. **`/home/z/my-project/src/app/api/upload/route.ts`** - POST (file upload: PDF, PNG, AI, PSD, SVG, JPG with 50MB limit)
13. **`/home/z/my-project/src/app/api/settings/route.ts`** - GET (grouped settings with type parsing), PATCH (bulk upsert settings)

## Key Design Decisions
- All API routes use `import { db } from '@/lib/db'` for Prisma database access
- Dynamic route params use Next.js 16 convention: `{ params }: { params: Promise<{ id: string }> }` with `await params`
- JSON fields (images, attrs, values, metadata) are parsed before returning from API
- Cart store is client-only with localStorage persistence (not DB-backed for simplicity)
- Order creation handles quantity pricing tiers and coupon validation
- File upload validates extension, MIME type, and size; saves to `/upload/` directory
- Settings support typed parsing (text, number, boolean, json, color)
- All routes have proper error handling with appropriate HTTP status codes

## Verification
- `bun run lint` passes with no errors
- Dev server running cleanly on port 3000
