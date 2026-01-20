# Tarkari - AI Coding Agent Instructions

## Architecture

Full-stack restaurant ordering platform: **Next.js 16 (App Router) + React 19 + MongoDB/Mongoose + custom token auth** (NOT NextAuth/JWT).

```
Client (AuthContext) → localStorage.auth_token → API (Bearer) → getUserId() → MongoDB
```

**Provider nesting** (`app/layout.tsx`): `AuthProvider → CartProvider → LanguageProvider → ToastProvider`

## API Routes - Required Pattern

```tsx
import {
  apiSuccess,
  apiError,
  requireAuth,
  getPagination,
} from "@/lib/api-helpers";
import connectToDatabase from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  await connectToDatabase(); // ALWAYS first line

  const authResult = requireAuth(request);
  if (authResult instanceof NextResponse) return authResult; // MUST check before destructuring
  const { userId } = authResult;

  const { page, pageSize, skip } = getPagination(request);
  return apiSuccess(data, { page, pageSize, total, totalPages });
}
```

**For admin routes**, use `requireAdmin()` (async) which checks `role === "admin"`:

```tsx
const authResult = await requireAdmin(request);
if (authResult instanceof NextResponse) return authResult;
const { userId, role } = authResult;
```

**Helpers** (`lib/api-helpers.ts`): `apiSuccess()`, `apiError()`, `requireAuth()`, `requireAdmin()`, `requireStaff()`, `getUserId()`, `getPagination()`, `errors.notFound()`, `errors.forbidden()`

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

## Order Status Flow

Orders follow a 7-stage lifecycle defined in `models/Order.ts`:

```
order-placed → confirmed → preparing → ready → out-for-delivery → delivered
                                                                 ↘ cancelled
```

- **Active statuses**: `order-placed`, `confirmed`, `preparing`, `ready`, `out-for-delivery`
- **Terminal statuses**: `delivered`, `cancelled`
- **Timeline**: Each status change adds entry to `order.timeline[]` with `{ status, label, at, completed }`
- **Admin updates**: Use `PATCH /api/admin/orders/[id]/status` - automatically adds timeline entry

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

## Commands

```bash
pnpm dev                    # Dev server (localhost:3000)
pnpm build                  # Production build (strict TS)
npx tsx scripts/seed.ts     # Seed DB with dishes + demo user
npx tsx scripts/create-admin.ts  # Create admin user
```

## Critical Gotchas

1. **Mongoose imports**: Always `import { Model } from "@/models"` - never individual files
2. **Auth check**: `if (authResult instanceof NextResponse) return authResult` BEFORE destructuring
3. **Prices**: Field is `pricePaise` (integer), never `price` (float)
4. **shadcn**: Use `pnpm dlx shadcn@latest add ...` - NOT npm
5. **DB connection**: `await connectToDatabase()` must be first line in every API route
6. **Client components**: Add `"use client"` directive for components using hooks/context
7. **Admin auth**: `requireAdmin()` is async - must `await` it unlike `requireAuth()`
8. **formatPricePaise**: Import from `@/lib/api-helpers`, NOT `@/lib/utils`
