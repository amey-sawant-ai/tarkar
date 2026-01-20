/**
 * Shared TypeScript types and interfaces
 * Single source of truth for all type definitions
 */

import type { LucideIcon } from "lucide-react";

// ============================================================================
// MENU & DISHES
// ============================================================================

export interface MenuItem {
  id: number;
  name: string;
  desc: string;
  price: number;
  category: MenuCategory;
  type: DishType;
  image: string;
  isPopular?: boolean;
  isSpicy?: boolean;
  isVegan?: boolean;
  allergens?: string[];
}

export type MenuCategory =
  | "North Indian"
  | "South Indian"
  | "Chinese"
  | "Snacks"
  | "Beverages"
  | "Thali";

export type DishType =
  | "Starter"
  | "Main Course"
  | "Snack"
  | "Beverage"
  | "Thali";

export interface MenuSectionItem {
  name: string;
  desc: string;
  price: string;
  image: string;
}

// ============================================================================
// USER & AUTHENTICATION
// ============================================================================

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  avatarUrl?: string;
  memberSince: string;
  loyaltyTier: LoyaltyTier;
  loyaltyPoints: number;
  walletBalance: number;
  preferences: UserPreferences;
  notifications: NotificationSettings;
}

export type LoyaltyTier = "Bronze" | "Silver" | "Gold" | "Platinum";

export interface UserPreferences {
  darkMode: boolean;
  language: Language;
}

export interface NotificationSettings {
  orderUpdates: boolean;
  promotions: boolean;
  newsletter: boolean;
  sms: boolean;
}

export type Language = "en" | "hi" | "mr";

// ============================================================================
// ORDERS
// ============================================================================

export interface Order {
  id: string;
  userId: string;
  status: OrderStatus;
  items: OrderItem[];
  timeline: OrderTimeline[];
  address: DeliveryAddress;
  delivery: DeliveryInfo;
  billing: OrderBilling;
  placedAt: string;
  completedAt?: string;
  specialInstructions?: string;
}

export type OrderStatus =
  | "order-placed"
  | "confirmed"
  | "preparing"
  | "ready"
  | "out-for-delivery"
  | "delivered"
  | "cancelled";

export interface OrderItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
  image: string;
}

export interface OrderTimeline {
  status: OrderStatus;
  timestamp: string;
  description: string;
}

export interface DeliveryInfo {
  type: "delivery" | "pickup";
  estimatedTime: string;
  actualTime?: string;
  driverName?: string;
  driverPhone?: string;
}

export interface OrderBilling {
  subtotal: number;
  tax: number;
  deliveryFee: number;
  discount: number;
  total: number;
  paymentMethod: string;
}

// ============================================================================
// CART
// ============================================================================

export interface CartItem extends OrderItem {
  specialInstructions?: string;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  tax: number;
  deliveryFee: number;
  total: number;
}

// ============================================================================
// ADDRESSES
// ============================================================================

export interface Address {
  id: string;
  type: AddressType;
  name: string;
  phone: string;
  street: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

export type DeliveryAddress = Omit<Address, "id" | "isDefault">;

export type AddressType = "Home" | "Work" | "Other";

// ============================================================================
// WALLET & TRANSACTIONS
// ============================================================================

export interface WalletData {
  balance: number;
  monthlySpent: number;
  totalSaved: number;
  transactions: WalletTransaction[];
}

export interface WalletTransaction {
  id: string;
  type: TransactionType;
  amount: number;
  description: string;
  date: string;
  status: TransactionStatus;
  orderId?: string;
  balanceAfter: number;
}

export type TransactionType =
  | "credit"
  | "debit"
  | "refund"
  | "cashback"
  | "reward"
  | "referral";

export type TransactionStatus = "completed" | "pending" | "failed";

// ============================================================================
// PAYMENT METHODS
// ============================================================================

export interface PaymentMethod {
  id: string;
  type: PaymentMethodType;
  name: string;
  isDefault: boolean;
  lastUsedAt?: string;
  // Card-specific
  cardNumberMasked?: string;
  expiry?: string;
  cardType?: CardType;
  // UPI-specific
  upiId?: string;
  // Netbanking-specific
  bankName?: string;
}

export type PaymentMethodType = "card" | "upi" | "netbanking" | "wallet";
export type CardType = "visa" | "mastercard" | "rupay" | "amex";

// ============================================================================
// RESERVATIONS
// ============================================================================

export interface Reservation {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guestCount: number;
  specialRequests?: string;
  status: ReservationStatus;
  createdAt: string;
}

export type ReservationStatus = "pending" | "confirmed" | "cancelled" | "completed";

// ============================================================================
// REVIEWS & TESTIMONIALS
// ============================================================================

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userRole?: string;
  avatarUrl?: string;
  rating: number;
  content: string;
  date: string;
  status: ReviewStatus;
  orderId?: string;
}

export type ReviewStatus = "pending" | "approved" | "rejected";

export interface Testimonial extends Review {
  status: "approved";
}

// ============================================================================
// OFFERS & PROMOTIONS
// ============================================================================

export interface Offer {
  id: string;
  code: string;
  title: string;
  description: string;
  discountType: DiscountType;
  discountValue: number;
  minOrderValue?: number;
  maxDiscount?: number;
  validFrom: string;
  validUntil: string;
  category: OfferCategory;
  isActive: boolean;
  usageLimit?: number;
  usedCount: number;
}

export type DiscountType = "percentage" | "flat";
export type OfferCategory =
  | "festival"
  | "weekday"
  | "combo"
  | "delivery"
  | "firsttime"
  | "referral";

// ============================================================================
// GALLERY
// ============================================================================

export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  category: GalleryCategory;
  featured?: boolean;
  order?: number;
}

export type GalleryCategory =
  | "food"
  | "ambiance"
  | "events"
  | "kitchen"
  | "team";

// ============================================================================
// PARTY ORDERS
// ============================================================================

export interface PartyPackage {
  id: string;
  name: string;
  description: string;
  category: PartyCategory;
  pricePerPerson: number;
  minGuests: number;
  maxGuests: number;
  items: string[];
  features: string[];
  isPopular?: boolean;
}

export type PartyCategory = "wedding" | "birthday" | "corporate" | "religious" | "custom";

export interface PartyBooking {
  id: string;
  userId: string;
  packageId: string;
  guestCount: number;
  date: string;
  venue: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  specialRequests?: string;
  status: PartyBookingStatus;
  totalAmount: number;
  createdAt: string;
}

export type PartyBookingStatus = "inquiry" | "quoted" | "confirmed" | "completed" | "cancelled";

// ============================================================================
// UI COMPONENTS
// ============================================================================

export interface NavLink {
  href: string;
  label: string;
  translationKey?: string;
  icon?: LucideIcon;
}

export interface StatCard {
  icon: LucideIcon;
  label: string;
  value: string | number;
  change?: string;
  color: string;
}

export interface QuickAction {
  icon: LucideIcon;
  label: string;
  href: string;
  color: string;
}

// ============================================================================
// API RESPONSES
// ============================================================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
  meta?: PaginationMeta;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, string[]>;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// ============================================================================
// FORM STATES
// ============================================================================

export interface FormState<T> {
  data: T;
  errors: Partial<Record<keyof T, string>>;
  isSubmitting: boolean;
  isValid: boolean;
}

export type FormAction<T> =
  | { type: "SET_FIELD"; field: keyof T; value: T[keyof T] }
  | { type: "SET_ERROR"; field: keyof T; error: string }
  | { type: "CLEAR_ERRORS" }
  | { type: "SET_SUBMITTING"; isSubmitting: boolean }
  | { type: "RESET"; initialData: T };
