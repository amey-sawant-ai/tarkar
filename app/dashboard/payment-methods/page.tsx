"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  CreditCard,
  Smartphone,
  Building2,
  Wallet,
  Plus,
  Trash2,
  Star,
  CheckCircle,
  X,
  Shield,
  Clock,
} from "lucide-react";
import DashboardNavbar from "@/components/DashboardNavbar";
import { Button } from "@/components/ui/button";
import {
  savedPaymentMethods,
  getPaymentMethodsByType,
  getPaymentMethodColor,
  getPaymentMethodLabel,
  getCardTypeIcon,
  type PaymentMethod,
  type PaymentMethodType,
} from "@/lib/paymentMethodsData";
import { useLanguage } from "@/contexts/LanguageContext";

export default function PaymentMethodsPage() {
  const { t } = useLanguage();
  const [selectedFilter, setSelectedFilter] = useState<
    "all" | PaymentMethodType
  >("all");
  const [showAddMethod, setShowAddMethod] = useState(false);
  const [deleteMethod, setDeleteMethod] = useState<PaymentMethod | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [newMethodType, setNewMethodType] = useState<PaymentMethodType>("card");

  const filteredMethods =
    selectedFilter === "all"
      ? savedPaymentMethods
      : getPaymentMethodsByType(selectedFilter);

  const handleDeleteConfirm = () => {
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setDeleteMethod(null);
    }, 2000);
  };

  const handleAddMethod = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setShowAddMethod(false);
    }, 2000);
  };

  const getMethodIcon = (type: PaymentMethodType) => {
    const icons = {
      card: CreditCard,
      upi: Smartphone,
      netbanking: Building2,
      wallet: Wallet,
    };
    return icons[type];
  };

  return (
    <div className="min-h-screen bg-warm-beige">
      <DashboardNavbar
        title={t("page.paymentMethods.title")}
        subtitle={t("page.paymentMethods.subtitle")}
      />

      <div className="container mx-auto px-6 py-8 max-w-7xl">
        {/* Info Banner */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-6 mb-8 text-white"
        >
          <div className="flex items-start gap-4">
            <Shield className="w-8 h-8 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-xl font-bold mb-2">Secure Payment Methods</h3>
              <p className="text-white/90 mb-3">
                All your payment information is encrypted and stored securely.
                We never share your details with third parties.
              </p>
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>256-bit SSL Encryption</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>PCI DSS Compliant</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>Quick Checkout</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl shadow-lg p-6 sticky top-24"
            >
              <h3 className="text-lg font-bold text-dark-green mb-4">
                Filter by Type
              </h3>
              <div className="space-y-2">
                <Button
                  onClick={() => setSelectedFilter("all")}
                  className={`w-full justify-start px-4 py-3 rounded-xl font-semibold transition-all ${
                    selectedFilter === "all"
                      ? "bg-gradient-to-r from-tomato-red to-saffron-yellow text-white"
                      : "bg-gray-100 text-dark-green hover:bg-gray-200"
                  }`}
                >
                  All Methods ({savedPaymentMethods.length})
                </Button>
                <Button
                  onClick={() => setSelectedFilter("card")}
                  className={`w-full justify-start px-4 py-3 rounded-xl font-semibold transition-all ${
                    selectedFilter === "card"
                      ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                      : "bg-gray-100 text-dark-green hover:bg-gray-200"
                  }`}
                >
                  <CreditCard className="w-5 h-5 mr-2" />
                  Cards ({getPaymentMethodsByType("card").length})
                </Button>
                <Button
                  onClick={() => setSelectedFilter("upi")}
                  className={`w-full justify-start px-4 py-3 rounded-xl font-semibold transition-all ${
                    selectedFilter === "upi"
                      ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white"
                      : "bg-gray-100 text-dark-green hover:bg-gray-200"
                  }`}
                >
                  <Smartphone className="w-5 h-5 mr-2" />
                  UPI ({getPaymentMethodsByType("upi").length})
                </Button>
                <Button
                  onClick={() => setSelectedFilter("netbanking")}
                  className={`w-full justify-start px-4 py-3 rounded-xl font-semibold transition-all ${
                    selectedFilter === "netbanking"
                      ? "bg-gradient-to-r from-green-500 to-green-600 text-white"
                      : "bg-gray-100 text-dark-green hover:bg-gray-200"
                  }`}
                >
                  <Building2 className="w-5 h-5 mr-2" />
                  Net Banking ({getPaymentMethodsByType("netbanking").length})
                </Button>
                <Button
                  onClick={() => setSelectedFilter("wallet")}
                  className={`w-full justify-start px-4 py-3 rounded-xl font-semibold transition-all ${
                    selectedFilter === "wallet"
                      ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white"
                      : "bg-gray-100 text-dark-green hover:bg-gray-200"
                  }`}
                >
                  <Wallet className="w-5 h-5 mr-2" />
                  Wallets ({getPaymentMethodsByType("wallet").length})
                </Button>
              </div>

              <Button
                onClick={() => setShowAddMethod(true)}
                className="w-full mt-6 bg-gradient-to-r from-tomato-red to-saffron-yellow text-white font-bold py-6 rounded-xl hover:shadow-xl transition-all"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add New Method
              </Button>
            </motion.div>
          </div>

          {/* Payment Methods List */}
          <div className="lg:col-span-2">
            {filteredMethods.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20 bg-white rounded-2xl shadow-lg"
              >
                <CreditCard className="w-20 h-20 text-dark-green/30 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-dark-green mb-3">
                  No Payment Methods
                </h3>
                <p className="text-dark-green/70 mb-6">
                  Add a payment method for quick checkout
                </p>
                <Button
                  onClick={() => setShowAddMethod(true)}
                  className="bg-gradient-to-r from-tomato-red to-saffron-yellow text-white font-bold px-8 py-6 rounded-xl"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Add Payment Method
                </Button>
              </motion.div>
            ) : (
              <div className="space-y-4">
                {filteredMethods.map((method, index) => {
                  const Icon = getMethodIcon(method.type);
                  return (
                    <motion.div
                      key={method.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`bg-gradient-to-r ${getPaymentMethodColor(
                        method.type
                      )} rounded-2xl p-6 text-white shadow-lg hover:shadow-2xl transition-all relative overflow-hidden group`}
                    >
                      {/* Background Pattern */}
                      <div className="absolute top-0 right-0 text-9xl opacity-10">
                        {method.icon}
                      </div>

                      <div className="relative z-10">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                              <Icon className="w-6 h-6" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="text-xl font-bold">
                                  {method.name}
                                </h3>
                                {method.isDefault && (
                                  <span className="bg-saffron-yellow text-dark-green px-2 py-0.5 rounded-full text-xs font-bold flex items-center gap-1">
                                    <Star className="w-3 h-3 fill-current" />
                                    Default
                                  </span>
                                )}
                              </div>
                              <p className="text-white/80 text-sm">
                                {getPaymentMethodLabel(method.type)}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => setDeleteMethod(method)}
                            className="text-white hover:bg-white/20 rounded-full p-2 transition-all"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>

                        <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 mb-3">
                          <p className="text-2xl font-bold tracking-wider mb-2">
                            {method.details}
                          </p>
                          {method.expiryDate && (
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-white/80">Expires</span>
                              <span className="font-semibold">
                                {method.expiryDate}
                              </span>
                            </div>
                          )}
                          {method.cardType && (
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-2xl">
                                {getCardTypeIcon(method.cardType)}
                              </span>
                              <span className="text-sm uppercase font-bold">
                                {method.cardType}
                              </span>
                            </div>
                          )}
                        </div>

                        {method.lastUsed && (
                          <div className="flex items-center gap-2 text-white/80 text-sm">
                            <Clock className="w-4 h-4" />
                            Last used: {method.lastUsed}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Add Payment Method Modal */}
        <AnimatePresence>
          {showAddMethod && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
              onClick={() => !showSuccess && setShowAddMethod(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl shadow-2xl max-w-md w-full"
              >
                {showSuccess ? (
                  <div className="p-12 text-center">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle className="w-12 h-12 text-green-600" />
                    </div>
                    <h2 className="text-3xl font-bold text-dark-green mb-3">
                      Method Added!
                    </h2>
                    <p className="text-dark-green/70">
                      Payment method saved successfully
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="bg-gradient-to-r from-dark-green to-green-600 p-6 text-white rounded-t-2xl">
                      <div className="flex items-center justify-between">
                        <div>
                          <h2 className="text-2xl font-bold mb-2">
                            Add Payment Method
                          </h2>
                          <p className="text-white/90">
                            Save for quick checkout
                          </p>
                        </div>
                        <button
                          onClick={() => setShowAddMethod(false)}
                          className="text-white hover:bg-white/20 rounded-full p-2 transition-all"
                        >
                          <X className="w-6 h-6" />
                        </button>
                      </div>
                    </div>

                    <form onSubmit={handleAddMethod} className="p-6 space-y-6">
                      <div>
                        <label className="block text-dark-green font-semibold mb-3">
                          Payment Type
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                          <Button
                            type="button"
                            onClick={() => setNewMethodType("card")}
                            className={`py-6 rounded-xl font-semibold transition-all ${
                              newMethodType === "card"
                                ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                                : "bg-gray-100 text-dark-green hover:bg-gray-200"
                            }`}
                          >
                            <CreditCard className="w-5 h-5 mr-2" />
                            Card
                          </Button>
                          <Button
                            type="button"
                            onClick={() => setNewMethodType("upi")}
                            className={`py-6 rounded-xl font-semibold transition-all ${
                              newMethodType === "upi"
                                ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white"
                                : "bg-gray-100 text-dark-green hover:bg-gray-200"
                            }`}
                          >
                            <Smartphone className="w-5 h-5 mr-2" />
                            UPI
                          </Button>
                        </div>
                      </div>

                      {newMethodType === "card" ? (
                        <>
                          <div>
                            <label className="block text-dark-green font-semibold mb-2">
                              Card Number
                            </label>
                            <input
                              type="text"
                              required
                              maxLength={19}
                              placeholder="1234 5678 9012 3456"
                              className="w-full px-4 py-3 rounded-xl border-2 border-dark-green/20 focus:border-tomato-red focus:outline-none transition-all"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-dark-green font-semibold mb-2">
                                Expiry Date
                              </label>
                              <input
                                type="text"
                                required
                                placeholder="MM/YY"
                                maxLength={5}
                                className="w-full px-4 py-3 rounded-xl border-2 border-dark-green/20 focus:border-tomato-red focus:outline-none transition-all"
                              />
                            </div>
                            <div>
                              <label className="block text-dark-green font-semibold mb-2">
                                CVV
                              </label>
                              <input
                                type="text"
                                required
                                placeholder="123"
                                maxLength={3}
                                className="w-full px-4 py-3 rounded-xl border-2 border-dark-green/20 focus:border-tomato-red focus:outline-none transition-all"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-dark-green font-semibold mb-2">
                              Cardholder Name
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="JOHN DOE"
                              className="w-full px-4 py-3 rounded-xl border-2 border-dark-green/20 focus:border-tomato-red focus:outline-none transition-all uppercase"
                            />
                          </div>
                        </>
                      ) : (
                        <div>
                          <label className="block text-dark-green font-semibold mb-2">
                            UPI ID
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="yourname@upi"
                            className="w-full px-4 py-3 rounded-xl border-2 border-dark-green/20 focus:border-tomato-red focus:outline-none transition-all"
                          />
                        </div>
                      )}

                      <div className="flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-xl p-3">
                        <Shield className="w-5 h-5 text-blue-600 flex-shrink-0" />
                        <p className="text-blue-700 text-sm">
                          Your payment information is encrypted and secure
                        </p>
                      </div>

                      <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-tomato-red to-saffron-yellow text-white font-bold py-6 rounded-xl hover:shadow-xl transition-all"
                      >
                        <Plus className="w-5 h-5 mr-2" />
                        Save Payment Method
                      </Button>
                    </form>
                  </>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {deleteMethod && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
              onClick={() => !showSuccess && setDeleteMethod(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8"
              >
                {showSuccess ? (
                  <div className="text-center">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle className="w-12 h-12 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-dark-green mb-3">
                      Method Deleted
                    </h2>
                    <p className="text-dark-green/70">
                      Payment method removed successfully
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="text-center mb-6">
                      <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Trash2 className="w-10 h-10 text-red-600" />
                      </div>
                      <h2 className="text-2xl font-bold text-dark-green mb-2">
                        Delete Payment Method?
                      </h2>
                      <p className="text-dark-green/70">
                        Are you sure you want to remove{" "}
                        <span className="font-semibold">
                          {deleteMethod.name}
                        </span>
                        ?
                      </p>
                    </div>

                    <div className="flex gap-4">
                      <Button
                        onClick={() => setDeleteMethod(null)}
                        className="flex-1 border-2 border-dark-green/30 text-dark-green font-bold py-4 rounded-xl hover:bg-dark-green/5 transition-all"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleDeleteConfirm}
                        className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white font-bold py-4 rounded-xl hover:shadow-xl transition-all"
                      >
                        Delete
                      </Button>
                    </div>
                  </>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
