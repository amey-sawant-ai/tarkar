"use client";

import { motion } from "motion/react";
import { MapPin, Home, Briefcase, Plus, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import DashboardNavbar from "@/components/DashboardNavbar";
import { useLanguage } from "@/contexts/LanguageContext";

export default function AddressesPage() {
  const { t } = useLanguage();
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      type: "Home",
      name: "John Doe",
      phone: "+91 98765 43210",
      address: "123, Shanti Nagar, Near Railway Station",
      city: "Dombivli East",
      state: "Maharashtra",
      pincode: "421201",
      isDefault: true,
    },
    {
      id: 2,
      type: "Work",
      name: "John Doe",
      phone: "+91 98765 43210",
      address: "456, Business Park, 5th Floor",
      city: "Thane",
      state: "Maharashtra",
      pincode: "400601",
      isDefault: false,
    },
    {
      id: 3,
      type: "Other",
      name: "John Doe",
      phone: "+91 98765 43210",
      address: "789, Green Valley Apartments, Building C",
      city: "Kalyan",
      state: "Maharashtra",
      pincode: "421301",
      isDefault: false,
    },
  ]);

  const [showAddForm, setShowAddForm] = useState(false);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Home":
        return <Home className="w-5 h-5" />;
      case "Work":
        return <Briefcase className="w-5 h-5" />;
      default:
        return <MapPin className="w-5 h-5" />;
    }
  };

  const deleteAddress = (id: number) => {
    setAddresses(addresses.filter((addr) => addr.id !== id));
  };

  const setDefaultAddress = (id: number) => {
    setAddresses(
      addresses.map((addr) => ({
        ...addr,
        isDefault: addr.id === id,
      }))
    );
  };

  return (
    <div className="min-h-screen bg-warm-beige">
      <DashboardNavbar
        title={t("page.addresses.title")}
        subtitle={t("page.addresses.subtitle")}
      />
      <div className="container mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto space-y-6"
        >
          {/* Add New Address Button */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => setShowAddForm(!showAddForm)}
            className="w-full bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all border-2 border-dashed border-dark-green/30 hover:border-tomato-red group"
          >
            <div className="flex items-center justify-center gap-3">
              <Plus className="w-6 h-6 text-dark-green group-hover:text-tomato-red transition-colors" />
              <span className="text-lg font-bold text-dark-green group-hover:text-tomato-red transition-colors">
                {t("address.addNew")}
              </span>
            </div>
          </motion.button>

          {/* Add Address Form */}
          {showAddForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white rounded-2xl shadow-lg p-6 overflow-hidden"
            >
              <h3 className="text-xl font-bold text-dark-green mb-6">
                {t("address.addNew")}
              </h3>
              <form className="space-y-4">
                <div className="grid sm:grid-cols-3 gap-4">
                  <button
                    type="button"
                    className="px-4 py-3 rounded-xl border-2 border-dark-green/20 hover:border-tomato-red hover:bg-tomato-red/5 transition-all flex items-center justify-center gap-2 font-semibold text-dark-green"
                  >
                    <Home className="w-5 h-5" />
                    {t("address.home")}
                  </button>
                  <button
                    type="button"
                    className="px-4 py-3 rounded-xl border-2 border-dark-green/20 hover:border-tomato-red hover:bg-tomato-red/5 transition-all flex items-center justify-center gap-2 font-semibold text-dark-green"
                  >
                    <Briefcase className="w-5 h-5" />
                    {t("address.work")}
                  </button>
                  <button
                    type="button"
                    className="px-4 py-3 rounded-xl border-2 border-dark-green/20 hover:border-tomato-red hover:bg-tomato-red/5 transition-all flex items-center justify-center gap-2 font-semibold text-dark-green"
                  >
                    <MapPin className="w-5 h-5" />
                    {t("address.other")}
                  </button>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder={t("form.name")}
                    className="px-4 py-3 rounded-xl border-2 border-dark-green/20 focus:border-tomato-red focus:outline-none transition-all"
                  />
                  <input
                    type="tel"
                    placeholder={t("form.phone")}
                    className="px-4 py-3 rounded-xl border-2 border-dark-green/20 focus:border-tomato-red focus:outline-none transition-all"
                  />
                </div>
                <textarea
                  placeholder={t("form.address")}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border-2 border-dark-green/20 focus:border-tomato-red focus:outline-none transition-all resize-none"
                ></textarea>
                <div className="grid sm:grid-cols-3 gap-4">
                  <input
                    type="text"
                    placeholder={t("form.city")}
                    className="px-4 py-3 rounded-xl border-2 border-dark-green/20 focus:border-tomato-red focus:outline-none transition-all"
                  />
                  <input
                    type="text"
                    placeholder={t("form.state")}
                    className="px-4 py-3 rounded-xl border-2 border-dark-green/20 focus:border-tomato-red focus:outline-none transition-all"
                  />
                  <input
                    type="text"
                    placeholder={t("form.pincode")}
                    className="px-4 py-3 rounded-xl border-2 border-dark-green/20 focus:border-tomato-red focus:outline-none transition-all"
                  />
                </div>
                <div className="flex gap-3">
                  <Button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-tomato-red to-saffron-yellow text-white hover:shadow-xl"
                  >
                    {t("form.saveAddress")}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowAddForm(false)}
                    className="border-dark-green text-dark-green hover:bg-dark-green hover:text-white"
                  >
                    {t("action.cancel")}
                  </Button>
                </div>
              </form>
            </motion.div>
          )}

          {/* Address List */}
          {addresses.map((address, index) => (
            <motion.div
              key={address.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-tomato-red to-saffron-yellow rounded-full flex items-center justify-center text-white">
                    {getTypeIcon(address.type)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-dark-green">
                        {address.type}
                      </h3>
                      {address.isDefault && (
                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-semibold">
                          {t("address.default")}
                        </span>
                      )}
                    </div>
                    <p className="text-dark-green/70 text-sm">{address.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="w-10 h-10 rounded-full bg-warm-beige/50 hover:bg-dark-green/10 flex items-center justify-center text-dark-green transition-all">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteAddress(address.id)}
                    className="w-10 h-10 rounded-full bg-warm-beige/50 hover:bg-red-100 flex items-center justify-center text-dark-green hover:text-red-600 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="bg-warm-beige/20 rounded-xl p-4 mb-4">
                <p className="text-dark-green mb-2">{address.address}</p>
                <p className="text-dark-green">
                  {address.city}, {address.state} - {address.pincode}
                </p>
                <p className="text-dark-green/70 mt-2">
                  Phone: {address.phone}
                </p>
              </div>

              {!address.isDefault && (
                <Button
                  onClick={() => setDefaultAddress(address.id)}
                  variant="outline"
                  className="w-full border-dark-green text-dark-green hover:bg-dark-green hover:text-white"
                >
                  {t("address.setDefault")}
                </Button>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
