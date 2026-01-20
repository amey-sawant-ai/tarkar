# Tarkari API Specification

This document defines a proposed REST API for the Tarkari app. The current codebase is frontend-only; these endpoints describe a backend you can implement (e.g., in Next.js App Router under `app/api/**/route.ts`).

- Base URL: `https://your-domain.com`
- Version: v1 (prefix paths with `/api`)
- Auth: Bearer token (JWT) recommended for protected routes
- Content-Type: `application/json`

## Conventions

- IDs are strings (ULIDs/UUIDs).
- Timestamps are ISO 8601 strings in UTC.
- Monetary amounts are in INR paise (integers) in API payloads; the UI formats rupees.
- Success: 2xx codes; Errors: standard 4xx/5xx with `{ code, message, details? }`.

---

## Data Models

### Order

```ts
type OrderStatus =
  | "order-placed"
  | "confirmed"
  | "preparing"
  | "ready"
  | "out-for-delivery"
  | "delivered"
  | "cancelled";

interface OrderItem {
  id: string;
  name: string;
  qty: number;
  pricePaise: number; // per unit
}

interface TimelineStep {
  status: OrderStatus;
  label: string;
  at: string; // ISO datetime
  completed: boolean;
}

interface DeliveryPerson {
  name: string;
  phone: string;
  vehicleNumber?: string;
}

interface BillingBreakdown {
  subTotalPaise: number;
  taxPaise: number;
  deliveryFeePaise: number;
  discountPaise: number;
  totalPaise: number;
  paymentMethod: string; // e.g., masked card, UPI id
}

interface Order {
  id: string;
  status: OrderStatus;
  items: OrderItem[];
  timeline: TimelineStep[];
  address: string;
  delivery?: DeliveryPerson;
  billing: BillingBreakdown;
  placedAt: string; // ISO datetime
}
```

### Wallet

```ts
type TransactionType =
  | "credit"
  | "debit"
  | "refund"
  | "cashback"
  | "reward"
  | "referral";

interface Transaction {
  id: string;
  type: TransactionType;
  amountPaise: number;
  description: string;
  createdAt: string; // ISO datetime
  orderId?: string;
  balanceAfterPaise?: number;
}

interface Wallet {
  balancePaise: number;
  totalEarnedPaise: number;
  totalSpentPaise: number;
  rewardPoints: number;
  pendingRefundsPaise?: number;
  transactions: Transaction[];
}
```

### Payment Method

```ts
type PaymentMethodType = "card" | "upi" | "netbanking" | "wallet";

type CardType = "visa" | "mastercard" | "rupay" | "amex";

interface PaymentMethod {
  id: string;
  type: PaymentMethodType;
  name: string; // display name
  isDefault?: boolean;
  lastUsedAt?: string; // ISO datetime
  // Conditional fields
  cardNumberMasked?: string; // **** **** **** 1234
  expiry?: string; // MM/YY
  cardType?: CardType;
  upiId?: string; // e.g., name@bank
  bankName?: string; // for netbanking
}
```

### Preferences / Settings

```ts
interface Preferences {
  darkMode: boolean;
  language: "en" | "hi" | "mr";
}
```

### Translation

```ts
interface TranslationBundle {
  lang: "en" | "hi" | "mr";
  data: Record<string, string>;
}
```

---

## Endpoints

### Orders

- GET `/api/orders`

  - Query: `status?` (`active|completed`), `page?`, `pageSize?`
  - 200: `{ items: Order[], page: number, pageSize: number, total: number }`

- GET `/api/orders/{id}`

  - 200: `Order`
  - 404 if not found

- POST `/api/orders`

  - Body: `{ items: { id: string; qty: number }[], address: string, paymentMethodId: string }`
  - 201: `Order` (with `status: "order-placed"`)

- GET `/api/orders/{id}/tracking`

  - 200: `{ id: string, status: OrderStatus, timeline: TimelineStep[], delivery?: DeliveryPerson, etaMinutes?: number }`

- PATCH `/api/orders/{id}/status`
  - Body: `{ status: OrderStatus }`
  - 200: `{ id: string, status: OrderStatus }`

### Wallet

- GET `/api/wallet`

  - 200: `Wallet`

- GET `/api/wallet/transactions`

  - Query: `type?` (`credit|debit|refund|cashback|reward|referral`), `page?`, `pageSize?`
  - 200: `{ items: Transaction[], page: number, pageSize: number, total: number }`

