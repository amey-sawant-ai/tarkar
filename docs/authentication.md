# Authentication System Documentation

## Overview

Tarkari uses an **email-only authentication system** - no passwords required. Users can sign up and log in with just their email address.

## Architecture

### Authentication Flow

```
User Signs Up
    ↓
/api/auth/register (POST)
    ↓
Create User in MongoDB
    ↓
Generate Auth Token
    ↓
Return Token to Client
    ↓
Save Token to localStorage
    ↓
Redirect to Dashboard
```

### Login Flow

```
User Enters Email
    ↓
/api/auth/login (POST)
    ↓
Find User in MongoDB
    ↓
Generate Auth Token
    ↓
Return Token to Client
    ↓
Save Token to localStorage
    ↓
Redirect to Dashboard
```

## API Routes

### POST `/api/auth/register`

**Register a new user**

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "name": "John Doe",
    "phone": "+91 98765 43210"
  }'
```

**Request Body:**

```typescript
{
  email: string;      // Required, must be valid email
  name: string;       // Required, min 2 characters
  phone?: string;     // Optional
}
```

**Response (Success 201):**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "email": "user@example.com",
      "name": "John Doe",
      "phone": "+91 98765 43210",
      "createdAt": "2026-01-17T10:30:00Z"
    },
    "token": "base64_encoded_token_here"
  }
}
```

**Response (Error):**

```json
{
  "success": false,
  "error": {
    "code": "CONFLICT",
    "message": "User with this email already exists"
  }
}
```

**Possible Errors:**

- `VALIDATION_ERROR` (400): Missing required fields or invalid format
- `CONFLICT` (409): Email already registered
- `SERVER_ERROR` (500): Database or server error

---

### POST `/api/auth/login`

**Log in an existing user**

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com"
  }'
```

**Request Body:**

```typescript
{
  email: string; // Required, must be valid email
}
```

**Response (Success 200):**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "email": "user@example.com",
      "name": "John Doe",
      "phone": "+91 98765 43210",
      "avatarUrl": null,
      "walletBalancePaise": 0,
      "preferences": {
        "darkMode": false,
        "language": "en"
      },
      "notifications": {
        "orderUpdates": true,
        "promotions": true,
        "newsletter": false,
        "sms": true
      },
      "createdAt": "2026-01-17T10:30:00Z"
    },
    "token": "base64_encoded_token_here"
  }
}
```

**Response (Error):**

```json
{
  "success": false,
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Email not found or invalid"
  }
}
```

**Possible Errors:**

- `VALIDATION_ERROR` (400): Email missing or invalid format
- `INVALID_CREDENTIALS` (401): Email not found
- `SERVER_ERROR` (500): Database or server error

---

### GET `/api/auth/me`

**Get current authenticated user profile**

```bash
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer <token>"
```

**Response (Success 200):**

```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "name": "John Doe",
    "phone": "+91 98765 43210",
    "avatarUrl": null,
    "walletBalancePaise": 0,
    "preferences": {
      "darkMode": false,
      "language": "en"
    },
    "notifications": {
      "orderUpdates": true,
      "promotions": true,
      "newsletter": false,
      "sms": true
    },
    "createdAt": "2026-01-17T10:30:00Z"
  }
}
```

**Response (Error):**

```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Authentication required"
  }
}
```

---

## Token System

### Token Generation

Tokens are generated using a simple format that's secure for development:

```
Format: base64(userId|timestamp|checksum)
```

**Example:**

```
dXNlcl8xMjM0NTY3OHxmZmZmZmZmZnxjaGVja3N1bQ==
```

**Token Validity:**

- Default: 30 days
- Can be configured in `lib/auth.ts`

**In Production:**

- Use proper JWT (JSON Web Tokens) with RS256 signing
- Implement refresh tokens
- Add token blacklisting for logout

### Token Storage

Tokens are stored in browser's `localStorage`:

```javascript
// Client-side usage
localStorage.setItem("auth_token", token);
localStorage.getItem("auth_token");
localStorage.removeItem("auth_token");
```

---

## Client-Side Usage

### Authentication Helper Functions

Located in `lib/auth.ts`

```typescript
// Generate token (server-side)
import { generateAuthToken } from "@/lib/auth";
const token = generateAuthToken(userId);

// Verify token (server or client)
import { verifyAuthToken } from "@/lib/auth";
const userId = verifyAuthToken(token);

// Save token to localStorage
import { saveAuthToken } from "@/lib/auth";
saveAuthToken(token);

// Get token from localStorage
import { getAuthToken } from "@/lib/auth";
const token = getAuthToken();

// Clear token from localStorage
import { clearAuthToken } from "@/lib/auth";
clearAuthToken();

// Check if user is authenticated
import { isAuthenticated } from "@/lib/auth";
if (isAuthenticated()) {
  // User is logged in
}

// Get current user ID
import { getCurrentUserId } from "@/lib/auth";
const userId = getCurrentUserId();

// Get authorization header
import { getAuthHeader } from "@/lib/auth";
const headers = getAuthHeader();

// Make authenticated request
import { authenticatedFetch } from "@/lib/auth";
const response = await authenticatedFetch("/api/orders");
```

### Usage in React Components

**Login Example:**

```typescript
import { useState } from "react";
import { useRouter } from "next/navigation";
import { saveAuthToken } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (!data.success) {
      setError(data.error.message);
      return;
    }

    // Save token and redirect
    saveAuthToken(data.data.token);
    router.push("/dashboard");
  };

  return (
    <form onSubmit={handleLogin}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
      />
      <button type="submit">Sign In</button>
      {error && <p>{error}</p>}
    </form>
  );
}
```

