"use client";

import { motion } from "motion/react";
import {
  Calendar,
  Clock,
  Users,
  User,
  Mail,
  Phone,
  MessageSquare,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Image from "next/image";
import DashboardNavbar from "@/components/DashboardNavbar";

export default function ReservationPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    guests: "2",
    specialRequest: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    // Here you would typically send the data to your backend
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: "",
        email: "",
        phone: "",
        date: "",
        time: "",
        guests: "2",
        specialRequest: "",
      });
    }, 3000);
  };

  const timeSlots = [
    "11:00 AM",
    "11:30 AM",
    "12:00 PM",
    "12:30 PM",
    "1:00 PM",
    "1:30 PM",
    "2:00 PM",
    "6:00 PM",
    "6:30 PM",
    "7:00 PM",
    "7:30 PM",
    "8:00 PM",
    "8:30 PM",
    "9:00 PM",
    "9:30 PM",
    "10:00 PM",
  ];

  return (
    <div className="min-h-screen bg-warm-beige">
      <DashboardNavbar
        title="Reservations"
        subtitle="Manage your table bookings"
      />

      <div className="container mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Left Side - Info & Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            {/* Restaurant Image */}
            <div className="relative h-80 rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/Tarkari-image.png"
                alt="Tarkari Restaurant"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-green/80 to-transparent flex items-end p-8">
                <div className="text-white">
                  <h2 className="text-3xl font-serif font-bold mb-2">
                    Welcome to Tarkari
                  </h2>
                  <p className="text-warm-beige/90">
                    Experience authentic flavors in a cozy atmosphere
                  </p>
                </div>
              </div>
            </div>

            {/* Info Cards */}
            <div className="space-y-4">
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-tomato-red to-saffron-yellow rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-dark-green text-lg mb-2">
                      Opening Hours
                    </h3>
                    <p className="text-dark-green/70">
                      Monday - Sunday: 11:00 AM - 10:30 PM
                    </p>
                    <p className="text-dark-green/70 text-sm mt-1">
                      Kitchen closes at 10:00 PM
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-tomato-red to-saffron-yellow rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-dark-green text-lg mb-2">
                      Contact Us
                    </h3>
                    <p className="text-dark-green/70">+91 96192 67393</p>
                    <p className="text-dark-green/70 text-sm mt-1">
                      info@tarkari.com
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-tomato-red to-saffron-yellow rounded-full flex items-center justify-center flex-shrink-0">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-dark-green text-lg mb-2">
                      Group Reservations
                    </h3>
                    <p className="text-dark-green/70 text-sm">
                      For parties of 8 or more, please call us directly to
                      ensure the best seating arrangement.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Side - Reservation Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-white rounded-2xl shadow-2xl p-8">
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
                    Reservation Confirmed!
                  </h2>
                  <p className="text-dark-green/70 mb-2">
                    Thank you for choosing Tarkari.
                  </p>
                  <p className="text-dark-green/70">
                    We&apos;ve sent a confirmation to your email.
                  </p>
                </motion.div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-dark-green mb-6">
                    Book Your Table
                  </h2>
                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Name */}
                    <div>
                      <label className="block text-sm font-semibold text-dark-green mb-2">
                        <User className="w-4 h-4 inline mr-2" />
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        placeholder="Enter your name"
                        className="w-full px-4 py-3 rounded-xl border-2 border-dark-green/20 focus:border-tomato-red focus:outline-none transition-all"
                      />
                    </div>

                    {/* Email & Phone */}
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-dark-green mb-2">
                          <Mail className="w-4 h-4 inline mr-2" />
                          Email *
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                          placeholder="your@email.com"
                          className="w-full px-4 py-3 rounded-xl border-2 border-dark-green/20 focus:border-tomato-red focus:outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-dark-green mb-2">
                          <Phone className="w-4 h-4 inline mr-2" />
                          Phone *
                        </label>
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) =>
                            setFormData({ ...formData, phone: e.target.value })
                          }
                          placeholder="+91 98765 43210"
                          className="w-full px-4 py-3 rounded-xl border-2 border-dark-green/20 focus:border-tomato-red focus:outline-none transition-all"
                        />
                      </div>
                    </div>

                    {/* Date & Guests */}
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-dark-green mb-2">
                          <Calendar className="w-4 h-4 inline mr-2" />
                          Date *
                        </label>
                        <input
                          type="date"
                          required
                          value={formData.date}
                          onChange={(e) =>
                            setFormData({ ...formData, date: e.target.value })
                          }
                          min={new Date().toISOString().split("T")[0]}
                          className="w-full px-4 py-3 rounded-xl border-2 border-dark-green/20 focus:border-tomato-red focus:outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-dark-green mb-2">
                          <Users className="w-4 h-4 inline mr-2" />
                          Number of Guests *
                        </label>
                        <select
                          required
                          value={formData.guests}
                          onChange={(e) =>
                            setFormData({ ...formData, guests: e.target.value })
                          }
                          className="w-full px-4 py-3 rounded-xl border-2 border-dark-green/20 focus:border-tomato-red focus:outline-none transition-all bg-white"
                        >
                          {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                            <option key={num} value={num}>
                              {num} {num === 1 ? "Guest" : "Guests"}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Time Slot */}
                    <div>
                      <label className="block text-sm font-semibold text-dark-green mb-2">
                        <Clock className="w-4 h-4 inline mr-2" />
                        Preferred Time *
                      </label>
                      <select
                        required
                        value={formData.time}
                        onChange={(e) =>
                          setFormData({ ...formData, time: e.target.value })
                        }
                        className="w-full px-4 py-3 rounded-xl border-2 border-dark-green/20 focus:border-tomato-red focus:outline-none transition-all bg-white"
                      >
                        <option value="">Select a time</option>
                        {timeSlots.map((slot) => (
                          <option key={slot} value={slot}>
                            {slot}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Special Requests */}
                    <div>
                      <label className="block text-sm font-semibold text-dark-green mb-2">
                        <MessageSquare className="w-4 h-4 inline mr-2" />
                        Special Requests (Optional)
                      </label>
                      <textarea
                        rows={4}
                        value={formData.specialRequest}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            specialRequest: e.target.value,
                          })
                        }
                        placeholder="Any dietary restrictions, celebrations, or special requirements..."
                        className="w-full px-4 py-3 rounded-xl border-2 border-dark-green/20 focus:border-tomato-red focus:outline-none transition-all resize-none"
                      ></textarea>
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-tomato-red to-saffron-yellow text-white hover:shadow-2xl font-bold py-6 text-lg"
                    >
                      Confirm Reservation
                    </Button>

                    <p className="text-dark-green/60 text-xs text-center">
                      By confirming, you agree to receive reservation
                      confirmations via email and SMS.
                    </p>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
