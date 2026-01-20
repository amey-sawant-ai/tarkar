# Auth Implementation - Quick Start Guide

## What Was Implemented

Complete email-only authentication system for Tarkari restaurant:

### ✅ API Routes

1. **POST `/api/auth/register`** - Create new user account
   - Input: email, name, phone (optional)
   - Returns: user object + auth token
   - Stores user in MongoDB with default preferences

2. **POST `/api/auth/login`** - Log in existing user
   - Input: email only
   - Returns: user object + auth token
   - No password required

3. **GET `/api/auth/me`** - Get authenticated user profile
   - Requires: Auth token in Authorization header
   - Returns: full user profile with preferences

### ✅ Client Pages

1. **`/signup`** - Sign up page
   - Collects: email, full name, phone (optional)
   - Form validation
   - Shows success animation on completion
   - Auto-redirects to dashboard after signup

2. **`/login`** - Login page
   - Collects: email only
   - Form validation
   - Error handling with user-friendly messages
   - Link to signup for new users

### ✅ Authentication Utilities (`lib/auth.ts`)

```typescript
// Token Management
generateAuthToken(userId); // Create auth token
verifyAuthToken(token); // Verify & decode token
saveAuthToken(token); // Save to localStorage
getAuthToken(); // Retrieve from localStorage
clearAuthToken(); // Remove from localStorage

// User Status
isAuthenticated(); // Check if logged in
getCurrentUserId(); // Get current user ID

// API Helpers
getAuthHeader(); // Get Authorization header
authenticatedFetch(url, opts); // Make authenticated API call
```

### ✅ Features

- **Email-only signup** - No password required initially
- **Email validation** - Checks format before submission
- **Token-based auth** - Secure token generation & verification
- **localStorage persistence** - Token saved in browser
- **Automatic redirects** - After login/signup → dashboard
- **Error handling** - User-friendly error messages
- **Loading states** - Shows spinners during requests
- **Success animation** - Celebratory animation on signup

---

## How to Use

### 1. Sign Up

Go to `/signup`:

1. Enter email, name, and optionally phone
2. Click "Create Account"
3. See success animation
4. Auto-redirected to dashboard

Or via API:

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "name": "John Doe",
    "phone": "+91 98765 43210"
  }'
```

### 2. Login

Go to `/login`:

1. Enter email
2. Click "Sign In"
3. Auto-redirected to dashboard

Or via API:

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com"}'
```

### 3. Authenticate Requests

The token is automatically saved and used for all authenticated requests:

```typescript
// Automatically includes token
const response = await fetch("/api/orders");

// Or manually
const token = localStorage.getItem("auth_token");
const response = await fetch("/api/orders", {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

// Or use helper
import { authenticatedFetch } from "@/lib/auth";
const response = await authenticatedFetch("/api/orders");
```

### 4. Check Authentication Status

```typescript
import { isAuthenticated, getCurrentUserId } from "@/lib/auth";

if (isAuthenticated()) {
  const userId = getCurrentUserId();
  console.log("Logged in as:", userId);
} else {
  console.log("Not logged in");
}
```

### 5. Logout

```typescript
import { clearAuthToken } from "@/lib/auth";

function handleLogout() {
  clearAuthToken();
  // Redirect to login
  router.push("/login");
}
```

---

## File Structure

```
app/
├── (auth)/
│   ├── login/
│   │   └── page.tsx          # Login form page
│   └── signup/
│       └── page.tsx          # Signup form page
└── api/
    └── auth/
        ├── register/
        │   └── route.ts      # Signup API route
        ├── login/
        │   └── route.ts      # Login API route
        └── me/
            └── route.ts      # Get profile API route

lib/
├── auth.ts                    # Auth utilities (NEW)
├── api-helpers.ts            # API response helpers
└── mongodb.ts                # DB connection

docs/
└── authentication.md          # Full auth documentation (NEW)
```

---

## Testing

### Test Signup

```bash
# Visit http://localhost:3000/signup
# Or API test
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "name": "Test User"
  }'
```

### Test Login

```bash
# Visit http://localhost:3000/login
# Or API test
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'
```

### Test Protected Routes

```bash
# Get the token from response above, then:
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer <token_from_login>"
```

### Test in Browser Console

```javascript
// Check localStorage
console.log(localStorage.getItem("auth_token"));

// Check auth status
import { isAuthenticated, getCurrentUserId } from "@/lib/auth";
console.log(isAuthenticated()); // true/false
console.log(getCurrentUserId()); // userId or null
```

---

## Environment Setup

### `.env.local`

```env
# Required for MongoDB
MONGODB_URI="mongodb://localhost:27017"
MONGODB_DB="tarkari"

# Token generation secret
AUTH_SECRET="tarkari_development_secret_key"
```

### Start MongoDB (if not running)

```bash
# Using Docker
docker run -d -p 27017:27017 --name mongodb mongo

# Or using local MongoDB
mongod
```

### Start Development Server

```bash
pnpm dev
# Visit http://localhost:3000
```

---

## Security Notes

### Current Implementation

✅ Email validation
✅ Token generation with checksum
✅ Token expiry (30 days)
✅ localStorage storage
✅ Automatic token inclusion in requests

### For Production

1. **Use JWT with RS256**
   - Implement proper signing
   - Use cryptographic libraries

2. **Enable HTTPS**
   - Set secure cookies
   - Use httpOnly flag

3. **Add Rate Limiting**
   - Limit signup/login attempts
   - Prevent brute force attacks

4. **Email Verification**
   - Send verification emails
   - Verify before allowing login

5. **Add Refresh Tokens**
   - Short-lived access tokens
   - Long-lived refresh tokens
   - Token rotation

6. **Implement Password Later**
   - Optional password setup
   - Password reset functionality
   - Secure hashing (bcrypt)

---

## Next Steps

### Short Term

- [ ] Add logout functionality
- [ ] Create protected dashboard wrapper
- [ ] Add user profile editing
- [ ] Implement forgot email (account recovery)

### Medium Term

- [ ] Add email verification on signup
- [ ] Implement optional password setup
- [ ] Add two-factor authentication (OTP)
- [ ] Create session management

### Long Term

- [ ] Social login (Google, Facebook, WhatsApp)
- [ ] Password reset functionality
- [ ] Account deletion
- [ ] Privacy and data export features

---

## Troubleshooting

### "Cannot find module @/lib/auth"

- Rebuild: `pnpm build`
- Restart dev server: `pnpm dev`
- Clear `.next` folder: `rm -rf .next && pnpm dev`

### Token not saving to localStorage

- Check browser privacy settings
- Clear browser cache/cookies
- Try incognito/private window
- Check browser console for errors

### Getting 401 Unauthorized

- Token expired (need to login again)
- Token not included in request
- Invalid token format
- User deleted from database

### MongoDB connection fails

- Ensure MongoDB is running
- Check MONGODB_URI in .env.local
- Verify database name (tarkari)
- Check network connectivity

---

## Documentation

Full documentation available in:

- `docs/authentication.md` - Complete auth system docs
- `lib/auth.ts` - Auth utility functions
- API routes in `app/api/auth/`
- Form pages in `app/(auth)/`

---

## Support

For issues:

1. Check error messages in browser console
2. Review API response in Network tab
3. Check terminal output for server errors
4. Verify .env.local configuration
5. Restart dev server and try again
