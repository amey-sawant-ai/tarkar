"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  ChefHat,
  Package,
  MapPin,
  Phone,
  Mail,
  User,
  CreditCard,
  Calendar,
  AlertTriangle,
  Wallet,
  X,
} from "lucide-react";
import { cn, formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface OrderItem {
  itemId: string;
  name: string;
  qty: number;
  pricePaise: number;
}

interface Order {
  _id: string;
  userId: string;
  status: string;
  items: OrderItem[];
  billing: {
    subTotalPaise: number;
    taxPaise: number;
    deliveryFeePaise: number;
    totalPaise: number;
    paymentMethod: string;
  };
  deliveryType: string;
  address?: string;
  specialInstructions?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    name: string;
    email: string;
    phone: string;
    walletBalancePaise?: number;
  };
}

const statusFlow = [
  { value: "order-placed", label: "Order Placed", icon: Clock },
  { value: "confirmed", label: "Confirmed", icon: CheckCircle },
  { value: "preparing", label: "Preparing", icon: ChefHat },
  { value: "ready", label: "Ready", icon: Package },
  { value: "out-for-delivery", label: "Out for Delivery", icon: Truck },
  { value: "delivered", label: "Delivered", icon: CheckCircle },
];

const getStatusColor = (status: string, isActive: boolean, isPast: boolean) => {
  if (status === "cancelled") return "bg-red-500";
  if (isActive) return "bg-dark-green";
  if (isPast) return "bg-green-500";
  return "bg-gray-300";
};

