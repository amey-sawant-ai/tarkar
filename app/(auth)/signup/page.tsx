"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import {
  Mail,
  User,
  Phone,
  Lock,
  ArrowRight,
  AlertCircle,
  Loader2,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { saveAuthToken } from "@/lib/auth";

interface SignupResponse {
  success: boolean;
  data?: {
    user: {
      id: string;
      email: string;
      name: string;
    };
    token: string;
  };
  error?: {
    code: string;
    message: string;
    details?: Record<string, string>;
  };
}

export default function SignUp() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validation
    if (!formData.email || !formData.name || !formData.password) {
      setError("Email, name, and password are required");
      setLoading(false);
      return;
    }

    if (formData.name.trim().length < 2) {
      setError("Name must be at least 2 characters");
      setLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters");
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email.toLowerCase(),
          name: formData.name.trim(),
          phone: formData.phone || undefined,
          password: formData.password,
        }),
      });

      const data: SignupResponse = await response.json();

      if (!data.success || !data.data) {
        setError(data.error?.message || "Signup failed");
        return;
      }

      // Show success message and redirect
      setSuccess(true);
      saveAuthToken(data.data.token);

      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    } catch (err) {
      console.error("Signup error:", err);
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-warm-beige via-white to-warm-beige flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl shadow-2xl p-12 text-center max-w-md"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
          </motion.div>
          <h2 className="text-3xl font-serif font-bold text-dark-green mb-4">
            Welcome to Tarkari!
          </h2>
          <p className="text-dark-green/70 mb-6">
            Your account has been created successfully. Redirecting to your
            dashboard...
          </p>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Loader2 className="w-6 h-6 text-tomato-red mx-auto" />
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-warm-beige via-white to-warm-beige flex items-center justify-center p-6">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
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
                Join the
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-tomato-red to-saffron-yellow">
                  Tarkari Family
                </span>
              </h1>
              <p className="text-dark-green/70 text-lg leading-relaxed mb-8">
                Create your account and unlock exclusive benefits, personalized
                recommendations, and seamless ordering experience.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-dark-green/80">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-tomato-red to-saffron-yellow flex items-center justify-center text-white text-xl">
                    🎁
                  </div>
                  <span>Welcome Offer: 10% Off First Order</span>
                </div>
                <div className="flex items-center gap-3 text-dark-green/80">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-tomato-red to-saffron-yellow flex items-center justify-center text-white text-xl">
                    ⭐
                  </div>
                  <span>Earn Rewards Points</span>
                </div>
                <div className="flex items-center gap-3 text-dark-green/80">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-tomato-red to-saffron-yellow flex items-center justify-center text-white text-xl">
                    🔔
                  </div>
                  <span>Early Access to New Dishes</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Side - Sign Up Form */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full"
        >
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 max-h-[90vh] overflow-y-auto">
            {/* Mobile Logo */}
            <div className="lg:hidden mb-8 text-center">
              <Link href="/" className="inline-block">
                <Image
                  src="/logo.svg"
                  alt="Tarkari Logo"
                  width={120}
                  height={120}
                />
              </Link>
            </div>

            <div className="mb-8">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-dark-green mb-2">
                Create Account
              </h2>
              <p className="text-dark-green/60">
                Sign up to start ordering delicious food!
              </p>
            </div>

            {/* Error Alert */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 flex items-center gap-3 bg-red-50 border-2 border-red-200 rounded-xl p-4 text-red-700"
              >
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <span className="text-sm font-medium">{error}</span>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Full Name Field */}
              <div>
                <label className="block text-dark-green font-semibold mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-green/40" />
                  <input
                    type="text"
                    name="name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-dark-green/20 focus:border-tomato-red focus:outline-none transition-all"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-dark-green font-semibold mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-green/40" />
                  <input
                    type="email"
                    name="email"
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-dark-green/20 focus:border-tomato-red focus:outline-none transition-all"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-dark-green font-semibold mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-green/40" />
                  <input
                    type="password"
                    name="password"
                    placeholder="At least 8 characters"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-dark-green/20 focus:border-tomato-red focus:outline-none transition-all"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Confirm Password Field */}
              <div>
                <label className="block text-dark-green font-semibold mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-green/40" />
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-dark-green/20 focus:border-tomato-red focus:outline-none transition-all"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Phone Field */}
              <div>
                <label className="block text-dark-green font-semibold mb-2">
                  Phone Number (Optional)
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-green/40" />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-dark-green/20 focus:border-tomato-red focus:outline-none transition-all"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Terms & Conditions */}
              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  id="terms"
                  className="w-4 h-4 mt-1 rounded border-2 border-dark-green/20 text-tomato-red focus:ring-tomato-red"
                  required
                  disabled={loading}
                />
                <label
                  htmlFor="terms"
                  className="text-xs text-dark-green/70 cursor-pointer"
                >
                  I agree to the{" "}
                  <Link
                    href="#"
                    className="text-tomato-red hover:text-saffron-yellow transition-colors"
                  >
                    Terms & Conditions
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="#"
                    className="text-tomato-red hover:text-saffron-yellow transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </label>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading || !formData.email || !formData.name}
                className="w-full bg-gradient-to-r from-tomato-red to-saffron-yellow text-white font-bold py-4 text-lg rounded-xl hover:shadow-2xl hover:scale-105 transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </form>

            {/* Login Link */}
            <p className="mt-8 text-center text-dark-green/70">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-tomato-red font-semibold hover:text-saffron-yellow transition-colors"
              >
                Sign In
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
