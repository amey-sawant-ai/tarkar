# Tarkari - AI Coding Agent Instructions

## Quick Architecture Summary

**Full-stack restaurant ordering platform**: Next.js 16 (App Router) + React 19 + MongoDB/Mongoose + **custom token auth** (NOT NextAuth/JWT).

**Auth Flow**: `Client (localStorage.auth_token) → API (Bearer) → verifyAuthToken() → getUserId() → MongoDB`

**Key idea**: Token is `base64(userId|timestamp|checksum)`, verified server-side. Demo mode uses hardcoded user `696caa01ebbb3c66c1a41fc7`.

**Provider nesting** (`app/layout.tsx`): `AuthProvider → CartProvider → LanguageProvider → ToastProvider`

## API Routes - Critical Pattern

**EVERY API route MUST follow this exact structure**:

```tsx
import { apiSuccess, apiError, requireAuth, getPagination } from "@/lib/api-helpers";
import connectToDatabase from "@/lib/mongodb";
import { NextResponse, NextRequest } from "next/server";

export async function GET(request: Request) {
  // ✅ FIRST: Always connect to database
  await connectToDatabase();

  // ✅ SECOND: Check auth (BEFORE destructuring)
  const authResult = requireAuth(request); // Sync - use for user routes
  if (authResult instanceof NextResponse) return authResult;
  const { userId } = authResult;

  // For admin: const authResult = await requireAdmin(request); (ASYNC, must await)
  // For staff: const authResult = await requireStaff(request); (ASYNC, must await)
  
  // ✅ Get pagination if needed
  const { page, pageSize, skip } = getPagination(request);
  
  // ✅ Return responses
  return apiSuccess(data, { page, pageSize, total, totalPages });
}
```

**Key rules:**
- `connectToDatabase()` must be **first** statement in route handler
- Check `if (authResult instanceof NextResponse)` BEFORE destructuring
- `requireAuth()` is **sync**; `requireAdmin()`/`requireStaff()` are **async** (await required)
- Always use `apiSuccess()` / `apiError()` helpers from `lib/api-helpers.ts`
- For dynamic routes: `const { id } = await params` (Next.js 16 pattern)

## Price Handling - Integer Paise Only

All prices in **integer paise** (₹1 = 100 paise). Never use floats.

```tsx
// Schema: pricePaise: { type: Number }  →  29900 = ₹299.00
// Display: formatPricePaise(29900) → "₹299.00"  (from lib/api-helpers.ts)
// CartContext.price is already in paise
```

## Authentication & Roles

- **Token**: `base64(userId|timestamp|checksum)` - custom format, 30-day expiry
- **Client**: `localStorage.auth_token` → `Authorization: Bearer <token>`
- **Roles**: `user | admin | staff` - stored in User model, checked via `requireAdmin()`/`requireStaff()`
- **Demo mode**: `ENABLE_DEMO_MODE=true` → hardcoded user `696caa01ebbb3c66c1a41fc7`
- **Functions**: `lib/auth.ts` - `generateAuthToken()`, `verifyAuthToken()`, `hashPassword()`, `verifyPassword()`

## Order Status Lifecycle

Orders follow a 7-stage state machine defined in [models/Order.ts](models/Order.ts):

```
order-placed → confirmed → preparing → ready → out-for-delivery → delivered
                                                                 ↘ cancelled
```

- **Active statuses**: `order-placed`, `confirmed`, `preparing`, `ready`, `out-for-delivery`
- **Terminal statuses**: `delivered`, `cancelled`
- **Timeline**: Each status change adds entry to `order.timeline[]` with `{ status, label, at, completed }`
- **Admin updates**: `PATCH /api/admin/orders/[id]/status` — automatically adds timeline entry with label from constants
- **Key fields**: `_id`, `userId`, `items[]`, `status`, `timeline[]`, `billing`, `createdAt`
- **Query patterns**: Filter active vs completed with `status: { $in: [...] }`

