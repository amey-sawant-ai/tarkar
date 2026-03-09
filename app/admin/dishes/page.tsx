"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  Filter,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";

interface Dish {
  _id: string;
  name: string;
  description: string;
  pricePaise: number;
  categoryId: {
    _id: string;
    name: string;
    slug: string;
  } | null;
  imageUrl: string;
  isVeg: boolean;
  isAvailable: boolean;
  isFeatured: boolean;
  spicyLevel?: number;
  preparationTime?: number;
}

interface Category {
  _id: string;
  name: string;
  slug: string;
}

export default function AdminDishesPage() {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [availabilityFilter, setAvailabilityFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchDishes();
  }, [page, categoryFilter, availabilityFilter]);

  async function fetchCategories() {
    try {
      const res = await fetch("/api/menu/categories");
      const data = await res.json();
      if (data.success) {
        setCategories(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  }

  async function fetchDishes() {
    setLoading(true);
    try {
      const token = localStorage.getItem("auth_token");
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: "10",
      });

      if (categoryFilter !== "all") {
        params.append("category", categoryFilter);
      }

      if (availabilityFilter !== "all") {
        params.append("isAvailable", availabilityFilter);
      }

      if (search) {
        params.append("search", search);
      }

      const res = await fetch(`/api/admin/dishes?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (data.success) {
        setDishes(data.data);
        setTotalPages(data.meta?.totalPages || 1);
        setTotal(data.meta?.total || 0);
      }
    } catch (error) {
      console.error("Failed to fetch dishes:", error);
    } finally {
      setLoading(false);
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchDishes();
  };

  async function toggleAvailability(dish: Dish) {
    try {
      const token = localStorage.getItem("auth_token");
      const res = await fetch(`/api/admin/dishes/${dish._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isAvailable: !dish.isAvailable }),
      });

      if (res.ok) {
        setDishes((prev) =>
          prev.map((d) =>
            d._id === dish._id ? { ...d, isAvailable: !d.isAvailable } : d,
          ),
        );
      }
    } catch (error) {
      console.error("Failed to toggle availability:", error);
    }
  }

  async function deleteDish(id: string) {
    if (!confirm("Are you sure you want to delete this dish?")) return;

    setDeleting(id);
    try {
      const token = localStorage.getItem("auth_token");
      const res = await fetch(`/api/admin/dishes/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setDishes((prev) => prev.filter((d) => d._id !== id));
        setTotal((prev) => prev - 1);
      }
    } catch (error) {
      console.error("Failed to delete dish:", error);
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Menu Items</h1>
          <p className="text-gray-500">{total} dishes</p>
        </div>
        <Link href="/admin/dishes/new">
          <Button className="bg-dark-green hover:bg-dark-green/90 gap-2">
            <Plus className="h-4 w-4" />
            Add Dish
          </Button>
        </Link>
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
                placeholder="Search dishes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-dark-green/20"
              />
            </div>
          </form>

          {/* Category Filter */}
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setPage(1);
              }}
              className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-dark-green/20"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat.slug}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Availability Filter */}
          <select
            value={availabilityFilter}
            onChange={(e) => {
              setAvailabilityFilter(e.target.value);
              setPage(1);
            }}
            className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-dark-green/20"
          >
            <option value="all">All Status</option>
            <option value="true">Available</option>
            <option value="false">Unavailable</option>
          </select>
        </div>
      </div>

      {/* Dishes Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-dark-green mx-auto"></div>
            <p className="mt-2 text-gray-500">Loading dishes...</p>
          </div>
        ) : dishes.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No dishes found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Dish
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Category
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Price
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Type
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {dishes.map((dish) => (
                  <tr key={dish._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={dish.imageUrl || "/placeholder-dish.svg"}
                          alt={dish.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div>
                          <p className="font-medium text-gray-900">
                            {dish.name}
                          </p>
                          <p className="text-sm text-gray-500 line-clamp-1 max-w-xs">
                            {dish.description}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm capitalize">
                        {dish.categoryId?.name || "Uncategorized"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-medium">
                        {formatPrice(dish.pricePaise)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
                          dish.isVeg
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800",
                        )}
                      >
                        {dish.isVeg ? "Veg" : "Non-Veg"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleAvailability(dish)}
                        className={cn(
                          "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium transition-colors",
                          dish.isAvailable
                            ? "bg-green-100 text-green-800 hover:bg-green-200"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200",
                        )}
                      >
                        {dish.isAvailable ? (
                          <>
                            <Eye className="h-3 w-3" />
                            Available
                          </>
                        ) : (
                          <>
                            <EyeOff className="h-3 w-3" />
                            Hidden
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Link href={`/admin/dishes/${dish._id}`}>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteDish(dish._id)}
                          disabled={deleting === dish._id}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
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
