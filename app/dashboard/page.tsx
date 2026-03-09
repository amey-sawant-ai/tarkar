"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import {
  ShoppingBag,
  Heart,
  MapPin,
  Clock,
  User,
  Settings,
  LogOut,
  TrendingUp,
  Package,
  Star,
  CreditCard,
  Calendar,
  Users,
  Truck,
  Wallet,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import Image from "next/image";
import DashboardNavbar from "@/components/DashboardNavbar";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";

interface DashboardStats {
  totalOrders: number;
  totalSpentPaise: number;
  recentOrdersThisMonth: number;
  deliveredOrders: number;
}

interface RecentOrder {
  id: string;
  orderNumber: string;
  items: Array<{
    name: string;
    quantity: number;
  }>;
  totalPaise: number;
  status: string;
  createdAt: string;
  deliveryType: string;
}

interface FavoriteDish {
  id: string;
  name: string;
  slug: string;
  orders: number;
  pricePaise: number;
  imageUrl: string;
  lastOrderDate: string;
}

interface DashboardData {
  stats: DashboardStats;
  recentOrders: RecentOrder[];
  favoriteDishes: FavoriteDish[];
}

interface UserProfile {
  id: string;
  email: string;
  name: string;
  phone?: string;
  walletBalancePaise: number;
  preferences: {
    darkMode: boolean;
    language: string;
  };
  notifications: {
    orderUpdates: boolean;
    promotions: boolean;
    newsletter: boolean;
    sms: boolean;
  };
  createdAt: string;
}

