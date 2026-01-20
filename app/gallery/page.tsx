"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Camera,
  X,
  ChevronLeft,
  ChevronRight,
  UtensilsCrossed,
  Sparkles,
  Users,
  ChefHat,
  PartyPopper,
  Star,
  Tag,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  galleryImages,
  getImagesByCategory,
  categories,
  type GalleryImage,
} from "@/lib/galleryData";

export default function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number>(0);

  const filteredImages =
    selectedCategory === "all"
      ? galleryImages
      : getImagesByCategory(selectedCategory as GalleryImage["category"]);

  const getCategoryIcon = (categoryId: string) => {
    const icons: Record<string, React.ElementType> = {
      all: Camera,
      dishes: UtensilsCrossed,
      ambiance: Sparkles,
      events: PartyPopper,
      kitchen: ChefHat,
      staff: Users,
    };
    return icons[categoryId] || Camera;
  };

  const getCategoryColor = (category: GalleryImage["category"]) => {
    const colors = {
      dishes: "from-tomato-red to-saffron-yellow",
      ambiance: "from-purple-500 to-pink-500",
      events: "from-green-500 to-teal-500",
      kitchen: "from-orange-500 to-red-500",
      staff: "from-blue-500 to-indigo-500",
    };
    return colors[category] || "from-dark-green to-tomato-red";
  };

  const openLightbox = (image: GalleryImage) => {
    setSelectedImage(image);
    const index = filteredImages.findIndex((img) => img.id === image.id);
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const nextImage = () => {
    const newIndex = (lightboxIndex + 1) % filteredImages.length;
    setLightboxIndex(newIndex);
    setSelectedImage(filteredImages[newIndex]);
  };

  const prevImage = () => {
    const newIndex =
      (lightboxIndex - 1 + filteredImages.length) % filteredImages.length;
    setLightboxIndex(newIndex);
    setSelectedImage(filteredImages[newIndex]);
  };

  // Placeholder colors for image backgrounds
  const getPlaceholderColor = (id: number) => {
    const colors = [
      "bg-gradient-to-br from-tomato-red/20 to-saffron-yellow/20",
      "bg-gradient-to-br from-dark-green/20 to-teal-500/20",
      "bg-gradient-to-br from-purple-500/20 to-pink-500/20",
      "bg-gradient-to-br from-orange-500/20 to-red-500/20",
      "bg-gradient-to-br from-blue-500/20 to-indigo-500/20",
    ];
    return colors[id % colors.length];
  };

  return (
    <div className="min-h-screen bg-warm-beige">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 bg-gradient-to-br from-dark-green via-dark-green to-tomato-red overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-60 h-60 bg-saffron-yellow rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-tomato-red rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full mb-6">
              <Camera className="w-5 h-5 text-saffron-yellow" />
              <span className="text-white font-semibold">Photo Gallery</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Visual Journey Through Tarkari
            </h1>
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              Explore our delicious dishes, warm ambiance, and memorable moments
              captured at Tarkari - DombivLi&apos;s finest pure vegetarian
              restaurant.
            </p>

            <div className="flex items-center justify-center gap-4 flex-wrap">
              <div className="bg-white/20 backdrop-blur-sm px-6 py-4 rounded-2xl">
                <p className="text-3xl font-bold text-white">
                  {galleryImages.length}+
                </p>
                <p className="text-white/80 text-sm">Photos</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm px-6 py-4 rounded-2xl">
                <p className="text-3xl font-bold text-white">
                  {categories.length - 1}
                </p>
                <p className="text-white/80 text-sm">Categories</p>
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
              const Icon = getCategoryIcon(category.id);
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
                  <span className="ml-2 text-xs opacity-75">
                    ({category.count})
                  </span>
                </Button>
              );
            })}
          </div>
        </motion.div>
      </section>

      {/* Gallery Grid */}
      <section className="container mx-auto px-6 py-16">
        {filteredImages.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <Camera className="w-20 h-20 text-dark-green/30 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-dark-green mb-3">
              No Images Found
            </h3>
            <p className="text-dark-green/70">
              Try selecting a different category!
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredImages.map((image, index) => (
              <motion.div
                key={image.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => openLightbox(image)}
                className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all"
              >
                {/* Placeholder Background */}
                <div
                  className={`absolute inset-0 ${getPlaceholderColor(
                    image.id
                  )} flex items-center justify-center`}
                >
                  <div className="text-center p-6">
                    <div className="text-6xl mb-4">
                      {image.category === "dishes" && "🍛"}
                      {image.category === "ambiance" && "✨"}
                      {image.category === "events" && "🎉"}
                      {image.category === "kitchen" && "👨‍🍳"}
                      {image.category === "staff" && "👥"}
                    </div>
                    <h3 className="text-dark-green font-bold text-lg mb-2">
                      {image.title}
                    </h3>
                    <p className="text-dark-green/70 text-sm line-clamp-2">
                      {image.description}
                    </p>
                  </div>
                </div>

                {/* Overlay on Hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-dark-green/90 via-dark-green/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 className="text-xl font-bold mb-2">{image.title}</h3>
                    <p className="text-white/90 text-sm mb-3 line-clamp-2">
                      {image.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {image.tags.slice(0, 2).map((tag, idx) => (
                        <span
                          key={idx}
                          className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                      {image.tags.length > 2 && (
                        <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs">
                          +{image.tags.length - 2}
                        </span>
                      )}
                    </div>
                  </div>
                  {image.featured && (
                    <div className="absolute top-4 right-4">
                      <div className="bg-saffron-yellow text-dark-green px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                        <Star className="w-3 h-3 fill-current" />
                        Featured
                      </div>
                    </div>
                  )}
                </div>

                {/* Category Badge */}
                <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div
                    className={`bg-gradient-to-r ${getCategoryColor(
                      image.category
                    )} text-white px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide`}
                  >
                    {image.category}
                  </div>
                </div>

                {/* View Icon */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="bg-white/30 backdrop-blur-sm rounded-full p-4">
                    <Camera className="w-8 h-8 text-white" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-6 right-6 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full p-3 transition-all z-50"
            >
              <X className="w-6 h-6 text-white" />
            </button>

            {/* Navigation Buttons */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
              className="absolute left-6 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full p-3 transition-all z-50"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
              className="absolute right-6 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full p-3 transition-all z-50"
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </button>

            {/* Image Container */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-5xl w-full"
            >
              {/* Image Placeholder */}
              <div
                className={`${getPlaceholderColor(
                  selectedImage.id
                )} rounded-2xl aspect-video flex items-center justify-center mb-6`}
              >
                <div className="text-center p-12">
                  <div className="text-9xl mb-6">
                    {selectedImage.category === "dishes" && "🍛"}
                    {selectedImage.category === "ambiance" && "✨"}
                    {selectedImage.category === "events" && "🎉"}
                    {selectedImage.category === "kitchen" && "👨‍🍳"}
                    {selectedImage.category === "staff" && "👥"}
                  </div>
                  <h2 className="text-dark-green font-bold text-3xl mb-4">
                    {selectedImage.title}
                  </h2>
                  <p className="text-dark-green/70 text-lg">
                    {selectedImage.description}
                  </p>
                </div>
              </div>

              {/* Image Details */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">
                      {selectedImage.title}
                    </h2>
                    <p className="text-white/80">{selectedImage.description}</p>
                  </div>
                  <div
                    className={`bg-gradient-to-r ${getCategoryColor(
                      selectedImage.category
                    )} text-white px-4 py-2 rounded-xl text-sm font-semibold uppercase tracking-wide`}
                  >
                    {selectedImage.category}
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {selectedImage.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="bg-white/20 text-white px-3 py-1 rounded-full text-sm flex items-center gap-1"
                    >
                      <Tag className="w-3 h-3" />
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Counter */}
                <div className="mt-4 text-white/60 text-sm text-center">
                  {lightboxIndex + 1} / {filteredImages.length}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
            <UtensilsCrossed className="w-16 h-16 text-white mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Experience Tarkari in Person
            </h2>
            <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
              Visit us at DombivLi East and taste the flavors you see here.
              Reserve your table today!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-white text-dark-green hover:bg-white/90 px-8 py-6 rounded-xl font-bold text-lg">
                Reserve a Table
              </Button>
              <Button
                variant="outline"
                className="border-2 border-white text-white hover:bg-white/10 px-8 py-6 rounded-xl font-bold text-lg"
              >
                View Menu
              </Button>
            </div>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
