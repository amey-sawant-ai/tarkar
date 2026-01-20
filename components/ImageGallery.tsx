"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { useLanguage } from "@/contexts/LanguageContext";

interface ImageGalleryProps {
  images: string[];
  title?: string;
  subtitle?: string;
}

export default function ImageGallery({
  images,
  title,
  subtitle,
}: ImageGalleryProps) {
  const { t } = useLanguage();
  return (
    <section className="py-16 md:py-24 bg-warm-beige">
      <div className="container mx-auto px-6 md:px-12">
        {title && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-dark-green">
              {title}
              {subtitle && (
                <>
                  <br />
                  {subtitle}
                </>
              )}
            </h2>
          </motion.div>
        )}

        <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
          {images.map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.8, rotateY: -90 }}
              whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.6,
                delay: i * 0.1,
                type: "spring",
                stiffness: 100,
              }}
              whileHover={{
                scale: 1.05,
                y: -10,
                transition: { duration: 0.3 },
              }}
              className="group flex-shrink-0 w-48 md:w-64 h-64 md:h-80 rounded-3xl overflow-hidden shadow-2xl cursor-pointer border-4 border-white hover:border-saffron-yellow/50 transition-all relative"
            >
              <Image
                src={img}
                alt={`Image ${i + 1}`}
                width={300}
                height={400}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <motion.div
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                className="absolute inset-0 bg-gradient-to-t from-dark-green/90 via-dark-green/30 to-transparent flex items-end p-6"
              >
                <p className="text-white font-bold text-lg">
                  {t("gallery.deliciousDish")} #{i + 1}
                </p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
