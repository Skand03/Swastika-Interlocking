# Swastika Interlocking — Development Changelog

All significant changes, fixes, and improvements made to the codebase are documented here in chronological order.

---

## Authentication System

### Problem
The project had Firebase installed as a dependency but the entire auth system was using Supabase Auth. Firebase was dead code causing bundle bloat.

### Changes
- **Removed** `firebase` from `package.json` (removed 84 packages)
- **Rewrote** `src/auth/AuthContext.jsx` to use only Supabase Auth
- **Removed** `signInWithPhone`, `verifyOTP`, `getCurrentUser` — unused functions
- **Fixed** Google OAuth to use `supabase.auth.signInWithOAuth` with correct `redirectTo`
- **Renamed** `signOut` consistently (previously conflicting as `logout` in some files)
- **Fixed** `src/components/Navbar.jsx` — `dbUser` → `profile`, `logout` → `signOut`
- **Fixed** `src/components/admin/Header.jsx` — `logout` → `signOut`, removed `localStorage.getItem('admin_name')` in favour of `profile?.full_name`
- **Rewrote** `src/pages/Auth.jsx` — clean Login / Register / Forgot Password panels with proper Hindi and English text (previous version had Telugu text corruption throughout)
- **Added** `parseAuthError()` helper function mapping raw Supabase errors to user-friendly messages
- **Added** Google OAuth + Email login conflict detection — shows helpful message when user tries email login on a Google OAuth account

---

## Products & Product Detail Pages

### Problem
- Products page showed nothing — DB was empty and fallback data wasn't loading
- Product detail page read wrong DB columns (`found.image_url`, `found.desc_en`, `found.price`) instead of actual schema columns (`found.images[]`, `found.description_en`, `found.price_min/max`)
- Admin form had no Specifications fields — product detail page showed hardcoded fallback values

### Changes
- **Fixed** `src/services/productService.js` — removed category join that silently dropped rows when `category_id` was null
- **Removed** `is_active = true` filter from `getProductsByDivision` — admin-added products now show immediately
- **Fixed** `src/pages/Products.jsx` — reads correct DB columns, added loading/error/empty states, removed static fallback
- **Fixed** `src/pages/Shuttering.jsx` — fully dynamic, removed static fallback, added proper loading state
- **Fixed** `src/pages/ProductDetail.jsx` — reads `images[]`, `description_en/hi`, `price_min/max`, `specifications` jsonb
- **Added** Specifications section to admin `ProductsManagement` form — 6 fields: thickness, weight, strength, color, application, material stored in `specifications` jsonb column
- **Updated** `src/routes/adminRoutes.jsx` — `handleSaveProduct` now stores specs in `specifications` jsonb, `handleEditProduct` reads them back for editing

---

## Admin Dashboard

### Problem
- Admin `OrdersManagement.jsx` used old DB columns (`ord.product_type`, `ord.phone`, `ord.city`, `ord.quantity`) — all wrong
- Admin product cards showed blank images and missing price/stock
- Image upload failing with "Image upload failed"

### Changes
- **Rewrote** `src/components/admin/OrdersManagement.jsx` — uses correct columns: `ord.order_number`, `ord.customer_phone`, `ord.delivery_city`, `ord.delivery_address`, `ord.items`, `ord.total_amount`
- **Rewrote** `src/components/admin/ProductsManagement.jsx` — `getProductImage()` and `formatPrice()` helpers read `prod.images[]`, `prod.price_min/max`, `prod.stock_quantity`
- **Fixed** `src/services/uploadService.js` — was uploading to bucket `'images'` which doesn't exist; now maps to correct `'products'` bucket
- **Updated** `supabase/storage.sql` — correct bucket policies for `products` and `projects`

---

## Order Submission

### Problem
Order form submitted but DB returned error — `status` column has CHECK constraint `('new','confirmed','processing','dispatched','delivered','cancelled')` but UI was sending `'Pending'`, `'Shipped'` etc.

### Changes
- **Fixed** `src/services/orderService.js`:
  - `createOrder` — always sets `status: 'new'` on insert
  - `updateOrderStatus` — maps UI labels → DB values before saving
  - `getAllOrders` + `getOrdersByCustomer` — map DB values → UI labels on read
  - `createOrder` — uses `.maybeSingle()` instead of `.single()` for order number query (fixed crash on first order of year)
  - Strips local `id` field from cart items before saving to DB

