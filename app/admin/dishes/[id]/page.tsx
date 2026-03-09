"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CURRENCY } from "@/lib/constants";

interface Category {
  _id: string;
  name: string;
  slug: string;
}

interface DishForm {
  name: string;
  description: string;
  priceRupees: number;
  category: string;
  image: string;
  isVeg: boolean;
  isAvailable: boolean;
  isFeatured: boolean;
  spiceLevel: number;
  preparationTime: number;
}

const defaultForm: DishForm = {
  name: "",
  description: "",
  priceRupees: 0,
  category: "",
  image: "",
  isVeg: true,
  isAvailable: true,
  isFeatured: false,
  spiceLevel: 1,
  preparationTime: 20,
};

export default function AdminDishEditPage() {
  const params = useParams();
  const router = useRouter();
  const isNew = params.id === "new";

  const [form, setForm] = useState<DishForm>(defaultForm);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCategories();
    if (!isNew) {
      fetchDish();
    }
  }, [params.id]);

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

  async function fetchDish() {
    try {
      const token = localStorage.getItem("auth_token");
      const res = await fetch(`/api/admin/dishes/${params.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setForm({
          name: data.data.name || "",
          description: data.data.description || "",
          priceRupees: (data.data.pricePaise || 0) / 100,
          category: data.data.categoryId?.slug || "",
          image: data.data.imageUrl || "",
          isVeg: data.data.isVeg ?? true,
          isAvailable: data.data.isAvailable ?? true,
          isFeatured: data.data.isFeatured ?? false,
          spiceLevel: data.data.spicyLevel || 1,
          preparationTime: data.data.preparationTime || 20,
        });
      }
    } catch (error) {
      console.error("Failed to fetch dish:", error);
      setError("Failed to load dish");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      const token = localStorage.getItem("auth_token");
      const url = isNew
        ? "/api/admin/dishes"
        : `/api/admin/dishes/${params.id}`;
      const method = isNew ? "POST" : "PATCH";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...form,
          pricePaise: Math.round(form.priceRupees * 100),
        }),
      });

      const data = await res.json();

      if (data.success) {
        router.push("/admin/dishes");
      } else {
        const errorMsg =
          typeof data.error === "string"
            ? data.error
            : data.error?.message || "Failed to save dish";
        setError(errorMsg);
      }
    } catch (error) {
      console.error("Failed to save dish:", error);
      setError("Failed to save dish");
    } finally {
      setSaving(false);
    }
  }

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : type === "number"
            ? parseFloat(value) || 0
            : value,
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-dark-green"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        <h1 className="text-2xl font-bold text-gray-900">
          {isNew ? "Add New Dish" : "Edit Dish"}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name *
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-dark-green/20"
              placeholder="e.g., Paneer Butter Masala"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              required
              rows={3}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-dark-green/20"
              placeholder="Describe the dish..."
            />
          </div>

          {/* Price & Category */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price ({CURRENCY.symbol}) *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                  {CURRENCY.symbol}
                </span>
                <input
                  type="number"
                  name="priceRupees"
                  value={form.priceRupees ?? ""}
                  onChange={handleChange}
                  required
                  min={0}
                  step="0.01"
                  className="w-full pl-8 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-dark-green/20"
                  placeholder="e.g., 299"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category *
              </label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-dark-green/20"
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat.slug}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Image URL
            </label>
            <input
              type="url"
              name="image"
              value={form.image}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-dark-green/20"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          {/* Spice Level & Prep Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Spice Level (1-5)
              </label>
              <input
                type="number"
                name="spiceLevel"
                value={form.spiceLevel}
                onChange={handleChange}
                min={1}
                max={5}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-dark-green/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Prep Time (minutes)
              </label>
              <input
                type="number"
                name="preparationTime"
                value={form.preparationTime}
                onChange={handleChange}
                min={1}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-dark-green/20"
              />
            </div>
          </div>

          {/* Toggles */}
          <div className="space-y-3 pt-4 border-t">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="isVeg"
                checked={form.isVeg}
                onChange={handleChange}
                className="w-4 h-4 text-dark-green rounded focus:ring-dark-green"
              />
              <span className="text-sm font-medium">Vegetarian</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="isAvailable"
                checked={form.isAvailable}
                onChange={handleChange}
                className="w-4 h-4 text-dark-green rounded focus:ring-dark-green"
              />
              <span className="text-sm font-medium">Available for order</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="isFeatured"
                checked={form.isFeatured}
                onChange={handleChange}
                className="w-4 h-4 text-dark-green rounded focus:ring-dark-green"
              />
              <span className="text-sm font-medium">Featured on homepage</span>
            </label>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={saving}
            className="bg-dark-green hover:bg-dark-green/90 gap-2"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                {isNew ? "Create Dish" : "Save Changes"}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