## Project Structure

| Path             | Purpose                                                           |
| ---------------- | ----------------------------------------------------------------- |
| `app/api/`       | API routes - always use `lib/api-helpers` patterns                |
| `app/api/admin/` | Admin-only APIs - use `requireAdmin()` for auth                   |
| `app/(auth)/`    | Auth pages (login, signup, forgot-password, reset-password)       |
| `app/dashboard/` | Protected user pages (orders, favorites, checkout, etc.)          |
| `app/admin/`     | Admin panel - role-checked via layout + middleware                |
| `components/ui/` | **shadcn/ui ONLY** - install: `pnpm dlx shadcn@latest add <name>` |
| `contexts/`      | React Context - Auth, Cart, Language (en/hi/mr), Toast            |
| `models/`        | Mongoose schemas - **always import from `@/models` barrel**       |
| `lib/`           | Core: api-helpers, auth, mongodb, types, utils, constants         |
| `scripts/`       | Seeding: `npx tsx scripts/seed.ts` (161 dishes, demo user)        |

## Styling - Tailwind v4

**Brand colors** (CSS vars + Tailwind classes):

- `--dark-green` / `text-dark-green` - Primary
- `--warm-beige` / `bg-warm-beige` - Background
- `--tomato-red` / `text-tomato-red` - Accent
- `--saffron-yellow` / `bg-saffron-yellow` - Secondary

**Class merging**: Always use `cn()` from `@/lib/utils`

## i18n - Multi-language Support

```tsx
import { useLanguage } from "@/contexts/LanguageContext";
const { t, language, setLanguage } = useLanguage();
// Usage: t("menu.addToCart") → supports en, hi, mr
```

## Commands & Workflows

```bash
pnpm dev                           # Dev server (localhost:3000)
pnpm build                         # Production build (strict TS)
pnpm lint                          # ESLint check
npx tsx scripts/seed.ts            # Seed DB with 161 dishes + demo user (696caa01ebbb3c66c1a41fc7)
npx tsx scripts/create-admin.ts    # Create new admin user
```

**Testing auth locally:**
- `node test-auth.js` — test login/register flow (requires running dev server)
- `node check-demo-user.js` — verify demo user exists
- `npm run build` — validates strict TS before deploying

## Critical Gotchas

1. **Mongoose imports**: Always `import { Model } from "@/models"` - never individual files
2. **Auth check pattern**: `if (authResult instanceof NextResponse) return authResult` BEFORE destructuring
3. **Prices**: Field is `pricePaise` (integer), never `price` (float). Example: 29900 = ₹299.00
4. **shadcn**: Use `pnpm dlx shadcn@latest add ...` - NOT npm
5. **DB connection**: `await connectToDatabase()` must be first line in every API route
6. **Client components**: Add `"use client"` directive for components using hooks/context
7. **Admin auth**: `requireAdmin()` is async - must `await` it (unlike sync `requireAuth()`)
8. **formatPricePaise**: Import from `@/lib/api-helpers`, NOT `@/lib/utils`
9. **Dynamic routes**: Next.js 16 requires `const { id } = await params` pattern
10. **Token expiry**: Custom auth tokens expire after 30 days - users must re-login
11. **Admin panel**: Protected by `/admin` layout + middleware + `requireAdmin()` auth checks
12. **Transactional operations**: Use MongoDB transactions for multi-document updates (wallet, orders, etc.)
13. **useSearchParams() in pages**: Pages using `useSearchParams()`, `usePathname()`, or dynamic `useRouter()` must extract the hook into a child component and wrap with `<Suspense>` (required for static prerendering in Next.js 16)

## Common Integration Patterns

### Error Handling in API Routes
```tsx
try {
  // ... your code
  return apiSuccess(data);
} catch (error) {
  console.error("Operation error:", error);
  return apiError("SERVER_ERROR", "Failed to complete operation", 500);
}
```