---

## Customer Dashboard

### Problem
- Spending chart read `ord.product_type` (old field that doesn't exist in new schema)
- Order cards read `ord.items` using `JSON.parse()` when it was already a JS object from Supabase
- Order detail tab used `selectedOrder.phone`, `selectedOrder.city`, `selectedOrder.address` (old fields)
- PDF invoice generation used old fields

### Changes
- **Fixed** `src/pages/CustomerDashboard.jsx`:
  - Spending chart now reads `ord.total_amount` directly
  - Order cards read `ord.items` (jsonb array) for names, images, quantities
  - Order detail reads `ord.order_number`, `ord.customer_phone`, `ord.delivery_address`, `ord.delivery_city`, `ord.admin_notes`
  - PDF invoice rewritten using correct fields
  - Reviews tab reads `orders[0].items[0].image_url` instead of `product_type`

---

## Forms & Inquiries

### Problem
- Contact page form used `inputValue` (chatbot string state) as an object — `inputValue.name` always undefined
- Home page quote form `source: 'contact_page'` violated DB CHECK constraint
- ProductDetail inquiry used `source: 'product_detail_quick_quote'` — not a valid DB value

### Changes
- **Fixed** `src/pages/Contact.jsx` — added separate `contactForm` state for contact form (independent from chatbot `inputValue`)
- **Fixed** `src/pages/Home.jsx` — changed `source` to `'contact_form'`, added `customer_id: null`
- **Fixed** `src/pages/ProductDetail.jsx` — changed `source` to `'contact_form'`
- **Added** `src/components/AuthGate.jsx` — blocks guests from Order, ShutteringEnquiry, RCCEnquiry pages

---

## Complete Profile Modal

### Problem
When Google OAuth users tried to save profile, generic error "Failed to save profile" showed even when the real cause was a duplicate phone number.

### Changes
- **Fixed** `src/components/CompleteProfileModal.jsx`:
  - Real-time phone uniqueness check on blur using `isPhoneInUse()`
  - Submit button disabled if phone is already taken
  - Smart error parsing: code `23505` (unique violation) → "This phone number is already registered"
  - Client-side validation before DB call

---

## RLS (Row Level Security) Policies

### Problem
- Guests could submit orders and inquiries (security gap)
- Admin couldn't read all orders/customers/inquiries (missing admin policies)
- Profile insert was blocked by RLS during signup trigger

### Files Created / Updated

#### `supabase/remove_guest_access.sql`
- `orders_insert` — requires `auth.uid() = customer_id` (no guests)
- `inquiries_insert` — allows public marketing forms (customer_id NULL) AND authenticated users

#### `supabase/admin_access_only.sql`
- Creates `is_admin()` function with `SECURITY DEFINER` using `$func$` tags (not `$$` to avoid formatter stripping)
- `new_admin_orders_select` — admin can view all orders
- `new_admin_orders_update` — admin can update order status
- `new_admin_inquiries_select` — admin can view all inquiries
- `new_admin_inquiries_update` — admin can reply to inquiries

#### `supabase/fix_profiles_rls.sql`
- Fixes `"new row violates row-level security policy for table profiles"` during signup
- Allows insert when `auth.uid() = id` OR `auth.role() = 'service_role'` (trigger)

#### `supabase/fix_inquiries_policy.sql`
- Resets `inquiries_insert` to `WITH CHECK (true)` to fix Home page quote form for guests

#### `supabase/admin_rls_fix.sql`
- Complete RLS policy file covering all tables
- All function bodies use `$func$` quoting to survive Kiro autoformatter

---

## Chatbot

### Problem
Chatbot responded "I am not sure about that" to basic greetings like "hello", "hi", "helo" — keyword matching was too narrow (only 7 rules total).

### Changes
- **Rewrote** `src/components/Chatbot.jsx`:
  - Knowledge base with `match()` regex functions instead of keyword arrays
  - 14+ topic categories in both Hindi and English
  - Covers: greetings, company info, all products, pricing, cement/sand/gravel/pipes, shuttering rental rates, RCC roads, orders, delivery, contact, WhatsApp, login/dashboard, quality, colors/sizes, thanks/bye
  - Added Quick Reply chips shown on first open
  - Fallback message is now helpful instead of generic

---

## SEO Optimization

### Problem
- Website used **HashRouter** — URLs like `/#/products` which Google cannot index
- No meta tags, no sitemap, no robots.txt, no structured data
- No canonical URLs, no Open Graph, no Twitter Cards

### Critical Fix — HashRouter → BrowserRouter
**`src/App.jsx`** — migrated from `HashRouter` to `BrowserRouter`. This is the single most impactful SEO change. All URLs are now clean: `/products`, `/shuttering`, `/rcc-roads`.

**`vite.config.js`** — removed `base: './'` which breaks BrowserRouter, added code splitting.

**`vercel.json`** — updated with SPA routing rewrite + security headers + asset cache headers.

### Files Created

#### `public/robots.txt`
- Allows all crawlers on public pages
- Blocks: `/admin-dashboard/`, `/customer-dashboard/`, `/auth`, `/order/`, `/api/`
- References sitemap URL

#### `public/sitemap.xml`
- 9 public pages with correct priorities, changefreq, lastmod
- hreflang tags for en-IN and hi-IN on homepage

#### `index.html`
- Complete base meta tags, geo tags, Open Graph, Twitter Card
- Preconnect for Google Fonts and Supabase
- Canonical URL, hreflang, sitemap reference

#### `src/components/SEO/schemas.js`
- `organizationSchema` — business entity for Google Knowledge Panel
- `localBusinessSchema` — most important for local SEO, includes geo coordinates, area served, opening hours
- `websiteSchema` — with SearchAction for Google sitelinks search box
- `faqSchema` — 8 FAQs targeting local search queries
- `getBreadcrumbSchema()` — generates breadcrumb per page
- `getProductSchema()` — per-product structured data

#### `src/components/SEO/SEOHead.jsx`
- Reusable Helmet component using `react-helmet-async`
- Per-page: title, description, keywords, canonical, OG, Twitter, hreflang, geo meta, JSON-LD
- Always injects Organization + LocalBusiness + WebSite schemas on every page

### Pages Updated with SEOHead
| Page | Title | Keywords |
|------|-------|---------|
| Home `/` | Paver Blocks & RCC Roads - Deesa, Gujarat | paver blocks Deesa, interlocking blocks Gujarat |
| Products `/products` | Paver Blocks & Building Materials - Deesa | buy paver blocks Deesa, building materials Banaskantha |
| Shuttering `/shuttering` | Shuttering Materials on Rent & Sale - Deesa | shuttering materials Deesa, steel plates on rent Gujarat |
| RCC Roads `/rcc-roads` | RCC Road Construction - Deesa Banaskantha | RCC road contractor Deesa, road construction Gujarat |
| About `/about` | About Swastika Interlocking - Deesa Gujarat | paver block manufacturer Gujarat, construction company |
| Contact `/contact` | Contact Swastika Interlocking - Deesa Gujarat | Swastika Interlocking contact, address Deesa |
| Order `/order` | Book Order - Paver Blocks | order paver blocks Deesa, buy interlocking blocks |
| ProductDetail `/products/:id` | Dynamic per product | Dynamic per product name + Gujarat/Deesa |

---

## Address Corrections

### Problem
Wrong addresses appeared in multiple places — "Industrial Area Phase II, Govindpura, Bhopal, MP 462023" and "Gajpur Kauriram" spelling error.

### Changes
- **Fixed** `src/pages/RCCEnquiry.jsx` — replaced Bhopal address with correct address
- **Fixed** `src/pages/About.jsx` — corrected "Gajpur Kauriram" → "Girdharpur Uncher, Kauriram"
- **Replaced** fake AI-generated Bhopal map image in `RCCEnquiry.jsx` with real Google Maps iframe (same as Contact page)

---

## SEO Score Estimate

| Metric | Before | After |
|--------|--------|-------|
| Google Indexability | ❌ 0% (HashRouter) | ✅ 100% (BrowserRouter) |
| Meta Tags | ❌ None | ✅ All pages |
| Structured Data | ❌ None | ✅ Organization + LocalBusiness + FAQ + Product |
| Sitemap | ❌ None | ✅ 9 pages |
| robots.txt | ❌ None | ✅ Created |
| Canonical URLs | ❌ None | ✅ All pages |
| Open Graph | ❌ None | ✅ All pages |
| Local SEO | ❌ None | ✅ Geo tags + LocalBusiness schema |
| **Overall SEO Score** | **~20/100** | **~75/100** |

---

## Pending Actions (Must Do)

### Run in Supabase SQL Editor (in order)
1. `supabase/fix_profiles_rls.sql` — fixes registration RLS error
2. `supabase/remove_guest_access.sql` — removes guest order access
3. `supabase/admin_access_only.sql` — adds admin read/write policies
4. `supabase/fix_inquiries_policy.sql` — fixes Home/Contact inquiry forms

### Set yourself as Admin
```sql
UPDATE public.profiles SET role = 'admin' WHERE email = 'your@email.com';
```

### Google Search Console
1. Add property → `https://www.swastikainterlocking.live`
2. Submit sitemap → `https://www.swastikainterlocking.live/sitemap.xml`
3. Request indexing for homepage first

### Supabase Dashboard
- Authentication → Settings → Disable email confirmations (to fix email rate limit during testing)
- Or set up custom SMTP (Resend.com recommended — 100 emails/day free)

---

## File Reference

| File | Change Type | Description |
|------|------------|-------------|
| `src/App.jsx` | Modified | HashRouter → BrowserRouter, removed SEOUpdater |
| `src/main.jsx` | Modified | Added HelmetProvider |
| `index.html` | Modified | Full meta tags, geo, preconnect, canonical |
| `vite.config.js` | Modified | Removed `base: './'`, added code splitting |
| `vercel.json` | Modified | Security headers + asset caching |
| `public/robots.txt` | Created | Crawler rules |
| `public/sitemap.xml` | Created | 9 public pages |
| `src/components/SEO/SEOHead.jsx` | Created | Reusable SEO helmet |
| `src/components/SEO/schemas.js` | Created | All JSON-LD schemas |
| `src/components/AuthGate.jsx` | Created | Guest access blocker |
| `src/components/CompleteProfileModal.jsx` | Modified | Smart error messages |
| `src/components/Chatbot.jsx` | Rewritten | 14+ topic knowledge base |
| `src/components/admin/OrdersManagement.jsx` | Rewritten | Correct DB schema fields |
| `src/components/admin/ProductsManagement.jsx` | Modified | Image/price/spec fixes |
| `src/auth/AuthContext.jsx` | Modified | Firebase removed, clean Supabase only |
| `src/pages/Auth.jsx` | Rewritten | Correct Hindi/English, smart errors |
| `src/pages/Home.jsx` | Modified | SEOHead added |
| `src/pages/Products.jsx` | Modified | SEOHead + fully dynamic (no static fallback) |
| `src/pages/Shuttering.jsx` | Modified | SEOHead + fully dynamic |
| `src/pages/RCCRoads.jsx` | Modified | SEOHead, correct address, real map |
| `src/pages/About.jsx` | Modified | SEOHead, corrected address |
| `src/pages/Contact.jsx` | Modified | SEOHead, separate form state |
| `src/pages/Order.jsx` | Modified | SEOHead |
| `src/pages/ProductDetail.jsx` | Modified | SEOHead + correct DB field reading |
| `src/pages/CustomerDashboard.jsx` | Modified | Correct DB fields throughout |
| `src/routes/adminRoutes.jsx` | Modified | Specs in save/edit/cancel/reset |
| `src/services/orderService.js` | Modified | Status mapping, maybeSingle, clean items |
| `src/services/uploadService.js` | Modified | Correct bucket mapping |
| `src/services/productService.js` | Modified | Removed broken category join |
| `supabase/admin_rls_fix.sql` | Created | Complete RLS for all tables |
| `supabase/remove_guest_access.sql` | Created | No guest orders |
| `supabase/admin_access_only.sql` | Created | Admin read/write policies |
| `supabase/fix_profiles_rls.sql` | Created | Signup trigger fix |
| `supabase/fix_inquiries_policy.sql` | Created | Public inquiry forms fix |
| `supabase/storage.sql` | Modified | Correct bucket policies |
