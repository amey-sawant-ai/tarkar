"use client";

import { useState, useEffect, use } from "react";
import { motion } from "motion/react";
import {
  Calendar,
  Clock,
  Users,
  MapPin,
  Phone,
  Mail,
  ArrowLeft,
  Loader2,
  CheckCircle,
  XCircle,
  AlertCircle,
  MessageSquare,
  IndianRupee,
  Save,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";

interface PartyOrderItem {
  packageId: number;
  packageName: string;
  quantity: number;
  pricePaise: number;
  servings: string;
  category: string;
  items: string[];
}

interface TimelineStep {
  status: string;
  label: string;
  at: string;
  completed: boolean;
}

interface PartyOrder {
  id: string;
  userId: string;
  status: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  eventDate: string;
  eventTime: string;
  guestCount: number;
  venue: string;
  specialRequests: string;
  packages: PartyOrderItem[];
  billing: {
    subTotalPaise: number;
    taxPaise: number;
    totalPaise: number;
  };
  timeline: TimelineStep[];
  adminNotes: string;
  cancelledAt?: string;
  cancellationReason?: string;
  placedAt: string;
  createdAt: string;
}

export default function AdminPartyOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { token } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();

  const [order, setOrder] = useState<PartyOrder | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [adminNotes, setAdminNotes] = useState("");
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    async function fetchOrder() {
      if (!token) return;
      try {
        const res = await fetch(`/api/admin/party-orders/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success) {
          setOrder(data.data);
          setAdminNotes(data.data.adminNotes || "");
        } else {
          showToast(data.error || "Failed to fetch order", "error");
          router.push("/admin/party-orders");
        }
      } catch {
        showToast("Something went wrong", "error");
      } finally {
        setIsLoading(false);
      }
    }
    fetchOrder();
  }, [token, id, router, showToast]);

  const handleUpdateStatus = async (newStatus: string) => {
    if (!token || !order) return;
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/admin/party-orders/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        showToast("Status updated successfully", "success");
        setOrder((prev) =>
          prev
            ? {
                ...prev,
                status: newStatus,
                timeline: data.data.timeline,
              }
            : null,
        );
      } else {
        showToast(data.error || "Failed to update status", "error");
      }
    } catch {
      showToast("Something went wrong", "error");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSaveNotes = async () => {
    if (!token || !order) return;
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/admin/party-orders/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ adminNotes }),
      });
      const data = await res.json();
      if (data.success) {
        showToast("Notes saved successfully", "success");
      } else {
        showToast(data.error || "Failed to save notes", "error");
      }
    } catch {
      showToast("Something went wrong", "error");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!token || !order || !cancelReason.trim()) return;
    setIsCancelling(true);
    try {
      const res = await fetch(`/api/admin/party-orders/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: "cancelled",
          cancellationReason: cancelReason,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast("Order cancelled successfully", "success");
        setShowCancelModal(false);
        setOrder((prev) =>
          prev
            ? {
                ...prev,
                status: "cancelled",
                timeline: data.data.timeline,
                cancellationReason: cancelReason,
                cancelledAt: new Date().toISOString(),
              }
            : null,
        );
      } else {
        showToast(data.error || "Failed to cancel order", "error");
      }
    } catch {
      showToast("Something went wrong", "error");
    } finally {
      setIsCancelling(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-blue-100 text-blue-800",
      preparing: "bg-purple-100 text-purple-800",
      ready: "bg-green-100 text-green-800",
      delivered: "bg-emerald-100 text-emerald-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getNextStatus = (currentStatus: string): string | null => {
    const flow: Record<string, string> = {
      pending: "confirmed",
      confirmed: "preparing",
      preparing: "ready",
      ready: "delivered",
    };
    return flow[currentStatus] || null;
  };

  const formatPrice = (paise: number) => {
    return `₹${(paise / 100).toLocaleString("en-IN")}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-dark-green" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-6">
        <div className="text-center py-20">
          <AlertCircle className="w-20 h-20 text-dark-green/30 mx-auto mb-6" />
          <h3 className="text-2xl font-bold text-dark-green mb-3">
            Order Not Found
          </h3>
          <Link href="/admin/party-orders">
            <Button className="bg-dark-green text-white">
              Back to Party Orders
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const nextStatus = getNextStatus(order.status);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/party-orders">
            <Button variant="outline" className="border-dark-green/30">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-dark-green">
              Party Order #{order.id.slice(-8).toUpperCase()}
            </h1>
            <p className="text-dark-green/70">
              Placed on {formatDateTime(order.placedAt)}
            </p>
          </div>
        </div>
        <span
          className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(
            order.status,
          )}`}
        >
          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
        </span>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <h2 className="text-lg font-bold text-dark-green mb-4">
              Customer Information
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-dark-green/10 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-dark-green" />
                </div>
                <div>
                  <p className="text-xs text-dark-green/60">Name</p>
                  <p className="font-medium text-dark-green">
                    {order.customerName}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-dark-green/10 rounded-full flex items-center justify-center">
                  <Phone className="w-5 h-5 text-dark-green" />
                </div>
                <div>
                  <p className="text-xs text-dark-green/60">Phone</p>
                  <a
                    href={`tel:${order.customerPhone}`}
                    className="font-medium text-dark-green hover:text-tomato-red"
                  >
                    {order.customerPhone}
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-dark-green/10 rounded-full flex items-center justify-center">
                  <Mail className="w-5 h-5 text-dark-green" />
                </div>
                <div>
                  <p className="text-xs text-dark-green/60">Email</p>
                  <a
                    href={`mailto:${order.customerEmail}`}
                    className="font-medium text-dark-green hover:text-tomato-red"
                  >
                    {order.customerEmail}
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-dark-green/10 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-dark-green" />
                </div>
                <div>
                  <p className="text-xs text-dark-green/60">Guest Count</p>
                  <p className="font-medium text-dark-green">
                    {order.guestCount} guests
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Event Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <h2 className="text-lg font-bold text-dark-green mb-4">
              Event Details
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-saffron-yellow/20 rounded-full flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-saffron-yellow" />
                </div>
                <div>
                  <p className="text-xs text-dark-green/60">Event Date</p>
                  <p className="font-medium text-dark-green">
                    {formatDate(order.eventDate)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-saffron-yellow/20 rounded-full flex items-center justify-center">
                  <Clock className="w-5 h-5 text-saffron-yellow" />
                </div>
                <div>
                  <p className="text-xs text-dark-green/60">Event Time</p>
                  <p className="font-medium text-dark-green">
                    {order.eventTime}
                  </p>
                </div>
              </div>
              <div className="md:col-span-2 flex items-start gap-3">
                <div className="w-10 h-10 bg-saffron-yellow/20 rounded-full flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-saffron-yellow" />
                </div>
                <div>
                  <p className="text-xs text-dark-green/60">Venue</p>
                  <p className="font-medium text-dark-green">{order.venue}</p>
                </div>
              </div>
              {order.specialRequests && (
                <div className="md:col-span-2 bg-dark-green/5 rounded-xl p-4">
                  <p className="text-xs text-dark-green/60 mb-1">
                    Special Requests
                  </p>
                  <p className="text-dark-green">{order.specialRequests}</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Packages */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <h2 className="text-lg font-bold text-dark-green mb-4">
              Ordered Packages
            </h2>
            <div className="space-y-4">
              {order.packages.map((pkg, idx) => (
                <div
                  key={idx}
                  className="border border-dark-green/10 rounded-xl p-4"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-dark-green">
                        {pkg.packageName}
                      </h3>
                      <p className="text-sm text-dark-green/60">
                        {pkg.servings} × {pkg.quantity}
                      </p>
                    </div>
                    <p className="font-bold text-dark-green">
                      {formatPrice(pkg.pricePaise * pkg.quantity)}
                    </p>
                  </div>
                  <div className="bg-dark-green/5 rounded-lg p-3">
                    <p className="text-xs text-dark-green/60 mb-2">
                      Items Included:
                    </p>
                    <ul className="text-sm text-dark-green/80 space-y-1">
                      {pkg.items.map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-tomato-red">•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Admin Notes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-dark-green flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Admin Notes
              </h2>
              <Button
                onClick={handleSaveNotes}
                disabled={isUpdating}
                size="sm"
                className="bg-dark-green text-white"
              >
                {isUpdating ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-1" />
                    Save
                  </>
                )}
              </Button>
            </div>
            <textarea
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              rows={4}
              placeholder="Add internal notes about this order..."
              className="w-full px-4 py-3 rounded-xl border border-dark-green/20 focus:border-dark-green focus:outline-none resize-none"
            />
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Billing */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <h2 className="text-lg font-bold text-dark-green mb-4 flex items-center gap-2">
              <IndianRupee className="w-5 h-5" />
              Billing
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-dark-green/70">Subtotal</span>
                <span className="text-dark-green">
                  {formatPrice(order.billing.subTotalPaise)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-dark-green/70">Tax (5%)</span>
                <span className="text-dark-green">
                  {formatPrice(order.billing.taxPaise)}
                </span>
              </div>
              <div className="border-t border-dark-green/10 pt-3 flex justify-between">
                <span className="font-bold text-dark-green">Total</span>
                <span className="font-bold text-dark-green text-lg">
                  {formatPrice(order.billing.totalPaise)}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Status Actions */}
          {order.status !== "cancelled" && order.status !== "delivered" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <h2 className="text-lg font-bold text-dark-green mb-4">
                Update Status
              </h2>
              <div className="space-y-3">
                {nextStatus && (
                  <Button
                    onClick={() => handleUpdateStatus(nextStatus)}
                    disabled={isUpdating}
                    className="w-full bg-linear-to-r from-dark-green to-teal-600 text-white"
                  >
                    {isUpdating ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <CheckCircle className="w-4 h-4 mr-2" />
                    )}
                    Mark as{" "}
                    {nextStatus.charAt(0).toUpperCase() + nextStatus.slice(1)}
                  </Button>
                )}
                <Button
                  onClick={() => setShowCancelModal(true)}
                  variant="outline"
                  className="w-full border-red-300 text-red-600 hover:bg-red-50"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Cancel Order
                </Button>
              </div>
            </motion.div>
          )}

          {/* Cancellation Info */}
          {order.status === "cancelled" && order.cancellationReason && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 rounded-2xl p-6 border border-red-200"
            >
              <h2 className="text-lg font-bold text-red-800 mb-2 flex items-center gap-2">
                <XCircle className="w-5 h-5" />
                Cancelled
              </h2>
              <p className="text-sm text-red-700 mb-2">
                <span className="font-semibold">Reason:</span>{" "}
                {order.cancellationReason}
              </p>
              {order.cancelledAt && (
                <p className="text-xs text-red-600">
                  Cancelled on {formatDateTime(order.cancelledAt)}
                </p>
              )}
            </motion.div>
          )}

          {/* Timeline */}
          {order.timeline.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <h2 className="text-lg font-bold text-dark-green mb-4">
                Order Timeline
              </h2>
              <div className="space-y-4">
                {order.timeline.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                        step.completed
                          ? "bg-green-100 text-green-600"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      {step.completed ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <div className="w-3 h-3 rounded-full border-2 border-current" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-dark-green text-sm">
                        {step.label}
                      </p>
                      <p className="text-xs text-dark-green/60">
                        {formatDateTime(step.at)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
          >
            <h2 className="text-xl font-bold text-dark-green mb-4 flex items-center gap-2">
              <XCircle className="w-6 h-6 text-red-500" />
              Cancel Party Order
            </h2>
            <p className="text-dark-green/70 mb-4">
              Are you sure you want to cancel this party order? This action
              cannot be undone.
            </p>
            <div className="mb-4">
              <label className="block text-sm font-semibold text-dark-green mb-2">
                Cancellation Reason *
              </label>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                rows={3}
                placeholder="Enter reason for cancellation..."
                className="w-full px-4 py-3 rounded-xl border border-dark-green/20 focus:border-red-500 focus:outline-none resize-none"
              />
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => setShowCancelModal(false)}
                variant="outline"
                className="flex-1 border-dark-green/30"
              >
                Keep Order
              </Button>
              <Button
                onClick={handleCancelOrder}
                disabled={isCancelling || !cancelReason.trim()}
                className="flex-1 bg-red-600 text-white hover:bg-red-700"
              >
                {isCancelling ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Cancelling...
                  </>
                ) : (
                  "Confirm Cancel"
                )}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
