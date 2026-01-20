"use client";

import { motion } from "motion/react";
import {
  Bell,
  Moon,
  Globe,
  CreditCard,
  Shield,
  HelpCircle,
  FileText,
  LogOut,
  ArrowLeft,
  Link,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import DashboardNavbar from "@/components/DashboardNavbar";
import { useLanguage } from "@/contexts/LanguageContext";
import type { Language } from "@/lib/translations";

export default function SettingsPage() {
  const { language, setLanguage, t } = useLanguage();

  const [notifications, setNotifications] = useState({
    orderUpdates: true,
    promotions: true,
    newsletter: false,
    sms: true,
  });

  const [preferences, setPreferences] = useState({
    darkMode: false,
  });

  return (
    <div className="min-h-screen bg-warm-beige">
      <DashboardNavbar
        title={t("page.settings.title")}
        subtitle={t("page.settings.subtitle")}
      />

      <div className="container mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto space-y-6"
        >
          {/* Notifications */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <Bell className="w-6 h-6 text-dark-green" />
              <h2 className="text-xl font-bold text-dark-green">
                {t("settings.notifications")}
              </h2>
            </div>
            <div className="space-y-4">
              {[
                {
                  key: "orderUpdates",
                  label: t("settings.orderUpdates"),
                  desc: t("settings.orderUpdatesDesc"),
                },
                {
                  key: "promotions",
                  label: t("settings.promotions"),
                  desc: t("settings.promotionsDesc"),
                },
                {
                  key: "newsletter",
                  label: t("settings.newsletter"),
                  desc: t("settings.newsletterDesc"),
                },
                {
                  key: "sms",
                  label: t("settings.sms"),
                  desc: t("settings.smsDesc"),
                },
              ].map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between p-4 bg-warm-beige/20 rounded-xl"
                >
                  <div>
                    <p className="font-semibold text-dark-green">
                      {item.label}
                    </p>
                    <p className="text-dark-green/60 text-sm">{item.desc}</p>
                  </div>
                  <button
                    onClick={() =>
                      setNotifications({
                        ...notifications,
                        [item.key]:
                          !notifications[
                            item.key as keyof typeof notifications
                          ],
                      })
                    }
                    className={`relative w-14 h-8 rounded-full transition-all ${
                      notifications[item.key as keyof typeof notifications]
                        ? "bg-gradient-to-r from-tomato-red to-saffron-yellow"
                        : "bg-dark-green/20"
                    }`}
                  >
                    <span
                      className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                        notifications[item.key as keyof typeof notifications]
                          ? "translate-x-6"
                          : ""
                      }`}
                    ></span>
                  </button>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Preferences */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <Globe className="w-6 h-6 text-dark-green" />
              <h2 className="text-xl font-bold text-dark-green">
                {t("settings.preferences")}
              </h2>
            </div>
            <div className="space-y-4">
              {/* Dark Mode */}
              <div className="flex items-center justify-between p-4 bg-warm-beige/20 rounded-xl">
                <div className="flex items-center gap-3">
                  <Moon className="w-5 h-5 text-dark-green" />
                  <div>
                    <p className="font-semibold text-dark-green">
                      {t("settings.darkMode")}
                    </p>
                    <p className="text-dark-green/60 text-sm">
                      {t("settings.darkModeDesc")}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() =>
                    setPreferences({
                      ...preferences,
                      darkMode: !preferences.darkMode,
                    })
                  }
                  className={`relative w-14 h-8 rounded-full transition-all ${
                    preferences.darkMode
                      ? "bg-gradient-to-r from-tomato-red to-saffron-yellow"
                      : "bg-dark-green/20"
                  }`}
                >
                  <span
                    className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                      preferences.darkMode ? "translate-x-6" : ""
                    }`}
                  ></span>
                </button>
              </div>

              {/* Language */}
              <div className="p-4 bg-warm-beige/20 rounded-xl">
                <label className="block text-sm font-semibold text-dark-green mb-3">
                  {t("settings.language")}
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as Language)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-dark-green/20 focus:border-tomato-red focus:outline-none transition-all bg-white"
                >
                  <option value="en">English</option>
                  <option value="hi">हिंदी (Hindi)</option>
                  <option value="mr">मराठी (Marathi)</option>
                </select>
              </div>
            </div>
          </motion.div>

          {/* Payment Methods */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <CreditCard className="w-6 h-6 text-dark-green" />
              <h2 className="text-xl font-bold text-dark-green">
                {t("page.paymentMethods.title")}
              </h2>
            </div>
            <div className="space-y-3">
              <div className="p-4 bg-warm-beige/20 rounded-xl flex items-center justify-between">
                <div>
                  <p className="font-semibold text-dark-green">
                    {t("payment.card")}
                  </p>
                  <p className="text-dark-green/60 text-sm">
                    **** **** **** 4532
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-dark-green text-dark-green hover:bg-dark-green hover:text-white"
                >
                  {t("action.edit")}
                </Button>
              </div>
              <Button
                variant="outline"
                className="w-full border-tomato-red text-tomato-red hover:bg-tomato-red hover:text-white"
              >
                + {t("payment.addMethod")}
              </Button>
            </div>
          </motion.div>

          {/* Support & Legal */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <HelpCircle className="w-6 h-6 text-dark-green" />
              <h2 className="text-xl font-bold text-dark-green">
                {t("settings.quickLinks")}
              </h2>
            </div>
            <div className="space-y-3">
              <button className="w-full p-4 bg-warm-beige/20 rounded-xl flex items-center justify-between hover:bg-warm-beige/40 transition-all group">
                <div className="flex items-center gap-3">
                  <HelpCircle className="w-5 h-5 text-dark-green" />
                  <span className="font-semibold text-dark-green">
                    {t("settings.helpSupport")}
                  </span>
                </div>
                <ArrowLeft className="w-5 h-5 text-dark-green rotate-180 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="w-full p-4 bg-warm-beige/20 rounded-xl flex items-center justify-between hover:bg-warm-beige/40 transition-all group">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-dark-green" />
                  <span className="font-semibold text-dark-green">
                    {t("settings.termsConditions")}
                  </span>
                </div>
                <ArrowLeft className="w-5 h-5 text-dark-green rotate-180 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="w-full p-4 bg-warm-beige/20 rounded-xl flex items-center justify-between hover:bg-warm-beige/40 transition-all group">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-dark-green" />
                  <span className="font-semibold text-dark-green">
                    {t("settings.privacyPolicy")}
                  </span>
                </div>
                <ArrowLeft className="w-5 h-5 text-dark-green rotate-180 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>

          {/* Logout */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Link href="/login">
              <Button className="w-full bg-red-600 text-white hover:bg-red-700 py-6 text-lg font-semibold">
                <LogOut className="w-5 h-5 mr-2" />
                {t("dashboard.logout")}
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
