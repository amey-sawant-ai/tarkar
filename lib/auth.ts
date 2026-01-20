/**
 * Authentication utilities for Tarkari
 * Handles token generation, verification, and user authentication
 */

import bcrypt from "bcryptjs";

// ============================================================================
// TYPES
// ============================================================================

export interface AuthToken {
  userId: string;
  iat: number;
  exp: number;
}

// ============================================================================
// CONSTANTS
// ============================================================================

// Token validity period (30 days)
const TOKEN_EXPIRY_DAYS = 30;
const TOKEN_EXPIRY_MS = TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000;

// Simple token format: base64(userId:timestamp:checksum)
// In production, use proper JWT with RS256 signing

// ============================================================================
// TOKEN GENERATION
// ============================================================================

/**
 * Generate authentication token for a user
 * Format: base64(userId|timestamp|checksum)
 * In production, this should use JWT with proper signing
 */
export function generateAuthToken(userId: string): string {
  const timestamp = Date.now();
  const checksum = generateChecksum(`${userId}${timestamp}`);
  const tokenData = `${userId}|${timestamp}|${checksum}`;
  
  // Encode to base64 for transport
  return Buffer.from(tokenData).toString("base64");
}

/**
 * Verify and decode authentication token
 * Returns userId if valid, null if invalid or expired
 */
export function verifyAuthToken(token: string): string | null {
  try {
    // Decode from base64
    const decoded = Buffer.from(token, "base64").toString("utf-8");
    const [userId, timestampStr, checksum] = decoded.split("|");
    
    if (!userId || !timestampStr || !checksum) {
      return null;
    }
    
    const timestamp = parseInt(timestampStr, 10);
    
    // Check if token is expired
    const now = Date.now();
    if (now - timestamp > TOKEN_EXPIRY_MS) {
      return null;
    }
    
    // Verify checksum
    const expectedChecksum = generateChecksum(`${userId}${timestamp}`);
    if (checksum !== expectedChecksum) {
      return null;
    }
    
    return userId;
  } catch (error) {
    console.error("Token verification error:", error);
    return null;
  }
}

/**
 * Generate a simple checksum for token validation
 * In production, use cryptographic signing (JWT with RS256)
 */
function generateChecksum(data: string): string {
  // Simple checksum: sum of character codes modulo 10000
  // In production, use proper HMAC-SHA256 or similar
  const secret = process.env.AUTH_SECRET || "tarkari_secret_key";
  let checksum = 0;
  
  for (let i = 0; i < data.length; i++) {
    checksum += data.charCodeAt(i);
  }
  
  for (let i = 0; i < secret.length; i++) {
    checksum += secret.charCodeAt(i);
  }
  
  return (checksum % 100000).toString();
}

// ============================================================================
// PASSWORD HASHING
// ============================================================================

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

/**
 * Compare a password with a hash
 */
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// ============================================================================
// TOKEN STORAGE HELPERS
// ============================================================================

/**
 * Save auth token to localStorage (client-side)
 */
export function saveAuthToken(token: string): void {
  if (typeof window === "undefined") return;
  
  try {
    localStorage.setItem("auth_token", token);
    localStorage.setItem("auth_token_time", Date.now().toString());
  } catch (error) {
    console.error("Failed to save auth token:", error);
  }
}

/**
 * Get auth token from localStorage (client-side)
 */
export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  
  try {
    return localStorage.getItem("auth_token");
  } catch (error) {
    console.error("Failed to get auth token:", error);
    return null;
  }
}

/**
 * Remove auth token from localStorage (client-side)
 */
export function clearAuthToken(): void {
  if (typeof window === "undefined") return;
  
  try {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_token_time");
  } catch (error) {
    console.error("Failed to clear auth token:", error);
  }
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  const token = getAuthToken();
  if (!token) return false;
  
  const userId = verifyAuthToken(token);
  return userId !== null;
}

/**
 * Get current authenticated user ID
 */
export function getCurrentUserId(): string | null {
  const token = getAuthToken();
  if (!token) return null;
  
  return verifyAuthToken(token);
}

// ============================================================================
// REQUEST HELPERS
// ============================================================================

/**
 * Get authorization header for API requests
 */
export function getAuthHeader(): Record<string, string> | null {
  const token = getAuthToken();
  if (!token) return null;
  
  return {
    Authorization: `Bearer ${token}`,
  };
}

/**
 * Make authenticated API request
 */
export async function authenticatedFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const authHeader = getAuthHeader();
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
    ...(authHeader || {}),
  };
  
  return fetch(url, {
    ...options,
    headers,
  });
}
