"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Globe, CheckCircle, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { languages, type Language } from "@/lib/translations";
import { useLanguage } from "@/contexts/LanguageContext";

export default function LanguageSwitcher() {
  const { language, setLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Mark as hydrated after mount to prevent SSR mismatch
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const currentLanguage = languages.find((lang) => lang.code === language);

  // Use English as default display until hydrated to match server render
  const defaultLang = languages.find((lang) => lang.code === "en");
  const displayLanguage = isHydrated ? currentLanguage : defaultLang;

  const handleLanguageChange = (newLang: Language) => {
    setLanguage(newLang);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {/* Trigger Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-dark-green/10 backdrop-blur-sm text-dark-green hover:bg-dark-green/20 px-4 py-2 rounded-xl font-semibold transition-all border border-dark-green/20"
      >
        <Globe className="w-5 h-5" />
        <span className="hidden sm:inline">{displayLanguage?.nativeName}</span>
        <span className="sm:hidden">{displayLanguage?.flag}</span>
        <ChevronDown
          className={`w-4 h-4 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </Button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Menu */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full right-0 mt-2 bg-white rounded-xl shadow-2xl overflow-hidden z-50 min-w-[200px]"
          >
            <div className="bg-gradient-to-r from-dark-green to-green-600 p-3">
              <p className="text-white font-bold text-sm">
                {t("language.select")}
              </p>
            </div>

            <div className="py-2">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  className={`w-full px-4 py-3 flex items-center justify-between hover:bg-dark-green/5 transition-all ${
                    language === lang.code ? "bg-green-50" : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{lang.flag}</span>
                    <div className="text-left">
                      <p className="font-semibold text-dark-green">
                        {lang.nativeName}
                      </p>
                      <p className="text-xs text-dark-green/60">{lang.name}</p>
                    </div>
                  </div>
                  {language === lang.code && (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
}