- POST `/api/wallet/add-money`
  - Body: `{ amountPaise: number, paymentMethodId: string }`
  - 201: `{ balancePaise: number, transaction: Transaction }`

### Payment Methods

- GET `/api/payment-methods`

  - 200: `PaymentMethod[]`

- POST `/api/payment-methods`

  - Body (one of):
    - Card: `{ type: "card", name: string, cardNumber: string, expiry: string, cvv: string }`
    - UPI: `{ type: "upi", name: string, upiId: string }`
  - 201: `PaymentMethod`

- PATCH `/api/payment-methods/{id}/default`

  - Body: `{ isDefault: boolean }`
  - 200: `PaymentMethod`

- DELETE `/api/payment-methods/{id}`
  - 204

### Preferences / Settings

- GET `/api/user/preferences`

  - 200: `Preferences`

- PUT `/api/user/preferences`
  - Body: `Preferences`
  - 200: `Preferences`

### Translations

- GET `/api/translations`
  - Query: `lang` (`en|hi|mr`)
  - 200: `TranslationBundle`

---

## Errors

```json
{
  "code": "invalid_request",
  "message": "Amount must be >= 100 paise",
  "details": {
    "field": "amountPaise",
    "min": 100
  }
}
```

- Common codes: `invalid_request`, `unauthorized`, `forbidden`, `not_found`, `conflict`, `rate_limited`, `internal_error`.

---

## Pagination

- Query params: `page` (default 1), `pageSize` (default 20, max 100)
- Response shape: `{ items: T[], page, pageSize, total }`

## Rate Limiting

- Suggested: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `Retry-After` headers

## Next.js Route Mapping

Implement handlers under `app/api`:

- Orders: `app/api/orders/route.ts`, `app/api/orders/[id]/route.ts`, `app/api/orders/[id]/tracking/route.ts`
- Wallet: `app/api/wallet/route.ts`, `app/api/wallet/transactions/route.ts`, `app/api/wallet/add-money/route.ts`
- Payment Methods: `app/api/payment-methods/route.ts`, `app/api/payment-methods/[id]/route.ts`, `app/api/payment-methods/[id]/default/route.ts`
- Preferences: `app/api/user/preferences/route.ts`
- Translations: `app/api/translations/route.ts`

Each `route.ts` should export HTTP method functions (GET/POST/PATCH/PUT/DELETE) with `NextResponse`.

---

## Examples

### Add Money

Request

```http
POST /api/wallet/add-money
Content-Type: application/json
Authorization: Bearer <token>

{ "amountPaise": 50000, "paymentMethodId": "pm_123" }
```

Response

```json
{
  "balancePaise": 135000,
  "transaction": {
    "id": "txn_abc",
    "type": "credit",
    "amountPaise": 50000,
    "description": "Money added",
    "createdAt": "2025-11-28T10:00:00Z",
    "balanceAfterPaise": 135000
  }
}
```

### Get Active Orders

```http
GET /api/orders?status=active&page=1&pageSize=10
```

Response

```json
{
  "items": [
    {
      "id": "ord_1",
      "status": "out-for-delivery",
      "items": [
        { "id": "itm_1", "name": "Paneer Tikka", "qty": 1, "pricePaise": 29900 }
      ],
      "timeline": [
        {
          "status": "order-placed",
          "label": "Order placed",
          "at": "2025-11-28T09:00:00Z",
          "completed": true
        }
      ],
      "address": "MG Road, Pune",
      "delivery": {
        "name": "Rahul",
        "phone": "+91-90000-11111",
        "vehicleNumber": "MH12 AB 1234"
      },
      "billing": {
        "subTotalPaise": 29900,
        "taxPaise": 5400,
        "deliveryFeePaise": 2000,
        "discountPaise": 1000,
        "totalPaise": 56300,
        "paymentMethod": "VISA **** 4532"
      },
      "placedAt": "2025-11-28T08:50:00Z"
    }
  ],
  "page": 1,
  "pageSize": 10,
  "total": 1
}
```

---

## Notes

- Currency is INR-only across the platform.
- Languages supported: `en`, `hi`, `mr`.
- Map UI components to these endpoints gradually; the current `lib/*Data.ts` files mirror the response shapes.
- Map UI components to these endpoints gradually; the current `lib/*Data.ts` files mirror the response shapes.

---

## Quick Start

- All requests and responses are JSON. Include `Authorization: Bearer <token>` where noted.
- Use `Idempotency-Key` for monetary/order writes.
- Use `Accept-Language: en|hi|mr` to hint response language; or fetch bundles from `/api/translations`.

