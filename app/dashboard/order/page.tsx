"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import {
  Search,
  ShoppingCart,
  Filter,
  X,
  Plus,
  Minus,
  Loader2,
  ShoppingBag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import DashboardNavbar from "@/components/DashboardNavbar";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { cn, formatPrice, calculateOrderTotal } from "@/lib/utils";
import { PRICING } from "@/lib/constants";

// Types
interface Dish {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  pricePaise: number;
  discountPricePaise?: number;
  imageUrl?: string;
  isVeg: boolean;
  isSpicy?: boolean;
  spicyLevel?: number;
  categoryId: string;
  categoryName?: string;
  isAvailable: boolean;
  isFeatured?: boolean;
  isPopular?: boolean;
}

interface Category {
  _id: string;
  name: string;
  slug: string;
}

export default function OrderPage() {
  const router = useRouter();
  const { items, addItem, removeItem, updateQuantity, totalPrice, totalItems } =
    useCart();
  const { token, isAuthenticated, isLoading: authLoading } = useAuth();

  // State
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000]); // in paise
  const [showCart, setShowCart] = useState(false);
  const [showVegOnly, setShowVegOnly] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login?redirect=/dashboard/order");
    }
  }, [authLoading, isAuthenticated, router]);

  // Fetch dishes and categories
  useEffect(() => {
    async function fetchData() {
      try {
        const [dishesRes, categoriesRes] = await Promise.all([
          fetch("/api/menu/dishes?pageSize=200"),
          fetch("/api/menu/categories"),
        ]);

        const [dishesData, categoriesData] = await Promise.all([
          dishesRes.json(),
          categoriesRes.json(),
        ]);

        if (dishesData.success) {
          // Map category names to dishes
          const categoryMap = new Map(
            categoriesData.success
              ? categoriesData.data.map((c: Category) => [c._id, c.name])
              : [],
          );
          const dishesWithCategory = dishesData.data.map((dish: Dish) => ({
            ...dish,
            categoryName: categoryMap.get(dish.categoryId) || "Other",
          }));
          setDishes(dishesWithCategory);
        }

        if (categoriesData.success) {
          setCategories(categoriesData.data);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  // Filter dishes
  const filteredDishes = useMemo(() => {
    return dishes.filter((dish) => {
      if (!dish.isAvailable) return false;

      const matchesSearch =
        dish.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dish.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "All" || dish.categoryName === selectedCategory;
      const matchesPrice =
        dish.pricePaise >= priceRange[0] && dish.pricePaise <= priceRange[1];
      const matchesVeg = !showVegOnly || dish.isVeg;

      return matchesSearch && matchesCategory && matchesPrice && matchesVeg;
    });
  }, [dishes, searchQuery, selectedCategory, priceRange, showVegOnly]);

  // Cart helpers
  const getCartQuantity = (dishId: string) => {
    const item = items.find((i) => i.dishId === dishId);
    return item?.quantity || 0;
  };

  const handleAddToCart = (dish: Dish) => {
    addItem({
      dishId: dish._id,
      name: dish.name,
      price: dish.discountPricePaise || dish.pricePaise,
      quantity: 1,
      image: dish.imageUrl || "/placeholder-dish.svg",
    });
  };

  const handleRemoveFromCart = (dishId: string) => {
    const item = items.find((i) => i.dishId === dishId);
    if (item && item.quantity > 1) {
      updateQuantity(dishId, item.quantity - 1);
    } else {
      removeItem(dishId);
    }
  };

  // Placeholder for handleProceedToCheckout if needed
  const handleProceedToCheckout = () => {
    setShowCart(false);
    router.push("/dashboard/checkout");
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-warm-beige flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-tomato-red" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warm-beige">
      <DashboardNavbar
        title="Order Food"
        subtitle="Browse & Order Your Favorites"
      />

      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-end">
          <Button
            onClick={() => setShowCart(!showCart)}
            className="relative bg-gradient-to-r from-tomato-red to-saffron-yellow text-white hover:shadow-xl"
          >
            <ShoppingCart className="w-5 h-5 mr-2" />
            Cart
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 w-6 h-6 bg-white text-tomato-red rounded-full text-xs font-bold flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              <div className="flex items-center gap-2 mb-6">
                <Filter className="w-5 h-5 text-dark-green" />
                <h3 className="text-xl font-bold text-dark-green">Filters</h3>
              </div>

              <div className="space-y-6">
                {/* Veg Only Toggle */}
                <div>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showVegOnly}
                      onChange={(e) => setShowVegOnly(e.target.checked)}
                      className="w-5 h-5 rounded border-dark-green/30 text-green-600 focus:ring-green-500"
                    />
                    <span className="font-semibold text-dark-green flex items-center gap-2">
                      <span className="w-4 h-4 bg-green-600 rounded-full border-2 border-green-600"></span>
                      Veg Only
                    </span>
                  </label>
                </div>

                {/* Category Filter */}
                <div>
                  <h4 className="text-sm font-semibold text-dark-green mb-3">
                    Category
                  </h4>
                  <div className="space-y-2">
                    <button
                      onClick={() => setSelectedCategory("All")}
                      className={cn(
                        "w-full text-left px-4 py-2 rounded-lg font-semibold transition-all",
                        selectedCategory === "All"
                          ? "bg-gradient-to-r from-tomato-red to-saffron-yellow text-white"
                          : "bg-warm-beige/30 text-dark-green hover:bg-warm-beige/50",
                      )}
                    >
                      All
                    </button>
                    {categories.map((category) => (
                      <button
                        key={category._id}
                        onClick={() => setSelectedCategory(category.name)}
                        className={cn(
                          "w-full text-left px-4 py-2 rounded-lg font-semibold transition-all",
                          selectedCategory === category.name
                            ? "bg-gradient-to-r from-tomato-red to-saffron-yellow text-white"
                            : "bg-warm-beige/30 text-dark-green hover:bg-warm-beige/50",
                        )}
                      >
                        {category.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Range Filter */}
                <div>
                  <h4 className="text-sm font-semibold text-dark-green mb-3">
                    Price Range
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-dark-green/70">
                        {formatPrice(priceRange[0])}
                      </span>
                      <span className="text-dark-green/70">
                        {formatPrice(priceRange[1])}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="50000"
                      step="1000"
                      value={priceRange[1]}
                      onChange={(e) =>
                        setPriceRange([0, parseInt(e.target.value)])
                      }
                      className="w-full h-2 bg-warm-beige/50 rounded-lg appearance-none cursor-pointer accent-tomato-red"
                    />
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => setPriceRange([0, 15000])}
                        className="px-3 py-1 text-xs rounded-lg bg-warm-beige/30 text-dark-green hover:bg-warm-beige/50 transition-all"
                      >
                        Under {formatPrice(15000)}
                      </button>
                      <button
                        onClick={() => setPriceRange([15000, 25000])}
                        className="px-3 py-1 text-xs rounded-lg bg-warm-beige/30 text-dark-green hover:bg-warm-beige/50 transition-all"
                      >
                        {formatPrice(15000).replace(/\.00$/, '')}-{formatPrice(25000).replace(/\.00$/, '')}
                      </button>
                      <button
                        onClick={() => setPriceRange([25000, 50000])}
                        className="px-3 py-1 text-xs rounded-lg bg-warm-beige/30 text-dark-green hover:bg-warm-beige/50 transition-all"
                      >
                        Above {formatPrice(25000)}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Clear Filters */}
                {(selectedCategory !== "All" ||
                  showVegOnly ||
                  priceRange[0] !== 0 ||
                  priceRange[1] !== 50000) && (
                    <Button
                      variant="outline"
                      className="w-full border-tomato-red text-tomato-red hover:bg-tomato-red hover:text-white"
                      onClick={() => {
                        setSelectedCategory("All");
                        setShowVegOnly(false);
                        setPriceRange([0, 50000]);
                      }}
                    >
                      Clear All Filters
                    </Button>
                  )}
              </div>
            </div>
          </motion.div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-green/40" />
                <input
                  type="text"
                  placeholder="Search for dishes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-dark-green/20 focus:border-tomato-red focus:outline-none transition-all text-dark-green font-semibold"
                />
              </div>
              <p className="text-dark-green/60 text-sm mt-3">
                Found {filteredDishes.length} dishes
              </p>
            </motion.div>

            {/* Dishes Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDishes.map((dish, index) => {
                const quantity = getCartQuantity(dish._id);
                const price = dish.discountPricePaise || dish.pricePaise;

                return (
                  <motion.div
                    key={dish._id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 + index * 0.03 }}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                  >
                    <div className="relative h-40">
                      <Image
                        src={dish.imageUrl || "/placeholder-dish.svg"}
                        alt={dish.name}
                        fill
                        className="object-cover"
                      />
                      {/* Veg/Non-veg indicator */}
                      <div className="absolute top-3 left-3">
                        <div
                          className={cn(
                            "w-5 h-5 rounded border-2 flex items-center justify-center",
                            dish.isVeg ? "border-green-600" : "border-red-600",
                          )}
                        >
                          <div
                            className={cn(
                              "w-2.5 h-2.5 rounded-full",
                              dish.isVeg ? "bg-green-600" : "bg-red-600",
                            )}
                          />
                        </div>
                      </div>
                      {dish.isSpicy && (
                        <div className="absolute top-3 right-3 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                          🌶️ Spicy
                        </div>
                      )}
                      {dish.discountPricePaise && (
                        <div className="absolute bottom-3 left-3 bg-saffron-yellow text-dark-green text-xs px-2 py-0.5 rounded-full font-bold">
                          {Math.round(
                            (1 - dish.discountPricePaise / dish.pricePaise) *
                            100,
                          )}
                          % OFF
                        </div>
                      )}
                    </div>

                    <div className="p-4">
                      <h3 className="font-bold text-dark-green text-lg mb-1 truncate">
                        {dish.name}
                      </h3>
                      <p className="text-dark-green/60 text-sm mb-3 line-clamp-2">
                        {dish.shortDescription ||
                          dish.description ||
                          "Delicious dish from our kitchen"}
                      </p>

                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-xl font-bold text-tomato-red">
                            {formatPrice(price)}
                          </span>
                          {dish.discountPricePaise && (
                            <span className="text-sm text-dark-green/40 line-through ml-2">
                              {formatPrice(dish.pricePaise)}
                            </span>
                          )}
                        </div>

                        {quantity === 0 ? (
                          <Button
                            size="sm"
                            onClick={() => handleAddToCart(dish)}
                            className="bg-gradient-to-r from-tomato-red to-saffron-yellow text-white"
                          >
                            <Plus className="w-4 h-4 mr-1" />
                            Add
                          </Button>
                        ) : (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleRemoveFromCart(dish._id)}
                              className="w-8 h-8 rounded-full bg-tomato-red/10 text-tomato-red hover:bg-tomato-red hover:text-white transition-all flex items-center justify-center"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="font-bold text-dark-green w-6 text-center">
                              {quantity}
                            </span>
                            <button
                              onClick={() => handleAddToCart(dish)}
                              className="w-8 h-8 rounded-full bg-saffron-yellow/20 text-saffron-yellow hover:bg-saffron-yellow hover:text-white transition-all flex items-center justify-center"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {filteredDishes.length === 0 && (
              <div className="text-center py-16">
                <Search className="w-16 h-16 text-dark-green/20 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-dark-green mb-2">
                  No dishes found
                </h3>
                <p className="text-dark-green/60">
                  Try adjusting your search or filters
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Cart Sidebar */}
      {showCart && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setShowCart(false)}
          ></div>
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3 }}
            className="fixed right-0 top-0 bottom-0 w-full sm:w-96 bg-white shadow-2xl z-50 overflow-y-auto"
          >
            <div className="sticky top-0 bg-gradient-to-r from-dark-green to-dark-green/95 text-white p-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-serif font-bold">Your Cart</h2>
                <p className="text-warm-beige/70 text-sm">{totalItems} items</p>
              </div>
              <button
                onClick={() => setShowCart(false)}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              {items.length === 0 ? (
                <div className="text-center py-16">
                  <ShoppingCart className="w-16 h-16 text-dark-green/20 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-dark-green mb-2">
                    Your cart is empty
                  </h3>
                  <p className="text-dark-green/60 mb-6">
                    Add some delicious dishes!
                  </p>
                  <Button
                    onClick={() => setShowCart(false)}
                    className="bg-gradient-to-r from-tomato-red to-saffron-yellow text-white"
                  >
                    Browse Menu
                  </Button>
                </div>
              ) : (
                <>
                  <div className="space-y-4 mb-6">
                    {items.map((item) => (
                      <div
                        key={item.dishId}
                        className="flex items-center gap-4 p-4 bg-warm-beige/30 rounded-xl"
                      >
                        {item.image && (
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={60}
                            height={60}
                            className="rounded-lg object-cover"
                          />
                        )}
                        {!item.image && (
                          <div className="w-[60px] h-[60px] bg-warm-beige rounded-lg flex items-center justify-center text-dark-green/40">
                            <ShoppingBag className="w-6 h-6" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-dark-green truncate">
                            {item.name}
                          </h4>
                          <p className="text-tomato-red font-semibold">
                            {formatPrice(item.price)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleRemoveFromCart(item.dishId)}
                            className="w-8 h-8 rounded-full bg-tomato-red/10 text-tomato-red hover:bg-tomato-red hover:text-white transition-all flex items-center justify-center"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="font-bold text-dark-green w-8 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => addItem({ ...item, quantity: 1 })}
                            className="w-8 h-8 rounded-full bg-saffron-yellow/20 text-saffron-yellow hover:bg-saffron-yellow hover:text-white transition-all flex items-center justify-center"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t-2 border-dark-green/10 pt-6 space-y-4">
                    {(() => {
                      const totals = calculateOrderTotal(totalPrice);
                      return (
                        <>
                          <div className="flex items-center justify-between text-lg">
                            <span className="text-dark-green/70 font-semibold">
                              Subtotal
                            </span>
                            <span className="font-bold text-dark-green">
                              {formatPrice(totals.subtotal)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-lg">
                            <span className="text-dark-green/70 font-semibold">
                              Tax ({PRICING.taxPercent}%)
                            </span>
                            <span className="font-bold text-dark-green">
                              {formatPrice(totals.tax)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-lg">
                            <span className="text-dark-green/70 font-semibold">
                              Delivery Fee
                            </span>
                            <span className="font-bold text-dark-green">
                              {formatPrice(totals.deliveryFee)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-2xl border-t-2 border-dark-green/10 pt-4">
                            <span className="text-dark-green font-bold">Total</span>
                            <span className="font-bold text-tomato-red">
                              {formatPrice(totals.total)}
                            </span>
                          </div>
                        </>
                      );
                    })()}
                    <Button
                      onClick={handleProceedToCheckout}
                      className="w-full bg-gradient-to-r from-tomato-red to-saffron-yellow text-white hover:shadow-2xl font-bold py-6 text-lg"
                    >
                      Proceed to Checkout
                    </Button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
}
