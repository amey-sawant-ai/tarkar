"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";

import LoginForm from "@/components/LoginForm";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, isLoading, user } = useAuth();

  // Get redirect URL from query params
  const redirectParam = searchParams.get("redirect");

  // Determine redirect URL based on role
  const getRedirectUrl = () => {
    // If explicit redirect param, use it (unless user is admin and no redirect specified)
    if (redirectParam) return redirectParam;

    // Redirect based on role
    if (user?.role === "admin" || user?.role === "staff") {
      return "/admin";
    }
    return "/dashboard";
  };

  // Redirect if already authenticated
  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      const redirectUrl = getRedirectUrl();
      setTimeout(() => {
        router.push(redirectUrl);
      }, 100);
    }
  }, [isAuthenticated, isLoading, router, user]);

  // Show loading if checking auth state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-warm-beige">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-warm-beige via-white to-warm-beige flex items-center justify-center p-6">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-12 items-center">
        {/* Left Side - Branding */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="hidden lg:block relative"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-tomato-red/20 to-saffron-yellow/20 rounded-3xl blur-3xl"></div>
            <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-12 shadow-2xl">
              <Link href="/" className="inline-block mb-8">
                <Image
                  src="/logo.svg"
                  alt="Tarkari Logo"
                  width={150}
                  height={150}
                />
              </Link>
              <h1 className="text-4xl font-serif font-bold text-dark-green mb-6">
                Welcome Back to
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-tomato-red to-saffron-yellow">
                  Tarkari
                </span>
              </h1>
              <p className="text-dark-green/70 text-lg leading-relaxed mb-8">
                Sign in to access your account, manage your orders, and enjoy
                exclusive offers from our kitchen to your table.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-dark-green/80">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-tomato-red to-saffron-yellow flex items-center justify-center text-white font-bold">
                    ✓
                  </div>
                  <span>Quick & Easy Ordering</span>
                </div>
                <div className="flex items-center gap-3 text-dark-green/80">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-tomato-red to-saffron-yellow flex items-center justify-center text-white font-bold">
                    ✓
                  </div>
                  <span>Track Your Orders</span>
                </div>
                <div className="flex items-center gap-3 text-dark-green/80">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-tomato-red to-saffron-yellow flex items-center justify-center text-white font-bold">
                    ✓
                  </div>
                  <span>Exclusive Member Offers</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Panel - Login Form */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex items-center justify-center"
        >
          <div className="w-full max-w-md bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/20">
            <LoginForm
              onSuccess={(loggedInUser) => {
                // Redirect based on role from the logged-in user data
                const redirectUrl = redirectParam
                  ? redirectParam
                  : loggedInUser?.role === "admin" ||
                      loggedInUser?.role === "staff"
                    ? "/admin"
                    : "/dashboard";
                router.push(redirectUrl);
              }}
            />

            {/* Back to Home */}
            <div className="mt-8 text-center border-t border-gray-100 pt-6">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-primary transition-colors font-medium"
              >
                ← Back to Home
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
