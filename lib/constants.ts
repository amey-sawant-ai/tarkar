/**
 * Application-wide constants and configuration
 * Centralized location for all magic numbers, strings, and config values
 */

import type { OrderStatus } from "./types";

// ============================================================================
// COMPANY INFORMATION
// ============================================================================

export const COMPANY = {
  name: "Tarkari",
  tagline: "Pure Veg Family Dining",
  description:
    "Experience authentic pure vegetarian cuisine at Tarkari, Dombivli East.",
  phone: "+91 96192 67393",
  email: "info@tarkari.com",
  address: {
    street: "Shop 5 And 6, Ground Floor, Pushpdeo Society",
    landmark: "Near Sarvesh Hall",
    area: "Acharya Tulsi Marg, Dombivli East",
    city: "Thane",
    state: "Maharashtra",
    pincode: "421201",
    plusCode: "638R+CP Dombivli",
  },
  hours: {
    open: "11:00 AM",
    close: "10:00 PM",
    days: "Daily",
  },
  social: {
    instagram: "https://instagram.com/tarkari",
    facebook: "https://facebook.com/tarkari",
    twitter: "https://twitter.com/tarkari",
  },
} as const;

// ============================================================================
// NAVIGATION
// ============================================================================

export const NAV_LINKS = [
  { href: "/menu", label: "Menu", translationKey: "nav.menu" },
  { href: "/reservation", label: "Reservation", translationKey: "nav.reservation" },
  { href: "/offers", label: "Offers", translationKey: "nav.offers" },
  { href: "/about", label: "About", translationKey: "nav.about" },
  { href: "/gallery", label: "Gallery", translationKey: "nav.gallery" },
  { href: "/reviews", label: "Reviews", translationKey: "nav.reviews" },
  { href: "/contact", label: "Contact", translationKey: "nav.contact" },
] as const;

export const DASHBOARD_NAV_LINKS = [
  { href: "/dashboard", label: "Dashboard", icon: "LayoutDashboard" },
  { href: "/dashboard/order", label: "Order Food", icon: "ShoppingBag" },
  { href: "/dashboard/my-orders", label: "My Orders", icon: "Package" },
  { href: "/dashboard/order-tracking", label: "Track Orders", icon: "Truck" },
  { href: "/dashboard/reservation", label: "Reservations", icon: "Calendar" },
  { href: "/dashboard/party-orders", label: "Party Orders", icon: "Users" },
  { href: "/dashboard/favorites", label: "Favorites", icon: "Heart" },
  { href: "/dashboard/addresses", label: "Addresses", icon: "MapPin" },
  { href: "/dashboard/reviews", label: "My Reviews", icon: "Star" },
  { href: "/dashboard/wallet", label: "Wallet", icon: "Wallet" },
  { href: "/dashboard/payment-methods", label: "Payment Methods", icon: "CreditCard" },
  { href: "/dashboard/profile", label: "Profile", icon: "User" },
  { href: "/dashboard/settings", label: "Settings", icon: "Settings" },
] as const;

// ============================================================================
// CURRENCY & PRICING
// ============================================================================

export const CURRENCY = {
  code: "INR",
  symbol: "₹",
  locale: "en-IN",
} as const;

export const PRICING = {
  deliveryFee: 2000, // in paise (₹20)
  taxPercent: 5,     // in percent (5%) - Standard GST for restaurants in many regions
  minOrderAmount: 15000, // in paise (₹150)
  freeDeliveryThreshold: 50000, // in paise (₹500)
} as const;

// ============================================================================
// ORDER STATUS
// ============================================================================

export const ORDER_STATUS = {
  ORDER_PLACED: "order-placed",
  CONFIRMED: "confirmed",
  PREPARING: "preparing",
  READY: "ready",
  OUT_FOR_DELIVERY: "out-for-delivery",
  DELIVERED: "delivered",
  CANCELLED: "cancelled",
} as const;

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  [ORDER_STATUS.ORDER_PLACED]: "Order Placed",
  [ORDER_STATUS.CONFIRMED]: "Confirmed",
  [ORDER_STATUS.PREPARING]: "Preparing",
  [ORDER_STATUS.READY]: "Ready for Pickup",
  [ORDER_STATUS.OUT_FOR_DELIVERY]: "Out for Delivery",
  [ORDER_STATUS.DELIVERED]: "Delivered",
  [ORDER_STATUS.CANCELLED]: "Cancelled",
};

