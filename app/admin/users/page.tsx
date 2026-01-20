"use client";

import { useEffect, useState } from "react";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Shield,
  ShieldCheck,
  User,
  Ban,
  CheckCircle,
  Mail,
  Phone,
  Calendar,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface UserData {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: "user" | "admin" | "staff";
  isActive: boolean;
  createdAt: string;
}

const roleColors: Record<string, string> = {
  admin: "bg-purple-100 text-purple-800",
  staff: "bg-blue-100 text-blue-800",
  user: "bg-gray-100 text-gray-800",
};

const roleIcons: Record<string, React.ReactNode> = {
  admin: <ShieldCheck className="h-3 w-3" />,
  staff: <Shield className="h-3 w-3" />,
  user: <User className="h-3 w-3" />,
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchUsers();
  }, [page, roleFilter]);

  async function fetchUsers() {
    setLoading(true);
    try {
      const token = localStorage.getItem("auth_token");
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: "10",
      });

      if (roleFilter !== "all") {
        params.append("role", roleFilter);
      }

      if (search) {
        params.append("search", search);
      }

      const res = await fetch(`/api/admin/users?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (data.success) {
        setUsers(data.data);
        setTotalPages(data.meta?.totalPages || 1);
        setTotal(data.meta?.total || 0);
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchUsers();
  };

  async function updateRole(userId: string, newRole: string) {
    try {
      const token = localStorage.getItem("auth_token");
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role: newRole }),
      });

      if (res.ok) {
        setUsers((prev) =>
          prev.map((u) =>
            u._id === userId ? { ...u, role: newRole as UserData["role"] } : u,
          ),
        );
      }
    } catch (error) {
      console.error("Failed to update role:", error);
    }
  }

  async function toggleActive(user: UserData) {
    try {
      const token = localStorage.getItem("auth_token");
      const res = await fetch(`/api/admin/users/${user._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isActive: !user.isActive }),
      });

      if (res.ok) {
        setUsers((prev) =>
          prev.map((u) =>
            u._id === user._id ? { ...u, isActive: !u.isActive } : u,
          ),
        );
      }
    } catch (error) {
      console.error("Failed to toggle user status:", error);
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>
          <p className="text-gray-500">{total} registered users</p>
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
                placeholder="Search by name, email, or phone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-dark-green/20"
              />
            </div>
          </form>

          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setPage(1);
            }}
            className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-dark-green/20"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admins</option>
            <option value="staff">Staff</option>
            <option value="user">Users</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-dark-green mx-auto"></div>
            <p className="mt-2 text-gray-500">Loading users...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No users found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    User
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Contact
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Role
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Joined
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {users.map((user) => (
                  <tr
                    key={user._id}
                    className={cn(
                      "hover:bg-gray-50",
                      !user.isActive && "opacity-60",
                    )}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-dark-green/10 flex items-center justify-center">
                          <span className="text-dark-green font-medium">
                            {user.name?.charAt(0).toUpperCase() || "?"}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {user.name}
                          </p>
                          <p className="text-xs text-gray-400 font-mono">
                            {user._id.slice(-8)}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Mail className="h-3 w-3" />
                          {user.email}
                        </div>
                        {user.phone && (
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <Phone className="h-3 w-3" />
                            {user.phone}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={user.role}
                        onChange={(e) => updateRole(user._id, e.target.value)}
                        className={cn(
                          "text-xs font-medium px-2 py-1 rounded-full border-0 cursor-pointer",
                          roleColors[user.role],
                        )}
                      >
                        <option value="user">User</option>
                        <option value="staff">Staff</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleActive(user)}
                        className={cn(
                          "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium transition-colors",
                          user.isActive
                            ? "bg-green-100 text-green-800 hover:bg-green-200"
                            : "bg-red-100 text-red-800 hover:bg-red-200",
                        )}
                      >
                        {user.isActive ? (
                          <>
                            <CheckCircle className="h-3 w-3" />
                            Active
                          </>
                        ) : (
                          <>
                            <Ban className="h-3 w-3" />
                            Disabled
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Calendar className="h-3 w-3" />
                        {formatDate(user.createdAt)}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Button variant="ghost" size="sm" disabled>
                        View
                      </Button>
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
