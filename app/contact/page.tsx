"use client";

import Navbar from "@/components/Navbar";
import { motion } from "motion/react";
import Footer from "@/components/Footer";
import {
  Clock,
  MapPin,
  Phone,
  Mail,
  Send,
  Instagram,
  Facebook,
  Twitter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Contact() {
  const { t } = useLanguage();
  const contactInfo = [
    {
      icon: MapPin,
      title: t("contact.visitUs"),
      details: [
        "Shop 5 And 6, Ground Floor",
        "Pushpdeo Society, Acharya Tulsi Marg",
        "Near Sarvesh Hall, Dombivali East, Thane",
        "638R+CP Dombivli, Maharashtra",
      ],
      color: "saffron-yellow",
    },
    {
      icon: Phone,
      title: t("contact.callUs"),
      details: ["+91 96192 67393", "Available 11 AM - 11 PM"],
      color: "tomato-red",
    },
    {
      icon: Mail,
      title: t("contact.emailUs"),
      details: ["info@tarkari.com", "We'll respond within 24 hours"],
      color: "dark-green",
    },
    {
      icon: Clock,
      title: t("contact.openingHours"),
      details: [
        "Monday - Sunday",
        "11:00 AM - 11:00 PM",
        "No holidays, we're always here!",
      ],
      color: "saffron-yellow",
    },
  ];

  const socialLinks = [
    { icon: Instagram, name: "Instagram", href: "#", color: "tomato-red" },
    { icon: Facebook, name: "Facebook", href: "#", color: "dark-green" },
    { icon: Twitter, name: "Twitter", href: "#", color: "saffron-yellow" },
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
              Get In Touch
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl md:text-2xl text-warm-beige/90 leading-relaxed"
            >
              We&apos;d love to hear from you. Reach out for reservations,
              queries, or just to say hello!
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

      {/* Contact Info Cards */}
      <section className="py-16 md:py-24 bg-warm-beige">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto mb-16">
            {contactInfo.map((info, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all group"
              >
                <div
                  className={`w-16 h-16 rounded-full bg-${info.color}/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
                >
                  <info.icon
                    className={`w-8 h-8 text-${info.color}`}
                    style={{
                      color:
                        info.color === "saffron-yellow"
                          ? "#F5A623"
                          : info.color === "tomato-red"
                          ? "#C3423F"
                          : "#1E3D2F",
                    }}
                  />
                </div>
                <h3 className="text-xl font-bold text-dark-green mb-4">
                  {info.title}
                </h3>
                <div className="space-y-2">
                  {info.details.map((detail, idx) => (
                    <p
                      key={idx}
                      className="text-dark-green/70 text-sm leading-relaxed"
                    >
                      {detail}
                    </p>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Contact Form & Map Section */}
          <div className="grid lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="bg-white rounded-2xl p-8 md:p-10 shadow-2xl"
            >
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-dark-green mb-6">
                Send us a Message
              </h2>
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-dark-green font-semibold mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 rounded-lg border-2 border-dark-green/20 focus:border-tomato-red focus:outline-none transition-colors"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label className="block text-dark-green font-semibold mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 rounded-lg border-2 border-dark-green/20 focus:border-tomato-red focus:outline-none transition-colors"
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-dark-green font-semibold mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 rounded-lg border-2 border-dark-green/20 focus:border-tomato-red focus:outline-none transition-colors"
                    placeholder="john.doe@example.com"
                  />
                </div>

                <div>
                  <label className="block text-dark-green font-semibold mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    className="w-full px-4 py-3 rounded-lg border-2 border-dark-green/20 focus:border-tomato-red focus:outline-none transition-colors"
                    placeholder="+91 98765 43210"
                  />
                </div>

                <div>
                  <label className="block text-dark-green font-semibold mb-2">
                    Subject
                  </label>
                  <select className="w-full px-4 py-3 rounded-lg border-2 border-dark-green/20 focus:border-tomato-red focus:outline-none transition-colors">
                    <option>General Inquiry</option>
                    <option>Reservation</option>
                    <option>Feedback</option>
                    <option>Catering Request</option>
                    <option>Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-dark-green font-semibold mb-2">
                    Message
                  </label>
                  <textarea
                    rows={5}
                    className="w-full px-4 py-3 rounded-lg border-2 border-dark-green/20 focus:border-tomato-red focus:outline-none transition-colors resize-none"
                    placeholder="Tell us how we can help you..."
                  ></textarea>
                </div>

                <Button className="w-full bg-gradient-to-r from-tomato-red to-saffron-yellow text-white font-bold py-4 text-lg rounded-lg hover:shadow-xl hover:scale-105 transition-all group">
                  Send Message
                  <Send className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </form>
            </motion.div>

            {/* Map & Social */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              {/* Map */}
              <div className="bg-white rounded-2xl overflow-hidden shadow-2xl h-[400px]">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d235.4701532659382!2d73.09163441595604!3d19.216049373160118!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be795194e3baa6b%3A0xbf8edba1d731a5f9!2sTarkari!5e0!3m2!1sen!2sin!4v1764234684905!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Tarkari Location"
                ></iframe>
              </div>

              {/* Social Links */}
              <div className="bg-gradient-to-br from-dark-green to-dark-green/95 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23FFFFFF' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }}
                  ></div>
                </div>

                <div className="relative z-10">
                  <h3 className="text-2xl font-serif font-bold text-white mb-6">
                    Follow Us
                  </h3>
                  <p className="text-warm-beige/80 mb-6">
                    Stay connected for updates, special offers, and delicious
                    content!
                  </p>
                  <div className="flex gap-4">
                    {socialLinks.map((social, index) => (
                      <a
                        key={index}
                        href={social.href}
                        className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white hover:scale-110 transition-all group"
                      >
                        <social.icon className="w-6 h-6 text-white group-hover:text-tomato-red transition-colors" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quick Info */}
              <div className="bg-gradient-to-r from-tomato-red to-saffron-yellow rounded-2xl p-8 shadow-2xl text-white">
                <h3 className="text-2xl font-serif font-bold mb-4">
                  Quick Reservations
                </h3>
                <p className="mb-6 opacity-90">
                  Call us directly for instant table bookings and special
                  requests
                </p>
                <a
                  href="tel:+919619267393"
                  className="inline-flex items-center gap-3 bg-white text-tomato-red font-bold px-6 py-3 rounded-lg hover:scale-105 transition-all"
                >
                  <Phone className="w-5 h-5" />
                  +91 96192 67393
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
