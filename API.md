# Tarkari API Documentation

## Base URL

```
http://localhost:3000/api
```

## Authentication

Most endpoints require authentication via the `X-User-Id` header (for development) or `Authorization: Bearer <token>` header.

For demo mode, use:

```
X-User-Id: demo_user_001
```

---

## Response Format

### Success Response

```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "page": 1,
    "pageSize": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

### Error Response

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message",
    "details": { ... }
  }
}
```

---

## Endpoints

### Authentication

#### Register

```
POST /api/auth/register
```

Body:

```json
{
  "email": "user@example.com",
  "name": "John Doe",
  "phone": "+91 98765 43210"
}
```

#### Login

```
POST /api/auth/login
```

Body:

```json
{
  "email": "user@example.com"
}
```

#### Get Current User

```
GET /api/auth/me
```

Headers: `X-User-Id` or `Authorization`

---

### Menu

#### Get Categories

```
GET /api/menu/categories?active=true
```

#### Get Dishes

```
GET /api/menu/dishes
```

Query Parameters:

- `categoryId` - Filter by category
- `isVeg` - Filter vegetarian (true/false)
- `isVegan` - Filter vegan
- `isGlutenFree` - Filter gluten-free
- `featured` - Only featured dishes
- `popular` - Only popular dishes
- `minPrice` - Minimum price in rupees
- `maxPrice` - Maximum price in rupees
- `search` - Text search
- `sortBy` - Field to sort by (default: displayOrder)
- `sortOrder` - asc/desc
- `page` - Page number
- `pageSize` - Items per page

#### Get Single Dish

```
GET /api/menu/dishes/{slug}
```

#### Get Featured Dishes

```
GET /api/menu/featured
```

Returns featured, popular, and new dishes.

---

### Orders

#### List Orders

```
GET /api/orders
```

Query Parameters:

- `status` - "active" or "completed"
- `page`, `pageSize` - Pagination

#### Create Order

```
POST /api/orders
```

Body:

```json
{
  "items": [
    { "itemId": "...", "name": "Butter Chicken", "qty": 2, "pricePaise": 39900 }
  ],
  "address": "123 Main St, Mumbai",
  "paymentMethodId": "pm_123"
}
```

#### Get Order Details

```
GET /api/orders/{id}
```

#### Get Order Tracking

```
GET /api/orders/{id}/track
```

#### Cancel Order

```
POST /api/orders/{id}/cancel
```

Body:

```json
{
  "reason": "Changed my mind"
}
```

---

### User Profile

#### Get Profile

```
GET /api/user/profile
```

#### Update Profile

```
PUT /api/user/profile
```

Body:

```json
{
  "name": "New Name",
  "phone": "+91 98765 43210"
}
```

#### Get/Update Preferences

```
GET /api/user/preferences
PUT /api/user/preferences
```

#### Get/Update Notifications

```
GET /api/user/notifications
PUT /api/user/notifications
```

---

### Addresses

#### List Addresses

```
GET /api/user/addresses
```

#### Add Address

```
POST /api/user/addresses
```

Body:

```json
{
  "label": "Home",
  "fullName": "John Doe",
  "phone": "+91 98765 43210",
  "addressLine1": "123 Main Street",
  "addressLine2": "Apt 4B",
  "landmark": "Near City Mall",
  "city": "Mumbai",
  "state": "Maharashtra",
  "pincode": "400001",
  "isDefault": true
}
```

#### Update Address

```
PUT /api/user/addresses/{id}
```

#### Delete Address

```
DELETE /api/user/addresses/{id}
```

---

### Payment Methods

#### List Payment Methods

```
GET /api/payment-methods
```

#### Add Payment Method

```
POST /api/payment-methods
```

Body (Card):

```json
{
  "type": "card",
  "name": "Personal Card",
  "cardNumberMasked": "**** **** **** 1234",
  "expiry": "12/25",
  "cardType": "visa",
  "isDefault": true
}
```

Body (UPI):

```json
{
  "type": "upi",
  "name": "GPay",
  "upiId": "user@upi"
}
```

#### Update Payment Method

```
PUT /api/payment-methods/{id}
```

#### Delete Payment Method

```
DELETE /api/payment-methods/{id}
```

---

### Wallet

#### Get Wallet Balance & Transactions

```
GET /api/wallet
```

Query Parameters:

- `type` - Filter by transaction type (credit/debit/refund/cashback/reward/referral)
- `page`, `pageSize` - Pagination

#### Add Money to Wallet

```
POST /api/wallet/add-money
```

Headers:

- `Idempotency-Key: <unique-key>` (Required)

Body:

```json
{
  "amountPaise": 50000,
  "paymentMethodId": "pm_123"
}
```

---

### Reservations

#### List Reservations

```
GET /api/reservations
```

Query Parameters:

- `status` - Filter by status
- `page`, `pageSize` - Pagination

#### Create Reservation

```
POST /api/reservations
```

Body:

```json
{
  "guestName": "John Doe",
  "guestEmail": "john@example.com",
  "guestPhone": "+91 98765 43210",
  "date": "2024-12-25",
  "time": "19:00",
  "partySize": 4,
  "tablePreference": "indoor",
  "occasion": "birthday",
  "specialRequests": "Need a quiet corner"
}
```

#### Get Reservation

```
GET /api/reservations/{id}
```

ID can be the MongoDB ID or confirmation code (e.g., TRK1234ABC)

#### Update Reservation

```
PUT /api/reservations/{id}
```

#### Cancel Reservation

```
POST /api/reservations/{id}/cancel
```

#### Check Availability

```
GET /api/reservations/availability?date=2024-12-25&partySize=4
```

---

### Reviews

#### List Reviews

```
GET /api/reviews
```

Query Parameters:

- `dishId` - Filter by dish
- `minRating` - Minimum rating (1-5)
- `verified` - Only verified reviews
- `sortBy` - Field to sort by
- `sortOrder` - asc/desc
- `page`, `pageSize` - Pagination

#### Create Review

```
POST /api/reviews
```

Body:

```json
{
  "dishId": "...",
  "orderId": "...",
  "rating": 5,
  "title": "Amazing!",
  "comment": "Best butter chicken ever!",
  "photos": ["url1", "url2"]
}
```

#### Get Review

```
GET /api/reviews/{id}
```

#### Update Review

```
PUT /api/reviews/{id}
```

#### Delete Review

```
DELETE /api/reviews/{id}
```

#### Mark Review Helpful

```
POST /api/reviews/{id}/helpful
```

Body:

```json
{
  "helpful": true
}
```

---

### Database Seeding (Development Only)

#### Seed Database

```
POST /api/seed
```

Populates the database with sample categories, dishes, and a demo user.

---

## Error Codes

| Code               | Description             |
| ------------------ | ----------------------- |
| `UNAUTHORIZED`     | Authentication required |
| `FORBIDDEN`        | Access denied           |
| `NOT_FOUND`        | Resource not found      |
| `BAD_REQUEST`      | Invalid request         |
| `VALIDATION_ERROR` | Validation failed       |
| `CONFLICT`         | Resource already exists |
| `RATE_LIMITED`     | Too many requests       |
| `SERVER_ERROR`     | Internal server error   |

---

## Pagination

All list endpoints support pagination:

- `page` - Page number (default: 1)
- `pageSize` - Items per page (default: 20, max: 100)

Response includes meta:

```json
{
  "meta": {
    "page": 1,
    "pageSize": 20,
    "total": 100,
    "totalPages": 5
  }
}
```