export default function AdminOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [refundToWallet, setRefundToWallet] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [refundInfo, setRefundInfo] = useState<{
    amountPaise: number;
    newWalletBalance: number;
  } | null>(null);

  useEffect(() => {
    fetchOrder();
  }, [params.id]);

  async function fetchOrder() {
    try {
      const token = localStorage.getItem("auth_token");
      const res = await fetch(`/api/admin/orders/${params.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setOrder(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch order:", error);
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(newStatus: string) {
    if (!order) return;
    setUpdating(true);
    try {
      const token = localStorage.getItem("auth_token");
      const res = await fetch(`/api/admin/orders/${params.id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setOrder(data.data);
      }
    } catch (error) {
      console.error("Failed to update status:", error);
    } finally {
      setUpdating(false);
    }
  }

  async function handleCancelOrder() {
    if (!order || !cancelReason.trim()) return;
    setCancelling(true);
    try {
      const token = localStorage.getItem("auth_token");
      const res = await fetch(`/api/admin/orders/${params.id}/cancel`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          reason: cancelReason,
          refundToWallet,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setOrder(data.data.order);
        if (data.data.refund) {
          setRefundInfo(data.data.refund);
        }
        setShowCancelModal(false);
        setCancelReason("");
      } else {
        alert(data.error || "Failed to cancel order");
      }
    } catch (error) {
      console.error("Failed to cancel order:", error);
      alert("Failed to cancel order");
    } finally {
      setCancelling(false);
    }
  }



  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getCurrentStatusIndex = () => {
    if (!order) return -1;
    return statusFlow.findIndex((s) => s.value === order.status);
  };

  const getNextStatus = () => {
    const currentIndex = getCurrentStatusIndex();
    if (currentIndex === -1 || currentIndex >= statusFlow.length - 1)
      return null;
    return statusFlow[currentIndex + 1];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-dark-green"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Order not found</p>
        <Link href="/admin/orders">
          <Button variant="outline" className="mt-4">
            Back to Orders
          </Button>
        </Link>
      </div>
    );
  }

  const currentStatusIndex = getCurrentStatusIndex();
  const nextStatus = getNextStatus();
  const isCancelled = order.status === "cancelled";
  const isDelivered = order.status === "delivered";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Order #{order._id.slice(-6).toUpperCase()}
            </h1>
            <p className="text-gray-500">
              Placed on {formatDate(order.createdAt)}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          {!isCancelled && !isDelivered && nextStatus && (
            <Button
              onClick={() => updateStatus(nextStatus.value)}
              disabled={updating}
              className="bg-dark-green hover:bg-dark-green/90"
            >
              {updating ? "Updating..." : `Mark as ${nextStatus.label}`}
            </Button>
          )}
          {!isCancelled && !isDelivered && (
            <Button
              variant="destructive"
              onClick={() => setShowCancelModal(true)}
              disabled={updating}
            >
              Cancel Order
            </Button>
          )}
        </div>
      </div>

      {/* Status Progress */}
      {!isCancelled && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-6">Order Status</h2>
          <div className="flex items-center justify-between">
            {statusFlow.map((step, index) => {
              const Icon = step.icon;
              const isActive = index === currentStatusIndex;
              const isPast = index < currentStatusIndex;

              return (
                <div key={step.value} className="flex items-center flex-1">
                  <div className="flex flex-col items-center">
                    <div
                      className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center text-white transition-colors",
                        getStatusColor(step.value, isActive, isPast),
                      )}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <span
                      className={cn(
                        "text-xs mt-2 text-center",
                        isActive
                          ? "text-dark-green font-semibold"
                          : isPast
                            ? "text-green-600"
                            : "text-gray-400",
                      )}
                    >
                      {step.label}
                    </span>
                  </div>
                  {index < statusFlow.length - 1 && (
                    <div
                      className={cn(
                        "flex-1 h-1 mx-2",
                        isPast ? "bg-green-500" : "bg-gray-200",
                      )}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Cancelled Badge */}
      {isCancelled && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
          <XCircle className="h-6 w-6 text-red-500" />
          <div>
            <p className="font-semibold text-red-800">Order Cancelled</p>
            <p className="text-sm text-red-600">
              This order has been cancelled
            </p>
          </div>
        </div>
      )}

      {/* Refund Success Message */}
      {refundInfo && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
          <Wallet className="h-6 w-6 text-green-500" />
          <div>
            <p className="font-semibold text-green-800">Refund Processed</p>
            <p className="text-sm text-green-600">
              {formatPrice(refundInfo.amountPaise)} has been credited to
              customer&apos;s wallet. New balance:{" "}
              {formatPrice(refundInfo.newWalletBalance)}
            </p>
          </div>
          <button
            onClick={() => setRefundInfo(null)}
            className="ml-auto text-green-500 hover:text-green-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Cancel Order Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-100 rounded-full">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Cancel Order</h3>
                <p className="text-sm text-gray-500">
                  Order #{order?._id.slice(-6).toUpperCase()}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cancellation Reason *
                </label>
                <textarea
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="Enter reason for cancellation..."
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 min-h-[80px]"
                />
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={refundToWallet}
                    onChange={(e) => setRefundToWallet(e.target.checked)}
                    className="w-5 h-5 text-dark-green rounded focus:ring-dark-green"
                  />
                  <div>
                    <span className="font-medium">Refund to Wallet</span>
                    <p className="text-sm text-gray-500">
                      Credit {formatPrice(order?.billing.totalPaise || 0)} to
                      customer&apos;s wallet
                    </p>
                  </div>
                </label>
              </div>

              {order?.billing.paymentMethod === "cash-on-delivery" &&
                refundToWallet && (
                  <p className="text-sm text-amber-600 bg-amber-50 p-3 rounded-lg flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    This was a COD order. Refunding to wallet will add credits
                    even though no payment was collected.
                  </p>
                )}
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                variant="outline"
                onClick={() => {
                  setShowCancelModal(false);
                  setCancelReason("");
                }}
                className="flex-1"
                disabled={cancelling}
              >
                Keep Order
              </Button>
              <Button
                variant="destructive"
                onClick={handleCancelOrder}
                disabled={cancelling || cancelReason.trim().length < 3}
                className="flex-1"
              >
                {cancelling ? "Cancelling..." : "Cancel Order"}
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Items */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Order Items</h2>
            <div className="divide-y">
              {order.items.map((item, index) => (
                <div
                  key={index}
                  className="py-3 flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-500">
                      {formatPrice(item.pricePaise)} × {item.qty}
                    </p>
                  </div>
                  <p className="font-medium">
                    {formatPrice(item.pricePaise * item.qty)}
                  </p>
                </div>
              ))}
            </div>

            {/* Billing Summary */}
            <div className="mt-4 pt-4 border-t space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal</span>
                <span>{formatPrice(order.billing.subTotalPaise)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Tax</span>
                <span>{formatPrice(order.billing.taxPaise)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Delivery Fee</span>
                <span>{formatPrice(order.billing.deliveryFeePaise)}</span>
              </div>
              <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                <span>Total</span>
                <span className="text-dark-green">
                  {formatPrice(order.billing.totalPaise)}
                </span>
              </div>
            </div>
          </div>

          {/* Special Instructions */}
          {order.specialInstructions && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-2">
                Special Instructions
              </h2>
              <p className="text-gray-600">{order.specialInstructions}</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer Info */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Customer</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <User className="h-4 w-4 text-gray-400" />
                <span>{order.user?.name || "Unknown"}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="text-sm">{order.user?.email || "-"}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-gray-400" />
                <span>{order.user?.phone || "-"}</span>
              </div>
            </div>
          </div>

          {/* Delivery Info */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Delivery</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Truck className="h-4 w-4 text-gray-400" />
                <span className="capitalize">{order.deliveryType}</span>
              </div>
              {order.address && (
                <div className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                  <span className="text-sm">{order.address}</span>
                </div>
              )}
            </div>
          </div>

          {/* Payment Info */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Payment</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <CreditCard className="h-4 w-4 text-gray-400" />
                <span className="capitalize">
                  {order.billing.paymentMethod?.replace(/-/g, " ") || "N/A"}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className="text-sm">
                  Updated: {formatDate(order.updatedAt)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
