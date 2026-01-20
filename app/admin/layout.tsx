"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import {
  LayoutDashboard,
  ShoppingBag,
  UtensilsCrossed,
  Users,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  ChefHat,
  PartyPopper,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const sidebarLinks = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/party-orders", label: "Party Orders", icon: PartyPopper },
  { href: "/admin/dishes", label: "Menu Items", icon: UtensilsCrossed },
  { href: "/admin/categories", label: "Categories", icon: ChefHat },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/reports", label: "Reports", icon: BarChart3 },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    // Check if user is admin
    async function checkAdmin() {
      if (!isAuthenticated || isLoading) return;

      try {
        const token = localStorage.getItem("auth_token");
        const res = await fetch("/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (data.success && data.data.role === "admin") {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
          router.push("/dashboard");
        }
      } catch {
        setIsAdmin(false);
        router.push("/login");
      }
    }

    if (!isLoading) {
      if (!isAuthenticated) {
        router.push("/login");
      } else {
        checkAdmin();
      }
    }
  }, [isAuthenticated, isLoading, router]);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  // Loading state
  if (isLoading || isAdmin === null) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-dark-green"></div>
      </div>
    );
  }

  // Not admin - will redirect
  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-64 bg-dark-green text-white transform transition-transform duration-200 ease-in-out lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-white/10">
          <Link href="/admin" className="flex items-center gap-2">
            <ChefHat className="h-8 w-8 text-saffron-yellow" />
            <span className="font-bold text-xl">Tarkari Admin</span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 hover:bg-white/10 rounded"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors"
                onClick={() => setSidebarOpen(false)}
              >
                <Icon className="h-5 w-5" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User & Logout */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
          <div className="flex items-center gap-3 mb-3 px-3">
            <div className="w-8 h-8 rounded-full bg-saffron-yellow flex items-center justify-center text-dark-green font-bold">
              {user?.name?.charAt(0) || "A"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {user?.name || "Admin"}
              </p>
              <p className="text-xs text-white/60 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 w-full rounded-lg hover:bg-white/10 transition-colors text-red-300"
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main content area */}
      <div className="lg:pl-64">
        {/* Top header */}
        <header className="sticky top-0 z-30 bg-white shadow-sm h-16 flex items-center px-4 lg:px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg mr-4"
          >
            <Menu className="h-6 w-6" />
          </button>
          <h1 className="text-lg font-semibold text-gray-800">Admin Panel</h1>
          <div className="ml-auto flex items-center gap-4">
            <Link
              href="/"
              className="text-sm text-gray-600 hover:text-dark-green"
            >
              View Site →
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
