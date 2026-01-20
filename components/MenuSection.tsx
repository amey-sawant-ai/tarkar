"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";

interface MenuItem {
  name: string;
  desc: string;
  price: string;
  image: string;
}

interface MenuSectionProps {
  title: string;
  items: MenuItem[];
  delay?: number;
}

export default function MenuSection({
  title,
  items,
  delay = 0,
}: MenuSectionProps) {
  return (
    <section className="py-16 md:py-24 bg-warm-beige">
      <div className="container mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            whileInView={{ scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: delay + 0.2 }}
            className="inline-block w-16 h-16 mb-6"
          >
            <Image
              src="/mint-leaf.png"
              alt="Leaf"
              width={64}
              height={64}
              className="w-full h-full drop-shadow-lg"
            />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: delay + 0.3 }}
            className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-dark-green mb-3 relative inline-block"
          >
            {title}
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: delay + 0.5 }}
              className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-saffron-yellow to-transparent rounded-full"
            />
          </motion.h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto mb-8">
          {items.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: delay + 0.1 * index }}
              whileHover={{ y: -8 }}
              className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all cursor-pointer border-2 border-transparent hover:border-saffron-yellow/30"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.name}
                  width={400}
                  height={300}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {/* Price Badge */}
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
                  <span className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-tomato-red to-saffron-yellow">
                    {item.price}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="font-bold text-dark-green text-xl mb-2 group-hover:text-tomato-red transition-colors">
                  {item.name}
                </h3>
                <p className="text-sm text-dark-green/70 mb-4 line-clamp-2">
                  {item.desc}
                </p>

                {/* Order Button */}
                <Button
                  size="sm"
                  className="w-full bg-gradient-to-r from-dark-green to-dark-green/90 hover:from-tomato-red hover:to-saffron-yellow text-white shadow-md hover:shadow-lg transition-all font-semibold group/btn"
                >
                  Order Now
                  <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: delay + 0.5 }}
          className="text-center"
        >
          <Button className="bg-dark-green hover:bg-dark-green/90 text-white rounded-full px-8 group">
            Book a Table
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
