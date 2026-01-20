"use client";

import { useState } from "react";
import { motion } from "motion/react";
import {
  Star,
  StarHalf,
  User,
  Calendar,
  Send,
  MessageSquare,
  Mail,
  CheckCircle,
  Plus,
} from "lucide-react";
import DashboardNavbar from "@/components/DashboardNavbar";
import { Button } from "@/components/ui/button";
import {
  getAverageRating,
  getApprovedTestimonials,
} from "@/lib/testimonialsData";

export default function ReviewsPage() {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    review: "",
  });

  const approvedReviews = getApprovedTestimonials();
  const averageRating = getAverageRating();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setShowForm(false);
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

  const renderStars = (starRating: number) => {
    const stars = [];
    const fullStars = Math.floor(starRating);
    const hasHalfStar = starRating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star
          key={i}
          className="w-4 h-4 fill-saffron-yellow text-saffron-yellow"
        />
      );
    }
    if (hasHalfStar) {
      stars.push(
        <StarHalf
          key="half"
          className="w-4 h-4 fill-saffron-yellow text-saffron-yellow"
        />
      );
    }
    const remainingStars = 5 - Math.ceil(starRating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} className="w-4 h-4 text-dark-green/20" />
      );
    }
    return stars;
  };

  return (
    <div className="min-h-screen bg-warm-beige">
      <DashboardNavbar
        title="Reviews & Testimonials"
        subtitle="Share your experience and read what others say"
      />

      <div className="container mx-auto px-6 py-8 max-w-6xl">
        {/* Stats & Write Review Button */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-dark-green/70 text-sm mb-1">Total Reviews</p>
                <p className="text-3xl font-bold text-dark-green">
                  {approvedReviews.length}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-tomato-red to-saffron-yellow rounded-full flex items-center justify-center">
                <Star className="w-6 h-6 text-white" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-dark-green/70 text-sm mb-1">
                  Average Rating
                </p>
                <p className="text-3xl font-bold text-dark-green">
                  {averageRating}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-saffron-yellow to-tomato-red rounded-full flex items-center justify-center">
                <Star className="w-6 h-6 text-white fill-white" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Button
              onClick={() => setShowForm(!showForm)}
              className="w-full h-full bg-gradient-to-r from-tomato-red to-saffron-yellow text-white hover:shadow-2xl font-bold py-6 text-lg rounded-2xl"
            >
              <Plus className="w-6 h-6 mr-2" />
              {showForm ? "Cancel" : "Write a Review"}
            </Button>
          </motion.div>
        </div>

        {/* Review Form */}
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-2xl p-8 mb-8"
          >
            {isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
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
              <>
                <h2 className="text-2xl font-bold text-dark-green mb-6">
                  Share Your Experience
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
              </>
            )}
          </motion.div>
        )}

        {/* Customer Reviews Section */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-dark-green mb-2">
            What Our Customers Say
          </h2>
          <p className="text-dark-green/70">
            Read reviews from our valued customers
          </p>
        </div>

        {/* Reviews List */}
        <div className="space-y-6">
          {approvedReviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all"
            >
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="w-12 h-12 bg-gradient-to-r from-tomato-red to-saffron-yellow rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold">{review.avatar}</span>
                </div>

                {/* Details */}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-dark-green text-lg">
                      {review.author}
                    </h3>
                  </div>

                  <p className="text-dark-green/70 text-sm mb-2">
                    {review.role}
                  </p>

                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-3">
                    {renderStars(review.rating)}
                    <span className="ml-2 text-sm text-dark-green/70">
                      {review.rating}/5
                    </span>
                  </div>

                  {/* Quote */}
                  <p className="text-dark-green leading-relaxed mb-3 italic">
                    &ldquo;{review.quote}&rdquo;
                  </p>

                  {/* Date */}
                  <div className="flex items-center gap-2 text-sm text-dark-green/60">
                    <Calendar className="w-4 h-4" />
                    {new Date(review.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}

          {approvedReviews.length === 0 && (
            <div className="text-center py-16">
              <User className="w-16 h-16 text-dark-green/30 mx-auto mb-4" />
              <p className="text-dark-green/70 text-lg">
                No reviews yet. Be the first to share your experience!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
