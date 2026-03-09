"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import {
  Package,
  MapPin,
  Phone,
  Clock,
  IndianRupee,
  CheckCircle,
  Truck,
  ChefHat,
  Store,
  Home,
  X,
  Receipt,
  User,
} from "lucide-react";
import DashboardNavbar from "@/components/DashboardNavbar";
import { Button } from "@/components/ui/button";
import { cn, formatPrice } from "@/lib/utils";
import {
  trackingOrders,
  getActiveOrders,
  getCompletedOrders,
  getOrderStatusColor,
  getOrderStatusIcon,
  type OrderTracking,
} from "@/lib/orderTrackingData";
import { useLanguage } from "@/contexts/LanguageContext";

function OrderTrackingContent() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const orderIdParam = searchParams.get("orderId");

  const [selectedTab, setSelectedTab] = useState<"active" | "completed">(
    "active"
  );
  const [selectedOrder, setSelectedOrder] = useState<OrderTracking | null>(
    null
  );
  const [realOrders, setRealOrders] = useState<OrderTracking[]>([]);
  const [isLoadingReal, setIsLoadingReal] = useState(true);

  // Fetch real orders from database
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("auth_token");
        if (!token) {
          setIsLoadingReal(false);
          return;
        }

        const res = await fetch("/api/orders", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (data.success && data.data) {
          // Map DB orders to OrderTracking interface
          const mappedOrders: OrderTracking[] = data.data.map((order: any) => ({
            orderId: order._id,
            orderDate: new Date(order.placedAt || order.createdAt).toLocaleDateString("en-US", {
              day: "numeric",
              month: "short",
              year: "numeric",
            }),
            orderTime: new Date(order.placedAt || order.createdAt).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            }),
            status: order.status,
            estimatedDelivery: "45-60 mins", // Fallback
            deliveryAddress: order.address || "Self Pickup",
            items: order.items.map((item: any) => ({
              id: item._id || item.itemId,
              name: item.name,
              quantity: item.qty || item.quantity,
              price: item.pricePaise || 0,
            })),
            subtotal: order.billing.subTotalPaise,
            tax: order.billing.taxPaise,
            deliveryFee: order.billing.deliveryFeePaise,
            discount: order.billing.discountPaise || 0,
            total: order.billing.totalPaise,
            paymentMethod: order.billing.paymentMethod,
            timeline: order.timeline.map((t: any) => ({
              status: t.status,
              timestamp: new Date(t.at).toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
              }),
              message: t.label,
              completed: t.completed,
            })),
            specialInstructions: order.notes,
          }));
          setRealOrders(mappedOrders);
        }
      } catch (error) {
        console.error("Failed to fetch real orders:", error);
      } finally {
        setIsLoadingReal(false);
      }
    };

    fetchOrders();
  }, []);

  // Combine mock data with real data
  const allOrders = useMemo(() => {
    // Unique orders by ID
    const seen = new Set();
    const combined = [...realOrders, ...trackingOrders].filter(o => {
      if (seen.has(o.orderId)) return false;
      seen.add(o.orderId);
      return true;
    });
    return combined;
  }, [realOrders]);

  const activeOrders = allOrders.filter(
    (order) => order.status !== "delivered" && order.status !== "cancelled"
  );
  const completedOrders = allOrders.filter(
    (order) => order.status === "delivered" || order.status === "cancelled"
  );

  // Handle orderId from query parameter
  useEffect(() => {
    if (orderIdParam && allOrders.length > 0) {
      const order = allOrders.find((o) => o.orderId === orderIdParam);
      if (order) {
        setSelectedOrder(order);
        // Switch tab if needed
        if (order.status === "delivered" || order.status === "cancelled") {
          setSelectedTab("completed");
        } else {
          setSelectedTab("active");
        }
      }
    }
  }, [orderIdParam, allOrders]);

  const displayOrders =
    selectedTab === "active" ? activeOrders : completedOrders;

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      "order-placed": "Order Placed",
      confirmed: "Confirmed",
      preparing: "Preparing",
      ready: "Ready for Pickup",
      "out-for-delivery": "Out for Delivery",
      delivered: "Delivered",
      cancelled: "Cancelled",
    };
    return statusMap[status] || status;
  };

  return (
    <div className="min-h-screen bg-warm-beige">
      <DashboardNavbar
        title={t("page.orderTracking.title")}
        subtitle={t("page.orderTracking.subtitle")}
      />

      <div className="container mx-auto px-6 py-8 max-w-7xl">
        {/* Tab Switcher */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-2 mb-8 flex gap-2"
        >
          <Button
            onClick={() => setSelectedTab("active")}
            className={`flex-1 py-6 rounded-xl font-bold text-lg transition-all ${selectedTab === "active"
              ? "bg-gradient-to-r from-tomato-red to-saffron-yellow text-white"
              : "bg-transparent text-dark-green hover:bg-dark-green/5"
              }`}
          >
            <Truck className="w-5 h-5 mr-2" />
            Active Orders ({activeOrders.length})
          </Button>
          <Button
            onClick={() => setSelectedTab("completed")}
            className={`flex-1 py-6 rounded-xl font-bold text-lg transition-all ${selectedTab === "completed"
              ? "bg-gradient-to-r from-tomato-red to-saffron-yellow text-white"
              : "bg-transparent text-dark-green hover:bg-dark-green/5"
              }`}
          >
            <CheckCircle className="w-5 h-5 mr-2" />
            Completed ({completedOrders.length})
          </Button>
        </motion.div>

        {/* Orders List */}
        {displayOrders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <Package className="w-20 h-20 text-dark-green/30 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-dark-green mb-3">
              No {selectedTab === "active" ? "Active" : "Completed"} Orders
            </h3>
            <p className="text-dark-green/70 mb-6">
              {selectedTab === "active"
                ? "You don't have any active orders right now"
                : "Your completed orders will appear here"}
            </p>
            <Button className="bg-gradient-to-r from-tomato-red to-saffron-yellow text-white font-bold px-8 py-6 rounded-xl">
              Order Food Now
            </Button>
          </motion.div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-6">
            {displayOrders.map((order, index) => (
              <motion.div
                key={order.orderId}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all cursor-pointer"
                onClick={() => setSelectedOrder(order)}
              >
                {/* Order Header */}
                <div
                  className={`bg-gradient-to-r ${getOrderStatusColor(
                    order.status
                  )} p-6 text-white`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-4xl">
                        {getOrderStatusIcon(order.status)}
                      </span>
                      <div>
                        <h3 className="text-xl font-bold">{order.orderId}</h3>
                        <p className="text-white/80 text-sm">
                          {order.orderDate} • {order.orderTime}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-2xl font-bold">
                        {formatPrice(order.total)}
                      </div>
                    </div>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg inline-block">
                    <p className="font-bold text-sm uppercase tracking-wide">
                      {getStatusText(order.status)}
                    </p>
                  </div>
                </div>

                {/* Order Details */}
                <div className="p-6">
                  {/* Items Summary */}
                  <div className="mb-4">
                    <h4 className="text-dark-green font-bold mb-2 flex items-center gap-2">
                      <Package className="w-4 h-4" />
                      {order.items.length} Items
                    </h4>
                    <div className="space-y-1">
                      {order.items.slice(0, 2).map((item) => (
                        <p
                          key={item.id}
                          className="text-dark-green/80 text-sm flex justify-between"
                        >
                          <span>
                            {item.quantity}x {item.name}
                          </span>
                          <span className="font-semibold">{formatPrice(item.price)}</span>
                        </p>
                      ))}
                      {order.items.length > 2 && (
                        <p className="text-dark-green/60 text-sm">
                          +{order.items.length - 2} more items
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Delivery Info */}
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                    <p className="text-green-700 text-sm flex items-start gap-2">
                      <Clock className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>
                        {order.status === "delivered"
                          ? `Delivered on ${order.orderDate}`
                          : `Expected by ${order.estimatedDelivery}`}
                      </span>
                    </p>
                  </div>

                  {/* Delivery Person (if assigned) */}
                  {order.deliveryPerson &&
                    order.status === "out-for-delivery" && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                        <p className="text-blue-700 text-sm font-semibold mb-1">
                          Delivery Partner
                        </p>
                        <p className="text-blue-600 text-sm flex items-center gap-2">
                          <User className="w-4 h-4" />
                          {order.deliveryPerson.name}
                        </p>
                        <p className="text-blue-600 text-sm flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          {order.deliveryPerson.phone}
                        </p>
                      </div>
                    )}

                  <Button className="w-full bg-gradient-to-r from-dark-green to-green-600 text-white font-bold py-4 rounded-xl hover:shadow-lg transition-all">
                    View Full Details
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Order Detail Modal */}
        <AnimatePresence>
          {selectedOrder && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
              onClick={() => setSelectedOrder(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
              >
                {/* Modal Header */}
                <div
                  className={`bg-gradient-to-r ${getOrderStatusColor(
                    selectedOrder.status
                  )} p-6 text-white sticky top-0 z-10`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-5xl">
                        {getOrderStatusIcon(selectedOrder.status)}
                      </span>
                      <div>
                        <h2 className="text-2xl font-bold">
                          {selectedOrder.orderId}
                        </h2>
                        <p className="text-white/90">
                          {selectedOrder.orderDate} • {selectedOrder.orderTime}
                        </p>
                        <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-lg inline-block mt-2">
                          <p className="font-bold text-sm uppercase tracking-wide">
                            {getStatusText(selectedOrder.status)}
                          </p>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedOrder(null)}
                      className="text-white hover:bg-white/20 rounded-full p-2 transition-all"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  {/* Order Timeline */}
                  <div>
                    <h3 className="text-dark-green font-bold text-xl mb-4 flex items-center gap-2">
                      <Clock className="w-5 h-5" />
                      Order Timeline
                    </h3>
                    <div className="space-y-4">
                      {selectedOrder.timeline.map((step, index) => (
                        <div key={index} className="flex gap-4">
                          <div className="flex flex-col items-center">
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center ${step.completed
                                ? "bg-gradient-to-r from-green-500 to-green-600"
                                : "bg-gray-300"
                                }`}
                            >
                              {step.completed ? (
                                <CheckCircle className="w-5 h-5 text-white" />
                              ) : (
                                <Clock className="w-5 h-5 text-gray-600" />
                              )}
                            </div>
                            {index < selectedOrder.timeline.length - 1 && (
                              <div
                                className={`w-0.5 h-12 ${step.completed
                                  ? "bg-green-500"
                                  : "bg-gray-300"
                                  }`}
                              />
                            )}
                          </div>
                          <div className="flex-1 pb-8">
                            <p
                              className={`font-bold ${step.completed
                                ? "text-dark-green"
                                : "text-gray-500"
                                }`}
                            >
                              {step.message}
                            </p>
                            <p className="text-sm text-dark-green/60">
                              {step.timestamp}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Delivery Address */}
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <h4 className="text-dark-green font-bold mb-2 flex items-center gap-2">
                      <MapPin className="w-5 h-5" />
                      Delivery Address
                    </h4>
                    <p className="text-dark-green/80">
                      {selectedOrder.deliveryAddress}
                    </p>
                    {selectedOrder.specialInstructions && (
                      <p className="text-dark-green/60 text-sm mt-2 italic">
                        Note: {selectedOrder.specialInstructions}
                      </p>
                    )}
                  </div>

                  {/* Order Items */}
                  <div>
                    <h3 className="text-dark-green font-bold text-xl mb-4 flex items-center gap-2">
                      <Receipt className="w-5 h-5" />
                      Order Items
                    </h3>
                    <div className="space-y-3">
                      {selectedOrder.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex justify-between items-center p-3 bg-warm-beige rounded-lg"
                        >
                          <div>
                            <p className="font-semibold text-dark-green">
                              {item.name}
                            </p>
                            <p className="text-dark-green/60 text-sm">
                              Quantity: {item.quantity}
                              {item.customization && ` • ${item.customization}`}
                            </p>
                          </div>
                          <p className="font-bold text-dark-green">
                            {formatPrice(item.price)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Bill Summary */}
                  <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
                    <h4 className="text-dark-green font-bold mb-3">
                      Bill Summary
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between text-dark-green/80">
                        <span>Subtotal</span>
                        <span>{formatPrice(selectedOrder.subtotal)}</span>
                      </div>
                      <div className="flex justify-between text-dark-green/80">
                        <span>GST & Taxes</span>
                        <span>{formatPrice(selectedOrder.tax)}</span>
                      </div>
                      <div className="flex justify-between text-dark-green/80">
                        <span>Delivery Fee</span>
                        <span>{formatPrice(selectedOrder.deliveryFee)}</span>
                      </div>
                      {selectedOrder.discount > 0 && (
                        <div className="flex justify-between text-green-600 font-semibold">
                          <span>Discount (10%)</span>
                          <span>-{formatPrice(selectedOrder.discount)}</span>
                        </div>
                      )}
                      <div className="border-t-2 border-green-300 pt-2 mt-2">
                        <div className="flex justify-between text-dark-green font-bold text-lg">
                          <span>Total Paid</span>
                          <span className="flex items-center">
                            {formatPrice(selectedOrder.total)}
                          </span>
                        </div>
                        <p className="text-dark-green/60 text-xs mt-1">
                          via {selectedOrder.paymentMethod}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-4">
                    <Button
                      onClick={() => setSelectedOrder(null)}
                      className="flex-1 bg-gradient-to-r from-tomato-red to-saffron-yellow text-white font-bold py-6 rounded-xl hover:shadow-xl transition-all"
                    >
                      Close
                    </Button>
                    {selectedOrder.status === "delivered" && (
                      <Button className="flex-1 bg-gradient-to-r from-dark-green to-green-600 text-white font-bold py-6 rounded-xl hover:shadow-xl transition-all">
                        Reorder
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function OrderTrackingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-warm-beige flex items-center justify-center">
        <Package className="w-8 h-8 animate-spin text-tomato-red" />
      </div>
    }>
      <OrderTrackingContent />
    </Suspense>
  );
}
