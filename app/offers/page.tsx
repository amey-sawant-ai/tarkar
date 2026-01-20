"use client";

import { useState } from "react";
import { motion } from "motion/react";
import {
  Tag,
  Calendar,
  Copy,
  Check,
  Gift,
  Sparkles,
  TrendingUp,
  Truck,
  Users,
  Star,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { getActiveOffers, type Offer } from "@/lib/offersData";

export default function OffersPage() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const activeOffers = getActiveOffers();

  const categories = [
    { id: "all", label: "All Offers", icon: Gift },
    { id: "festival", label: "Festival", icon: Sparkles },
    { id: "weekday", label: "Weekly", icon: Calendar },
    { id: "combo", label: "Combos", icon: Users },
    { id: "delivery", label: "Delivery", icon: Truck },
    { id: "firsttime", label: "First Order", icon: Star },
  ];

  const filteredOffers =
    selectedCategory === "all"
      ? activeOffers
      : activeOffers.filter((offer) => offer.category === selectedCategory);

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const getCategoryColor = (category: Offer["category"]) => {
    const colors = {
      festival: "from-saffron-yellow to-tomato-red",
      weekday: "from-blue-500 to-purple-600",
      combo: "from-green-500 to-teal-600",
      delivery: "from-orange-500 to-pink-600",
      firsttime: "from-rose-500 to-red-600",
    };
    return colors[category] || "from-dark-green to-tomato-red";
  };

  return (
    <div className="min-h-screen bg-warm-beige">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 bg-gradient-to-br from-dark-green via-dark-green to-tomato-red overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-40 h-40 bg-saffron-yellow rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-60 h-60 bg-tomato-red rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full mb-6">
              <TrendingUp className="w-5 h-5 text-saffron-yellow" />
              <span className="text-white font-semibold">
                Limited Time Offers
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Special Offers & Promotions
            </h1>
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              Discover amazing deals on pure vegetarian delicacies! Save more,
              enjoy more at Tarkari.
            </p>

            <div className="flex items-center justify-center gap-4">
              <div className="bg-white/20 backdrop-blur-sm px-6 py-4 rounded-2xl">
                <p className="text-3xl font-bold text-white">
                  {activeOffers.length}
                </p>
                <p className="text-white/80 text-sm">Active Offers</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm px-6 py-4 rounded-2xl">
                <p className="text-3xl font-bold text-white">Upto 30%</p>
                <p className="text-white/80 text-sm">Max Discount</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Category Filters */}
      <section className="container mx-auto px-6 -mt-8 relative z-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-2xl p-6"
        >
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <Button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  variant={
                    selectedCategory === category.id ? "default" : "outline"
                  }
                  className={`${
                    selectedCategory === category.id
                      ? "bg-gradient-to-r from-tomato-red to-saffron-yellow text-white"
                      : "border-dark-green/30 text-dark-green hover:bg-dark-green/5"
                  } px-6 py-3 rounded-xl font-semibold transition-all`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {category.label}
                </Button>
              );
            })}
          </div>
        </motion.div>
      </section>

      {/* Offers Grid */}
      <section className="container mx-auto px-6 py-16">
        {filteredOffers.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <Gift className="w-20 h-20 text-dark-green/30 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-dark-green mb-3">
              No Offers Available
            </h3>
            <p className="text-dark-green/70">
              Check back soon for exciting new deals!
            </p>
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredOffers.map((offer, index) => (
              <motion.div
                key={offer.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all overflow-hidden group"
              >
                {/* Offer Badge */}
                <div
                  className={`bg-gradient-to-r ${getCategoryColor(
                    offer.category
                  )} p-6 relative overflow-hidden`}
                >
                  <div className="absolute top-0 right-0 text-8xl opacity-10">
                    {offer.image}
                  </div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-2">
                      <Tag className="w-4 h-4 text-white" />
                      <span className="text-white/90 text-sm font-semibold uppercase tracking-wide">
                        {offer.category}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {offer.discount}
                    </h3>
                    <p className="text-white/90 text-sm">{offer.title}</p>
                  </div>
                </div>

                {/* Offer Details */}
                <div className="p-6">
                  <p className="text-dark-green/80 mb-4 leading-relaxed">
                    {offer.description}
                  </p>

                  {/* Promo Code */}
                  <div className="bg-gradient-to-r from-dark-green/5 to-tomato-red/5 border-2 border-dashed border-dark-green/20 rounded-xl p-4 mb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-dark-green/70 text-sm mb-1">
                          Promo Code
                        </p>
                        <p className="text-xl font-bold text-dark-green font-mono">
                          {offer.code}
                        </p>
                      </div>
                      <Button
                        onClick={() => copyCode(offer.code)}
                        variant="outline"
                        className="border-dark-green text-dark-green hover:bg-dark-green hover:text-white"
                      >
                        {copiedCode === offer.code ? (
                          <>
                            <Check className="w-4 h-4 mr-2" />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4 mr-2" />
                            Copy
                          </>
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Valid Until */}
                  <div className="flex items-center gap-2 text-dark-green/70 mb-4">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">
                      Valid until{" "}
                      {new Date(offer.validUntil).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>

                  {/* Terms & Conditions */}
                  <div className="border-t border-dark-green/10 pt-4">
                    <p className="text-dark-green/70 text-sm font-semibold mb-2">
                      Terms & Conditions:
                    </p>
                    <ul className="space-y-1">
                      {offer.terms.slice(0, 2).map((term, idx) => (
                        <li
                          key={idx}
                          className="text-dark-green/60 text-xs flex items-start gap-2"
                        >
                          <span className="text-tomato-red mt-1">•</span>
                          <span>{term}</span>
                        </li>
                      ))}
                      {offer.terms.length > 2 && (
                        <li className="text-dark-green/60 text-xs">
                          +{offer.terms.length - 2} more conditions
                        </li>
                      )}
                    </ul>
                  </div>

                  {/* Apply Button */}
                  <Button className="w-full mt-6 bg-gradient-to-r from-tomato-red to-saffron-yellow text-white font-bold py-6 rounded-xl hover:shadow-xl hover:scale-105 transition-all">
                    Apply Offer
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-dark-green via-dark-green to-tomato-red rounded-3xl p-12 text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-60 h-60 bg-saffron-yellow rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-60 h-60 bg-tomato-red rounded-full blur-3xl"></div>
          </div>

          <div className="relative z-10">
            <Gift className="w-16 h-16 text-white mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Want to Get Notified About New Offers?
            </h2>
            <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
              Subscribe to our newsletter and never miss out on exclusive deals
              and special promotions!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-4 rounded-xl border-2 border-white/30 bg-white/10 backdrop-blur-sm text-white placeholder:text-white/60 focus:outline-none focus:border-white/60"
              />
              <Button className="bg-white text-dark-green hover:bg-white/90 px-8 py-4 rounded-xl font-bold">
                Subscribe
              </Button>
            </div>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
