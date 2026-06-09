---
Task ID: 1
Agent: Hash Routing Developer
Task: Implement hash-based routing for bookmarkability

Work Log:
- Read and analyzed `/home/z/my-project/src/lib/store.ts` — understood the existing Zustand store with `navigate()`, `goHome()`, and state fields (`page`, `productId`, `categorySlug`)
- Read and analyzed `/home/z/my-project/src/app/page.tsx` — understood the SPA rendering pattern using `useNavigationStore` and dynamic imports
- Updated `store.ts` with:
  - `pageToHash()` function: converts `{ page, productId, categorySlug }` to a URL hash string (e.g., `#products/wedding-cards`, `#product-detail/clxxxx123`)
  - `hashToPage()` function: parses a URL hash string back to `{ page, productId, categorySlug }`, with fallback to home for unknown hashes
  - `syncFromHash()` action: updates the store from a parsed hash (used by browser back/forward)
  - `_programmaticHashChange` flag: prevents infinite loops when `navigate()`/`goHome()` updates the hash, which would trigger `hashchange` → `syncFromHash` → redundant state update
  - Updated `navigate()` to set `window.location.hash` with the computed hash string
  - Updated `goHome()` to set `window.location.hash` to `#home`
- Updated `page.tsx` with:
  - `HashRouter` component: wraps the app with `useEffect` that:
    1. On mount: reads `window.location.hash` and calls `syncFromHash()` to navigate to the correct page from the URL
    2. Ensures hash is set on bare URL landing (using `history.replaceState` to avoid extra history entry)
    3. Listens for `hashchange` events (browser back/forward) and syncs the store via `syncFromHash()`
    4. Cleans up the `hashchange` listener on unmount
  - Wrapped both admin and non-admin render paths with `<HashRouter>`
- Ran `bun run lint` — passed with no errors
- Checked dev server log — no errors, server running normally

Stage Summary:
- Hash-based routing is fully implemented and working
- Direct URL access (e.g., `mysite.com/#products`) correctly shows the products page
- Browser back/forward buttons work via `hashchange` event listener
- Navigation via `navigate()` updates the URL hash without page reload
- Programmatic hash changes are tracked to avoid circular updates
- All existing Zustand-based rendering logic is preserved — hash sync is layered on top
- No other files were modified
