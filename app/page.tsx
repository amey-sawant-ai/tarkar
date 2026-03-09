"use client";

import Navbar from "@/components/Navbar";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import MenuSection from "@/components/MenuSection";
import ImageGallery from "@/components/ImageGallery";
import TestimonialCard from "@/components/TestimonialCard";
import Footer from "@/components/Footer";
import { formatPrice } from "@/lib/utils";
import {
  northIndianDishes,
  southIndianDishes,
  chineseDishes,
  thalis,
} from "@/lib/menuData";
import { getRecentTestimonials } from "@/lib/testimonialsData";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Home() {
  const { t } = useLanguage();
  const [foodGallery, setFoodGallery] = useState<string[]>(Array(6).fill("/Tarkari-image.png"));
  const [tarkariSpecials, setTarkariSpecials] = useState<any[]>([]);

  useEffect(() => {
    const fetchGalleryImages = async () => {
      try {
        const response = await fetch("/api/menu/dishes?pageSize=150");
        const data = await response.json();
        if (data.success && data.data) {
          // Food Gallery
          const images = data.data
            .filter((d: any) => d.imageUrl && !d.imageUrl.includes("placeholder"))
            .map((d: any) => d.imageUrl)
            .sort(() => 0.5 - Math.random())
            .slice(0, 6);

          if (images.length > 0) {
            setFoodGallery(images);
          }

          // Tarkari Specials (Featured or first 6 with images)
          const specials = data.data
            .filter((d: any) => d.imageUrl && !d.imageUrl.includes("Tarkari-image.png"))
            .slice(0, 6)
            .map((d: any) => ({
              id: d._id,
              name: d.name,
              desc: d.shortDescription || d.description || "",
              price: formatPrice(d.pricePaise),
              image: d.imageUrl,
            }));

          if (specials.length > 0) {
            setTarkariSpecials(specials);
          } else {
            // Fallback to static data if no real data found
            setTarkariSpecials(northIndianDishes.slice(0, 6).map(d => ({
              id: d.id.toString(),
              name: d.name,
              desc: d.desc,
              price: formatPrice(d.price * 100),
              image: d.image
            })));
          }
        }
      } catch (error) {
        console.error("Error fetching home page data:", error);
      }
    };
    fetchGalleryImages();
  }, []);

  const southIndianSpecials = southIndianDishes.slice(0, 6).map((dish) => ({
    id: dish.id.toString(),
    name: dish.name,
    desc: dish.desc,
    price: formatPrice(dish.price * 100),
    image: dish.image,
  }));

  const chineseDelights = chineseDishes.slice(0, 6).map((dish) => ({
    id: dish.id.toString(),
    name: dish.name,
    desc: dish.desc,
    price: formatPrice(dish.price * 100),
    image: dish.image,
  }));


  const testimonials = getRecentTestimonials(4);

  return (
    <div className="min-h-screen bg-warm-beige">
      <Navbar />

      {/* Hero Section with Modern Design */}
      <section
        id="home"
        className="relative overflow-hidden bg-warm-beige min-h-screen flex items-center"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%231E3D2F' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          ></div>
        </div>

        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg border-2 border-dark-green/10"
              >
                <div className="w-2 h-2 bg-saffron-yellow rounded-full animate-pulse"></div>
                <span className="text-dark-green font-semibold text-sm">
                  {t("home.badge")}
                </span>
              </motion.div>

              {/* Main Heading */}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-serif font-bold text-dark-green leading-[1.1]"
              >
                {t("home.heroTitle1")}
                <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-tomato-red via-saffron-yellow to-tomato-red">
                  {t("home.heroTitle2")}
                </span>
              </motion.h1>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="text-lg md:text-xl text-dark-green/70 max-w-lg leading-relaxed"
              >
                {t("home.heroDescription")}
              </motion.p>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="flex flex-wrap gap-8"
              >
                <div className="text-center">
                  <div className="text-4xl font-bold text-tomato-red">60+</div>
                  <div className="text-sm text-dark-green/60 font-medium">
                    {t("home.statsDishes")}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-saffron-yellow">
                    6
                  </div>
                  <div className="text-sm text-dark-green/60 font-medium">
                    {t("home.statsCuisines")}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-dark-green">100%</div>
                  <div className="text-sm text-dark-green/60 font-medium">
                    {t("home.statsFresh")}
                  </div>
                </div>
              </motion.div>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7 }}
                className="flex flex-wrap gap-4"
              >
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-tomato-red to-saffron-yellow text-white hover:shadow-2xl hover:scale-105 font-bold px-10 py-6 text-lg transition-all group"
                >
                  {t("home.exploreMenu")}
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-2 transition-transform" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-dark-green text-dark-green hover:bg-dark-green hover:text-white font-bold px-10 py-6 text-lg transition-all"
                >
                  {t("home.bookTable")}
                </Button>
              </motion.div>
            </motion.div>

            {/* Right Image Grid */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative"
            >
              {/* Main Large Image */}
              <div className="relative">
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  className="relative h-[500px] lg:h-[600px] rounded-3xl overflow-hidden shadow-2xl border-8 border-white"
                >
                  <Image
                    src="/Tarkari-image.png"
                    alt="Delicious Indian cuisine"
                    fill
                    className="object-cover"
                    priority
                  />
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-green/30 to-transparent"></div>
                </motion.div>

                {/* Floating Badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    duration: 0.6,
                    delay: 1,
                    type: "spring",
                    stiffness: 200,
                  }}
                  className="absolute -top-6 -right-6 bg-white rounded-2xl shadow-2xl p-6 border-2 border-saffron-yellow/30"
                >
                  <div className="text-center">
                    <div className="text-3xl font-bold text-tomato-red">
                      4.8★
                    </div>
                    <div className="text-sm text-dark-green/70 font-medium">
                      {t("home.customerRating")}
                    </div>
                  </div>
                </motion.div>

                {/* Decorative Element */}
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.9 }}
                  className="absolute -bottom-6 -left-6 bg-gradient-to-br from-saffron-yellow to-tomato-red rounded-2xl shadow-2xl p-6"
                >
                  <div className="text-white">
                    <div className="text-2xl font-bold">
                      {t("home.freshDaily")}
                    </div>
                    <div className="text-sm opacity-90">
                      {t("home.madeWithLove")}
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Decorative Circle */}
              <motion.div
                animate={{
                  rotate: 360,
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                  scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                }}
                className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-r from-saffron-yellow/10 to-tomato-red/10 blur-3xl"
              ></motion.div>
            </motion.div>
          </div>
        </div>

        {/* Decorative wave bottom */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" className="w-full h-auto">
            <path
              d="M0 0L60 10C120 20 240 40 360 46.7C480 53 600 47 720 43.3C840 40 960 40 1080 46.7C1200 53 1320 67 1380 73.3L1440 80V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V0Z"
              fill="#EEE3D1"
            />
          </svg>
        </div>
      </section>

      {/* Food Gallery Section */}
      <section className="py-16 md:py-24 bg-warm-beige">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-dark-green mb-4">
              {t("home.galleryTitle")}
            </h2>
            <p className="text-lg text-dark-green/70 max-w-2xl mx-auto">
              {t("home.gallerySubtitle")}
            </p>
          </motion.div>
          <ImageGallery images={foodGallery} />
        </div>
      </section>

      {/* Menu Sections */}
      <section id="menu" className="py-16 md:py-24 bg-warm-beige">
        <MenuSection
          title={t("home.tarkariSpecials")}
          items={tarkariSpecials}
        />
      </section>

      {/* Testimonial Section */}
      <section className="py-16 md:py-24 bg-warm-beige">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-dark-green mb-4">
              {t("home.testimonialsTitle")}
            </h2>
          </motion.div>
          <TestimonialCard testimonials={testimonials} />
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
