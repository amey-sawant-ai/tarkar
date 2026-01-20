import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Middleware runs on Edge runtime, so we can't use Mongoose directly
// We'll verify the token format and decode it to check role

function decodeToken(token: string): { userId: string; timestamp: number; role?: string } | null {
  try {
    // Token format: base64(userId|timestamp|checksum) or base64(userId|timestamp|role|checksum)
    const decoded = atob(token);
    const parts = decoded.split("|");
    
    if (parts.length < 3) return null;
    
    const userId = parts[0];
    const timestamp = parseInt(parts[1], 10);
    
    // Check token expiry (30 days)
    const thirtyDays = 30 * 24 * 60 * 60 * 1000;
    if (Date.now() - timestamp > thirtyDays) {
      return null;
    }
    
    // If there's a 4th part, the 3rd part is the role
    const role = parts.length >= 4 ? parts[2] : undefined;
    
    return { userId, timestamp, role };
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect /admin routes (not /api/admin - those have their own auth)
  if (pathname.startsWith("/admin")) {
    // Get token from cookie or Authorization header
    const token = request.cookies.get("auth_token")?.value;
    
    // If no token in cookie, we can't check here since localStorage isn't available
    // The client-side will handle redirect for localStorage tokens
    // But we can check if there's a cookie-based token
    
    if (!token) {
      // Allow the request to proceed - client-side will check localStorage
      // and redirect if needed via the admin layout
      return NextResponse.next();
    }

    // Verify token
    const decoded = decodeToken(token);
    
    if (!decoded) {
      // Invalid or expired token - redirect to login
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // If role is in token and not admin/staff, redirect
    if (decoded.role && decoded.role !== "admin" && decoded.role !== "staff") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // Token is valid - allow request
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all /admin routes except static files
    "/admin/:path*",
  ],
};
