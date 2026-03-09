import { NextResponse } from "next/server";
import { verifyAuthToken } from "./auth";

// Standard API response types
export interface ApiSuccessResponse<T = unknown> {
  success: true;
  data: T;
  meta?: {
    page?: number;
    pageSize?: number;
    total?: number;
    totalPages?: number;
  };
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
}

export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse;

// Standard success response helper
export function apiSuccess<T>(
  data: T,
  meta?: ApiSuccessResponse["meta"],
  status = 200
): NextResponse<ApiSuccessResponse<T>> {
  return NextResponse.json(
    { success: true, data, ...(meta && { meta }) },
    { status }
  );
}

// Standard error response helper
export function apiError(
  code: string,
  message: string,
  status = 400,
  details?: Record<string, unknown>
): NextResponse<ApiErrorResponse> {
  return NextResponse.json(
    { success: false, error: { code, message, ...(details && { details }) } },
    { status }
  );
}

// Common error responses
export const errors = {
  unauthorized: () => apiError("UNAUTHORIZED", "Authentication required", 401),
  forbidden: () => apiError("FORBIDDEN", "Access denied", 403),
  notFound: (resource = "Resource") => apiError("NOT_FOUND", `${resource} not found`, 404),
  badRequest: (message = "Invalid request") => apiError("BAD_REQUEST", message, 400),
  validationError: (details: Record<string, string>) =>
    apiError("VALIDATION_ERROR", "Validation failed", 400, details),
  serverError: (message = "Internal server error") =>
    apiError("SERVER_ERROR", message, 500),
  rateLimited: () => apiError("RATE_LIMITED", "Too many requests", 429),
  conflict: (message = "Resource already exists") =>
    apiError("CONFLICT", message, 409),
};

// Get user ID from request (demo mode or auth)
export function getUserId(request: Request): string | null {
  // Check for auth token first
  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.substring(7); // Remove "Bearer " prefix
    const result = verifyAuthToken(token);
    if (result) return result.userId;
  }

  // Fallback to x-user-id header (for development/testing)
  const userIdHeader = request.headers.get("x-user-id");
  if (userIdHeader) return userIdHeader;

  // Demo mode fallback - use the actual demo user ID from database
  if (process.env.ENABLE_DEMO_MODE === "true") {
    return "696caa01ebbb3c66c1a41fc7"; // Actual demo user ID
  }

  return null;
}

// Get optional user ID (returns null if not authenticated)
export function getOptionalUserId(request: Request): string | null {
  return getUserId(request);
}

// Require authentication
export function requireAuth(request: Request): { userId: string; role: string } | NextResponse<ApiErrorResponse> {
  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.substring(7);
    const result = verifyAuthToken(token);
    if (result) return result;
  }

  return errors.unauthorized();
}

// User role type
export type UserRole = "user" | "admin" | "staff";

// Require admin authentication (checks role from database)
export async function requireAdmin(
  request: Request
): Promise<{ userId: string; role: UserRole } | NextResponse<ApiErrorResponse>> {
  const authResult = requireAuth(request);
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  // Import User model dynamically to avoid circular dependency
  const { User } = await import("@/models");

  const user = await User.findById(authResult.userId).select("role isActive").lean();

  if (!user) {
    return errors.unauthorized();
  }

  if (!user.isActive) {
    return apiError("ACCOUNT_DISABLED", "Your account has been disabled", 403);
  }

  if (user.role !== "admin") {
    return errors.forbidden();
  }

  return { userId: authResult.userId, role: user.role as UserRole };
}

// Require staff or admin authentication
export async function requireStaff(
  request: Request
): Promise<{ userId: string; role: UserRole } | NextResponse<ApiErrorResponse>> {
  const authResult = requireAuth(request);
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  const { User } = await import("@/models");

  const user = await User.findById(authResult.userId).select("role isActive").lean();

  if (!user) {
    return errors.unauthorized();
  }

  if (!user.isActive) {
    return apiError("ACCOUNT_DISABLED", "Your account has been disabled", 403);
  }

  if (user.role !== "admin" && user.role !== "staff") {
    return errors.forbidden();
  }

  return { userId: authResult.userId, role: user.role as UserRole };
}

// Get user with role (for optional admin features)
export async function getUserWithRole(
  request: Request
): Promise<{ userId: string; role: UserRole } | null> {
  const userId = getUserId(request);
  if (!userId) return null;

  const { User } = await import("@/models");
  const user = await User.findById(userId).select("role isActive").lean();

  if (!user || !user.isActive) return null;

  return { userId, role: (user.role || "user") as UserRole };
}

// Parse pagination params
export function getPagination(request: Request, defaults = { page: 1, pageSize: 20 }) {
  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get("page") || String(defaults.page), 10));
  const pageSize = Math.min(1000, Math.max(1, parseInt(searchParams.get("pageSize") || String(defaults.pageSize), 10)));
  return { page, pageSize, skip: (page - 1) * pageSize };
}

// Create paginated response
export function paginatedResponse<T>(
  items: T[],
  total: number,
  page: number,
  pageSize: number
): NextResponse<ApiSuccessResponse<T[]>> {
  return apiSuccess(items, {
    page,
    pageSize,
    total,
    totalPages: Math.ceil(total / pageSize),
  });
}

// Safe JSON parse
export async function parseBody<T>(request: Request): Promise<T | null> {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

// Validate required fields
export function validateRequired<T extends object>(
  data: T | null,
  fields: (keyof T)[]
): { valid: true; data: T } | { valid: false; errors: Record<string, string> } {
  if (!data) {
    return { valid: false, errors: { _body: "Request body is required" } };
  }

  const errors: Record<string, string> = {};
  for (const field of fields) {
    if (data[field] === undefined || data[field] === null || data[field] === "") {
      errors[field as string] = `${String(field)} is required`;
    }
  }

  if (Object.keys(errors).length > 0) {
    return { valid: false, errors };
  }

  return { valid: true, data };
}

// Generate unique ID
export function generateId(prefix = ""): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `${prefix}${timestamp}${random}`.toUpperCase();
}

// Slugify string
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
