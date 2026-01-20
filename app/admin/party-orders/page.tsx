"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "motion/react";
import {
  Package,
  Calendar,
  Users,
  Search,
  Filter,
  Loader2,
  Eye,
  ChevronLeft,
  ChevronRight,
  Phone,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

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
  placedAt: string;
  createdAt: string;
}

interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export default function AdminPartyOrdersPage() {
  const { token } = useAuth();
  const [orders, setOrders] = useState<PartyOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState<PaginationMeta>({
    page: 1,
    pageSize: 20,
    total: 0,
    totalPages: 0,
  });

  // Filters
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const fetchOrders = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);

    try {
      const params = new URLSearchParams();
      params.append("page", pagination.page.toString());
      params.append("pageSize", "20");
      if (statusFilter !== "all") params.append("status", statusFilter);
      if (searchQuery) params.append("search", searchQuery);
      if (dateFrom) params.append("dateFrom", dateFrom);
      if (dateTo) params.append("dateTo", dateTo);

      const res = await fetch(`/api/admin/party-orders?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (data.success) {
        setOrders(data.data);
        setPagination((prev) => ({
          ...prev,
          total: data.meta.total,
          totalPages: data.meta.totalPages,
        }));
      }
    } catch (error) {
      console.error("Error fetching party orders:", error);
    } finally {
      setIsLoading(false);
    }
  }, [token, pagination.page, statusFilter, searchQuery, dateFrom, dateTo]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

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
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-dark-green">Party Orders</h1>
          <p className="text-dark-green/70">
            Manage bulk orders and catering requests
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-dark-green/60">
          <Package className="w-4 h-4" />
          <span>{pagination.total} total orders</span>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Filter className="w-5 h-5 text-dark-green" />
          <h3 className="font-bold text-dark-green">Filters</h3>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-green/40" />
            <input
              type="text"
              placeholder="Search by name, email, phone..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPagination((prev) => ({ ...prev, page: 1 }));
              }}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-dark-green/20 focus:border-dark-green focus:outline-none"
            />
          </div>

          {/* Date From */}
          <div>
            <label className="block text-xs text-dark-green/60 mb-1">
              Event From
            </label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => {
                setDateFrom(e.target.value);
                setPagination((prev) => ({ ...prev, page: 1 }));
              }}
              className="w-full px-4 py-2 rounded-lg border border-dark-green/20 focus:border-dark-green focus:outline-none"
            />
          </div>

          {/* Date To */}
          <div>
            <label className="block text-xs text-dark-green/60 mb-1">
              Event To
            </label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => {
                setDateTo(e.target.value);
                setPagination((prev) => ({ ...prev, page: 1 }));
              }}
              className="w-full px-4 py-2 rounded-lg border border-dark-green/20 focus:border-dark-green focus:outline-none"
            />
          </div>

          {/* Clear Filters */}
          <div className="flex items-end">
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("");
                setDateFrom("");
                setDateTo("");
                setStatusFilter("all");
                setPagination((prev) => ({ ...prev, page: 1 }));
              }}
              className="border-dark-green/30 text-dark-green"
            >
              Clear Filters
            </Button>
          </div>
        </div>

        {/* Status Filter */}
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
              onClick={() => {
                setStatusFilter(status);
                setPagination((prev) => ({ ...prev, page: 1 }));
              }}
              variant={statusFilter === status ? "default" : "outline"}
              size="sm"
              className={
                statusFilter === status
                  ? "bg-dark-green text-white"
                  : "border-dark-green/30 text-dark-green"
              }
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-dark-green" />
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl shadow-lg">
          <Package className="w-20 h-20 text-dark-green/30 mx-auto mb-6" />
          <h3 className="text-2xl font-bold text-dark-green mb-3">
            No Party Orders Found
          </h3>
          <p className="text-dark-green/70">
            Try adjusting your filters or wait for new orders.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-dark-green/5 border-b border-dark-green/10">
                  <th className="text-left px-6 py-4 font-semibold text-dark-green">
                    Order
                  </th>
                  <th className="text-left px-6 py-4 font-semibold text-dark-green">
                    Customer
                  </th>
                  <th className="text-left px-6 py-4 font-semibold text-dark-green">
                    Event Date
                  </th>
                  <th className="text-left px-6 py-4 font-semibold text-dark-green">
                    Package
                  </th>
                  <th className="text-left px-6 py-4 font-semibold text-dark-green">
                    Guests
                  </th>
                  <th className="text-left px-6 py-4 font-semibold text-dark-green">
                    Total
                  </th>
                  <th className="text-left px-6 py-4 font-semibold text-dark-green">
                    Status
                  </th>
                  <th className="text-left px-6 py-4 font-semibold text-dark-green">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, index) => (
                  <motion.tr
                    key={order.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className="border-b border-dark-green/10 hover:bg-dark-green/5"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-dark-green">
                          #{order.id.slice(-8).toUpperCase()}
                        </p>
                        <p className="text-xs text-dark-green/60">
                          {formatDate(order.placedAt)}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-dark-green">
                          {order.customerName}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-dark-green/60">
                          <Phone className="w-3 h-3" />
                          {order.customerPhone}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-dark-green/60" />
                        <div>
                          <p className="text-dark-green">
                            {formatDate(order.eventDate)}
                          </p>
                          <p className="text-xs text-dark-green/60">
                            {order.eventTime}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-dark-green">
                        {order.packages[0]?.packageName}
                      </p>
                      {order.packages.length > 1 && (
                        <p className="text-xs text-dark-green/60">
                          +{order.packages.length - 1} more
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-dark-green">
                        <Users className="w-4 h-4 text-dark-green/60" />
                        {order.guestCount}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-dark-green">
                        {formatPrice(order.billing.totalPaise)}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                          order.status,
                        )}`}
                      >
                        {order.status.charAt(0).toUpperCase() +
                          order.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Link href={`/admin/party-orders/${order.id}`}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-dark-green/30 text-dark-green"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                      </Link>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-dark-green/10">
              <p className="text-sm text-dark-green/60">
                Showing {(pagination.page - 1) * pagination.pageSize + 1} to{" "}
                {Math.min(
                  pagination.page * pagination.pageSize,
                  pagination.total,
                )}{" "}
                of {pagination.total} orders
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setPagination((prev) => ({
                      ...prev,
                      page: prev.page - 1,
                    }))
                  }
                  disabled={pagination.page === 1}
                  className="border-dark-green/30 text-dark-green"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="text-sm text-dark-green">
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setPagination((prev) => ({
                      ...prev,
                      page: prev.page + 1,
                    }))
                  }
                  disabled={pagination.page === pagination.totalPages}
                  className="border-dark-green/30 text-dark-green"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
