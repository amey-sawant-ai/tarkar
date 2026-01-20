"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  ChefHat,
  Package,
} from "lucide-react";
import { cn } from "@/lib/utils";
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
  createdAt: string;
  user?: {
    name: string;
    email: string;
    phone: string;
  };
}

const statusOptions = [
  { value: "all", label: "All Orders" },
  { value: "active", label: "Active" },
  { value: "order-placed", label: "Order Placed" },
  { value: "confirmed", label: "Confirmed" },
  { value: "preparing", label: "Preparing" },
  { value: "ready", label: "Ready" },
  { value: "out-for-delivery", label: "Out for Delivery" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

const getStatusIcon = (status: string) => {
  const icons: Record<string, React.ReactNode> = {
    "order-placed": <Clock className="h-4 w-4" />,
    confirmed: <CheckCircle className="h-4 w-4" />,
    preparing: <ChefHat className="h-4 w-4" />,
    ready: <Package className="h-4 w-4" />,
    "out-for-delivery": <Truck className="h-4 w-4" />,
    delivered: <CheckCircle className="h-4 w-4" />,
    cancelled: <XCircle className="h-4 w-4" />,
  };
  return icons[status] || <Clock className="h-4 w-4" />;
};

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

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchOrders();
  }, [page, statusFilter]);

  async function fetchOrders() {
    setLoading(true);
    try {
      const token = localStorage.getItem("auth_token");
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: "10",
      });

      if (statusFilter !== "all") {
        params.append("status", statusFilter);
      }

      if (search) {
        params.append("search", search);
      }

      const res = await fetch(`/api/admin/orders?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (data.success) {
        setOrders(data.data);
        setTotalPages(data.meta?.totalPages || 1);
        setTotal(data.meta?.total || 0);
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchOrders();
  };

  const formatPrice = (paise: number) => `₹${(paise / 100).toFixed(2)}`;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-500">{total} total orders</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by order ID or customer..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-dark-green/20"
              />
            </div>
          </form>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-dark-green/20"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-dark-green mx-auto"></div>
            <p className="mt-2 text-gray-500">Loading orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No orders found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Order ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Customer
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Items
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Total
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <span className="font-mono text-sm font-medium">
                        #{order._id.slice(-6).toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-gray-900">
                          {order.user?.name || "Unknown"}
                        </p>
                        <p className="text-sm text-gray-500">
                          {order.user?.email || order.userId}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-gray-600">
                        {order.items.length} item(s)
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-medium">
                        {formatPrice(order.billing?.totalPaise || 0)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium capitalize",
                          getStatusColor(order.status),
                        )}
                      >
                        {getStatusIcon(order.status)}
                        {order.status.replace(/-/g, " ")}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-gray-500">
                        {formatDate(order.createdAt)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Link href={`/admin/orders/${order._id}`}>
                        <Button variant="ghost" size="sm" className="gap-1">
                          <Eye className="h-4 w-4" />
                          View
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t">
            <p className="text-sm text-gray-500">
              Page {page} of {totalPages}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
