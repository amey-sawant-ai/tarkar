"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ShoppingCart, Heart, Star, Flame } from "lucide-react";
import Image from "next/image";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MenuSearch from "@/components/MenuSearch";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface DishData {
  _id: string;
  name: string;
  description: string;
  shortDescription: string;
  pricePaise: number;
  imageUrl: string;
  isVeg?: boolean;
  isVegan?: boolean;
  isSpicy?: boolean;
  spicyLevel?: number;
  avgRating?: number;
  totalReviews?: number;
  categoryId: {
    _id: string;
    name: string;
    slug: string;
  };
  tags?: string[];
  slug: string;
}

interface SearchResult {
  dishes: DishData[];
  categories: any[];
  query: string;
  filters: any;
  meta: {
    total: number;
    page: number;
    totalPages: number;
  };
}

export default function SearchMenuPage() {
  const { t } = useLanguage();
  const { addItem, items: cartItems } = useCart();
  const [searchResults, setSearchResults] = useState<SearchResult | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  const handleSearchResults = useCallback((results: SearchResult) => {
    setSearchResults(results);
  }, []);

  const handleAddToCart = (dish: DishData) => {
    addItem({
      dishId: dish._id,
      name: dish.name,
      price: dish.pricePaise,
      quantity: 1,
      image: dish.imageUrl || "/dish-placeholder.jpg",
    });
  };

  const toggleFavorite = async (dishId: string) => {
    try {
      const response = await fetch("/api/user/favorites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Add auth header when implemented
        },
        body: JSON.stringify({ dishId }),
      });

      if (response.ok) {
        const newFavorites = new Set(favorites);
        if (newFavorites.has(dishId)) {
          newFavorites.delete(dishId);
        } else {
          newFavorites.add(dishId);
        }
        setFavorites(newFavorites);
      }
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
    }
  };

  const getItemQuantityInCart = (dishId: string) => {
    const item = cartItems.find((item) => item.dishId === dishId);
    return item?.quantity || 0;
  };

  const DishCard = ({ dish }: { dish: DishData }) => {
    const isInCart = getItemQuantityInCart(dish._id) > 0;
    const isFavorited = favorites.has(dish._id);

    return (
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="group relative overflow-hidden rounded-xl bg-white shadow-md transition-all duration-300 hover:shadow-xl hover:scale-[1.02]"
      >
        {/* Image */}
        <div className="relative h-48 overflow-hidden">
          <Image
            src={dish.imageUrl || "/dish-placeholder.jpg"}
            alt={dish.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />

          {/* Dietary indicators */}
          <div className="absolute left-3 top-3 flex gap-1">
            {dish.isVeg && (
              <div className="rounded-full bg-green-500 p-1">
                <div className="h-2 w-2 rounded-full bg-white" />
              </div>
            )}
            {dish.isVegan && (
              <div className="rounded bg-green-600 px-1.5 py-0.5 text-xs font-medium text-white">
                VEGAN
              </div>
            )}
            {dish.isSpicy && (
              <div className="rounded bg-red-500 p-1">
                <Flame className="h-3 w-3 text-white" />
              </div>
            )}
          </div>

          {/* Favorite button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => toggleFavorite(dish._id)}
            className="absolute right-3 top-3 h-8 w-8 rounded-full bg-white/80 p-0 backdrop-blur-sm hover:bg-white"
          >
            <Heart
              className={cn(
                "h-4 w-4 transition-colors",
                isFavorited ? "fill-red-500 text-red-500" : "text-gray-600",
              )}
            />
          </Button>

          {/* Category tag */}
          <div className="absolute bottom-3 left-3 rounded-md bg-black/60 px-2 py-1 text-xs text-white backdrop-blur-sm">
            {dish.categoryId.name}
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="mb-2 flex items-start justify-between">
            <h3 className="font-semibold text-gray-900 line-clamp-1">
              {dish.name}
            </h3>
            <span className="font-bold text-primary">
              {formatPrice(dish.pricePaise)}
            </span>
          </div>

          <p className="mb-3 text-sm text-gray-600 line-clamp-2">
            {dish.shortDescription || dish.description}
          </p>

          {/* Rating */}
          {dish.avgRating && dish.totalReviews && (
            <div className="mb-3 flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">
                {dish.avgRating.toFixed(1)}
              </span>
              <span className="text-sm text-gray-500">
                ({dish.totalReviews} reviews)
              </span>
            </div>
          )}

          {/* Tags */}
          {dish.tags && dish.tags.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-1">
              {dish.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Add to cart button */}
          <Button
            onClick={() => handleAddToCart(dish)}
            className="w-full gap-2"
            variant={isInCart ? "secondary" : "default"}
          >
            <ShoppingCart className="h-4 w-4" />
            {isInCart
              ? `In Cart (${getItemQuantityInCart(dish._id)})`
              : "Add to Cart"}
          </Button>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-warm-beige">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="mb-4 text-4xl font-bold text-dark-green">
            Search Our Menu
          </h1>
          <p className="text-lg text-gray-600">
            Discover delicious dishes from our extensive menu
          </p>
        </div>

        {/* Search Component */}
        <div className="mb-8">
          <MenuSearch
            onResults={handleSearchResults}
            className="mx-auto max-w-4xl"
          />
        </div>

        {/* Search Results */}
        <div className="space-y-8">
          {searchResults && searchResults.query && (
            <>
              {/* Results Summary */}
              <div className="text-center">
                <h2 className="text-xl font-semibold text-dark-green">
                  Search Results for "{searchResults.query}"
                </h2>
                <p className="text-gray-600">
                  Found {searchResults.meta.total} dishes
                  {searchResults.filters.category &&
                    ` in ${searchResults.filters.category}`}
                </p>
              </div>

              {/* Category Results */}
              {searchResults.categories.length > 0 && (
                <div>
                  <h3 className="mb-4 text-lg font-semibold text-dark-green">
                    Related Categories
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {searchResults.categories.map((category) => (
                      <Button
                        key={category.slug}
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          // Update search with category filter
                        }}
                        className="rounded-full"
                      >
                        {category.name}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Dish Results */}
              {searchResults.dishes.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  <AnimatePresence>
                    {searchResults.dishes.map((dish) => (
                      <DishCard key={dish._id} dish={dish} />
                    ))}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="py-12 text-center">
                  <p className="text-lg text-gray-600">
                    No dishes found for "{searchResults.query}"
                  </p>
                  <p className="text-sm text-gray-500">
                    Try adjusting your search terms or filters
                  </p>
                </div>
              )}

              {/* Pagination */}
              {searchResults.meta.totalPages > 1 && (
                <div className="flex justify-center">
                  <div className="flex gap-2">
                    {Array.from(
                      { length: searchResults.meta.totalPages },
                      (_, i) => (
                        <Button
                          key={i + 1}
                          variant={
                            searchResults.meta.page === i + 1
                              ? "default"
                              : "outline"
                          }
                          size="sm"
                          onClick={() => {
                            // Handle pagination
                          }}
                        >
                          {i + 1}
                        </Button>
                      ),
                    )}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Empty state */}
          {!searchResults && (
            <div className="py-12 text-center">
              <p className="text-lg text-gray-600">
                Start typing to search our delicious menu
              </p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
