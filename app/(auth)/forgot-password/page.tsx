"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Mail,
  Loader2,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";
import { useToast } from "@/contexts/ToastContext";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !newPassword || !confirmPassword) {
      showToast("Please fill in all fields", "error");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      showToast("Please enter a valid email address", "error");
      return;
    }

    if (newPassword.length < 6) {
      showToast("Password must be at least 6 characters", "error");
      return;
    }

    if (newPassword !== confirmPassword) {
      showToast("Passwords do not match", "error");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, newPassword }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        showToast("Password updated successfully!", "success");
      } else {
        showToast(data.error?.message || "Failed to update password", "error");
      }
    } catch (error) {
      console.error("Password reset error:", error);
      showToast("Something went wrong. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-warm-beige flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>

            <h2 className="text-2xl font-bold text-dark-green mb-4">
              Password Updated!
            </h2>

            <p className="text-dark-green/60 mb-6">
              Your password has been successfully updated for{" "}
              <strong>{email}</strong>. You can now sign in with your new
              password.
            </p>

            <Link href="/login">
              <Button className="w-full bg-dark-green hover:bg-dark-green/90 text-white">
                Continue to Sign In
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warm-beige flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md space-y-8"
      >
        <div className="text-center">
          <Link
            href="/login"
            className="inline-flex items-center text-dark-green hover:text-dark-green/80 mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Login
          </Link>

          <h1 className="text-3xl font-bold text-dark-green mb-2">
            Reset Password
          </h1>
          <p className="text-dark-green/60">
            Enter your email and new password to update your account.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-dark-green mb-2"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-green/40 w-5 h-5" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full pl-10 pr-4 py-3 border border-dark-green/20 rounded-lg focus:ring-2 focus:ring-dark-green/50 focus:border-dark-green transition-colors"
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium text-dark-green mb-2"
              >
                New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-green/40 w-5 h-5" />
                <input
                  id="newPassword"
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full pl-10 pr-12 py-3 border border-dark-green/20 rounded-lg focus:ring-2 focus:ring-dark-green/50 focus:border-dark-green transition-colors"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-dark-green/40 hover:text-dark-green/60"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-dark-green mb-2"
              >
                Confirm New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-green/40 w-5 h-5" />
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="w-full pl-10 pr-12 py-3 border border-dark-green/20 rounded-lg focus:ring-2 focus:ring-dark-green/50 focus:border-dark-green transition-colors"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-dark-green/40 hover:text-dark-green/60"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-dark-green hover:bg-dark-green/90 text-white py-3 rounded-lg font-medium transition-colors"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Updating Password...
                </>
              ) : (
                "Update Password"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-dark-green/60">
              Remember your password?{" "}
              <Link
                href="/login"
                className="text-tomato-red hover:text-tomato-red/80 font-medium"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
