export type PaymentMethodType = "card" | "upi" | "netbanking" | "wallet";

export interface PaymentMethod {
  id: string;
  type: PaymentMethodType;
  name: string;
  details: string;
  lastUsed?: string;
  isDefault: boolean;
  icon: string;
  cardNumber?: string;
  expiryDate?: string;
  cardType?: "visa" | "mastercard" | "rupay" | "amex";
  upiId?: string;
  bankName?: string;
}

export const savedPaymentMethods: PaymentMethod[] = [
  {
    id: "PM-001",
    type: "card",
    name: "HDFC Credit Card",
    details: "**** **** **** 1234",
    lastUsed: "Nov 28, 2025",
    isDefault: true,
    icon: "💳",
    cardNumber: "4532********1234",
    expiryDate: "12/26",
    cardType: "visa",
  },
  {
    id: "PM-002",
    type: "upi",
    name: "Google Pay",
    details: "john@oksbi",
    lastUsed: "Nov 27, 2025",
    isDefault: false,
    icon: "📱",
    upiId: "john@oksbi",
  },
  {
    id: "PM-003",
    type: "card",
    name: "SBI Debit Card",
    details: "**** **** **** 5678",
    lastUsed: "Nov 25, 2025",
    isDefault: false,
    icon: "💳",
    cardNumber: "6011********5678",
    expiryDate: "08/27",
    cardType: "rupay",
  },
  {
    id: "PM-004",
    type: "upi",
    name: "PhonePe",
    details: "9876543210@ybl",
    lastUsed: "Nov 23, 2025",
    isDefault: false,
    icon: "📱",
    upiId: "9876543210@ybl",
  },
  {
    id: "PM-005",
    type: "netbanking",
    name: "ICICI Net Banking",
    details: "ICICI Bank",
    lastUsed: "Nov 20, 2025",
    isDefault: false,
    icon: "🏦",
    bankName: "ICICI Bank",
  },
  {
    id: "PM-006",
    type: "wallet",
    name: "Paytm Wallet",
    details: "Balance: ₹450",
    lastUsed: "Nov 18, 2025",
    isDefault: false,
    icon: "👛",
  },
];

export const getPaymentMethodsByType = (
  type: PaymentMethodType
): PaymentMethod[] => {
  return savedPaymentMethods.filter((pm) => pm.type === type);
};

export const getDefaultPaymentMethod = (): PaymentMethod | undefined => {
  return savedPaymentMethods.find((pm) => pm.isDefault);
};

export const getPaymentMethodById = (id: string): PaymentMethod | undefined => {
  return savedPaymentMethods.find((pm) => pm.id === id);
};

export const getPaymentMethodColor = (type: PaymentMethodType): string => {
  const colors = {
    card: "from-blue-500 to-blue-600",
    upi: "from-purple-500 to-purple-600",
    netbanking: "from-green-500 to-green-600",
    wallet: "from-orange-500 to-orange-600",
  };
  return colors[type];
};

export const getPaymentMethodLabel = (type: PaymentMethodType): string => {
  const labels = {
    card: "Card",
    upi: "UPI",
    netbanking: "Net Banking",
    wallet: "Wallet",
  };
  return labels[type];
};

export const getCardTypeIcon = (
  cardType: "visa" | "mastercard" | "rupay" | "amex"
): string => {
  const icons = {
    visa: "🔵",
    mastercard: "🔴",
    rupay: "🟢",
    amex: "🔷",
  };
  return icons[cardType];
};
