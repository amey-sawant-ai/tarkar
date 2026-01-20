"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

interface LoginFormProps {
  onSuccess?: (user: { role?: string }) => void;
  redirectTo?: string;
}

export default function LoginForm({ onSuccess, redirectTo }: LoginFormProps) {
  const { login, isLoading: authLoading } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const result = await login(formData.email, formData.password);

      if (result.success && result.user) {
        // Give auth context time to update before redirecting
        setTimeout(() => {
          onSuccess?.(result.user!);
        }, 100);
      } else {
        setError(result.error || "Login failed");
      }
    } catch (error) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError(null); // Clear error when user starts typing
  };

  const isDisabled =
    loading || authLoading || !formData.email || !formData.password;

  return (
    <div className="w-full space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-dark-green mb-2">
          Welcome Back
        </h1>
        <p className="text-gray-600 text-sm">Sign in to your Tarkari account</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Field */}
        <div className="space-y-2">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email Address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleChange}
            className={cn(
              "w-full rounded-xl border px-4 py-3 text-sm transition-all duration-200",
              "focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              "bg-gray-50/50 hover:bg-white focus:bg-white",
              error ? "border-red-500 bg-red-50/50" : "border-gray-200",
            )}
            placeholder="Enter your email"
            disabled={loading || authLoading}
          />
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              value={formData.password}
              onChange={handleChange}
              className={cn(
                "w-full rounded-xl border px-4 py-3 pr-12 text-sm transition-all duration-200",
                "focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "bg-gray-50/50 hover:bg-white focus:bg-white",
                error ? "border-red-500 bg-red-50/50" : "border-gray-200",
              )}
              placeholder="Enter your password"
              disabled={loading || authLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              disabled={loading || authLoading}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-lg bg-red-50 border border-red-200 p-3"
          >
            <p className="text-sm text-red-600">{error}</p>
          </motion.div>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isDisabled}
          className="w-full h-12 gap-2 rounded-xl bg-gradient-to-r from-tomato-red to-saffron-yellow hover:from-tomato-red/90 hover:to-saffron-yellow/90 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Signing In...
            </>
          ) : (
            "Sign In"
          )}
        </Button>
      </form>

      {/* Additional Links */}
      <div className="space-y-4 text-center text-sm border-t border-gray-100 pt-6">
        <Link
          href="/forgot-password"
          className="block text-primary hover:text-primary/80 transition-colors font-medium"
        >
          Forgot your password?
        </Link>

        <div className="flex items-center justify-center gap-2 text-gray-600">
          <span>Don't have an account?</span>
          <Link
            href="/signup"
            className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-tomato-red to-saffron-yellow hover:from-tomato-red/80 hover:to-saffron-yellow/80 transition-all"
          >
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
