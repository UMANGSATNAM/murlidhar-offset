# R2 - Fix Critical Bugs: Cart Store Re-render Issue

## Summary
Fixed the critical bug where the cart store didn't properly trigger re-renders when items changed, because it used methods (`itemCount()`, `subtotal()`, etc.) instead of computed selector hooks.

## Root Cause
The original `useCartStore` defined `subtotal`, `gstAmount`, `totalAmount`, and `itemCount` as **methods** on the store state. When components called these methods, Zustand's subscription system couldn't detect changes because:
1. Methods are function references that don't change when `items` changes
2. The broken `useEffect` in Header (`setCartCount(itemCount())` with `useCartStore.getState().items` as dependency) created an infinite loop risk and didn't work properly

## Changes Made

### Fix 1: `/home/z/my-project/src/lib/cart-store.ts`
- **Removed** method-based computed values (`subtotal()`, `gstAmount()`, `totalAmount()`, `itemCount()`) from the store interface and implementation
- **Added** selector hooks that subscribe to `items` changes:
  - `useCartSubtotal()` - computes subtotal from items
  - `useCartGstAmount()` - computes GST amount
  - `useCartTotalAmount()` - computes total (subtotal + GST)
  - `useCartItemCount()` - computes total item count
- These selectors use `useCartStore((s) => ...)` pattern which properly triggers re-renders when the `items` array changes

### Fix 2: `/home/z/my-project/src/components/layout/Header.tsx`
- **Replaced** `const { itemCount, _hydrate } = useCartStore()` + broken `cartCount` state/effect
- **With** `const cartCount = useCartItemCount()` + `const _hydrate = useCartStore(s => s._hydrate)`
- **Removed** the broken `useEffect` that called `setCartCount(itemCount())` with invalid dependency
- The Header's cart badge now properly updates when items are added from any page

### Fix 3: `/home/z/my-project/src/components/cart/CartPage.tsx`
- **Replaced** single `useCartStore()` destructuring with individual selectors
- `items`, `removeItem`, `updateQuantity` each use their own `useCartStore(s => s.xxx)` selector
- `subtotalVal` → `useCartSubtotal()`, `gstVal` → `useCartGstAmount()`, `itemCount` → `useCartItemCount()`
- **Fixed** `itemCount()` method calls to `itemCount` (now a value, not a function)

### Fix 4: `/home/z/my-project/src/components/products/ProductDetail.tsx`
- **No changes needed** - already used `const addItem = useCartStore((s) => s.addItem)` which is the correct selector pattern

### Fix 5: `/home/z/my-project/src/components/checkout/CheckoutPage.tsx`
- **Replaced** `const { items, subtotal, gstAmount, totalAmount, clearCart } = useCartStore()`
- **With** individual selectors: `useCartStore((s) => s.items)`, `useCartStore((s) => s.clearCart)`, `useCartSubtotal()`, `useCartGstAmount()`
- Removed method calls `subtotal()`, `gstAmount()` in favor of direct values from selector hooks

## Verification
- ESLint passes with no errors
- Dev server compiles successfully
- All hooks are called unconditionally (before any early returns)