export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  [ORDER_STATUS.ORDER_PLACED]: "blue",
  [ORDER_STATUS.CONFIRMED]: "indigo",
  [ORDER_STATUS.PREPARING]: "orange",
  [ORDER_STATUS.READY]: "yellow",
  [ORDER_STATUS.OUT_FOR_DELIVERY]: "purple",
  [ORDER_STATUS.DELIVERED]: "green",
  [ORDER_STATUS.CANCELLED]: "red",
};

// ============================================================================
// WALLET & TRANSACTIONS
// ============================================================================

export const TRANSACTION_TYPES = {
  CREDIT: "credit",
  DEBIT: "debit",
  REFUND: "refund",
  CASHBACK: "cashback",
  REWARD: "reward",
  REFERRAL: "referral",
} as const;

export const PAYMENT_METHOD_TYPES = {
  CARD: "card",
  UPI: "upi",
  NETBANKING: "netbanking",
  WALLET: "wallet",
} as const;

export const VALIDATION = {
  phone: {
    pattern: /^[6-9]\d{9}$/,
    message: "Enter a valid 10-digit Indian mobile number",
  },
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: "Enter a valid email address",
  },
  pincode: {
    pattern: /^[1-9][0-9]{5}$/,
    message: "Enter a valid 6-digit pincode",
  },
  name: {
    minLength: 2,
    maxLength: 50,
    message: "Name must be 2-50 characters",
  },
  password: {
    minLength: 8,
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    message: "Password must be at least 8 characters with uppercase, lowercase, and number",
  },
} as const;

// ============================================================================
// ANIMATION DURATIONS
// ============================================================================

export const ANIMATION = {
  fast: 0.15,
  normal: 0.3,
  slow: 0.5,
  page: 0.6,
  stagger: 0.1,
} as const;

// ============================================================================
// BREAKPOINTS (matching Tailwind)
// ============================================================================

export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;

// ============================================================================
// LOCAL STORAGE KEYS
// ============================================================================

export const STORAGE_KEYS = {
  language: "tarkari-language",
  theme: "tarkari-theme",
  cart: "tarkari-cart",
  favorites: "tarkari-favorites",
  recentOrders: "tarkari-recent-orders",
} as const;

// ============================================================================
// API ENDPOINTS (for future backend integration)
// ============================================================================

export const API_ENDPOINTS = {
  auth: {
    login: "/api/auth/login",
    signup: "/api/auth/signup",
    logout: "/api/auth/logout",
    refresh: "/api/auth/refresh",
  },
  orders: "/api/orders",
  wallet: {
    balance: "/api/wallet",
    addMoney: "/api/wallet/add-money",
    transactions: "/api/wallet/transactions",
  },
  user: {
    profile: "/api/user/profile",
    preferences: "/api/user/preferences",
    addresses: "/api/user/addresses",
  },
  menu: "/api/menu",
  reservations: "/api/reservations",
  reviews: "/api/reviews",
} as const;

// ============================================================================
// ERROR MESSAGES
// ============================================================================

export const ERROR_MESSAGES = {
  generic: "Something went wrong. Please try again.",
  network: "Network error. Please check your connection.",
  unauthorized: "Please login to continue.",
  notFound: "The requested resource was not found.",
  validation: "Please check your input and try again.",
  serverError: "Server error. Please try again later.",
} as const;

// ============================================================================
// SUCCESS MESSAGES
// ============================================================================

export const SUCCESS_MESSAGES = {
  orderPlaced: "Order placed successfully!",
  reservationBooked: "Reservation confirmed!",
  reviewSubmitted: "Thank you for your review!",
  profileUpdated: "Profile updated successfully!",
  addressAdded: "Address added successfully!",
  moneyAdded: "Money added to wallet successfully!",
} as const;
