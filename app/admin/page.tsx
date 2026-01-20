"use client";

import { useEffect, useState } from "react";
import {
  ShoppingBag,
  Users,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  ChefHat,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardStats {
  totalOrders: number;
  todayOrders: number;
  totalRevenuePaise: number;
  todayRevenuePaise: number;
  totalUsers: number;
  newUsersToday: number;
  activeOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  totalDishes: number;
}

interface RecentOrder {
  _id: string;
  status: string;
  billing: { totalPaise: number };
  createdAt: string;
  items: { name: string; qty: number }[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  async function fetchDashboardData() {
    try {
      const token = localStorage.getItem("auth_token");
      const headers = { Authorization: `Bearer ${token}` };

      // Fetch stats
      const statsRes = await fetch("/api/admin/stats", { headers });
      const statsData = await statsRes.json();
      if (statsData.success) {
        setStats(statsData.data);
      }

      // Fetch recent orders
      const ordersRes = await fetch("/api/admin/orders?pageSize=5", {
        headers,
      });
      const ordersData = await ordersRes.json();
      if (ordersData.success) {
        setRecentOrders(ordersData.data);
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  }

  const formatPrice = (paise: number) => `₹${(paise / 100).toFixed(2)}`;

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      "order-placed": "bg-blue-100 text-blue-800",
      confirmed: "bg-indigo-100 text-indigo-800",
      preparing: "bg-yellow-100 text-yellow-800",
      ready: "bg-purple-100 text-purple-800",
      "out-for-delivery": "bg-orange-100 text-orange-800",
      delivered: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl p-6 shadow-sm animate-pulse"
            >
              <div className="h-4 bg-gray-200 rounded w-24 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-16"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Orders */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats?.totalOrders || 0}
              </p>
              <p className="text-xs text-green-600 mt-1">
                +{stats?.todayOrders || 0} today
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <ShoppingBag className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Revenue */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatPrice(stats?.totalRevenuePaise || 0)}
              </p>
              <p className="text-xs text-green-600 mt-1">
                +{formatPrice(stats?.todayRevenuePaise || 0)} today
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        {/* Users */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats?.totalUsers || 0}
              </p>
              <p className="text-xs text-green-600 mt-1">
                +{stats?.newUsersToday || 0} today
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Active Orders */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Active Orders</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats?.activeOrders || 0}
              </p>
              <p className="text-xs text-gray-500 mt-1">Pending fulfillment</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <Clock className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-green-100 rounded-lg">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Completed</p>
            <p className="text-xl font-bold text-gray-900">
              {stats?.completedOrders || 0}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-red-100 rounded-lg">
            <XCircle className="h-6 w-6 text-red-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Cancelled</p>
            <p className="text-xl font-bold text-gray-900">
              {stats?.cancelledOrders || 0}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-saffron-yellow/20 rounded-lg">
            <ChefHat className="h-6 w-6 text-saffron-yellow" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Menu Items</p>
            <p className="text-xl font-bold text-gray-900">
              {stats?.totalDishes || 0}
            </p>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
        </div>
        <div className="divide-y">
          {recentOrders.length === 0 ? (
            <div className="p-6 text-center text-gray-500">No orders yet</div>
          ) : (
            recentOrders.map((order) => (
              <div
                key={order._id}
                className="p-4 flex items-center justify-between hover:bg-gray-50"
              >
                <div className="flex items-center gap-4">
                  <div>
                    <p className="font-medium text-gray-900">
                      #{order._id.slice(-6).toUpperCase()}
                    </p>
                    <p className="text-sm text-gray-500">
                      {order.items
                        .map((i) => `${i.qty}x ${i.name}`)
                        .join(", ")
                        .slice(0, 50)}
                      {order.items.map((i) => `${i.qty}x ${i.name}`).join(", ")
                        .length > 50 && "..."}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-medium text-gray-900">
                    {formatPrice(order.billing?.totalPaise || 0)}
                  </span>
                  <span
                    className={cn(
                      "px-2 py-1 rounded-full text-xs font-medium capitalize",
                      getStatusColor(order.status),
                    )}
                  >
                    {order.status.replace(/-/g, " ")}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
