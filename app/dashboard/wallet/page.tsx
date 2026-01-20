"use client";

import { useState } from "react";
import { motion } from "motion/react";
import {
  Wallet,
  IndianRupee,
  TrendingUp,
  TrendingDown,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Gift,
  Users,
  RotateCcw,
  Star,
  CheckCircle,
  Clock,
  XCircle,
  Filter,
  Download,
} from "lucide-react";
import DashboardNavbar from "@/components/DashboardNavbar";
import { Button } from "@/components/ui/button";
import {
  walletData,
  getTransactionsByType,
  getRecentTransactions,
  getTransactionColor,
  getTransactionIcon,
  getTransactionLabel,
  type TransactionType,
} from "@/lib/walletData";
import { useLanguage } from "@/contexts/LanguageContext";

export default function WalletPage() {
  const { t } = useLanguage();
  const [showAddMoney, setShowAddMoney] = useState(false);
  const [addAmount, setAddAmount] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<"all" | TransactionType>(
    "all"
  );
  const [showSuccess, setShowSuccess] = useState(false);

  const filteredTransactions =
    selectedFilter === "all"
      ? walletData.transactions
      : getTransactionsByType(selectedFilter);

  const handleAddMoney = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setShowAddMoney(false);
      setAddAmount("");
    }, 2000);
  };

  const quickAmounts = [100, 200, 500, 1000, 2000];

  return (
    <div className="min-h-screen bg-warm-beige">
      <DashboardNavbar
        title={t("page.wallet.title")}
        subtitle={t("page.wallet.subtitle")}
      />

      <div className="container mx-auto px-6 py-8 max-w-7xl">
        {/* Wallet Balance Card */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-dark-green via-green-600 to-emerald-600 rounded-2xl p-8 mb-8 text-white shadow-2xl"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <Wallet className="w-8 h-8" />
              </div>
              <div>
                <p className="text-white/80 text-sm">
                  {t("wallet.availableBalance")}
                </p>
                <div className="flex items-center gap-2 text-4xl font-bold">
                  <IndianRupee className="w-8 h-8" />
                  {walletData.balance}
                </div>
              </div>
            </div>
            <Button
              onClick={() => setShowAddMoney(true)}
              className="bg-white text-dark-green font-bold px-6 py-6 rounded-xl hover:bg-white/90 transition-all hover:scale-105"
            >
              <Plus className="w-5 h-5 mr-2" />
              {t("wallet.addMoney")}
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center gap-2 text-white/80 text-sm mb-1">
                <TrendingUp className="w-4 h-4" />
                {t("wallet.totalEarned")}
              </div>
              <p className="text-2xl font-bold flex items-center">
                <IndianRupee className="w-5 h-5" />
                {walletData.totalEarned}
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center gap-2 text-white/80 text-sm mb-1">
                <TrendingDown className="w-4 h-4" />
                {t("wallet.totalSpent")}
              </div>
              <p className="text-2xl font-bold flex items-center">
                <IndianRupee className="w-5 h-5" />
                {walletData.totalSpent}
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center gap-2 text-white/80 text-sm mb-1">
                <Star className="w-4 h-4" />
                {t("wallet.rewardPoints")}
              </div>
              <p className="text-2xl font-bold">{walletData.rewardPoints}</p>
            </div>
          </div>
        </motion.div>

        {/* Filter Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <Filter className="w-5 h-5 text-dark-green" />
            <h3 className="text-lg font-bold text-dark-green">
              Filter Transactions
            </h3>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={() => setSelectedFilter("all")}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                selectedFilter === "all"
                  ? "bg-gradient-to-r from-tomato-red to-saffron-yellow text-white"
                  : "bg-gray-100 text-dark-green hover:bg-gray-200"
              }`}
            >
              All Transactions
            </Button>
            <Button
              onClick={() => setSelectedFilter("credit")}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                selectedFilter === "credit"
                  ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                  : "bg-gray-100 text-dark-green hover:bg-gray-200"
              }`}
            >
              💰 Money Added
            </Button>
            <Button
              onClick={() => setSelectedFilter("debit")}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                selectedFilter === "debit"
                  ? "bg-gradient-to-r from-red-500 to-red-600 text-white"
                  : "bg-gray-100 text-dark-green hover:bg-gray-200"
              }`}
            >
              💸 Payments
            </Button>
            <Button
              onClick={() => setSelectedFilter("cashback")}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                selectedFilter === "cashback"
                  ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white"
                  : "bg-gray-100 text-dark-green hover:bg-gray-200"
              }`}
            >
              🎁 Cashback
            </Button>
            <Button
              onClick={() => setSelectedFilter("refund")}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                selectedFilter === "refund"
                  ? "bg-gradient-to-r from-green-500 to-green-600 text-white"
                  : "bg-gray-100 text-dark-green hover:bg-gray-200"
              }`}
            >
              ↩️ Refunds
            </Button>
            <Button
              onClick={() => setSelectedFilter("reward")}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                selectedFilter === "reward"
                  ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white"
                  : "bg-gray-100 text-dark-green hover:bg-gray-200"
              }`}
            >
              ⭐ Rewards
            </Button>
          </div>
        </motion.div>

        {/* Transactions List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-dark-green">
              Transaction History ({filteredTransactions.length})
            </h3>
            <Button className="bg-dark-green/10 text-dark-green font-semibold px-4 py-2 rounded-xl hover:bg-dark-green/20 transition-all">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>

          <div className="space-y-3">
            {filteredTransactions.length === 0 ? (
              <div className="text-center py-12">
                <Wallet className="w-16 h-16 text-dark-green/30 mx-auto mb-4" />
                <p className="text-dark-green/60">
                  No transactions found for this filter
                </p>
              </div>
            ) : (
              filteredTransactions.map((txn, index) => (
                <motion.div
                  key={txn.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`border-2 rounded-xl p-4 hover:shadow-md transition-all ${getTransactionColor(
                    txn.type
                  )}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="text-4xl">
                        {getTransactionIcon(txn.type)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-dark-green">
                            {txn.description}
                          </p>
                          {txn.status === "completed" && (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          )}
                          {txn.status === "pending" && (
                            <Clock className="w-4 h-4 text-yellow-600" />
                          )}
                          {txn.status === "failed" && (
                            <XCircle className="w-4 h-4 text-red-600" />
                          )}
                        </div>
                        <p className="text-sm text-dark-green/60">
                          {txn.date} • {txn.time}
                          {txn.orderId && ` • ${txn.orderId}`}
                        </p>
                        <span className="inline-block mt-1 px-2 py-0.5 bg-white/50 rounded text-xs font-semibold">
                          {getTransactionLabel(txn.type)}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={`text-2xl font-bold flex items-center gap-1 ${
                          txn.type === "debit"
                            ? "text-red-600"
                            : "text-green-600"
                        }`}
                      >
                        {txn.type === "debit" ? (
                          <ArrowDownRight className="w-6 h-6" />
                        ) : (
                          <ArrowUpRight className="w-6 h-6" />
                        )}
                        <IndianRupee className="w-5 h-5" />
                        {txn.amount}
                      </p>
                      <p className="text-sm text-dark-green/60">
                        Balance: ₹{txn.balanceAfter}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>

        {/* Add Money Modal */}
        {showAddMoney && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => !showSuccess && setShowAddMoney(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full"
            >
              {showSuccess ? (
                <div className="p-12 text-center">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-12 h-12 text-green-600" />
                  </div>
                  <h2 className="text-3xl font-bold text-dark-green mb-3">
                    Money Added!
                  </h2>
                  <p className="text-dark-green/70">
                    ₹{addAmount} has been added to your wallet
                  </p>
                </div>
              ) : (
                <>
                  <div className="bg-gradient-to-r from-dark-green to-green-600 p-6 text-white rounded-t-2xl">
                    <h2 className="text-2xl font-bold mb-2">Add Money</h2>
                    <p className="text-white/90">
                      Add money to your Tarkari wallet
                    </p>
                  </div>

                  <form onSubmit={handleAddMoney} className="p-6 space-y-6">
                    <div>
                      <label className="block text-dark-green font-semibold mb-3">
                        Enter Amount
                      </label>
                      <div className="relative">
                        <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-dark-green/60" />
                        <input
                          type="number"
                          required
                          min="10"
                          max="50000"
                          value={addAmount}
                          onChange={(e) => setAddAmount(e.target.value)}
                          className="w-full pl-12 pr-4 py-4 text-2xl font-bold rounded-xl border-2 border-dark-green/20 focus:border-tomato-red focus:outline-none transition-all"
                          placeholder="0"
                        />
                      </div>
                      <p className="text-dark-green/60 text-sm mt-2">
                        Minimum: ₹10 • Maximum: ₹50,000
                      </p>
                    </div>

                    <div>
                      <label className="block text-dark-green font-semibold mb-3">
                        Quick Add
                      </label>
                      <div className="grid grid-cols-3 gap-3">
                        {quickAmounts.map((amount) => (
                          <Button
                            key={amount}
                            type="button"
                            onClick={() => setAddAmount(amount.toString())}
                            className="bg-dark-green/10 text-dark-green font-bold py-3 rounded-xl hover:bg-dark-green/20 transition-all"
                          >
                            ₹{amount}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <Button
                        type="button"
                        onClick={() => setShowAddMoney(false)}
                        className="flex-1 border-2 border-dark-green/30 text-dark-green font-bold py-6 rounded-xl hover:bg-dark-green/5 transition-all"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={!addAmount || parseInt(addAmount) < 10}
                        className="flex-1 bg-gradient-to-r from-tomato-red to-saffron-yellow text-white font-bold py-6 rounded-xl hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Plus className="w-5 h-5 mr-2" />
                        Add Money
                      </Button>
                    </div>
                  </form>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