## Authentication

- JWT bearer tokens via `Authorization: Bearer <token>`.
- Recommended claims: `sub` (user id), `exp`, `iat`, optional `scope`.
- 401 when missing/invalid, 403 when valid but insufficient permissions.

## Headers

- `Authorization`: `Bearer <token>`
- `Idempotency-Key`: unique string for safely retryable writes
  - Required for: `POST /api/wallet/add-money`, `POST /api/orders`
- `Accept-Language`: `en|hi|mr`
- `X-Request-Id`: optional client correlation id echoed back

## Idempotency

For monetary or order-creating endpoints, the server must return the same response for the same `Idempotency-Key` within a time window (e.g., 24h) to prevent duplicate charges/orders.

## Sorting & Filtering

- Sorting: `sort` (e.g., `createdAt`), `order` (`asc|desc`).
- Filtering: resource-specific filters (e.g., `status=active|completed` on orders, `type` on transactions).

## Error Object Schema

```ts
interface ApiError {
  code:
    | "invalid_request"
    | "unauthorized"
    | "forbidden"
    | "not_found"
    | "conflict"
    | "rate_limited"
    | "internal_error";
  message: string;
  details?: Record<string, unknown>;
  requestId?: string; // echoes X-Request-Id if provided
}
```

## Additional Examples

### Create Order (with idempotency)

```bash
curl -s -X POST "https://your-domain.com/api/orders" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: $(uuidgen)" \
  -d '{
    "items": [{ "id": "itm_paneer_tikka", "qty": 2 }],
    "address": "MG Road, Pune",
    "paymentMethodId": "pm_123"
  }'
```

### List Transactions (cashback only)

```bash
curl -s "https://your-domain.com/api/wallet/transactions?type=cashback&page=1&pageSize=20" \
  -H "Authorization: Bearer $TOKEN"
```

## Security & Compliance

- PCI DSS: Do not store raw card numbers or CVV. Use a payment gateway; persist only tokens, masked PAN, brand.
- PII: Encrypt addresses/phones at rest and restrict access via RBAC.
- CORS: Restrict to trusted origins.
- Logging: Never log secrets, auth headers, or full PAN.

## Versioning & Deprecation

- Current version: `v1` under `/api`.
- Breaking changes should be introduced under `/api/v2` (or negotiate via `Accept-Version`).
- Provide a 90-day deprecation window and `Deprecation` headers for removals.

## Webhooks (Optional)

Supported events:

- `order.updated`: order status/timeline changed
- `wallet.transaction.created`: new wallet transaction

Webhook example:

```json
{
  "id": "evt_123",
  "type": "order.updated",
  "createdAt": "2025-11-28T10:00:00Z",
  "data": { "id": "ord_123", "status": "out-for-delivery" }
}
```

Validate signatures via `X-Tarkari-Signature` (HMAC with shared secret).

## Implementation Tips (Next.js)

```ts
// app/api/orders/route.ts
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get("page") ?? 1);
  const pageSize = Number(searchParams.get("pageSize") ?? 20);
  // TODO: fetch from DB
  return NextResponse.json({ items: [], page, pageSize, total: 0 });
}

export async function POST(request: Request) {
  const idem = request.headers.get("Idempotency-Key");
  if (!idem) {
    return NextResponse.json(
      { code: "invalid_request", message: "Idempotency-Key required" },
      { status: 400 }
    );
  }
  const body = await request.json();
  // TODO: validate with zod and create order
  return NextResponse.json(
    { id: "ord_new", status: "order-placed" },
    { status: 201 }
  );
}
```

Consider `zod` for validation and Prisma/`@vercel/postgres` for persistence.

## OpenAPI (Excerpt)

```yaml
openapi: 3.0.3
info:
  title: Tarkari API
  version: 1.0.0
servers:
  - url: https://your-domain.com
paths:
  /api/orders:
    get:
      summary: List orders
      parameters:
        - in: query
          name: status
          schema: { type: string, enum: [active, completed] }
        - in: query
          name: page
          schema: { type: integer, minimum: 1, default: 1 }
        - in: query
          name: pageSize
          schema: { type: integer, minimum: 1, maximum: 100, default: 20 }
      responses:
        "200": { description: Orders page }
    post:
      summary: Create order
      parameters:
        - in: header
          name: Idempotency-Key
          required: true
          schema: { type: string }
      responses:
        "201": { description: Created }
  /api/wallet/add-money:
    post:
      summary: Add money to wallet
      parameters:
        - in: header
          name: Idempotency-Key
          required: true
          schema: { type: string }
      responses:
        "201": { description: Added }
```

