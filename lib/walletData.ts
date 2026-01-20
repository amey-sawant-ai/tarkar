export type TransactionType =
  | "credit"
  | "debit"
  | "refund"
  | "cashback"
  | "reward"
  | "referral";

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  description: string;
  date: string;
  time: string;
  orderId?: string;
  status: "completed" | "pending" | "failed";
  balanceAfter: number;
}

export interface WalletData {
  balance: number;
  totalEarned: number;
  totalSpent: number;
  pendingRefunds: number;
  rewardPoints: number;
  transactions: Transaction[];
}

export const walletData: WalletData = {
  balance: 850,
  totalEarned: 2450,
  totalSpent: 1600,
  pendingRefunds: 0,
  rewardPoints: 850,
  transactions: [
    {
      id: "TXN-2025-001",
      type: "credit",
      amount: 500,
      description: "Added money to wallet",
      date: "Nov 28, 2025",
      time: "10:30 AM",
      status: "completed",
      balanceAfter: 850,
    },
    {
      id: "TXN-2025-002",
      type: "debit",
      amount: 686,
      description: "Payment for order ORD-2025-001",
      date: "Nov 28, 2025",
      time: "12:30 PM",
      orderId: "ORD-2025-001",
      status: "completed",
      balanceAfter: 350,
    },
    {
      id: "TXN-2025-003",
      type: "cashback",
      amount: 68,
      description: "10% cashback on order ORD-2025-001",
      date: "Nov 28, 2025",
      time: "1:30 PM",
      orderId: "ORD-2025-001",
      status: "completed",
      balanceAfter: 418,
    },
    {
      id: "TXN-2025-004",
      type: "debit",
      amount: 591,
      description: "Payment for order ORD-2025-002",
      date: "Nov 27, 2025",
      time: "7:45 PM",
      orderId: "ORD-2025-002",
      status: "completed",
      balanceAfter: -173,
    },
    {
      id: "TXN-2025-005",
      type: "refund",
      amount: 250,
      description: "Refund for cancelled order ORD-2025-005",
      date: "Nov 26, 2025",
      time: "3:15 PM",
      orderId: "ORD-2025-005",
      status: "completed",
      balanceAfter: 77,
    },
    {
      id: "TXN-2025-006",
      type: "reward",
      amount: 100,
      description: "Birthday bonus credited",
      date: "Nov 25, 2025",
      time: "12:00 AM",
      status: "completed",
      balanceAfter: -173,
    },
    {
      id: "TXN-2025-007",
      type: "referral",
      amount: 150,
      description: "Referral bonus - Friend joined",
      date: "Nov 24, 2025",
      time: "2:30 PM",
      status: "completed",
      balanceAfter: -273,
    },
    {
      id: "TXN-2025-008",
      type: "credit",
      amount: 1000,
      description: "Added money to wallet",
      date: "Nov 23, 2025",
      time: "11:00 AM",
      status: "completed",
      balanceAfter: -423,
    },
    {
      id: "TXN-2025-009",
      type: "cashback",
      amount: 50,
      description: "First order cashback",
      date: "Nov 22, 2025",
      time: "6:00 PM",
      status: "completed",
      balanceAfter: -1423,
    },
    {
      id: "TXN-2025-010",
      type: "credit",
      amount: 500,
      description: "Welcome bonus",
      date: "Nov 20, 2025",
      time: "9:00 AM",
      status: "completed",
      balanceAfter: -1473,
    },
  ],
};

export const getTransactionsByType = (
  type: TransactionType
): Transaction[] => {
  return walletData.transactions.filter((txn) => txn.type === type);
};

export const getRecentTransactions = (count: number = 5): Transaction[] => {
  return walletData.transactions.slice(0, count);
};

export const getTransactionById = (id: string): Transaction | undefined => {
  return walletData.transactions.find((txn) => txn.id === id);
};

export const getTransactionColor = (type: TransactionType): string => {
  const colors = {
    credit: "text-blue-600 bg-blue-50 border-blue-200",
    debit: "text-red-600 bg-red-50 border-red-200",
    refund: "text-green-600 bg-green-50 border-green-200",
    cashback: "text-purple-600 bg-purple-50 border-purple-200",
    reward: "text-orange-600 bg-orange-50 border-orange-200",
    referral: "text-pink-600 bg-pink-50 border-pink-200",
  };
  return colors[type];
};

export const getTransactionIcon = (type: TransactionType): string => {
  const icons = {
    credit: "💰",
    debit: "💸",
    refund: "↩️",
    cashback: "🎁",
    reward: "⭐",
    referral: "👥",
  };
  return icons[type];
};

export const getTransactionLabel = (type: TransactionType): string => {
  const labels = {
    credit: "Money Added",
    debit: "Payment",
    refund: "Refund",
    cashback: "Cashback",
    reward: "Reward",
    referral: "Referral Bonus",
  };
  return labels[type];
};
