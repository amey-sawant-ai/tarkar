"use client";

import { motion } from "motion/react";
import { useState, useEffect } from "react";
import DashboardNavbar from "@/components/DashboardNavbar";
import {
  Heart,
  Loader2,
  X,
  ShoppingCart,
  AlertCircle,
  Package,
  HeartOff,
  Clock,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useRouter } from "next/navigation";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import { formatPrice } from "@/lib/utils";

interface FavoriteDish {
  _id: string;
  name: string;
  shortDescription: string;
  pricePaise: number;
  imageUrl: string;
  isVeg?: boolean;
  isSpicy?: boolean;
  categoryId?: {
    _id: string;
    name: string;
  };
  slug: string;
  orderCount?: number;
  lastOrderedAt?: string | null;
}

interface FavoritesResponse {
  success: boolean;
  data: FavoriteDish[];
  error?: {
    code: string;
    message: string;
  };
}

// Helper to format last ordered date
function formatLastOrdered(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30)
    return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? "s" : ""} ago`;
  if (diffDays < 365)
    return `${Math.floor(diffDays / 30)} month${Math.floor(diffDays / 30) > 1 ? "s" : ""} ago`;
  return date.toLocaleDateString();
}

export default function FavoritesPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const { addItem } = useCart();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { showToast } = useToast();
  const [favorites, setFavorites] = useState<FavoriteDish[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        router.push("/login");
        return;
      }
      fetchFavorites();
    }
  }, [authLoading, isAuthenticated, router]);

  const fetchFavorites = async () => {
    if (!isAuthenticated) return;

    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("auth_token");
      const response = await fetch("/api/user/favorites", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data: FavoritesResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || `Error ${response.status}`);
      }

      if (data.success) {
        setFavorites(data.data || []);
      } else {
        setError(data.error?.message || "Failed to fetch favorites");
      }
    } catch (error) {
      console.error("Error fetching favorites:", error);
      setError(
        error instanceof Error ? error.message : "Failed to fetch favorites",
      );
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (dishId: string) => {
    setRemovingId(dishId);
    try {
      // Use demo token if in demo mode, otherwise use stored token
      const token =
        process.env.NODE_ENV === "development" &&
          user?.email === "demo@tarkari.com"
          ? "demo-token"
          : localStorage.getItem("auth_token");

      const response = await fetch("/api/user/favorites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ dishId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || "Failed to remove favorite");
      }

      if (data.success) {
        setFavorites((prev) => prev.filter((dish) => dish._id !== dishId));
        showToast(data.data?.message || "Removed from favorites", "success");
      }
    } catch (error) {
      console.error("Error removing favorite:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to remove from favorites. Please try again.";
      showToast(errorMessage, "error");
    } finally {
      setRemovingId(null);
    }
  };

  const addToCart = (dish: FavoriteDish) => {
    addItem({
      dishId: dish._id,
      name: dish.name,
      price: dish.pricePaise,
      quantity: 1,
      image: dish.imageUrl,
    });
    showToast(`${dish.name} added to cart!`, "success");
  };

  const addAllToCart = () => {
    if (favorites.length === 0) return;

    favorites.forEach((dish) => {
      addItem({
        dishId: dish._id,
        name: dish.name,
        price: dish.pricePaise,
        quantity: 1,
        image: dish.imageUrl,
      });
    });
    showToast(`${favorites.length} items added to cart!`, "success");
  };

  const goToCheckout = () => {
    if (favorites.length === 0) return;
    addAllToCart();
    router.push("/dashboard/checkout");
  };

  if (authLoading || loading) {
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

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-warm-beige flex items-center justify-center">
        <div className="text-center">
          <p className="text-dark-green mb-4">
            Please log in to view your favorites
          </p>
          <Button onClick={() => router.push("/login")}>Go to Login</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warm-beige">
      <DashboardNavbar
        title={t("page.favorites.title")}
        subtitle={t("page.favorites.subtitle")}
      />

      <div className="container mx-auto px-6 py-12">
        {error ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto text-center py-16"
          >
            <AlertCircle className="w-24 h-24 text-red-500/20 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-dark-green mb-4">
              Error Loading Favorites
            </h2>
            <p className="text-dark-green/60 mb-8">{error}</p>
            <Button
              onClick={fetchFavorites}
              className="bg-tomato-red hover:bg-tomato-red/90"
            >
              Try Again
            </Button>
          </motion.div>
        ) : favorites.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto text-center py-16"
          >
            <Heart className="w-24 h-24 text-dark-green/20 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-dark-green mb-4">
              No Favorites Yet
            </h2>
            <p className="text-dark-green/60 mb-8">
              Start adding your favorite dishes to quickly reorder them
            </p>
            <Link href="/menu">
              <button className="bg-gradient-to-r from-tomato-red to-saffron-yellow text-white px-8 py-3 rounded-lg font-bold hover:scale-105 transition-transform">
                Browse Menu
              </button>
            </Link>
          </motion.div>
        ) : (
          <>
            {/* Quick Reorder Actions */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-6xl mx-auto mb-8 flex flex-wrap items-center justify-between gap-4 bg-white rounded-2xl shadow-lg p-4"
            >
              <div>
                <h3 className="font-bold text-dark-green">
                  {favorites.length} Favorite{favorites.length !== 1 ? "s" : ""}
                </h3>
                <p className="text-sm text-dark-green/60">
                  {formatPrice(favorites.reduce((sum, d) => sum + d.pricePaise, 0))}
                </p>
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={addAllToCart}
                  variant="outline"
                  className="border-tomato-red text-tomato-red hover:bg-tomato-red hover:text-white"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Add All to Cart
                </Button>
                <Button
                  onClick={goToCheckout}
                  className="bg-gradient-to-r from-tomato-red to-saffron-yellow text-white"
                >
                  Quick Reorder All
                </Button>
              </div>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {favorites.map((dish, index) => (
                <motion.div
                  key={dish._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
                >
                  {/* Image */}
                  <div className="relative overflow-hidden h-48 bg-dark-green/5">
                    {dish.imageUrl ? (
                      <img
                        src={dish.imageUrl}
                        alt={dish.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = "none";
                          target.nextElementSibling?.classList.remove("hidden");
                        }}
                      />
                    ) : null}

                    {/* Fallback icon when no image or image fails to load */}
                    <div
                      className={`${dish.imageUrl ? "hidden" : "flex"} w-full h-full bg-gradient-to-br from-tomato-red/20 to-saffron-yellow/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                    >
                      <Package className="w-16 h-16 text-dark-green/40" />
                    </div>

                    {/* Remove from Favorites */}
                    <button
                      onClick={() => removeFavorite(dish._id)}
                      disabled={removingId === dish._id}
                      className="absolute top-4 right-4 p-2 rounded-full bg-white shadow-lg hover:scale-110 transition-all disabled:opacity-50 group/heart"
                      title="Remove from favorites"
                    >
                      {removingId === dish._id ? (
                        <Loader2 className="w-5 h-5 text-tomato-red animate-spin" />
                      ) : (
                        <Heart className="w-5 h-5 fill-tomato-red text-tomato-red group-hover/heart:fill-transparent" />
                      )}
                    </button>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs font-semibold text-dark-green/60">
                        {dish.categoryId?.name || "Main Course"}
                      </p>
                      <div className="flex items-center gap-1">
                        {dish.isVeg && (
                          <div className="w-3 h-3 border border-green-600 flex items-center justify-center">
                            <div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div>
                          </div>
                        )}
                        {dish.isSpicy && (
                          <span className="text-red-500 text-sm">🌶️</span>
                        )}
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-dark-green mb-2 group-hover:text-tomato-red transition-colors">
                      {dish.name}
                    </h3>
                    <p className="text-dark-green/70 text-sm mb-4 line-clamp-2">
                      {dish.shortDescription ||
                        "Delicious and freshly prepared"}
                    </p>

                    {/* Order Stats */}
                    {(dish.orderCount && dish.orderCount > 0) ||
                      dish.lastOrderedAt ? (
                      <div className="flex items-center gap-3 mb-4 text-xs text-dark-green/60">
                        {dish.orderCount && dish.orderCount > 0 && (
                          <div className="flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" />
                            <span>Ordered {dish.orderCount}x</span>
                          </div>
                        )}
                        {dish.lastOrderedAt && (
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{formatLastOrdered(dish.lastOrderedAt)}</span>
                          </div>
                        )}
                      </div>
                    ) : null}

                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold text-tomato-red">
                        {formatPrice(dish.pricePaise)}
                      </span>
                      <button
                        onClick={() => addToCart(dish)}
                        className="p-2 rounded-lg bg-dark-green text-white hover:scale-110 transition-transform"
                      >
                        <ShoppingCart className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