### Paginated Responses
```tsx
const { page, pageSize, skip } = getPagination(request);
const items = await Model.find(query).skip(skip).limit(pageSize).lean();
const total = await Model.countDocuments(query);
return apiSuccess(items, { page, pageSize, total, totalPages: Math.ceil(total / pageSize) });
```

### Query Filtering (Active vs Completed Orders)
```tsx
// Active orders
const active = await Order.find({ 
  userId, 
  status: { $in: ["order-placed", "confirmed", "preparing", "ready", "out-for-delivery"] } 
});

// Completed orders
const completed = await Order.find({ 
  userId, 
  status: { $in: ["delivered", "cancelled"] } 
});
```

### Admin Actions with Timeline
When updating order status in admin:
1. Update `order.status` field
2. Add entry to `order.timeline[]`: `{ status, label, at: new Date(), completed: true }`
3. Use constants for labels (in `lib/constants.ts`)

### Page Components with useSearchParams (Next.js 16 Suspense Pattern)
Any page using `useSearchParams()`, `usePathname()`, or dynamic `useRouter()` must wrap the hook in `<Suspense>`:

```tsx
import { Suspense } from 'react'

// ✅ Child component with hooks
function PageContent() {
  const searchParams = useSearchParams() // Safe here
  const router = useRouter()
  // ... logic using params
}

// ✅ Parent page with Suspense boundary
export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PageContent />
    </Suspense>
  )
}
```

**Applied to**: `app/(auth)/login/page.tsx`, `app/(auth)/reset-password/page.tsx`

## Payment Integration - Razorpay & COD

**Complete integration in** `docs/PAYMENT_INTEGRATION.md`

### Key Points:
- **Razorpay SDK**: `npm install razorpay`
- **Amount format**: Always in paise (integer) - Razorpay native format
- **Signature verification**: HMAC-SHA256 using `RAZORPAY_KEY_SECRET` on backend
- **Order status flow**: `order-placed` → `confirmed` (after payment success)
- **Timeline entry**: Add `{ status: "confirmed", label: "Payment Confirmed", at: new Date(), completed: true }` 

### API Routes:
- `POST /api/payment/create-order` - Creates Razorpay order
- `POST /api/payment/verify` - Verifies signature and updates order status
- `POST /api/payment/confirm-cod` - Confirms COD orders (no payment required)

### Frontend Components:
- `PaymentButton` - Razorpay checkout with dynamic script loading
- `CODPaymentButton` - Cash on Delivery confirmation

### Pattern Example:
```tsx
import PaymentButton from "@/components/PaymentButton";

<PaymentButton
  orderId={orderId}
  amount={cartTotal}  // in paise
  onSuccess={() => clearCart()}
/>
```

**Environment Variables**:
```env
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_key_id
```

## File Organization Reference

| Path             | Purpose                                                           |
| ---------------- | ----------------------------------------------------------------- |
| `app/api/`       | API routes - always use `lib/api-helpers` patterns                |
| `app/api/admin/` | Admin-only APIs - use `requireAdmin()` for auth                   |
| `app/(auth)/`    | Auth pages (login, signup, forgot-password, reset-password)       |
| `app/dashboard/` | Protected user pages (orders, favorites, checkout, etc.)          |
| `app/admin/`     | Admin panel - role-checked via layout + middleware                |
| `components/ui/` | **shadcn/ui ONLY** - install: `pnpm dlx shadcn@latest add <name>` |
| `contexts/`      | React Context - Auth, Cart, Language (en/hi/mr), Toast            |
| `models/`        | Mongoose schemas - **always import from `@/models` barrel**       |
| `lib/`           | Core: api-helpers, auth, mongodb, types, utils, constants         |
| `scripts/`       | Seeding: `npx tsx scripts/seed.ts` (161 dishes, demo user)        |