## Testing Recipes

- Start dev server: `pnpm dev`
- Exercise endpoints via curl or REST client; use fixtures aligned with `lib/*Data.ts`.
- Add integration tests hitting route handlers; mock payments for add-money.

## Changelog

- 2025-11-28: Expanded docs with auth, headers, idempotency, examples, OpenAPI excerpt, and security guidance.

---

# Extended Resources (Full Feature Coverage)

Below are additional data models and endpoints to cover all app features visible in the UI: Menu, Order Food (Cart), Reservations, Party Orders, Favorites, Addresses, Reviews, Offers, Gallery, Profile/Auth, and Notifications.

## Additional Data Models

```ts
interface MenuCategory {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
}

interface MenuItem {
  id: string;
  name: string;
  description?: string;
  pricePaise: number;
  veg?: boolean;
  spicyLevel?: 0 | 1 | 2 | 3;
  imageUrl?: string;
  categoryId: string;
  available: boolean;
}

interface CartItem {
  itemId: string;
  qty: number;
  notes?: string;
}

interface Cart {
  items: CartItem[];
  totalPaise: number;
}

interface Reservation {
  id: string;
  name: string;
  phone: string;
  date: string; // ISO date
  time: string; // HH:mm
  guests: number;
  specialRequest?: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  createdAt: string;
}

interface PartyOrder {
  id: string;
  contactName: string;
  phone: string;
  eventDate: string; // ISO date
  headcount: number;
  menuNotes?: string;
  budgetPaise?: number;
  status: "requested" | "quoted" | "confirmed" | "cancelled" | "fulfilled";
  createdAt: string;
}

interface Address {
  id: string;
  label: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  isDefault?: boolean;
}

interface Review {
  id: string;
  userId: string;
  rating: 1 | 2 | 3 | 4 | 5;
  title?: string;
  comment?: string;
  images?: string[];
  createdAt: string;
  orderId?: string;
}

interface RatingSummary {
  average: number;
  count: number;
  byStars: { [k in 1 | 2 | 3 | 4 | 5]: number };
}

interface Offer {
  id: string;
  title: string;
  description?: string;
  code?: string;
  discountPercent?: number;
  startsAt?: string;
  endsAt?: string;
  active: boolean;
}

interface GalleryItem {
  id: string;
  title?: string;
  url: string;
  category?: string;
  createdAt: string;
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  createdAt: string;
}

interface NotificationsPrefs {
  orderUpdates: boolean;
  promotions: boolean;
  newsletter: boolean;
  sms: boolean;
}
```

## Additional Endpoints

### Menu

- GET `/api/menu/categories`

  - 200: `MenuCategory[]`

- GET `/api/menu/items`

  - Query: `categoryId?`, `q?`, `veg?`
  - 200: `{ items: MenuItem[], page, pageSize, total }`

- GET `/api/menu/items/{id}`
  - 200: `MenuItem`
  - 404 if not found

### Cart (Order Food)

- GET `/api/cart`

  - 200: `Cart`

- PUT `/api/cart`

  - Body: `CartItem[]`
  - 200: `Cart`

- POST `/api/cart/add`

  - Body: `CartItem`
  - 200: `Cart`

- POST `/api/cart/remove`
  - Body: `{ itemId: string }`
  - 200: `Cart`

### Reservations

- GET `/api/reservations`

  - 200: `{ items: Reservation[], page, pageSize, total }`

- POST `/api/reservations`

  - Body: `Omit<Reservation, "id" | "status" | "createdAt">`
  - 201: `Reservation`

- PATCH `/api/reservations/{id}`

  - Body: `Partial<Reservation>`
  - 200: `Reservation`

- POST `/api/reservations/{id}/cancel`
  - 200: `{ id: string, status: "cancelled" }`

### Party Orders

- GET `/api/party-orders`

  - 200: `{ items: PartyOrder[], page, pageSize, total }`

- POST `/api/party-orders`

  - Body: `Omit<PartyOrder, "id" | "status" | "createdAt">`
  - 201: `PartyOrder`

- PATCH `/api/party-orders/{id}`
  - Body: `Partial<PartyOrder>`
  - 200: `PartyOrder`

### Favorites

- GET `/api/favorites`

  - 200: `{ itemIds: string[] }`

