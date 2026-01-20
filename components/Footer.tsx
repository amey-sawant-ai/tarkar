"use client";

import Link from "next/link";
import {
  Phone,
  MapPin,
  Mail,
  Instagram,
  Facebook,
  Twitter,
} from "lucide-react";
import { motion } from "motion/react";

export default function Footer() {
  const footerSections = [
    {
      title: "Contact",
      items: [
        { icon: Phone, text: "+91 96192 67393" },
        {
          icon: MapPin,
          text: "Shop 5 And 6, Ground Floor, Pushpdeo Society,\nAcharya Tulsi Marg, Near Sarvesh Hall,\nDombivali East, Thane\n638R+CP Dombivli, Maharashtra",
        },
        { icon: Mail, text: "info@tarkari.com" },
      ],
    },
    {
      title: "Navigate",
      links: ["Home", "Menu", "About", "Contact", "Book Now"],
    },
    {
      title: "Menu",
      links: ["Breakfast", "Lunch", "Dinner"],
    },
  ];

  const socialLinks = [
    { icon: Instagram, href: "#" },
    { icon: Facebook, href: "#" },
    { icon: Twitter, href: "#" },
  ];

  return (
    <footer
      id="contact"
      className="bg-gradient-to-br from-white via-warm-beige/30 to-white py-16 border-t-4 border-dark-green/10"
    >
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {footerSections.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <h3 className="font-bold text-dark-green mb-4 text-lg border-b-2 border-saffron-yellow pb-2 inline-block">
                {section.title}
              </h3>
              {"items" in section ? (
                <div className="space-y-3 text-sm text-dark-green/70">
                  {section.items?.map((item, i) => (
                    <motion.div
                      key={i}
                      whileHover={{ x: 5 }}
                      className="flex items-start gap-2"
                    >
                      <item.icon className="h-4 w-4 mt-1 flex-shrink-0" />
                      <span className="whitespace-pre-line">{item.text}</span>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <ul className="space-y-2 text-sm text-dark-green/70">
                  {section.links.map((link, i) => (
                    <motion.li
                      key={i}
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Link
                        href={`#${link.toLowerCase()}`}
                        className="hover:text-dark-green"
                      >
                        {link}
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              )}
            </motion.div>
          ))}

          {/* Follow Us */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h3 className="font-bold text-dark-green mb-4 text-lg border-b-2 border-saffron-yellow pb-2 inline-block">
              Follow Us
            </h3>
            <div className="flex gap-3">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-12 h-12 rounded-full bg-gradient-to-br from-dark-green to-dark-green/80 text-white flex items-center justify-center hover:from-tomato-red hover:to-saffron-yellow transition-all shadow-lg hover:shadow-xl"
                >
                  <social.icon className="h-5 w-5" />
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="border-t-2 border-dark-green/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4"
        >
          <p className="text-sm text-dark-green/70 font-medium">
            © 2025 Tarkari. All Rights Reserved • Crafted with ❤️
          </p>
          <div className="flex gap-6">
            {["License", "Changelog", "Style Guide"].map((link, i) => (
              <Link key={i} href="#" className="hover:text-dark-green">
                <motion.span whileHover={{ y: -2 }} className="inline-block">
                  {link}
                </motion.span>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
