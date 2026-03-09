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
  customization?: string;
}

export interface OrderTracking {
  orderId: string;
  orderDate: string;
  orderTime: string;
  status: OrderStatus;
  estimatedDelivery: string;
  deliveryAddress: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  deliveryFee: number;
  discount: number;
  total: number;
  paymentMethod: string;
  deliveryPerson?: {
    name: string;
    phone: string;
    vehicle: string;
  };
  timeline: {
    status: OrderStatus;
    timestamp: string;
    message: string;
    completed: boolean;
  }[];
  specialInstructions?: string;
}

export const trackingOrders: OrderTracking[] = [
  {
    orderId: "ORD-2025-001",
    orderDate: "Nov 28, 2025",
    orderTime: "12:30 PM",
    status: "out-for-delivery",
    estimatedDelivery: "1:15 PM",
    deliveryAddress: "123 MG Road, DombivLi East, Maharashtra 421201",
    items: [
      { id: 1, name: "Paneer Butter Masala", quantity: 2, price: 28000 },
      { id: 2, name: "Butter Naan", quantity: 4, price: 6000 },
      { id: 3, name: "Dal Makhani", quantity: 1, price: 22000 },
      { id: 4, name: "Jeera Rice", quantity: 2, price: 12000 },
    ],
    subtotal: 68000,
    tax: 3400,
    deliveryFee: 4000,
    discount: 6800,
    total: 68600,
    paymentMethod: "UPI",
    deliveryPerson: {
      name: "Rajesh Kumar",
      phone: "+91 98765 43210",
      vehicle: "Bike - MH 43 AB 1234",
    },
    timeline: [
      {
        status: "order-placed",
        timestamp: "12:30 PM",
        message: "Order placed successfully",
        completed: true,
      },
      {
        status: "confirmed",
        timestamp: "12:32 PM",
        message: "Restaurant confirmed your order",
        completed: true,
      },
      {
        status: "preparing",
        timestamp: "12:35 PM",
        message: "Your food is being prepared",
        completed: true,
      },
      {
        status: "ready",
        timestamp: "1:00 PM",
        message: "Order is ready for pickup",
        completed: true,
      },
      {
        status: "out-for-delivery",
        timestamp: "1:05 PM",
        message: "Out for delivery - Rajesh is on the way",
        completed: true,
      },
      {
        status: "delivered",
        timestamp: "Expected by 1:15 PM",
        message: "Will be delivered soon",
        completed: false,
      },
    ],
    specialInstructions: "Please ring the bell, Flat 402",
  },
  {
    orderId: "ORD-2025-002",
    orderDate: "Nov 27, 2025",
    orderTime: "7:45 PM",
    status: "delivered",
    estimatedDelivery: "8:30 PM",
    deliveryAddress: "456 Station Road, DombivLi West, Maharashtra 421202",
    items: [
      { id: 1, name: "Veg Biryani", quantity: 2, price: 38000 },
      { id: 2, name: "Raita", quantity: 2, price: 8000 },
      { id: 3, name: "Gulab Jamun", quantity: 4, price: 12000 },
    ],
    subtotal: 58000,
    tax: 2900,
    deliveryFee: 4000,
    discount: 5800,
    total: 59100,
    paymentMethod: "Cash on Delivery",
    deliveryPerson: {
      name: "Amit Sharma",
      phone: "+91 98765 43211",
      vehicle: "Bike - MH 43 CD 5678",
    },
    timeline: [
      {
        status: "order-placed",
        timestamp: "7:45 PM",
        message: "Order placed successfully",
        completed: true,
      },
      {
        status: "confirmed",
        timestamp: "7:47 PM",
        message: "Restaurant confirmed your order",
        completed: true,
      },
      {
        status: "preparing",
        timestamp: "7:50 PM",
        message: "Your food is being prepared",
        completed: true,
      },
      {
        status: "ready",
        timestamp: "8:15 PM",
        message: "Order is ready for pickup",
        completed: true,
      },
      {
        status: "out-for-delivery",
        timestamp: "8:20 PM",
        message: "Out for delivery",
        completed: true,
      },
      {
        status: "delivered",
        timestamp: "8:35 PM",
        message: "Order delivered successfully",
        completed: true,
      },
    ],
  },
  {
    orderId: "ORD-2025-003",
    orderDate: "Nov 28, 2025",
    orderTime: "11:00 AM",
    status: "preparing",
    estimatedDelivery: "11:45 AM",
    deliveryAddress: "789 Market Road, DombivLi East, Maharashtra 421201",
    items: [
      { id: 1, name: "Masala Dosa", quantity: 2, price: 24000 },
      { id: 2, name: "Idli Sambar", quantity: 1, price: 15000 },
      { id: 3, name: "Filter Coffee", quantity: 2, price: 8000 },
    ],
    subtotal: 47000,
    tax: 2400,
    deliveryFee: 3000,
    discount: 4700,
    total: 47700,
    paymentMethod: "Debit Card",
    timeline: [
      {
        status: "order-placed",
        timestamp: "11:00 AM",
        message: "Order placed successfully",
        completed: true,
      },
      {
        status: "confirmed",
        timestamp: "11:02 AM",
        message: "Restaurant confirmed your order",
        completed: true,
      },
      {
        status: "preparing",
        timestamp: "11:05 AM",
        message: "Your food is being prepared with care",
        completed: true,
      },
      {
        status: "ready",
        timestamp: "Expected by 11:30 AM",
        message: "Order will be ready soon",
        completed: false,
      },
      {
        status: "out-for-delivery",
        timestamp: "Pending",
        message: "Waiting for delivery assignment",
        completed: false,
      },
      {
        status: "delivered",
        timestamp: "Expected by 11:45 AM",
        message: "Will be delivered soon",
        completed: false,
      },
    ],
    specialInstructions: "Extra chutney please",
  },
];

export const getOrderById = (orderId: string): OrderTracking | undefined => {
  return trackingOrders.find((order) => order.orderId === orderId);
};

export const getActiveOrders = (): OrderTracking[] => {
  return trackingOrders.filter(
    (order) => order.status !== "delivered" && order.status !== "cancelled"
  );
};

export const getCompletedOrders = (): OrderTracking[] => {
  return trackingOrders.filter((order) => order.status === "delivered");
};

export const getOrderStatusColor = (status: OrderStatus): string => {
  const colors = {
    "order-placed": "from-blue-500 to-blue-600",
    confirmed: "from-green-500 to-green-600",
    preparing: "from-orange-500 to-orange-600",
    ready: "from-purple-500 to-purple-600",
    "out-for-delivery": "from-indigo-500 to-indigo-600",
    delivered: "from-green-600 to-emerald-600",
    cancelled: "from-red-500 to-red-600",
  };
  return colors[status];
};

export const getOrderStatusIcon = (status: OrderStatus): string => {
  const icons = {
    "order-placed": "🛒",
    confirmed: "✅",
    preparing: "👨‍🍳",
    ready: "📦",
    "out-for-delivery": "🏍️",
    delivered: "🎉",
    cancelled: "❌",
  };
  return icons[status];
};
