"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { useState } from "react";

interface Testimonial {
  quote: string;
  author: string;
  role: string;
  avatar: string;
  image: string;
}

interface TestimonialCardProps {
  testimonials: Testimonial[];
}

export default function TestimonialCard({
  testimonials,
}: TestimonialCardProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrevious = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? testimonials.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prev) =>
      prev === testimonials.length - 1 ? 0 : prev + 1
    );
  };

  const current = testimonials[currentIndex];

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="bg-gradient-to-br from-saffron-yellow via-saffron-yellow/90 to-tomato-red/20 rounded-3xl p-8 md:p-12 shadow-2xl border-2 border-white/50"
    >
      <div className="grid md:grid-cols-2 gap-8 items-center">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-4"
        >
          <div className="relative">
            <div className="absolute -top-6 -left-4 text-7xl text-white/40 font-serif leading-none">
              &ldquo;
            </div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-lg md:text-xl text-dark-green leading-relaxed relative z-10 pl-6"
            >
              {current.quote}
            </motion.p>
            <div className="absolute -bottom-4 -right-2 text-7xl text-white/40 font-serif leading-none">
              &rdquo;
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="flex items-center gap-3"
          >
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-dark-green to-dark-green/80 flex items-center justify-center text-white font-bold text-lg shadow-lg">
              {current.avatar}
            </div>
            <div>
              <p className="font-bold text-dark-green text-lg">
                {current.author}
              </p>
              <p className="text-sm text-dark-green/70 font-medium">
                {current.role}
              </p>
            </div>
          </motion.div>
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handlePrevious}
              className="w-12 h-12 rounded-full bg-white border-2 border-dark-green/20 flex items-center justify-center hover:bg-dark-green hover:text-white hover:border-dark-green transition-all shadow-lg font-bold text-lg"
            >
              ←
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleNext}
              className="w-12 h-12 rounded-full bg-dark-green text-white border-2 border-dark-green flex items-center justify-center hover:bg-tomato-red hover:border-tomato-red transition-all shadow-lg font-bold text-lg"
            >
              →
            </motion.button>
          </div>
        </motion.div>
        <motion.div
          key={`image-${currentIndex}`}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-2 gap-4"
        >
          <div className="col-span-2 rounded-3xl overflow-hidden">
            <Image
              src={current.image}
              alt={current.author}
              width={400}
              height={300}
              className="w-full h-64 object-cover"
            />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
