"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  Edit,
  Trash2,
  GripVertical,
  Eye,
  EyeOff,
  Save,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  isActive: boolean;
  sortOrder: number;
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    image: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    try {
      const token = localStorage.getItem("auth_token");
      const res = await fetch("/api/admin/categories", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setCategories(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    } finally {
      setLoading(false);
    }
  }

  async function toggleActive(category: Category) {
    try {
      const token = localStorage.getItem("auth_token");
      const res = await fetch(`/api/admin/categories/${category._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isActive: !category.isActive }),
      });

      if (res.ok) {
        setCategories((prev) =>
          prev.map((c) =>
            c._id === category._id ? { ...c, isActive: !c.isActive } : c,
          ),
        );
      }
    } catch (error) {
      console.error("Failed to toggle category:", error);
    }
  }

  async function deleteCategory(id: string) {
    if (!confirm("Are you sure you want to delete this category?")) return;

    try {
      const token = localStorage.getItem("auth_token");
      const res = await fetch(`/api/admin/categories/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setCategories((prev) => prev.filter((c) => c._id !== id));
      }
    } catch (error) {
      console.error("Failed to delete category:", error);
    }
  }

  function startEdit(category: Category) {
    setEditingId(category._id);
    setForm({
      name: category.name,
      slug: category.slug,
      description: category.description || "",
      image: category.image || "",
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setIsAdding(false);
    setForm({ name: "", slug: "", description: "", image: "" });
  }

  async function saveCategory() {
    if (!form.name.trim()) return;

    setSaving(true);
    try {
      const token = localStorage.getItem("auth_token");
      const slug = form.slug || form.name.toLowerCase().replace(/\s+/g, "-");

      if (isAdding) {
        const res = await fetch("/api/admin/categories", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ ...form, slug }),
        });
        const data = await res.json();
        if (data.success) {
          setCategories((prev) => [...prev, data.data]);
        }
      } else if (editingId) {
        const res = await fetch(`/api/admin/categories/${editingId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ ...form, slug }),
        });
        const data = await res.json();
        if (data.success) {
          setCategories((prev) =>
            prev.map((c) => (c._id === editingId ? data.data : c)),
          );
        }
      }

      cancelEdit();
    } catch (error) {
      console.error("Failed to save category:", error);
    } finally {
      setSaving(false);
    }
  }

  function startAdd() {
    setIsAdding(true);
    setEditingId(null);
    setForm({ name: "", slug: "", description: "", image: "" });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
          <p className="text-gray-500">{categories.length} categories</p>
        </div>
        <Button
          onClick={startAdd}
          disabled={isAdding}
          className="bg-dark-green hover:bg-dark-green/90 gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Category
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-dark-green mx-auto"></div>
            <p className="mt-2 text-gray-500">Loading categories...</p>
          </div>
        ) : (
          <div className="divide-y">
            {/* Add new category form */}
            {isAdding && (
              <div className="p-4 bg-green-50 border-b-2 border-green-200">
                <div className="flex items-start gap-4">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Category name *"
                      value={form.name}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, name: e.target.value }))
                      }
                      className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-dark-green/20"
                    />
                    <input
                      type="text"
                      placeholder="Slug (auto-generated)"
                      value={form.slug}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, slug: e.target.value }))
                      }
                      className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-dark-green/20"
                    />
                    <input
                      type="text"
                      placeholder="Description"
                      value={form.description}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-dark-green/20"
                    />
                    <input
                      type="url"
                      placeholder="Image URL"
                      value={form.image}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, image: e.target.value }))
                      }
                      className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-dark-green/20"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={saveCategory}
                      disabled={saving || !form.name.trim()}
                      className="bg-dark-green hover:bg-dark-green/90"
                    >
                      <Save className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={cancelEdit}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {categories.length === 0 && !isAdding ? (
              <div className="p-8 text-center text-gray-500">
                No categories found. Add your first category!
              </div>
            ) : (
              categories.map((category) => (
                <div
                  key={category._id}
                  className={cn(
                    "p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors",
                    !category.isActive && "opacity-60",
                  )}
                >
                  <GripVertical className="h-5 w-5 text-gray-300 cursor-grab" />

                  {editingId === category._id ? (
                    // Edit mode
                    <div className="flex-1 flex items-start gap-4">
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                          type="text"
                          placeholder="Category name *"
                          value={form.name}
                          onChange={(e) =>
                            setForm((prev) => ({
                              ...prev,
                              name: e.target.value,
                            }))
                          }
                          className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-dark-green/20"
                        />
                        <input
                          type="text"
                          placeholder="Slug"
                          value={form.slug}
                          onChange={(e) =>
                            setForm((prev) => ({
                              ...prev,
                              slug: e.target.value,
                            }))
                          }
                          className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-dark-green/20"
                        />
                        <input
                          type="text"
                          placeholder="Description"
                          value={form.description}
                          onChange={(e) =>
                            setForm((prev) => ({
                              ...prev,
                              description: e.target.value,
                            }))
                          }
                          className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-dark-green/20"
                        />
                        <input
                          type="url"
                          placeholder="Image URL"
                          value={form.image}
                          onChange={(e) =>
                            setForm((prev) => ({
                              ...prev,
                              image: e.target.value,
                            }))
                          }
                          className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-dark-green/20"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={saveCategory}
                          disabled={saving || !form.name.trim()}
                          className="bg-dark-green hover:bg-dark-green/90"
                        >
                          <Save className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={cancelEdit}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    // View mode
                    <>
                      {category.image && (
                        <img
                          src={category.image}
                          alt={category.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                      )}
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-gray-900">
                            {category.name}
                          </h3>
                          <span className="text-xs text-gray-400 font-mono">
                            {category.slug}
                          </span>
                        </div>
                        {category.description && (
                          <p className="text-sm text-gray-500">
                            {category.description}
                          </p>
                        )}
                      </div>

                      <button
                        onClick={() => toggleActive(category)}
                        className={cn(
                          "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium transition-colors",
                          category.isActive
                            ? "bg-green-100 text-green-800 hover:bg-green-200"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200",
                        )}
                      >
                        {category.isActive ? (
                          <>
                            <Eye className="h-3 w-3" />
                            Active
                          </>
                        ) : (
                          <>
                            <EyeOff className="h-3 w-3" />
                            Hidden
                          </>
                        )}
                      </button>

                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => startEdit(category)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteCategory(category._id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
