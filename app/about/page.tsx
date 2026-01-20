"use client";

import Navbar from "@/components/Navbar";
import Image from "next/image";
import { motion } from "motion/react";
import Footer from "@/components/Footer";
import { Clock, MapPin, Phone, Users, Award, Heart } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function About() {
  const { t } = useLanguage();
  const stats = [
    { icon: Users, value: "10K+", label: t("about.happyFamilies") },
    { icon: Award, value: "100%", label: t("about.pureVegetarian") },
    { icon: Heart, value: "60+", label: t("about.vegDishes") },
    { icon: Clock, value: "11AM-10PM", label: t("about.daily") },
  ];

  const values = [
    {
      title: "Pure Vegetarian",
      desc: "100% vegetarian kitchen committed to fresh, wholesome plant-based meals for the whole family.",
      icon: "🌱",
    },
    {
      title: "Homestyle Cooking",
      desc: "Traditional recipes made with love, just like home. Fresh ingredients sourced daily from local markets.",
      icon: "✨",
    },
    {
      title: "Family Friendly",
      desc: "A welcoming space for families in Dombivli East - affordable, comfortable, and delicious.",
      icon: "❤️",
    },
    {
      title: "Variety",
      desc: "North Indian, South Indian, Chinese, snacks, thalis - something delicious for everyone.",
      icon: "🍽️",
    },
  ];

  const team = [
    {
      name: "Chef Rajesh Kumar",
      role: "Head Chef",
      image: "/Tarkari-image.png",
      desc: "15+ years crafting authentic Indian cuisine",
    },
    {
      name: "Priya Sharma",
      role: "Restaurant Manager",
      image: "/Tarkari-image.png",
      desc: "Ensuring every guest feels at home",
    },
    {
      name: "Chef Amit Patel",
      role: "Sous Chef",
      image: "/Tarkari-image.png",
      desc: "Master of regional specialties",
    },
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
              {t("about.title")}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl md:text-2xl text-warm-beige/90 leading-relaxed"
            >
              {t("about.subtitle")}
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

      {/* Stats Section */}
      <section className="py-16 bg-warm-beige">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-tomato-red to-saffron-yellow mb-4">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-4xl font-bold text-dark-green mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-dark-green/70 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-dark-green mb-6">
                A Journey of{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-tomato-red to-saffron-yellow">
                  Flavors
                </span>
              </h2>
              <div className="space-y-4 text-dark-green/80 text-lg leading-relaxed">
                <p>
                  Founded in 2010, Tarkari began with a simple vision: to bring
                  authentic Indian flavors to Dombivali. What started as a small
                  family kitchen has grown into a beloved dining destination.
                </p>
                <p>
                  Our founders, passionate about preserving traditional recipes,
                  spent years perfecting each dish. Today, we serve not just
                  Indian cuisine, but also Chinese and Italian favorites, all
                  prepared with the same dedication to quality and taste.
                </p>
                <p>
                  Every ingredient is carefully selected, every spice perfectly
                  balanced, and every dish prepared with love. We believe food
                  is more than sustenance—it&apos;s a way to connect, celebrate,
                  and create memories.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="relative h-[500px] rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="/Tarkari-image.png"
                  alt="Tarkari Restaurant"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-green/40 to-transparent"></div>
              </div>
              {/* Decorative element */}
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gradient-to-br from-saffron-yellow to-tomato-red rounded-3xl opacity-20 -z-10"></div>
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-gradient-to-br from-dark-green to-dark-green/80 rounded-3xl opacity-20 -z-10"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 md:py-24 bg-warm-beige">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-dark-green mb-4">
              Our Values
            </h2>
            <p className="text-lg text-dark-green/70 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all group"
              >
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">
                  {value.icon}
                </div>
                <h3 className="text-2xl font-bold text-dark-green mb-3 group-hover:text-tomato-red transition-colors">
                  {value.title}
                </h3>
                <p className="text-dark-green/70 leading-relaxed">
                  {value.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-dark-green mb-4">
              Meet Our Team
            </h2>
            <p className="text-lg text-dark-green/70 max-w-2xl mx-auto">
              The talented people behind your favorite dishes
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-warm-beige rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all group"
              >
                <div className="relative h-80 overflow-hidden">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-2xl font-bold text-dark-green mb-2">
                    {member.name}
                  </h3>
                  <p className="text-tomato-red font-semibold mb-3">
                    {member.role}
                  </p>
                  <p className="text-dark-green/70">{member.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Location & Contact Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-dark-green to-dark-green/95 relative overflow-hidden">
        {/* Background Pattern */}
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
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-white max-w-4xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-12 text-center">
              Visit Us
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-saffron-yellow/20 flex items-center justify-center mb-4">
                  <MapPin className="w-8 h-8 text-saffron-yellow" />
                </div>
                <h3 className="font-bold text-xl mb-3">Address</h3>
                <p className="text-warm-beige/90 leading-relaxed">
                  Shop 5 And 6, Ground Floor, Pushpdeo Society, Acharya Tulsi
                  Marg, Near Sarvesh Hall, Dombivali East, Thane
                  <br />
                  638R+CP Dombivli, Maharashtra
                </p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-tomato-red/20 flex items-center justify-center mb-4">
                  <Phone className="w-8 h-8 text-tomato-red" />
                </div>
                <h3 className="font-bold text-xl mb-3">Contact</h3>
                <p className="text-warm-beige/90">+91 96192 67393</p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-warm-beige/20 flex items-center justify-center mb-4">
                  <Clock className="w-8 h-8 text-warm-beige" />
                </div>
                <h3 className="font-bold text-xl mb-3">Hours</h3>
                <p className="text-warm-beige/90">
                  Open Daily: 11:00 AM - 11:00 PM
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
