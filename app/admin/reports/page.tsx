"use client";

import { useEffect, useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  IndianRupee,
  ShoppingBag,
  Users,
  Star,
  Calendar,
  Download,
  RefreshCw,
} from "lucide-react";
import { cn, formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ReportData {
  summary: {
    totalRevenue: number;
    totalOrders: number;
    averageOrderValue: number;
    newUsers: number;
    repeatCustomers: number;
    averageRating: number;
  };
  revenueByDay: { date: string; revenue: number; orders: number }[];
  topDishes: { name: string; quantity: number; revenue: number }[];
  ordersByStatus: { status: string; count: number }[];
  revenueByCategory: { category: string; revenue: number }[];
}

const defaultData: ReportData = {
  summary: {
    totalRevenue: 0,
    totalOrders: 0,
    averageOrderValue: 0,
    newUsers: 0,
    repeatCustomers: 0,
    averageRating: 0,
  },
  revenueByDay: [],
  topDishes: [],
  ordersByStatus: [],
  revenueByCategory: [],
};

export default function AdminReportsPage() {
  const [data, setData] = useState<ReportData>(defaultData);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState("7d");

  useEffect(() => {
    fetchReports();
  }, [dateRange]);

  async function fetchReports() {
    setLoading(true);
    try {
      const token = localStorage.getItem("auth_token");
      const res = await fetch(`/api/admin/reports?range=${dateRange}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await res.json();

      if (result.success) {
        setData(result.data);
      }
    } catch (error) {
      console.error("Failed to fetch reports:", error);
    } finally {
      setLoading(false);
    }
  }



  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      delivered: "bg-green-500",
      cancelled: "bg-red-500",
      preparing: "bg-yellow-500",
      "order-placed": "bg-blue-500",
      confirmed: "bg-indigo-500",
      ready: "bg-purple-500",
      "out-for-delivery": "bg-orange-500",
    };
    return colors[status] || "bg-gray-500";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-500">Analytics and insights</p>
        </div>
        <div className="flex gap-2">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-dark-green/20"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <Button
            variant="outline"
            onClick={fetchReports}
            disabled={loading}
            className="gap-2"
          >
            <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
            Refresh
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-dark-green"></div>
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatPrice(data.summary.totalRevenue)}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <IndianRupee className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Orders</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {data.summary.totalOrders}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <ShoppingBag className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Avg Order Value</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatPrice(data.summary.averageOrderValue)}
                  </p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">New Users</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {data.summary.newUsers}
                  </p>
                </div>
                <div className="p-3 bg-orange-100 rounded-full">
                  <Users className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Repeat Customers</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {data.summary.repeatCustomers}
                  </p>
                </div>
                <div className="p-3 bg-teal-100 rounded-full">
                  <Users className="h-6 w-6 text-teal-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Avg Rating</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {data.summary.averageRating.toFixed(1)} ⭐
                  </p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-full">
                  <Star className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue by Day */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Daily Revenue</h2>
              {data.revenueByDay.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  No data available
                </p>
              ) : (
                <div className="space-y-3">
                  {data.revenueByDay.slice(0, 7).map((day) => (
                    <div key={day.date} className="flex items-center gap-4">
                      <span className="text-sm text-gray-500 w-24">
                        {new Date(day.date).toLocaleDateString("en-IN", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                      <div className="flex-1 bg-gray-100 rounded-full h-4 overflow-hidden">
                        <div
                          className="bg-dark-green h-full rounded-full"
                          style={{
                            width: `${Math.min(
                              (day.revenue /
                                Math.max(
                                  ...data.revenueByDay.map((d) => d.revenue),
                                )) *
                              100,
                              100,
                            )}%`,
                          }}
                        />
                      </div>
                      <span className="text-sm font-medium w-24 text-right">
                        {formatPrice(day.revenue)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Top Dishes */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Top Selling Dishes</h2>
              {data.topDishes.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  No data available
                </p>
              ) : (
                <div className="space-y-3">
                  {data.topDishes.slice(0, 5).map((dish, index) => (
                    <div
                      key={dish.name}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={cn(
                            "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold",
                            index === 0
                              ? "bg-yellow-100 text-yellow-700"
                              : index === 1
                                ? "bg-gray-200 text-gray-700"
                                : index === 2
                                  ? "bg-orange-100 text-orange-700"
                                  : "bg-gray-100 text-gray-500",
                          )}
                        >
                          {index + 1}
                        </span>
                        <span className="font-medium">{dish.name}</span>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          {formatPrice(dish.revenue)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {dish.quantity} orders
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Orders by Status */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Orders by Status</h2>
              {data.ordersByStatus.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  No data available
                </p>
              ) : (
                <div className="space-y-3">
                  {data.ordersByStatus.map((item) => (
                    <div key={item.status} className="flex items-center gap-4">
                      <div
                        className={cn(
                          "w-3 h-3 rounded-full",
                          getStatusColor(item.status),
                        )}
                      />
                      <span className="flex-1 capitalize text-gray-700">
                        {item.status.replace(/-/g, " ")}
                      </span>
                      <span className="font-medium">{item.count}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Revenue by Category */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">
                Revenue by Category
              </h2>
              {data.revenueByCategory.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  No data available
                </p>
              ) : (
                <div className="space-y-3">
                  {data.revenueByCategory.map((item) => (
                    <div
                      key={item.category}
                      className="flex items-center gap-4"
                    >
                      <span className="flex-1 capitalize text-gray-700">
                        {item.category}
                      </span>
                      <span className="font-medium">
                        {formatPrice(item.revenue)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
