"use client";

import { motion } from "motion/react";
import DashboardNavbar from "@/components/DashboardNavbar";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/contexts/ToastContext";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import {
  Loader2,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

interface OrderItem {
  itemId: string;
  name: string;
  qty: number;
  pricePaise: number;
}

interface Order {
  _id: string;
  status: string;
  items: OrderItem[];
  billing: {
    subTotalPaise: number;
    taxPaise: number;
    deliveryFeePaise: number;
    totalPaise: number;
  };
  createdAt: string;
  deliveryType: "delivery" | "pickup";
  address?: string;
  notes?: string;
}

interface OrdersResponse {
  success: boolean;
  data: Order[];
  meta?: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
  error?: {
    code: string;
    message: string;
  };
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "delivered":
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    case "out-for-delivery":
      return <Truck className="w-5 h-5 text-blue-500" />;
    case "cancelled":
      return <XCircle className="w-5 h-5 text-red-500" />;
    default:
      return <Clock className="w-5 h-5 text-orange-500" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "delivered":
      return "bg-green-100 text-green-800";
    case "out-for-delivery":
      return "bg-blue-100 text-blue-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
    default:
      return "bg-orange-100 text-orange-800";
  }
};

export default function MyOrdersPage() {
  const { t } = useLanguage();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { addItem } = useCart();
  const { showToast } = useToast();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");

  const reorderItems = (order: Order) => {
    order.items.forEach((item) => {
      addItem({
        dishId: item.itemId,
        name: item.name,
        price: item.pricePaise,
        quantity: item.qty,
        image: "/placeholder-dish.svg",
      });
    });
    showToast(`${order.items.length} items added to cart!`, "success");
    router.push("/dashboard/checkout");
  };

  const fetchOrders = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("auth_token");
      const url = new URL("/api/orders", window.location.origin);

      url.searchParams.append("page", page.toString());
      url.searchParams.append("pageSize", pageSize.toString());

      if (filter !== "all") {
        url.searchParams.append("status", filter);
      }

      const response = await fetch(url.toString(), {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data: OrdersResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || `Error ${response.status}`);
      }

      if (data.success) {
        setOrders(data.data || []);
        if (data.meta) {
          setPage(data.meta.page || 1);
          setTotal(data.meta.total || 0);
          setTotalPages(data.meta.totalPages || 0);
        }
      } else {
        setError(data.error?.message || "Failed to fetch orders");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError(
        error instanceof Error ? error.message : "Failed to fetch orders",
      );
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, page, pageSize, filter]);

  // Initial load effect
  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        router.push("/login");
        return;
      }
      fetchOrders();
    }
  }, [authLoading, isAuthenticated, router, fetchOrders]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleFilterChange = (newFilter: "all" | "active" | "completed") => {
    setFilter(newFilter);
    setPage(1); // Reset to first page when filter changes
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-warm-beige flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Loader2 className="w-12 h-12 text-tomato-red" />
        </motion.div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-warm-beige flex items-center justify-center">
        <div className="text-center">
          <p className="text-dark-green mb-4">
            Please log in to view your orders
          </p>
          <Button onClick={() => router.push("/login")}>Go to Login</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warm-beige">
      <DashboardNavbar
        title="My Orders"
        subtitle="Track your orders and order history"
      />

      <div className="container mx-auto px-6 py-12">
        {/* Filter Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex gap-4 mb-8 justify-center"
        >
          {[
            { key: "all", label: "All Orders" },
            { key: "active", label: "Active" },
            { key: "completed", label: "Completed" },
          ].map(({ key, label }) => (
            <Button
              key={key}
              variant={filter === key ? "default" : "outline"}
              onClick={() => handleFilterChange(key as any)}
              className={
                filter === key
                  ? "bg-tomato-red hover:bg-tomato-red/90"
                  : "border-tomato-red text-tomato-red hover:bg-tomato-red hover:text-white"
              }
            >
              {label}
            </Button>
          ))}
        </motion.div>

        {error ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto text-center py-16"
          >
            <AlertCircle className="w-24 h-24 text-red-500/20 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-dark-green mb-4">
              Error Loading Orders
            </h2>
            <p className="text-dark-green/60 mb-8">{error}</p>
            <Button
              onClick={fetchOrders}
              className="bg-tomato-red hover:bg-tomato-red/90"
            >
              Try Again
            </Button>
          </motion.div>
        ) : orders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto text-center py-16"
          >
            <Package className="w-24 h-24 text-dark-green/20 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-dark-green mb-4">
              No Orders Yet
            </h2>
            <p className="text-dark-green/60 mb-8">
              Start placing orders to see them here
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto space-y-6"
          >
            {orders.map((order, index) => (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-sm text-dark-green/60">
                      Order #{order._id.slice(-6).toUpperCase()}
                    </p>
                    <p className="text-sm text-dark-green/60">
                      {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <div
                    className={`px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 ${getStatusColor(order.status)}`}
                  >
                    {getStatusIcon(order.status)}
                    {order.status.charAt(0).toUpperCase() +
                      order.status.slice(1).replace(/-/g, " ")}
                  </div>
                </div>

                {/* Items */}
                <div className="mb-4 border-t border-dark-green/10 pt-4">
                  {order.items.map((item) => (
                    <div
                      key={item.itemId}
                      className="flex justify-between py-2"
                    >
                      <div>
                        <p className="font-semibold text-dark-green">
                          {item.name}
                        </p>
                        <p className="text-sm text-dark-green/60">
                          Qty: {item.qty}
                        </p>
                      </div>
                      <p className="font-semibold text-dark-green">
                        {formatPrice(item.pricePaise * item.qty)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Bill */}
                <div className="border-t border-dark-green/10 pt-4 space-y-2">
                  <div className="flex justify-between text-dark-green/70">
                    <span>Subtotal</span>
                    {formatPrice(order.billing.subTotalPaise)}
                  </div>
                  <div className="flex justify-between text-dark-green/70">
                    <span>Tax (5%)</span>
                    <span>{formatPrice(order.billing.taxPaise)}</span>
                  </div>
                  {order.billing.deliveryFeePaise > 0 && (
                    <div className="flex justify-between text-dark-green/70">
                      <span>Delivery Fee</span>
                      <span>
                        {formatPrice(order.billing.deliveryFeePaise)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-lg text-tomato-red border-t border-dark-green/10 pt-2">
                    <span>Total</span>
                    <span>{formatPrice(order.billing.totalPaise)}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-dark-green/10 flex items-center justify-between">
                  <div className="text-sm text-dark-green/60">
                    {order.deliveryType === "delivery"
                      ? "🚗 Delivery"
                      : "🏪 Pickup"}
                    {order.address && order.deliveryType === "delivery" && (
                      <div className="mt-1 text-dark-green/50">
                        📍 {order.address}
                      </div>
                    )}
                  </div>
                  <Button
                    onClick={() => reorderItems(order)}
                    variant="outline"
                    size="sm"
                    className="border-tomato-red text-tomato-red hover:bg-tomato-red hover:text-white"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Reorder
                  </Button>
                </div>
              </motion.div>
            ))}

            {/* Pagination */}
            {totalPages > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex justify-center items-center gap-4 mt-12"
              >
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page <= 1}
                  className="border-tomato-red text-tomato-red hover:bg-tomato-red hover:text-white disabled:opacity-50"
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>

                <div className="flex items-center gap-2">
                  <span className="text-dark-green/60 text-sm">
                    Page {page} of {totalPages}
                  </span>
                  <span className="text-dark-green/40 text-sm">
                    ({total} orders total)
                  </span>
                </div>

                <Button
                  variant="outline"
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page >= totalPages}
                  className="border-tomato-red text-tomato-red hover:bg-tomato-red hover:text-white disabled:opacity-50"
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