export default function Dashboard() {
  const router = useRouter();
  const { t } = useLanguage();
  const { user, isLoading, isAuthenticated, logout } = useAuth();
  const [dashboardLoading, setDashboardLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null,
  );
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!isAuthenticated || !user) return;

      try {
        setDataLoading(true);
        setError(null);

        const token = localStorage.getItem("auth_token");
        const headers = {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        };

        // Fetch both in parallel
        const [statsRes, favRes] = await Promise.all([
          fetch("/api/user/dashboard-stats", { headers }),
          fetch("/api/user/favorites", { headers }),
        ]);

        if (!statsRes.ok)
          throw new Error(`Stats fetch failed: ${statsRes.status}`);

        const statsData = await statsRes.json();
        const favData = favRes.ok
          ? await favRes.json()
          : { success: false, data: [] };

        if (statsData.success) {
          // Map favorites to the shape the UI expects
          const favoriteDishes = (favData.data || []).map((fav: any) => ({
            id: fav._id,
            name: fav.name,
            slug: fav.slug,
            orders: fav.orderCount || 0,
            pricePaise: fav.pricePaise,
            imageUrl: fav.imageUrl || "",
            lastOrderDate: fav.lastOrderedAt || new Date().toISOString(),
          }));

          setDashboardData({
            ...statsData.data,
            favoriteDishes, // override with real favorites
          });
        } else {
          setError(statsData.error?.message || "Failed to load dashboard data");
        }
      } catch (error) {
        console.error("Dashboard data fetch error:", error);
        setError("Failed to load dashboard data. Please try again.");
      } finally {
        setDataLoading(false);
      }
    };

    if (isAuthenticated && user) {
      fetchDashboardData();
    }
  }, [isAuthenticated, user]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        // Add a small delay to prevent race conditions
        setTimeout(() => {
          router.push("/login");
        }, 100);
        return;
      }
      // User is authenticated, stop loading
      setDashboardLoading(false);
    }
  }, [isAuthenticated, isLoading, router]);

  const loading = isLoading || dashboardLoading || dataLoading;

  if (loading) {
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

  if (!user) {
    return (
      <div className="min-h-screen bg-warm-beige flex items-center justify-center">
        <div className="text-center">
          <p className="text-dark-green mb-4">Please log in to continue</p>
          <Link href="/login">
            <Button>Go to Login</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Get user initials
  const initials = (user?.name || "")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  // Dynamic stats based on fetched data
  const stats = dashboardData
    ? [
      {
        icon: ShoppingBag,
        label: t("stats.totalOrders"),
        value: dashboardData.stats.totalOrders.toString(),
        change: `${dashboardData.stats.recentOrdersThisMonth} ${t("common.thisMonth")}`,
        color: "tomato-red",
      },
      {
        icon: Wallet,
        label: t("stats.walletBalance"),
        value: formatPrice(user.walletBalancePaise || 0),
        change: `${t("common.available")}`,
        color: "saffron-yellow",
      },
      {
        icon: Star,
        label: t("stats.memberSince"),
        value: user?.createdAt ? new Date(user.createdAt).getFullYear().toString() : "N/A",
        change: user?.createdAt ? `${new Date(user.createdAt).toLocaleDateString()}` : "N/A",
        color: "dark-green",
      },
      {
        icon: CreditCard,
        label: t("stats.totalSpent"),
        value: formatPrice(dashboardData.stats.totalSpentPaise),
        change: `${dashboardData.stats.deliveredOrders} ${t("common.orders")}`,
        color: "tomato-red",
      },
    ]
    : [];

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-warm-beige">
      <DashboardNavbar />

      <div className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              {/* Profile Section */}
              <div className="text-center mb-6 pb-6 border-b-2 border-dark-green/10">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-tomato-red to-saffron-yellow mx-auto mb-4 flex items-center justify-center text-white text-3xl font-bold">
                  {initials}
                </div>
                <h3 className="text-xl font-bold text-dark-green mb-1">
                  {user.name}
                </h3>
                <p className="text-dark-green/60 text-sm">{user.email}</p>
              </div>

              {/* Navigation */}
              <nav className="space-y-2">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-tomato-red to-saffron-yellow text-white rounded-xl font-semibold"
                >
                  <TrendingUp className="w-5 h-5" />
                  {t("dashboard.title")}
                </Link>
                <Link
                  href="/dashboard/order"
                  className="flex items-center gap-3 px-4 py-3 text-dark-green hover:bg-dark-green/5 rounded-xl transition-all"
                >
                  <ShoppingBag className="w-5 h-5" />
                  {t("dashboard.orderFood")}
                </Link>
                <Link
                  href="/dashboard/my-orders"
                  className="flex items-center gap-3 px-4 py-3 text-dark-green hover:bg-dark-green/5 rounded-xl transition-all"
                >
                  <Package className="w-5 h-5" />
                  {t("dashboard.myOrders")}
                </Link>
                <Link
                  href="/dashboard/reservation"
                  className="flex items-center gap-3 px-4 py-3 text-dark-green hover:bg-dark-green/5 rounded-xl transition-all"
                >
                  <Calendar className="w-5 h-5" />
                  {t("nav.reservation")}
                </Link>
                <Link
                  href="/dashboard/party-orders"
                  className="flex items-center gap-3 px-4 py-3 text-dark-green hover:bg-dark-green/5 rounded-xl transition-all"
                >
                  <Users className="w-5 h-5" />
                  {t("dashboard.partyOrders")}
                </Link>
                <Link
                  href="/dashboard/favorites"
                  className="flex items-center gap-3 px-4 py-3 text-dark-green hover:bg-dark-green/5 rounded-xl transition-all"
                >
                  <Heart className="w-5 h-5" />
                  {t("dashboard.favorites")}
                </Link>
                <Link
                  href="/dashboard/addresses"
                  className="flex items-center gap-3 px-4 py-3 text-dark-green hover:bg-dark-green/5 rounded-xl transition-all"
                >
                  <MapPin className="w-5 h-5" />
                  {t("dashboard.addresses")}
                </Link>
                <Link
                  href="/dashboard/reviews"
                  className="flex items-center gap-3 px-4 py-3 text-dark-green hover:bg-dark-green/5 rounded-xl transition-all"
                >
                  <Star className="w-5 h-5" />
                  {t("nav.reviews")}
                </Link>
                <Link
                  href="/dashboard/order-tracking"
                  className="flex items-center gap-3 px-4 py-3 text-dark-green hover:bg-dark-green/5 rounded-xl transition-all"
                >
                  <Truck className="w-5 h-5" />
                  {t("dashboard.orderTracking")}
                </Link>
                <Link
                  href="/dashboard/wallet"
                  className="flex items-center gap-3 px-4 py-3 text-dark-green hover:bg-dark-green/5 rounded-xl transition-all"
                >
                  <Wallet className="w-5 h-5" />
                  {t("dashboard.wallet")}
                </Link>
                <Link
                  href="/dashboard/payment-methods"
                  className="flex items-center gap-3 px-4 py-3 text-dark-green hover:bg-dark-green/5 rounded-xl transition-all"
                >
                  <CreditCard className="w-5 h-5" />
                  {t("dashboard.paymentMethods")}
                </Link>
                <Link
                  href="/dashboard/profile"
                  className="flex items-center gap-3 px-4 py-3 text-dark-green hover:bg-dark-green/5 rounded-xl transition-all"
                >
                  <User className="w-5 h-5" />
                  {t("dashboard.profile")}
                </Link>
                <Link
                  href="/dashboard/settings"
                  className="flex items-center gap-3 px-4 py-3 text-dark-green hover:bg-dark-green/5 rounded-xl transition-all"
                >
                  <Settings className="w-5 h-5" />
                  {t("dashboard.settings")}
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-3 text-tomato-red hover:bg-tomato-red/5 rounded-xl transition-all mt-4 w-full"
                >
                  <LogOut className="w-5 h-5" />
                  {t("dashboard.logout")}
                </button>
              </nav>
            </div>
          </motion.div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Welcome Banner */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-gradient-to-br from-dark-green to-dark-green/95 rounded-2xl p-8 text-white relative overflow-hidden"
            >
              <div className="absolute inset-0 opacity-10">
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23FFFFFF' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                  }}
                ></div>
              </div>
              <div className="relative z-10">
                <h2 className="text-3xl md:text-4xl font-serif font-bold mb-2">
                  {t("dashboard.welcomeBack")}, {user?.name?.split(" ")[0]}! 👋
                </h2>
                <p className="text-warm-beige/80 text-lg mb-6">
                  {t("dashboard.rewardPointsMessage").replace(
                    "{points}",
                    "250",
                  )}
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link href="/dashboard/order">
                    <Button className="bg-gradient-to-r from-tomato-red to-saffron-yellow text-white hover:shadow-2xl font-semibold px-6 py-3">
                      {t("action.orderNow")}
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    className="border-white text-white hover:bg-white hover:text-dark-green font-semibold px-6 py-3"
                  >
                    {t("dashboard.viewRewards")}
                  </Button>
                </div>
              </div>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all"
                >
                  <div
                    className={`w-12 h-12 rounded-full bg-${stat.color}/20 flex items-center justify-center mb-4`}
                    style={{
                      backgroundColor:
                        stat.color === "tomato-red"
                          ? "rgba(195, 66, 63, 0.2)"
                          : stat.color === "saffron-yellow"
                            ? "rgba(245, 166, 35, 0.2)"
                            : "rgba(30, 61, 47, 0.2)",
                    }}
                  >
                    <stat.icon
                      className={`w-6 h-6 text-${stat.color}`}
                      style={{
                        color:
                          stat.color === "tomato-red"
                            ? "#C3423F"
                            : stat.color === "saffron-yellow"
                              ? "#F5A623"
                              : "#1E3D2F",
                      }}
                    />
                  </div>
                  <h3 className="text-2xl font-bold text-dark-green mb-1">
                    {stat.value}
                  </h3>
                  <p className="text-dark-green/70 font-semibold text-sm mb-1">
                    {stat.label}
                  </p>
                  <p className="text-dark-green/50 text-xs">{stat.change}</p>
                </motion.div>
              ))}
            </div>

            {/* Recent Orders */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="bg-white rounded-2xl shadow-lg p-6 md:p-8"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-serif font-bold text-dark-green">
                  {t("dashboard.recentOrders")}
                </h3>
                <Link
                  href="#"
                  className="text-tomato-red hover:text-saffron-yellow font-semibold text-sm"
                >
                  {t("dashboard.viewAll")}
                </Link>
              </div>
              {dataLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-8 h-8 text-tomato-red animate-spin" />
                </div>
              ) : error ? (
                <div className="text-center py-8">
                  <p className="text-dark-green/60 mb-4">{error}</p>
                  <Button
                    onClick={() => window.location.reload()}
                    variant="outline"
                    className="border-tomato-red text-tomato-red hover:bg-tomato-red hover:text-white"
                  >
                    {t("common.tryAgain")}
                  </Button>
                </div>
              ) : !dashboardData?.recentOrders?.length ? (
                <div className="text-center py-12">
                  <Package className="w-12 h-12 text-dark-green/30 mx-auto mb-4" />
                  <p className="text-dark-green/60 mb-4">
                    {t("dashboard.noRecentOrders")}
                  </p>
                  <Link href="/menu">
                    <Button className="bg-gradient-to-r from-tomato-red to-saffron-yellow text-white">
                      {t("common.orderNow")}
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {dashboardData.recentOrders.map((order, index) => {
                    const itemsText = order.items
                      .map((item) => `${item.quantity}x ${item.name}`)
                      .join(", ");
                    const orderDate = new Date(
                      order.createdAt,
                    ).toLocaleDateString();

                    return (
                      <div
                        key={order.id}
                        className="flex items-center gap-4 p-4 rounded-xl hover:bg-warm-beige/30 transition-all border-2 border-dark-green/5"
                      >
                        <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-tomato-red/10 to-saffron-yellow/10 flex items-center justify-center">
                          <Package className="w-8 h-8 text-tomato-red" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-dark-green/60 font-semibold text-sm">
                              #{order.orderNumber}
                            </span>
                            <span
                              className={`px-3 py-1 text-xs font-semibold rounded-full ${order.status === "delivered"
                                ? "bg-green-100 text-green-700"
                                : order.status === "preparing"
                                  ? "bg-orange-100 text-orange-700"
                                  : order.status === "pending"
                                    ? "bg-yellow-100 text-yellow-700"
                                    : "bg-gray-100 text-gray-700"
                                }`}
                            >
                              {order.status}
                            </span>
                          </div>
                          <h4 className="font-semibold text-dark-green mb-1 truncate">
                            {itemsText}
                          </h4>
                          <div className="flex items-center gap-2 text-dark-green/60 text-sm">
                            <Clock className="w-4 h-4" />
                            {orderDate} • {order.deliveryType}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold text-dark-green">
                            {formatPrice(order.totalPaise)}
                          </p>
                          <Button
                            size="sm"
                            variant="outline"
                            className="mt-2 border-tomato-red text-tomato-red hover:bg-tomato-red hover:text-white"
                          >
                            {t("order.reorder")}
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>

            {/* Favorite Dishes */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="bg-white rounded-2xl shadow-lg p-6 md:p-8"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-serif font-bold text-dark-green">
                  {t("dashboard.yourFavorites")}
                </h3>
                <Link
                  href="/dashboard/favorites"
                  className="text-tomato-red hover:text-saffron-yellow font-semibold text-sm"
                >
                  {t("dashboard.manage")}
                </Link>
              </div>
              {dataLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-8 h-8 text-tomato-red animate-spin" />
                </div>
              ) : error ? (
                <div className="text-center py-8">
                  <p className="text-dark-green/60 mb-4">{error}</p>
                  <Button
                    onClick={() => window.location.reload()}
                    variant="outline"
                    className="border-tomato-red text-tomato-red hover:bg-tomato-red hover:text-white"
                  >
                    {t("common.tryAgain")}
                  </Button>
                </div>
              ) : !dashboardData?.favoriteDishes?.length ? (
                <div className="text-center py-12">
                  <Heart className="w-12 h-12 text-dark-green/30 mx-auto mb-4" />
                  <p className="text-dark-green/60 mb-4">
                    {t("dashboard.noFavorites")}
                  </p>
                  <Link href="/menu">
                    <Button className="bg-gradient-to-r from-tomato-red to-saffron-yellow text-white">
                      {t("common.browseMenu")}
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {dashboardData.favoriteDishes.map((dish, index) => {
                    const lastOrderDate = new Date(
                      dish.lastOrderDate,
                    ).toLocaleDateString();

                    return (
                      <div
                        key={dish.id}
                        className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all"
                      >
                        {dish.imageUrl ? (
                          <Image
                            src={dish.imageUrl || "/placeholder-dish.svg"}
                            alt={dish.name}
                            width={300}
                            height={200}
                            className="w-full h-40 object-cover group-hover:scale-110 transition-transform duration-300"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "/placeholder-dish.svg";
                            }}
                          />
                        ) : (
                          <div className="w-full h-40 bg-gradient-to-br from-tomato-red/20 to-saffron-yellow/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <Package className="w-16 h-16 text-dark-green/40" />
                          </div>
                        )}
                        <div className="absolute top-3 right-3">
                          <Heart className="w-6 h-6 text-tomato-red fill-tomato-red" />
                        </div>
                        <div className="bg-white p-4">
                          <h4 className="font-bold text-dark-green mb-2">
                            {dish.name}
                          </h4>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-tomato-red font-bold text-lg">
                              {formatPrice(dish.pricePaise)}
                            </span>
                            <span className="text-dark-green/60 text-sm">
                              {t("dashboard.ordered")} {dish.orders}x
                            </span>
                          </div>
                          <p className="text-dark-green/50 text-xs mb-3">
                            {t("dashboard.lastOrdered")}: {lastOrderDate}
                          </p>
                          <Button
                            onClick={() => router.push(`/menu?dish=${dish.slug}`)}
                            className="w-full bg-gradient-to-r from-tomato-red to-saffron-yellow text-white hover:shadow-xl"
                          >
                            {t("order.orderAgain")}
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
