"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Search, Filter, X, SlidersHorizontal } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useDebounce } from "@/lib/hooks";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SearchFilters {
  category?: string;
  isVeg?: boolean;
  isVegan?: boolean;
  isSpicy?: boolean;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
}

interface SearchResult {
  dishes: any[];
  categories: any[];
  query: string;
  filters: SearchFilters;
  meta: {
    total: number;
    page: number;
    totalPages: number;
  };
}

interface MenuSearchProps {
  onResults?: (results: SearchResult) => void;
  onFiltersChange?: (filters: SearchFilters) => void;
  className?: string;
}

const SORT_OPTIONS = [
  { value: "relevance", label: "Relevance" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "rating", label: "Rating" },
  { value: "popular", label: "Most Popular" },
  { value: "newest", label: "Newest" },
];

export default function MenuSearch({
  onResults,
  onFiltersChange,
  className,
}: MenuSearchProps) {
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<SearchFilters>({});
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);

  const debouncedQuery = useDebounce(query, 300);

  // Fetch categories for filter dropdown
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/menu/categories");
        const data = await response.json();
        if (data.success) {
          setCategories(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // Perform search when query or filters change
  const performSearch = useCallback(
    async (searchQuery: string, searchFilters: SearchFilters) => {
      if (!searchQuery.trim() || searchQuery.length < 2) {
        onResults?.({
          dishes: [],
          categories: [],
          query: searchQuery,
          filters: searchFilters,
          meta: { total: 0, page: 1, totalPages: 0 },
        });
        return;
      }

      setLoading(true);

      try {
        const params = new URLSearchParams({
          q: searchQuery,
          ...Object.fromEntries(
            Object.entries(searchFilters)
              .filter(
                ([, value]) =>
                  value !== undefined && value !== null && value !== "",
              )
              .map(([key, value]) => [key, String(value)]),
          ),
        });

        const response = await fetch(`/api/menu/search?${params}`);
        const data = await response.json();

        if (data.success) {
          onResults?.(data.data);
        } else {
          console.error("Search error:", data.error);
        }
      } catch (error) {
        console.error("Search failed:", error);
      } finally {
        setLoading(false);
      }
    },
    [onResults],
  );

  // Effect for search execution
  useEffect(() => {
    if (debouncedQuery) {
      performSearch(debouncedQuery, filters);
    }
  }, [debouncedQuery, filters, performSearch]);

  // Update filters and notify parent
  const updateFilters = useCallback(
    (newFilters: Partial<SearchFilters>) => {
      const updatedFilters = { ...filters, ...newFilters };
      setFilters(updatedFilters);
      onFiltersChange?.(updatedFilters);
    },
    [filters, onFiltersChange],
  );

  // Clear search
  const clearSearch = () => {
    setQuery("");
    setFilters({});
    setShowFilters(false);
    onResults?.({
      dishes: [],
      categories: [],
      query: "",
      filters: {},
      meta: { total: 0, page: 1, totalPages: 0 },
    });
  };

  // Active filter count
  const activeFilterCount = useMemo(() => {
    return Object.values(filters).filter(
      (value) => value !== undefined && value !== null && value !== "",
    ).length;
  }, [filters]);

  return (
    <div className={cn("space-y-4", className)}>
      {/* Search Input */}
      <div className="relative">
        <div className="relative flex items-center">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search dishes, categories..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className={cn(
              "w-full rounded-lg border border-border bg-background/50 py-3 pl-10 pr-12",
              "text-sm placeholder:text-muted-foreground",
              "focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20",
              "backdrop-blur-sm transition-all duration-200",
            )}
          />
          {(query || activeFilterCount > 0) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearSearch}
              className="absolute right-2 top-1/2 h-7 w-7 -translate-y-1/2 p-0"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>

        {loading && (
          <div className="absolute right-10 top-1/2 -translate-y-1/2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        )}
      </div>

      {/* Filter Toggle */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
          className="gap-2"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
          {activeFilterCount > 0 && (
            <span className="ml-1 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
              {activeFilterCount}
            </span>
          )}
        </Button>
      </div>

      {/* Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="space-y-4 rounded-lg border border-border bg-background/50 p-4 backdrop-blur-sm">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {/* Category Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <select
                    value={filters.category || ""}
                    onChange={(e) =>
                      updateFilters({ category: e.target.value || undefined })
                    }
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20"
                  >
                    <option value="">All Categories</option>
                    {categories.map((cat) => (
                      <option key={cat.slug} value={cat.slug}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sort By */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Sort By</label>
                  <select
                    value={filters.sortBy || "relevance"}
                    onChange={(e) => updateFilters({ sortBy: e.target.value })}
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20"
                  >
                    {SORT_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price Range */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Price Range (₹)</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.minPrice || ""}
                      onChange={(e) =>
                        updateFilters({
                          minPrice: e.target.value
                            ? parseInt(e.target.value)
                            : undefined,
                        })
                      }
                      className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.maxPrice || ""}
                      onChange={(e) =>
                        updateFilters({
                          maxPrice: e.target.value
                            ? parseInt(e.target.value)
                            : undefined,
                        })
                      }
                      className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20"
                    />
                  </div>
                </div>
              </div>

              {/* Dietary Preferences */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Dietary Preferences
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { key: "isVeg", label: "Vegetarian", color: "green" },
                    { key: "isVegan", label: "Vegan", color: "emerald" },
                    { key: "isSpicy", label: "Spicy", color: "red" },
                  ].map(({ key, label, color }) => (
                    <button
                      key={key}
                      onClick={() =>
                        updateFilters({
                          [key]: filters[key as keyof SearchFilters]
                            ? undefined
                            : true,
                        })
                      }
                      className={cn(
                        "rounded-full border px-3 py-1 text-xs font-medium transition-all",
                        filters[key as keyof SearchFilters]
                          ? `border-${color}-500 bg-${color}-500 text-white`
                          : "border-border bg-background hover:border-primary",
                      )}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