**Protected Route Example:**

```typescript
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";

export default function ProtectedPage() {
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login");
    }
  }, [router]);

  return <div>Protected content</div>;
}
```

**Making Authenticated API Calls:**

```typescript
import { authenticatedFetch } from "@/lib/auth";

async function fetchUserOrders() {
  const response = await authenticatedFetch("/api/orders");
  const data = await response.json();
  return data;
}
```

---

## Server-Side Authentication

### Requiring Authentication

```typescript
import { requireAuth } from "@/lib/api-helpers";

export async function GET(request: Request) {
  // Check if user is authenticated
  const auth = requireAuth(request);
  if (auth instanceof NextResponse) {
    return auth; // Return 401 error
  }

  const { userId } = auth;
  // Use userId for database queries
}
```

### Getting Optional User ID

```typescript
import { getOptionalUserId } from "@/lib/api-helpers";

export async function GET(request: Request) {
  const userId = getOptionalUserId(request);

  if (userId) {
    // User is authenticated
  } else {
    // User is not authenticated
  }
}
```

### Authorization Header Verification

The system automatically checks for:

1. `Authorization: Bearer <token>` header
2. `x-user-id` header (for development)
3. Demo mode fallback

---

## Pages

### Sign Up Page: `/signup`

- Email-only signup form
- Collects: email, full name, phone (optional)
- Creates user account immediately
- Redirects to dashboard on success
- Shows success screen with animation

### Login Page: `/login`

- Email-only login form
- Simple email input
- Instant login on email found
- Detailed error messages
- Sign up link for new users

### Dashboard: `/dashboard`

- Protected route (requires authentication)
- Shows user profile and stats
- Access to all user features

---

## Environment Variables

```env
# Authentication Secret (for token generation)
AUTH_SECRET="your_secret_key_here_change_in_production"

# MongoDB
MONGODB_URI="mongodb://localhost:27017"
MONGODB_DB="tarkari"
```

---

## Security Considerations

### Current Implementation

- ✅ Email validation
- ✅ Tokens stored in localStorage
- ✅ Token expiry (30 days)
- ✅ Simple checksum validation

### Production Recommendations

1. **Use Proper JWT**

   ```typescript
   // Instead of simple base64, use jsonwebtoken package
   import jwt from "jsonwebtoken";

   const token = jwt.sign({ userId, email }, process.env.JWT_SECRET, {
     algorithm: "RS256",
     expiresIn: "30d",
   });
   ```

2. **Add HTTPS Only**

   ```typescript
   // Set secure cookie flag
   response.cookies.set("auth_token", token, {
     httpOnly: true,
     secure: process.env.NODE_ENV === "production",
     sameSite: "strict",
   });
   ```

3. **Implement Refresh Tokens**
   - Short-lived access tokens (15 min)
   - Long-lived refresh tokens (30 days)
   - Refresh token rotation

4. **Add Rate Limiting**

   ```typescript
   // Limit login/signup attempts
   const attempts = await getLoginAttempts(email);
   if (attempts > 5) {
     return apiError("RATE_LIMITED", "Too many attempts", 429);
   }
   ```

5. **Email Verification**
   - Send verification email on signup
   - Verify email before allowing login
   - Resend verification link option

6. **Password Recovery**
   - Add optional password protection later
   - Implement password reset flow
   - Use secure reset tokens

---

## Troubleshooting

### Token Not Persisting

- Check if localStorage is enabled in browser
- Verify cookies are not blocked
- Check browser's Privacy/Incognito mode

### Infinite Redirect Loop

- Verify token is saved to localStorage
- Check if `isAuthenticated()` returns correct value
- Clear cache and restart dev server

### 401 Unauthorized Errors

- Token may have expired (30 days)
- User needs to log in again
- Check if token format is correct

### Email Already Registered

- Use different email for signup
- Try login with existing email
- Implement email recovery feature

---

## Future Enhancements

1. **Two-Factor Authentication**
   - OTP via SMS/Email
   - TOTP apps support

2. **Social Login**
   - Google OAuth
   - Facebook Login
   - WhatsApp integration

3. **Password Support**
   - Optional password setup
   - Password reset flow
   - Password strength validation

4. **Session Management**
   - View active sessions
   - Logout from other devices
   - Session timeout warnings

5. **Audit Logging**
   - Track login/logout events
   - Monitor failed attempts
   - Security alerts

---

## Testing

### Manual Testing

```bash
# 1. Test Signup
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","name":"Test User"}'

# 2. Test Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'

# 3. Test Get Profile
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Unit Tests

```typescript
// Example test with Jest
import { verifyAuthToken, generateAuthToken } from "@/lib/auth";

describe("Auth", () => {
  it("should generate and verify token", () => {
    const userId = "123";
    const token = generateAuthToken(userId);
    const verified = verifyAuthToken(token);
    expect(verified).toBe(userId);
  });

  it("should detect expired token", () => {
    // Test with old timestamp
    const token = "old_token_here";
    const verified = verifyAuthToken(token);
    expect(verified).toBeNull();
  });
});
```

---

## Support

For issues or questions:

1. Check error messages in browser console
2. Review API response details
3. Check `.env.local` configuration
4. Verify MongoDB connection
5. Contact development team
