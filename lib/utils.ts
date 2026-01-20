/**
 * Utility functions for the Tarkari application
 * Centralized helper functions for common operations
 */

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { CURRENCY, PRICING } from "./constants";

// ============================================================================
// STYLING UTILITIES
// ============================================================================

/**
 * Merge Tailwind CSS classes with proper precedence
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ============================================================================
// CURRENCY & PRICE FORMATTING
// ============================================================================

/**
 * Format a number as Indian Rupees
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat(CURRENCY.locale, {
    style: "currency",
    currency: CURRENCY.code,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format price with rupee symbol (simpler version)
 */
export function formatPrice(price: number): string {
  return `${CURRENCY.symbol}${price.toLocaleString(CURRENCY.locale)}`;
}

/**
 * Calculate order total with tax and delivery
 */
export function calculateOrderTotal(subtotal: number): {
  subtotal: number;
  tax: number;
  deliveryFee: number;
  total: number;
} {
  const tax = Math.round((subtotal * PRICING.taxPercent) / 100);
  const deliveryFee =
    subtotal >= PRICING.freeDeliveryThreshold ? 0 : PRICING.deliveryFee;
  const total = subtotal + tax + deliveryFee;

  return { subtotal, tax, deliveryFee, total };
}

/**
 * Format paise to rupees
 */
export function paiseToRupees(paise: number): number {
  return paise / 100;
}

/**
 * Format rupees to paise
 */
export function rupeesToPaise(rupees: number): number {
  return Math.round(rupees * 100);
}

// ============================================================================
// DATE & TIME FORMATTING
// ============================================================================

/**
 * Format date for display
 */
export function formatDate(
  date: Date | string,
  options: Intl.DateTimeFormatOptions = {}
): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    ...options,
  }).format(d);
}

/**
 * Format time for display
 */
export function formatTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(d);
}

/**
 * Format relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSeconds < 60) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes > 1 ? "s" : ""} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;

  return formatDate(d);
}

/**
 * Get estimated delivery time string
 */
export function getEstimatedDeliveryTime(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} mins`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours} hour${hours > 1 ? "s" : ""}`;
}

// ============================================================================
// STRING UTILITIES
// ============================================================================

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "...";
}

/**
 * Capitalize first letter
 */
export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

/**
 * Convert string to title case
 */
export function toTitleCase(text: string): string {
  return text
    .split(" ")
    .map((word) => capitalize(word))
    .join(" ");
}

/**
 * Generate slug from text
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Mask sensitive data (e.g., phone, card numbers)
 */
export function maskString(
  text: string,
  visibleStart: number = 0,
  visibleEnd: number = 4
): string {
  if (text.length <= visibleStart + visibleEnd) return text;
  const start = text.slice(0, visibleStart);
  const end = text.slice(-visibleEnd);
  const masked = "*".repeat(text.length - visibleStart - visibleEnd);
  return `${start}${masked}${end}`;
}

/**
 * Format phone number for display
 */
export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
  }
  if (cleaned.length === 12 && cleaned.startsWith("91")) {
    return `+91 ${cleaned.slice(2, 7)} ${cleaned.slice(7)}`;
  }
  return phone;
}

// ============================================================================
// VALIDATION UTILITIES
// ============================================================================

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate Indian mobile number
 */
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone.replace(/\D/g, ""));
}

/**
 * Validate Indian pincode
 */
export function isValidPincode(pincode: string): boolean {
  const pincodeRegex = /^[1-9][0-9]{5}$/;
  return pincodeRegex.test(pincode);
}

/**
 * Check if string is empty or whitespace
 */
export function isEmpty(value: string | null | undefined): boolean {
  return !value || value.trim().length === 0;
}

// ============================================================================
// ARRAY UTILITIES
// ============================================================================

/**
 * Group array items by a key
 */
export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce((result, item) => {
    const groupKey = String(item[key]);
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(item);
    return result;
  }, {} as Record<string, T[]>);
}

/**
 * Remove duplicates from array
 */
export function unique<T>(array: T[]): T[] {
  return [...new Set(array)];
}

/**
 * Shuffle array (Fisher-Yates)
 */
export function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Chunk array into smaller arrays
 */
export function chunk<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

// ============================================================================
// OBJECT UTILITIES
// ============================================================================

/**
 * Deep clone an object
 */
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Pick specific keys from an object
 */
export function pick<T extends object, K extends keyof T>(
  obj: T,
  keys: K[]
): Pick<T, K> {
  return keys.reduce((result, key) => {
    if (key in obj) {
      result[key] = obj[key];
    }
    return result;
  }, {} as Pick<T, K>);
}

/**
 * Omit specific keys from an object
 */
export function omit<T extends object, K extends keyof T>(
  obj: T,
  keys: K[]
): Omit<T, K> {
  const result = { ...obj };
  keys.forEach((key) => delete result[key]);
  return result as Omit<T, K>;
}

// ============================================================================
// ID GENERATION
// ============================================================================

/**
 * Generate a random ID
 */
export function generateId(prefix: string = ""): string {
  const random = Math.random().toString(36).substring(2, 9);
  const timestamp = Date.now().toString(36);
  return prefix ? `${prefix}-${timestamp}${random}` : `${timestamp}${random}`;
}

/**
 * Generate order ID
 */
export function generateOrderId(): string {
  const date = new Date();
  const year = date.getFullYear();
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");
  return `ORD-${year}-${random}`;
}

// ============================================================================
// URL UTILITIES
// ============================================================================

/**
 * Build query string from object
 */
export function buildQueryString(params: Record<string, string | number | boolean>): string {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.append(key, String(value));
    }
  });
  return searchParams.toString();
}

/**
 * Parse query string to object
 */
export function parseQueryString(queryString: string): Record<string, string> {
  const params = new URLSearchParams(queryString);
  const result: Record<string, string> = {};
  params.forEach((value, key) => {
    result[key] = value;
  });
  return result;
}

// ============================================================================
// ASYNC UTILITIES
// ============================================================================

/**
 * Sleep/delay function
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Retry function with exponential backoff
 */
export async function retry<T>(
  fn: () => Promise<T>,
  maxAttempts: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: Error | undefined;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      if (attempt < maxAttempts) {
        await sleep(baseDelay * Math.pow(2, attempt - 1));
      }
    }
  }

  throw lastError;
}