- POST `/api/favorites`

  - Body: `{ itemId: string }`
  - 201: `{ itemIds: string[] }`

- DELETE `/api/favorites/{itemId}`
  - 204

### Addresses

- GET `/api/addresses`

  - 200: `Address[]`

- POST `/api/addresses`

  - Body: `Omit<Address, "id">`
  - 201: `Address`

- PUT `/api/addresses/{id}`

  - Body: `Partial<Address>`
  - 200: `Address`

- PATCH `/api/addresses/{id}/default`

  - Body: `{ isDefault: boolean }`
  - 200: `Address`

- DELETE `/api/addresses/{id}`
  - 204

### Reviews

- GET `/api/reviews`

  - Query: `page?`, `pageSize?`
  - 200: `{ items: Review[], page, pageSize, total, summary: RatingSummary }`

- POST `/api/reviews`

  - Body: `Omit<Review, "id" | "createdAt" | "userId">`
  - 201: `Review`

- PUT `/api/reviews/{id}`

  - Body: `Partial<Review>`
  - 200: `Review`

- DELETE `/api/reviews/{id}`
  - 204

### Offers

- GET `/api/offers`
  - 200: `Offer[]`

### Gallery

- GET `/api/gallery`
  - Query: `category?`, `page?`, `pageSize?`
  - 200: `{ items: GalleryItem[], page, pageSize, total }`

### Profile & Auth

- POST `/api/auth/signup`

  - Body: `{ name: string, email: string, password: string }`
  - 201: `{ user: UserProfile, token: string }`

- POST `/api/auth/login`

  - Body: `{ email: string, password: string }`
  - 200: `{ user: UserProfile, token: string }`

- POST `/api/auth/logout`

  - 204

- POST `/api/auth/refresh`

  - Body: `{ refreshToken: string }`
  - 200: `{ token: string }`

- GET `/api/user/profile`

  - 200: `UserProfile`

- PUT `/api/user/profile`
  - Body: `Partial<UserProfile>`
  - 200: `UserProfile`

### Notifications

- GET `/api/user/notifications`

  - 200: `NotificationsPrefs`

- PUT `/api/user/notifications`
  - Body: `NotificationsPrefs`
  - 200: `NotificationsPrefs`

### Health

- GET `/api/health`
  - 200: `{ status: "ok", time: string }`

## Route Mapping (Extended)

- Menu: `app/api/menu/categories/route.ts`, `app/api/menu/items/route.ts`, `app/api/menu/items/[id]/route.ts`
- Cart: `app/api/cart/route.ts`, `app/api/cart/add/route.ts`, `app/api/cart/remove/route.ts`
- Reservations: `app/api/reservations/route.ts`, `app/api/reservations/[id]/route.ts`, `app/api/reservations/[id]/cancel/route.ts`
- Party Orders: `app/api/party-orders/route.ts`, `app/api/party-orders/[id]/route.ts`
- Favorites: `app/api/favorites/route.ts`, `app/api/favorites/[itemId]/route.ts`
- Addresses: `app/api/addresses/route.ts`, `app/api/addresses/[id]/route.ts`, `app/api/addresses/[id]/default/route.ts`
- Reviews: `app/api/reviews/route.ts`, `app/api/reviews/[id]/route.ts`
- Offers: `app/api/offers/route.ts`
- Gallery: `app/api/gallery/route.ts`
- Auth: `app/api/auth/signup/route.ts`, `app/api/auth/login/route.ts`, `app/api/auth/logout/route.ts`, `app/api/auth/refresh/route.ts`
- Profile/Prefs/Notifications: `app/api/user/profile/route.ts`, `app/api/user/preferences/route.ts`, `app/api/user/notifications/route.ts`
- Health: `app/api/health/route.ts`

## OpenAPI (Extended Excerpt)

```yaml
paths:
  /api/menu/items:
    get:
      summary: List menu items
      parameters:
        - in: query
          name: categoryId
          schema: { type: string }
        - in: query
          name: q
          schema: { type: string }
      responses:
        "200": { description: Menu items page }
  /api/reservations:
    post:
      summary: Create reservation
      responses:
        "201": { description: Created }
  /api/user/notifications:
    put:
      summary: Update notification preferences
      responses:
        "200": { description: Updated }
```

## Final Notes

- Currency remains INR-only; all amounts in paise in the API.
- Languages supported: `en`, `hi`, `mr` via `/api/translations` and `Accept-Language`.
- The above covers all visible app features and routes in the current UI.
