"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "motion/react";
import {
  Star,
  User,
  Mail,
  MessageSquare,
  Send,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SubmitReviewPage() {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    review: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would send the review to your backend
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: "", email: "", role: "", review: "" });
      setRating(0);
    }, 3000);
  };

  const roleOptions = [
    "Regular Customer",
    "First Time Visitor",
    "Food Blogger",
    "Food Enthusiast",
    "Local Resident",
    "Tourist",
  ];

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
              Share Your Experience
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl md:text-2xl text-warm-beige/90 leading-relaxed"
            >
              Your feedback helps us serve you better. Share your dining
              experience with us!
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

      {/* Review Form Section */}
      <section className="py-16 md:py-24 bg-warm-beige">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto">
            {isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-2xl shadow-2xl p-12 text-center"
              >
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-12 h-12 text-green-600" />
                </div>
                <h2 className="text-3xl font-bold text-dark-green mb-4">
                  Thank You for Your Review!
                </h2>
                <p className="text-dark-green/70 mb-2">
                  Your feedback has been submitted successfully.
                </p>
                <p className="text-dark-green/70">
                  We&apos;ll review it and publish it soon.
                </p>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="bg-white rounded-2xl shadow-2xl p-8 md:p-10"
              >
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-dark-green mb-8">
                  Write a Review
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Rating */}
                  <div>
                    <label className="block text-dark-green font-semibold mb-3">
                      Your Rating *
                    </label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHoveredRating(star)}
                          onMouseLeave={() => setHoveredRating(0)}
                          className="transition-transform hover:scale-125"
                        >
                          <Star
                            className={`w-10 h-10 transition-colors ${
                              star <= (hoveredRating || rating)
                                ? "fill-saffron-yellow text-saffron-yellow"
                                : "text-dark-green/20"
                            }`}
                          />
                        </button>
                      ))}
                      {rating > 0 && (
                        <span className="ml-3 text-dark-green font-semibold self-center">
                          {rating} / 5
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Name & Email */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-dark-green font-semibold mb-2">
                        <User className="w-4 h-4 inline mr-2" />
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="w-full px-4 py-3 rounded-xl border-2 border-dark-green/20 focus:border-tomato-red focus:outline-none transition-all"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-dark-green font-semibold mb-2">
                        <Mail className="w-4 h-4 inline mr-2" />
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="w-full px-4 py-3 rounded-xl border-2 border-dark-green/20 focus:border-tomato-red focus:outline-none transition-all"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  {/* Role */}
                  <div>
                    <label className="block text-dark-green font-semibold mb-2">
                      You are a... *
                    </label>
                    <select
                      required
                      value={formData.role}
                      onChange={(e) =>
                        setFormData({ ...formData, role: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl border-2 border-dark-green/20 focus:border-tomato-red focus:outline-none transition-all bg-white"
                    >
                      <option value="">Select your role</option>
                      {roleOptions.map((role) => (
                        <option key={role} value={role}>
                          {role}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Review Text */}
                  <div>
                    <label className="block text-dark-green font-semibold mb-2">
                      <MessageSquare className="w-4 h-4 inline mr-2" />
                      Your Review *
                    </label>
                    <textarea
                      required
                      rows={6}
                      value={formData.review}
                      onChange={(e) =>
                        setFormData({ ...formData, review: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl border-2 border-dark-green/20 focus:border-tomato-red focus:outline-none transition-all resize-none"
                      placeholder="Share your experience with us... What did you love? What could be better?"
                    ></textarea>
                    <p className="text-sm text-dark-green/60 mt-2">
                      Minimum 20 characters ({formData.review.length}/20)
                    </p>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={rating === 0 || formData.review.length < 20}
                    className="w-full bg-gradient-to-r from-tomato-red to-saffron-yellow text-white font-bold py-6 text-lg rounded-xl hover:shadow-2xl hover:scale-105 transition-all group disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    Submit Review
                    <Send className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>

                  <p className="text-dark-green/60 text-sm text-center">
                    Your review will be reviewed by our team before being
                    published.
                  </p>
                </form>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
