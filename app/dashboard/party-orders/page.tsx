"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Users,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Clock,
  ShoppingCart,
  CheckCircle,
  IndianRupee,
  ChefHat,
  Sparkles,
  Package,
  Filter,
  Star,
  List,
  Plus,
  Loader2,
  XCircle,
  AlertCircle,
  Eye,
} from "lucide-react";
import DashboardNavbar from "@/components/DashboardNavbar";
import { Button } from "@/components/ui/button";
import {
  partyPackages,
  getPackagesByCategory,
  categories,
  type PartyPackage,
} from "@/lib/partyOrdersData";
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

interface PartyOrder {
  id: string;
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
  timeline: {
    status: string;
    label: string;
    at: string;
    completed: boolean;
  }[];
  placedAt: string;
}

export default function PartyOrdersPage() {
  const { token, user } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<"packages" | "my-orders">(
    "packages",
  );
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedPackage, setSelectedPackage] = useState<PartyPackage | null>(
    null,
  );
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [bookingData, setBookingData] = useState({
    name: "",
    phone: "",
    email: "",
    eventDate: "",
    eventTime: "",
    guests: "",
    venue: "",
    specialRequests: "",
    quantity: 1,
  });

  // My orders state
  const [myOrders, setMyOrders] = useState<PartyOrder[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [orderFilter, setOrderFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<PartyOrder | null>(null);
  const [showOrderDetail, setShowOrderDetail] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const filteredPackages =
    selectedCategory === "all"
      ? partyPackages
      : getPackagesByCategory(selectedCategory as PartyPackage["category"]);

  const fetchMyOrders = useCallback(async () => {
    if (!token) return;
    setIsLoadingOrders(true);
    try {
      const res = await fetch(
        `/api/party-orders?status=${orderFilter}&pageSize=50`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const data = await res.json();
      if (data.success) {
        setMyOrders(data.data);
      }
    } catch (error) {
      console.error("Error fetching party orders:", error);
    } finally {
      setIsLoadingOrders(false);
    }
  }, [token, orderFilter]);

  useEffect(() => {
    if (activeTab === "my-orders") {
      fetchMyOrders();
    }
  }, [activeTab, orderFilter, fetchMyOrders]);

  // Pre-fill user data
  useEffect(() => {
    if (user) {
      setBookingData((prev) => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      }));
    }
  }, [user]);

  const handleBookPackage = (pkg: PartyPackage) => {
    setSelectedPackage(pkg);
    setBookingData((prev) => ({
      ...prev,
      quantity: pkg.minOrder,
    }));
    setShowBookingForm(true);
  };

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPackage || !token) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/party-orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          customerName: bookingData.name,
          customerPhone: bookingData.phone,
          customerEmail: bookingData.email,
          eventDate: bookingData.eventDate,
          eventTime: bookingData.eventTime,
          guestCount: parseInt(bookingData.guests),
          venue: bookingData.venue,
          specialRequests: bookingData.specialRequests,
          packages: [
            {
              packageId: selectedPackage.id,
              packageName: selectedPackage.name,
              quantity: bookingData.quantity,
              pricePaise: selectedPackage.price * 100,
              servings: selectedPackage.servings,
              category: selectedPackage.category,
              items: selectedPackage.items,
            },
          ],
        }),
      });

      const data = await res.json();

      if (data.success) {
        setIsSubmitted(true);
        showToast("Party order placed successfully!", "success");
        setTimeout(() => {
          setIsSubmitted(false);
          setShowBookingForm(false);
          setSelectedPackage(null);
          setBookingData({
            name: user?.name || "",
            phone: user?.phone || "",
            email: user?.email || "",
            eventDate: "",
            eventTime: "",
            guests: "",
            venue: "",
            specialRequests: "",
            quantity: 1,
          });
        }, 3000);
      } else {
        showToast(data.error || "Failed to place order", "error");
      }
    } catch {
      showToast("Something went wrong", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    if (!token) return;
    setIsCancelling(true);
    try {
      const res = await fetch(`/api/party-orders/${orderId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        showToast("Party order cancelled successfully", "success");
        setShowOrderDetail(false);
        fetchMyOrders();
      } else {
        showToast(data.error || "Failed to cancel order", "error");
      }
    } catch {
      showToast("Something went wrong", "error");
    } finally {
      setIsCancelling(false);
    }
  };

  const getCategoryColor = (category: PartyPackage["category"]) => {
    const colors = {
      breakfast: "from-orange-400 to-yellow-500",
      lunch: "from-green-500 to-teal-600",
      dinner: "from-purple-500 to-pink-600",
      snacks: "from-red-500 to-orange-600",
      dessert: "from-pink-500 to-rose-600",
    };
    return colors[category] || "from-dark-green to-tomato-red";
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

  return (
    <div className="min-h-screen bg-warm-beige">
      <DashboardNavbar
        title="Party Orders & Catering"
        subtitle="Book bulk orders for events, parties & celebrations"
      />

      <div className="container mx-auto px-6 py-8 max-w-7xl">
        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          <Button
            onClick={() => setActiveTab("packages")}
            variant={activeTab === "packages" ? "default" : "outline"}
            className={`${
              activeTab === "packages"
                ? "bg-linear-to-r from-tomato-red to-saffron-yellow text-white"
                : "border-dark-green/30 text-dark-green"
            } px-6 py-3 rounded-xl font-semibold`}
          >
            <Package className="w-5 h-5 mr-2" />
            Browse Packages
          </Button>
          <Button
            onClick={() => setActiveTab("my-orders")}
            variant={activeTab === "my-orders" ? "default" : "outline"}
            className={`${
              activeTab === "my-orders"
                ? "bg-linear-to-r from-tomato-red to-saffron-yellow text-white"
                : "border-dark-green/30 text-dark-green"
            } px-6 py-3 rounded-xl font-semibold`}
          >
            <List className="w-5 h-5 mr-2" />
            My Party Orders
          </Button>
        </div>

        {activeTab === "packages" ? (
          <>
            {/* Info Banner */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-linear-to-r from-tomato-red to-saffron-yellow rounded-2xl p-6 mb-8 text-white"
            >
              <div className="flex items-start gap-4">
                <ChefHat className="w-8 h-8 shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold mb-2">
                    Bulk Orders & Party Catering
                  </h3>
                  <p className="text-white/90 mb-3">
                    Perfect for birthdays, corporate events, festivals, and
                    family gatherings. Minimum 10 people for most packages.
                  </p>
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>Order 24 hours in advance</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      <span>Call: +91 98765 43210</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      <span>Customization available</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Category Filters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg p-6 mb-8"
            >
              <div className="flex items-center gap-3 mb-4">
                <Filter className="w-5 h-5 text-dark-green" />
                <h3 className="text-lg font-bold text-dark-green">
                  Filter by Category
                </h3>
              </div>
              <div className="flex flex-wrap gap-3">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    variant={
                      selectedCategory === category.id ? "default" : "outline"
                    }
                    className={`${
                      selectedCategory === category.id
                        ? "bg-linear-to-r from-tomato-red to-saffron-yellow text-white"
                        : "border-dark-green/30 text-dark-green hover:bg-dark-green/5"
                    } px-6 py-3 rounded-xl font-semibold transition-all`}
                  >
                    <span className="mr-2">{category.icon}</span>
                    {category.label}
                  </Button>
                ))}
              </div>
            </motion.div>

            {/* Packages Grid */}
            {filteredPackages.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <Package className="w-20 h-20 text-dark-green/30 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-dark-green mb-3">
                  No Packages Found
                </h3>
                <p className="text-dark-green/70">
                  Try selecting a different category!
                </p>
              </motion.div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {filteredPackages.map((pkg, index) => (
                  <motion.div
                    key={pkg.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all overflow-hidden group"
                  >
                    {/* Package Header */}
                    <div
                      className={`bg-linear-to-r ${getCategoryColor(
                        pkg.category,
                      )} p-6 relative overflow-hidden`}
                    >
                      <div className="absolute top-0 right-0 text-8xl opacity-10">
                        {pkg.image}
                      </div>
                      <div className="relative z-10">
                        <div className="flex items-center justify-between mb-3">
                          <span className="bg-white/30 backdrop-blur-sm px-3 py-1 rounded-full text-white text-xs font-semibold uppercase tracking-wide">
                            {pkg.category}
                          </span>
                          {pkg.popular && (
                            <span className="bg-saffron-yellow text-dark-green px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                              <Star className="w-3 h-3 fill-current" />
                              Popular
                            </span>
                          )}
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">
                          {pkg.name}
                        </h3>
                        <p className="text-white/90 text-sm mb-3">
                          {pkg.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                            <div className="flex items-center gap-1 text-white font-bold text-xl">
                              <IndianRupee className="w-5 h-5" />
                              {pkg.price}
                            </div>
                            <p className="text-white/80 text-xs">
                              {pkg.servings}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-white/80 text-xs">
                              Minimum Order
                            </p>
                            <p className="text-white font-bold">
                              {pkg.minOrder}{" "}
                              {pkg.minOrder === 1 ? "pack" : "packs"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Package Details */}
                    <div className="p-6">
                      <div className="mb-4">
                        <h4 className="text-dark-green font-bold mb-3 flex items-center gap-2">
                          <Package className="w-4 h-4" />
                          What&apos;s Included:
                        </h4>
                        <ul className="space-y-2">
                          {pkg.items.slice(0, 5).map((item, idx) => (
                            <li
                              key={idx}
                              className="text-dark-green/80 text-sm flex items-start gap-2"
                            >
                              <span className="text-tomato-red mt-1">•</span>
                              <span>{item}</span>
                            </li>
                          ))}
                          {pkg.items.length > 5 && (
                            <li className="text-dark-green/60 text-sm pl-4">
                              +{pkg.items.length - 5} more items
                            </li>
                          )}
                        </ul>
                      </div>

                      {pkg.customizable && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                          <p className="text-green-700 text-sm flex items-center gap-2">
                            <Sparkles className="w-4 h-4" />
                            Customization available on request
                          </p>
                        </div>
                      )}

                      <Button
                        onClick={() => handleBookPackage(pkg)}
                        className="w-full bg-linear-to-r from-tomato-red to-saffron-yellow text-white font-bold py-6 rounded-xl hover:shadow-xl hover:scale-105 transition-all"
                      >
                        <ShoppingCart className="w-5 h-5 mr-2" />
                        Book This Package
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </>
        ) : (
          /* My Orders Tab */
          <div>
            {/* Filter */}
            <div className="bg-white rounded-2xl shadow-lg p-4 mb-6">
              <div className="flex flex-wrap gap-2">
                {[
                  "all",
                  "pending",
                  "confirmed",
                  "preparing",
                  "ready",
                  "delivered",
                  "cancelled",
                ].map((status) => (
                  <Button
                    key={status}
                    onClick={() => setOrderFilter(status)}
                    variant={orderFilter === status ? "default" : "outline"}
                    size="sm"
                    className={
                      orderFilter === status
                        ? "bg-dark-green text-white"
                        : "border-dark-green/30 text-dark-green"
                    }
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </Button>
                ))}
              </div>
            </div>

            {isLoadingOrders ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-dark-green" />
              </div>
            ) : myOrders.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl shadow-lg">
                <Package className="w-20 h-20 text-dark-green/30 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-dark-green mb-3">
                  No Party Orders Yet
                </h3>
                <p className="text-dark-green/70 mb-6">
                  Book your first party package for your next event!
                </p>
                <Button
                  onClick={() => setActiveTab("packages")}
                  className="bg-linear-to-r from-tomato-red to-saffron-yellow text-white font-bold px-8 py-3 rounded-xl"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Browse Packages
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {myOrders.map((order, index) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white rounded-2xl shadow-lg p-6"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                              order.status,
                            )}`}
                          >
                            {order.status.charAt(0).toUpperCase() +
                              order.status.slice(1)}
                          </span>
                          <span className="text-dark-green/60 text-sm">
                            #{order.id.slice(-8).toUpperCase()}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-dark-green mb-1">
                          {order.packages[0]?.packageName}
                          {order.packages.length > 1 &&
                            ` +${order.packages.length - 1} more`}
                        </h3>
                        <div className="flex flex-wrap gap-4 text-sm text-dark-green/70">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {formatDate(order.eventDate)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {order.eventTime}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {order.guestCount} guests
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-dark-green/60 text-sm">Total</p>
                          <p className="text-xl font-bold text-dark-green">
                            {formatPrice(order.billing.totalPaise)}
                          </p>
                        </div>
                        <Button
                          onClick={() => {
                            setSelectedOrder(order);
                            setShowOrderDetail(true);
                          }}
                          variant="outline"
                          className="border-dark-green/30 text-dark-green"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Booking Form Modal */}
        <AnimatePresence>
          {showBookingForm && selectedPackage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
              onClick={() =>
                !isSubmitting && !isSubmitted && setShowBookingForm(false)
              }
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              >
                {isSubmitted ? (
                  <div className="p-12 text-center">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle className="w-12 h-12 text-green-600" />
                    </div>
                    <h2 className="text-3xl font-bold text-dark-green mb-4">
                      Booking Submitted!
                    </h2>
                    <p className="text-dark-green/70 mb-2">
                      Thank you for your party order request.
                    </p>
                    <p className="text-dark-green/70">
                      Our team will contact you within 24 hours to confirm
                      details.
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Form Header */}
                    <div
                      className={`bg-linear-to-r ${getCategoryColor(
                        selectedPackage.category,
                      )} p-6 text-white`}
                    >
                      <h2 className="text-2xl font-bold mb-2">
                        Book {selectedPackage.name}
                      </h2>
                      <p className="text-white/90 mb-3">
                        {selectedPackage.description}
                      </p>
                      <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                        <IndianRupee className="w-5 h-5" />
                        <span className="font-bold text-xl">
                          {selectedPackage.price}
                        </span>
                        <span className="text-white/80">
                          / {selectedPackage.servings}
                        </span>
                      </div>
                    </div>

                    {/* Form Content */}
                    <form
                      onSubmit={handleSubmitBooking}
                      className="p-6 space-y-6"
                    >
                      {/* Personal Details */}
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-dark-green font-semibold mb-2">
                            <Users className="w-4 h-4 inline mr-2" />
                            Your Name *
                          </label>
                          <input
                            type="text"
                            required
                            value={bookingData.name}
                            onChange={(e) =>
                              setBookingData({
                                ...bookingData,
                                name: e.target.value,
                              })
                            }
                            className="w-full px-4 py-3 rounded-xl border-2 border-dark-green/20 focus:border-tomato-red focus:outline-none transition-all"
                            placeholder="John Doe"
                          />
                        </div>
                        <div>
                          <label className="block text-dark-green font-semibold mb-2">
                            <Phone className="w-4 h-4 inline mr-2" />
                            Phone Number *
                          </label>
                          <input
                            type="tel"
                            required
                            value={bookingData.phone}
                            onChange={(e) =>
                              setBookingData({
                                ...bookingData,
                                phone: e.target.value,
                              })
                            }
                            className="w-full px-4 py-3 rounded-xl border-2 border-dark-green/20 focus:border-tomato-red focus:outline-none transition-all"
                            placeholder="+91 98765 43210"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-dark-green font-semibold mb-2">
                          <Mail className="w-4 h-4 inline mr-2" />
                          Email Address *
                        </label>
                        <input
                          type="email"
                          required
                          value={bookingData.email}
                          onChange={(e) =>
                            setBookingData({
                              ...bookingData,
                              email: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 rounded-xl border-2 border-dark-green/20 focus:border-tomato-red focus:outline-none transition-all"
                          placeholder="john@example.com"
                        />
                      </div>

                      {/* Event Details */}
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-dark-green font-semibold mb-2">
                            <Calendar className="w-4 h-4 inline mr-2" />
                            Event Date *
                          </label>
                          <input
                            type="date"
                            required
                            value={bookingData.eventDate}
                            onChange={(e) =>
                              setBookingData({
                                ...bookingData,
                                eventDate: e.target.value,
                              })
                            }
                            min={new Date().toISOString().split("T")[0]}
                            className="w-full px-4 py-3 rounded-xl border-2 border-dark-green/20 focus:border-tomato-red focus:outline-none transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-dark-green font-semibold mb-2">
                            <Clock className="w-4 h-4 inline mr-2" />
                            Event Time *
                          </label>
                          <input
                            type="time"
                            required
                            value={bookingData.eventTime}
                            onChange={(e) =>
                              setBookingData({
                                ...bookingData,
                                eventTime: e.target.value,
                              })
                            }
                            className="w-full px-4 py-3 rounded-xl border-2 border-dark-green/20 focus:border-tomato-red focus:outline-none transition-all"
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-dark-green font-semibold mb-2">
                            <Users className="w-4 h-4 inline mr-2" />
                            Number of Guests *
                          </label>
                          <input
                            type="number"
                            required
                            min={selectedPackage.minOrder}
                            value={bookingData.guests}
                            onChange={(e) =>
                              setBookingData({
                                ...bookingData,
                                guests: e.target.value,
                              })
                            }
                            className="w-full px-4 py-3 rounded-xl border-2 border-dark-green/20 focus:border-tomato-red focus:outline-none transition-all"
                            placeholder={`Minimum ${selectedPackage.minOrder}`}
                          />
                        </div>
                        <div>
                          <label className="block text-dark-green font-semibold mb-2">
                            <Package className="w-4 h-4 inline mr-2" />
                            Quantity *
                          </label>
                          <input
                            type="number"
                            required
                            min={selectedPackage.minOrder}
                            value={bookingData.quantity}
                            onChange={(e) =>
                              setBookingData({
                                ...bookingData,
                                quantity: parseInt(e.target.value) || 1,
                              })
                            }
                            className="w-full px-4 py-3 rounded-xl border-2 border-dark-green/20 focus:border-tomato-red focus:outline-none transition-all"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-dark-green font-semibold mb-2">
                          <MapPin className="w-4 h-4 inline mr-2" />
                          Venue/Delivery Address *
                        </label>
                        <input
                          type="text"
                          required
                          value={bookingData.venue}
                          onChange={(e) =>
                            setBookingData({
                              ...bookingData,
                              venue: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 rounded-xl border-2 border-dark-green/20 focus:border-tomato-red focus:outline-none transition-all"
                          placeholder="Enter venue or delivery address"
                        />
                      </div>

                      <div>
                        <label className="block text-dark-green font-semibold mb-2">
                          Special Requests (Optional)
                        </label>
                        <textarea
                          rows={4}
                          value={bookingData.specialRequests}
                          onChange={(e) =>
                            setBookingData({
                              ...bookingData,
                              specialRequests: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 rounded-xl border-2 border-dark-green/20 focus:border-tomato-red focus:outline-none transition-all resize-none"
                          placeholder="Any dietary preferences, customizations, or special requirements..."
                        ></textarea>
                      </div>

                      {/* Price Summary */}
                      <div className="bg-dark-green/5 rounded-xl p-4">
                        <h4 className="font-bold text-dark-green mb-3">
                          Order Summary
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-dark-green/70">
                              {selectedPackage.name} x {bookingData.quantity}
                            </span>
                            <span className="font-semibold text-dark-green">
                              ₹
                              {(
                                selectedPackage.price * bookingData.quantity
                              ).toLocaleString("en-IN")}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-dark-green/70">Tax (5%)</span>
                            <span className="font-semibold text-dark-green">
                              ₹
                              {(
                                selectedPackage.price *
                                bookingData.quantity *
                                0.05
                              ).toLocaleString("en-IN")}
                            </span>
                          </div>
                          <div className="border-t border-dark-green/20 pt-2 flex justify-between">
                            <span className="font-bold text-dark-green">
                              Total
                            </span>
                            <span className="font-bold text-dark-green text-lg">
                              ₹
                              {(
                                selectedPackage.price *
                                bookingData.quantity *
                                1.05
                              ).toLocaleString("en-IN")}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-4">
                        <Button
                          type="button"
                          onClick={() => setShowBookingForm(false)}
                          variant="outline"
                          disabled={isSubmitting}
                          className="flex-1 border-2 border-dark-green/30 text-dark-green hover:bg-dark-green/5 py-6 rounded-xl font-bold"
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          disabled={isSubmitting}
                          className="flex-1 bg-linear-to-r from-tomato-red to-saffron-yellow text-white font-bold py-6 rounded-xl hover:shadow-xl transition-all"
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                              Submitting...
                            </>
                          ) : (
                            "Confirm Booking"
                          )}
                        </Button>
                      </div>

                      <p className="text-dark-green/60 text-sm text-center">
                        Our team will contact you within 24 hours to confirm
                        your order and discuss payment details.
                      </p>
                    </form>
                  </>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Order Detail Modal */}
        <AnimatePresence>
          {showOrderDetail && selectedOrder && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
              onClick={() => setShowOrderDetail(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-dark-green">
                        Order Details
                      </h2>
                      <p className="text-dark-green/60 text-sm">
                        #{selectedOrder.id.slice(-8).toUpperCase()}
                      </p>
                    </div>
                    <span
                      className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(
                        selectedOrder.status,
                      )}`}
                    >
                      {selectedOrder.status.charAt(0).toUpperCase() +
                        selectedOrder.status.slice(1)}
                    </span>
                  </div>

                  {/* Event Info */}
                  <div className="bg-dark-green/5 rounded-xl p-4 mb-6">
                    <h3 className="font-bold text-dark-green mb-3">
                      Event Information
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-dark-green/60" />
                        <span>{formatDate(selectedOrder.eventDate)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-dark-green/60" />
                        <span>{selectedOrder.eventTime}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-dark-green/60" />
                        <span>{selectedOrder.guestCount} guests</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-dark-green/60" />
                        <span>{selectedOrder.venue}</span>
                      </div>
                    </div>
                    {selectedOrder.specialRequests && (
                      <div className="mt-3 pt-3 border-t border-dark-green/10">
                        <p className="text-dark-green/70 text-sm">
                          <span className="font-semibold">
                            Special Requests:
                          </span>{" "}
                          {selectedOrder.specialRequests}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Packages */}
                  <div className="mb-6">
                    <h3 className="font-bold text-dark-green mb-3">
                      Ordered Packages
                    </h3>
                    {selectedOrder.packages.map((pkg, idx) => (
                      <div
                        key={idx}
                        className="bg-white border border-dark-green/10 rounded-xl p-4 mb-2"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold text-dark-green">
                              {pkg.packageName}
                            </h4>
                            <p className="text-dark-green/60 text-sm">
                              {pkg.servings} × {pkg.quantity}
                            </p>
                          </div>
                          <p className="font-bold text-dark-green">
                            {formatPrice(pkg.pricePaise * pkg.quantity)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Billing */}
                  <div className="bg-dark-green/5 rounded-xl p-4 mb-6">
                    <h3 className="font-bold text-dark-green mb-3">
                      Billing Details
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-dark-green/70">Subtotal</span>
                        <span>
                          {formatPrice(selectedOrder.billing.subTotalPaise)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-dark-green/70">Tax</span>
                        <span>
                          {formatPrice(selectedOrder.billing.taxPaise)}
                        </span>
                      </div>
                      <div className="border-t border-dark-green/20 pt-2 flex justify-between">
                        <span className="font-bold text-dark-green">Total</span>
                        <span className="font-bold text-dark-green text-lg">
                          {formatPrice(selectedOrder.billing.totalPaise)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Timeline */}
                  {selectedOrder.timeline.length > 0 && (
                    <div className="mb-6">
                      <h3 className="font-bold text-dark-green mb-3">
                        Order Timeline
                      </h3>
                      <div className="space-y-3">
                        {selectedOrder.timeline.map((step, idx) => (
                          <div key={idx} className="flex items-center gap-3">
                            {step.completed ? (
                              <CheckCircle className="w-5 h-5 text-green-600" />
                            ) : (
                              <div className="w-5 h-5 rounded-full border-2 border-dark-green/30" />
                            )}
                            <div className="flex-1">
                              <p className="font-medium text-dark-green text-sm">
                                {step.label}
                              </p>
                              <p className="text-dark-green/60 text-xs">
                                {new Date(step.at).toLocaleString("en-IN")}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-4">
                    <Button
                      onClick={() => setShowOrderDetail(false)}
                      variant="outline"
                      className="flex-1 border-dark-green/30 text-dark-green"
                    >
                      Close
                    </Button>
                    {selectedOrder.status === "pending" && (
                      <Button
                        onClick={() => handleCancelOrder(selectedOrder.id)}
                        disabled={isCancelling}
                        variant="outline"
                        className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
                      >
                        {isCancelling ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Cancelling...
                          </>
                        ) : (
                          <>
                            <XCircle className="w-4 h-4 mr-2" />
                            Cancel Order
                          </>
                        )}
                      </Button>
                    )}
                    {selectedOrder.status === "confirmed" && (
                      <div className="flex-1 flex items-center justify-center gap-2 text-blue-600 bg-blue-50 rounded-xl px-4 py-2">
                        <AlertCircle className="w-4 h-4" />
                        <span className="text-sm">
                          Contact support to modify
                        </span>
                      </div>
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
