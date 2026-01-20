"use client";

import Link from "next/link";
import { useEffect, useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { motion, AnimatePresence } from "motion/react";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Loader2,
  Heart,
  Search,
  Flame,
  ShoppingCart,
  X,
  Filter,
  SlidersHorizontal,
  ArrowRight,
} from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/contexts/ToastContext";
import { useAuth } from "@/contexts/AuthContext";

interface DishData {
  _id: string;
  name: string;
  shortDescription: string;
  pricePaise: number;
  imageUrl: string;
  isVeg?: boolean;
  isSpicy?: boolean;
  spicyLevel?: number;
  isAvailable?: boolean;
  categoryId: { name: string; slug: string };
}

// Custom debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default function Menu() {
  const { t } = useLanguage();
  const router = useRouter();
  const { addItem, totalItems, totalPrice } = useCart();
  const { showToast } = useToast();
  const { isAuthenticated } = useAuth();
  const [dishes, setDishes] = useState<DishData[]>([]);
  const [filteredDishes, setFilteredDishes] = useState<DishData[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Record<string, DishData[]>>({});
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState([0, 50000]); // in paise
  const [showVegOnly, setShowVegOnly] = useState(false);
  const [showSpicyOnly, setShowSpicyOnly] = useState(false);
  const [hideUnavailable, setHideUnavailable] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState<string | null>(null);

  // Debounce search term for performance
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    const fetchDishes = async () => {
      try {
        // Fetch all dishes with pagination - include unavailable dishes to show with overlay
        const response = await fetch(
          "/api/menu/dishes?pageSize=100&includeUnavailable=true",
        );
        const data = await response.json();

        if (data.success && data.data) {
          setDishes(data.data);
          setFilteredDishes(data.data);

          // Group dishes by category
          const grouped: Record<string, DishData[]> = {};
          data.data.forEach((dish: DishData) => {
            const categoryName = dish.categoryId?.name || "Other";
            if (!grouped[categoryName]) {
              grouped[categoryName] = [];
            }
            grouped[categoryName].push(dish);
          });
          setCategories(grouped);
        }

        // Check if user is logged in and fetch favorites
        const token = localStorage.getItem("auth_token");
        if (token) {
          try {
            const favResponse = await fetch("/api/user/favorites", {
              headers: { Authorization: `Bearer ${token}` },
            });
            if (favResponse.ok) {
              const favData = await favResponse.json();
              const favIds = new Set(
                favData.data?.map((dish: DishData) => dish._id) || [],
              );
              setFavorites(favIds);
            }
          } catch (error) {
            console.error("Error fetching favorites:", error);
          }
        }
      } catch (error) {
        console.error("Failed to fetch dishes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDishes();
  }, []);

  // Filter dishes based on search, category, price, veg/spicy
  useEffect(() => {
    let filtered = dishes.filter((dish) => {
      const matchesSearch =
        debouncedSearchTerm === "" ||
        dish.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        dish.shortDescription
          .toLowerCase()
          .includes(debouncedSearchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === null || dish.categoryId?.name === selectedCategory;

      const matchesPrice =
        dish.pricePaise >= priceRange[0] && dish.pricePaise <= priceRange[1];

      const matchesVeg = !showVegOnly || dish.isVeg;
      const matchesSpicy = !showSpicyOnly || dish.isSpicy;
      const matchesAvailability =
        !hideUnavailable || dish.isAvailable !== false;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesPrice &&
        matchesVeg &&
        matchesSpicy &&
        matchesAvailability
      );
    });

    setFilteredDishes(filtered);
  }, [
    debouncedSearchTerm,
    selectedCategory,
    priceRange,
    showVegOnly,
    showSpicyOnly,
    hideUnavailable,
    dishes,
  ]);

  // Clear all filters
  const clearFilters = useCallback(() => {
    setSearchTerm("");
    setSelectedCategory(null);
    setPriceRange([0, 50000]);
    setShowVegOnly(false);
    setShowSpicyOnly(false);
    setHideUnavailable(false);
  }, []);

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return (
      searchTerm !== "" ||
      selectedCategory !== null ||
      priceRange[1] !== 50000 ||
      showVegOnly ||
      showSpicyOnly ||
      hideUnavailable
    );
  }, [
    searchTerm,
    selectedCategory,
    priceRange,
    showVegOnly,
    showSpicyOnly,
    hideUnavailable,
  ]);

  const toggleFavorite = async (dishId: string) => {
    if (!isAuthenticated) {
      showToast("Please login to add favorites", "error");
      router.push("/login");
      return;
    }

    setFavoriteLoading(dishId);
    try {
      const token = localStorage.getItem("auth_token");
      const response = await fetch("/api/user/favorites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ dishId }),
      });

      if (response.ok) {
        const result = await response.json();
        const isFavorite = result.data?.isFavorite;

        setFavorites((prev) => {
          const newSet = new Set(prev);
          if (isFavorite) {
            newSet.add(dishId);
          } else {
            newSet.delete(dishId);
          }
          return newSet;
        });

        // Show toast outside of setState callback to avoid React warning
        showToast(
          isFavorite ? "Added to favorites!" : "Removed from favorites",
          "success",
        );
      } else {
        showToast("Failed to update favorites", "error");
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      showToast("Failed to update favorites", "error");
    } finally {
      setFavoriteLoading(null);
    }
  };

  const handleAddToCart = (dish: DishData) => {
    addItem({
      dishId: dish._id,
      name: dish.name,
      price: dish.pricePaise,
      quantity: 1,
      image: dish.imageUrl,
    });
    showToast(`${dish.name} added to cart!`, "success");
  };

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

  return (
    <div className="min-h-screen bg-warm-beige">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-dark-green via-dark-green/95 to-dark-green/90 py-24 md:py-32">
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23FFFFFF' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          ></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-white mb-6"
            >
              {t("menu.title")}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl md:text-2xl text-warm-beige/90 leading-relaxed"
            >
              {t("menu.subtitle")}
            </motion.p>
          </motion.div>
        </div>

        {/* Decorative wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" className="w-full h-auto">
            <path
              d="M0 0L60 10C120 20 240 40 360 46.7C480 53 600 47 720 43.3C840 40 960 40 1080 46.7C1200 53 1320 67 1380 73.3L1440 80V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V0Z"
              fill="#EEE3D1"
            />
          </svg>
        </div>
      </section>

      {/* Menu Navigation & Filters */}
      <section className="py-8 bg-warm-beige sticky top-16 z-40 border-b-2 border-dark-green/10">
        <div className="container mx-auto px-6">
          {/* Search Bar */}
          <div className="mb-6">
            <div className="flex gap-2">
              <div
                className={`flex-1 relative transition-all duration-300 ${isSearchFocused ? "ring-2 ring-dark-green rounded-lg" : ""}`}
              >
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-green/50" />
                <input
                  type="text"
                  placeholder="Search dishes by name or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  className="w-full pl-12 pr-12 py-3 rounded-lg border-2 border-dark-green/20 focus:outline-none focus:border-dark-green transition-colors bg-white"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-dark-green/10 rounded-full transition-colors"
                  >
                    <X className="w-4 h-4 text-dark-green/50" />
                  </button>
                )}
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-4 py-3 rounded-lg border-2 transition-all flex items-center gap-2 ${
                  showFilters || hasActiveFilters
                    ? "bg-dark-green text-white border-dark-green"
                    : "bg-white text-dark-green border-dark-green/20 hover:border-dark-green"
                }`}
              >
                <SlidersHorizontal className="w-5 h-5" />
                <span className="hidden sm:inline">Filters</span>
                {hasActiveFilters && (
                  <span className="bg-tomato-red text-white text-xs px-2 py-0.5 rounded-full">
                    Active
                  </span>
                )}
              </button>
            </div>

            {/* Search Results Info */}
            <AnimatePresence>
              {(debouncedSearchTerm || hasActiveFilters) && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-3 flex items-center justify-between"
                >
                  <p className="text-dark-green/70">
                    Found{" "}
                    <span className="font-bold text-dark-green">
                      {filteredDishes.length}
                    </span>
                    {filteredDishes.length === 1 ? " dish" : " dishes"}
                    {debouncedSearchTerm && (
                      <>
                        {" "}
                        matching "
                        <span className="font-semibold text-tomato-red">
                          {debouncedSearchTerm}
                        </span>
                        "
                      </>
                    )}
                  </p>
                  {hasActiveFilters && (
                    <button
                      onClick={clearFilters}
                      className="text-sm text-tomato-red hover:text-tomato-red/80 font-medium flex items-center gap-1"
                    >
                      <X className="w-4 h-4" />
                      Clear all filters
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Collapsible Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-white rounded-xl shadow-sm border border-dark-green/10">
                  {/* Price Range */}
                  <div>
                    <label className="block text-sm font-semibold text-dark-green mb-2">
                      Price: ₹{(priceRange[0] / 100).toFixed(0)} - ₹
                      {(priceRange[1] / 100).toFixed(0)}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="50000"
                      step="1000"
                      value={priceRange[1]}
                      onChange={(e) =>
                        setPriceRange([priceRange[0], parseInt(e.target.value)])
                      }
                      className="w-full accent-dark-green"
                    />
                  </div>

                  {/* Veg Only */}
                  <div className="flex items-center">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={showVegOnly}
                        onChange={(e) => setShowVegOnly(e.target.checked)}
                        className="w-5 h-5 accent-green-600"
                      />
                      <span className="font-semibold text-dark-green">
                        🌱 Vegetarian Only
                      </span>
                    </label>
                  </div>

                  {/* Spicy Only */}
                  <div className="flex items-center">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={showSpicyOnly}
                        onChange={(e) => setShowSpicyOnly(e.target.checked)}
                        className="w-5 h-5 accent-tomato-red"
                      />
                      <span className="font-semibold text-dark-green flex items-center gap-1">
                        <Flame className="w-4 h-4 text-tomato-red" /> Spicy
                      </span>
                    </label>
                  </div>

                  {/* Hide Unavailable */}
                  <div className="flex items-center">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={hideUnavailable}
                        onChange={(e) => setHideUnavailable(e.target.checked)}
                        className="w-5 h-5 accent-dark-green"
                      />
                      <span className="font-semibold text-dark-green">
                        ✓ Available Only
                      </span>
                    </label>
                  </div>

                  {/* Category Filter */}
                  <div>
                    <select
                      value={selectedCategory || ""}
                      onChange={(e) =>
                        setSelectedCategory(e.target.value || null)
                      }
                      className="w-full px-4 py-2 rounded-lg border-2 border-dark-green/20 focus:outline-none focus:border-dark-green font-semibold text-dark-green"
                    >
                      <option value="">All Categories</option>
                      {Object.keys(categories).map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Category Navigation */}
          <div className="flex justify-center gap-3 flex-wrap">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-5 py-2.5 rounded-full font-semibold transition-all shadow-md text-sm ${
                selectedCategory === null
                  ? "bg-gradient-to-r from-tomato-red to-saffron-yellow text-white"
                  : "bg-white text-dark-green hover:bg-gradient-to-r hover:from-tomato-red hover:to-saffron-yellow hover:text-white"
              }`}
            >
              All
            </button>
            {Object.keys(categories).map((categoryName) => (
              <button
                key={categoryName}
                onClick={() =>
                  setSelectedCategory(
                    selectedCategory === categoryName ? null : categoryName,
                  )
                }
                className={`px-5 py-2.5 rounded-full font-semibold transition-all shadow-md text-sm ${
                  selectedCategory === categoryName
                    ? "bg-gradient-to-r from-tomato-red to-saffron-yellow text-white"
                    : "bg-white text-dark-green hover:bg-gradient-to-r hover:from-tomato-red hover:to-saffron-yellow hover:text-white"
                }`}
              >
                {categoryName}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* No Results State */}
      {filteredDishes.length === 0 && !loading && (
        <section className="py-24 bg-warm-beige">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center max-w-md mx-auto"
            >
              <div className="w-24 h-24 bg-dark-green/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-12 h-12 text-dark-green/40" />
              </div>
              <h3 className="text-2xl font-bold text-dark-green mb-3">
                No dishes found
              </h3>
              <p className="text-dark-green/60 mb-6">
                {debouncedSearchTerm
                  ? `We couldn't find any dishes matching "${debouncedSearchTerm}"`
                  : "No dishes match your current filters"}
              </p>
              <button
                onClick={clearFilters}
                className="px-6 py-3 bg-gradient-to-r from-tomato-red to-saffron-yellow text-white font-semibold rounded-lg hover:scale-105 transition-transform"
              >
                Clear all filters
              </button>
            </motion.div>
          </div>
        </section>
      )}

      {/* Dynamic Menu Sections */}
      {Object.entries(categories).map(
        ([categoryName, categoryDishes], index) => {
          const filteredCategoryDishes = filteredDishes.filter(
            (d) => d.categoryId?.name === categoryName,
          );

          if (filteredCategoryDishes.length === 0) return null;

          return (
            <section
              key={categoryName}
              id={categoryName.toLowerCase().replace(/\s+/g, "-")}
              className={`py-16 md:py-24 ${
                index % 2 === 0 ? "bg-warm-beige" : "bg-white"
              }`}
            >
              <div className="container mx-auto px-6">
                <h2 className="text-4xl md:text-5xl font-serif font-bold text-dark-green mb-12 text-center">
                  {categoryName}{" "}
                  {categoryName === "Beverages" ? "Specials" : "Delights"}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredCategoryDishes.map((dish) => (
                    <motion.div
                      key={dish._id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      className={cn(
                        "group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 relative",
                        dish.isAvailable === false && "opacity-80",
                      )}
                    >
                      {/* Unavailable Overlay */}
                      {dish.isAvailable === false && (
                        <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-[1px] z-20 flex items-center justify-center">
                          <div className="bg-red-500 text-white px-4 py-2 rounded-lg font-bold shadow-lg transform -rotate-3">
                            Currently Unavailable
                          </div>
                        </div>
                      )}

                      {/* Image Container */}
                      <div className="relative overflow-hidden h-64 bg-dark-green/5">
                        <img
                          src={dish.imageUrl || "/placeholder-dish.jpg"}
                          alt={dish.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />

                        {/* Favorite Button */}
                        <button
                          onClick={() => toggleFavorite(dish._id)}
                          disabled={favoriteLoading === dish._id}
                          className="absolute top-4 right-4 p-2 rounded-full bg-white shadow-lg hover:scale-110 transition-all disabled:opacity-50"
                        >
                          {favoriteLoading === dish._id ? (
                            <Loader2 className="w-6 h-6 text-dark-green animate-spin" />
                          ) : (
                            <Heart
                              className={`w-6 h-6 ${
                                favorites.has(dish._id)
                                  ? "fill-tomato-red text-tomato-red"
                                  : "text-dark-green"
                              }`}
                            />
                          )}
                        </button>

                        {/* Tags */}
                        <div className="absolute top-4 left-4 flex gap-2">
                          {dish.isVeg && (
                            <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                              🌱 Veg
                            </span>
                          )}
                          {dish.isSpicy && (
                            <span className="bg-tomato-red text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                              <Flame className="w-3 h-3" />
                              Spicy
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-dark-green mb-2 group-hover:text-tomato-red transition-colors">
                          {dish.name}
                        </h3>
                        <p className="text-dark-green/70 text-sm mb-4 line-clamp-2">
                          {dish.shortDescription}
                        </p>

                        <div className="flex justify-between items-center">
                          <span className="text-2xl font-bold text-tomato-red">
                            ₹{(dish.pricePaise / 100).toFixed(0)}
                          </span>
                          <button
                            onClick={() => handleAddToCart(dish)}
                            disabled={dish.isAvailable === false}
                            className={cn(
                              "px-4 py-2 rounded-lg font-semibold transition-transform flex items-center gap-2",
                              dish.isAvailable === false
                                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                : "bg-gradient-to-r from-dark-green to-dark-green/80 text-white hover:scale-105",
                            )}
                          >
                            <ShoppingCart className="w-4 h-4" />
                            {dish.isAvailable === false ? "Unavailable" : "Add"}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>
          );
        },
      )}

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-dark-green to-dark-green/95 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23FFFFFF' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          ></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">
              Ready to Order?
            </h2>
            <p className="text-xl text-warm-beige/90 mb-8">
              Call us now for takeaway or dine-in reservations
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a
                href="tel:+919619267393"
                className="inline-flex items-center gap-3 bg-gradient-to-r from-tomato-red to-saffron-yellow text-white font-bold px-8 py-4 rounded-lg hover:scale-105 transition-all shadow-2xl"
              >
                📞 Call: +91 96192 67393
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center gap-3 bg-white text-dark-green font-bold px-8 py-4 rounded-lg hover:scale-105 transition-all shadow-2xl"
              >
                📍 Visit Us
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Floating Cart Button */}
      <AnimatePresence>
        {totalItems > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
          >
            <button
              onClick={() => router.push("/dashboard/checkout")}
              className="flex items-center gap-4 bg-gradient-to-r from-dark-green to-dark-green/90 text-white px-6 py-4 rounded-2xl shadow-2xl hover:scale-105 transition-all"
            >
              <div className="relative">
                <ShoppingCart className="w-6 h-6" />
                <span className="absolute -top-2 -right-2 bg-tomato-red text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {totalItems}
                </span>
              </div>
              <div className="text-left">
                <p className="text-xs text-warm-beige/80">Your Cart</p>
                <p className="font-bold">₹{(totalPrice / 100).toFixed(0)}</p>
              </div>
              <div className="flex items-center gap-1 bg-white/20 px-3 py-1.5 rounded-lg">
                <span className="font-semibold">Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
