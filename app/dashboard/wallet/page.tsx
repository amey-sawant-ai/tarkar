"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Wallet,
  IndianRupee,
  TrendingUp,
  TrendingDown,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle,
  Clock,
  XCircle,
  Filter,
  ArrowLeft,
  ArrowRight,
  Loader2,
} from "lucide-react";
import DashboardNavbar from "@/components/DashboardNavbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth, authenticatedFetch } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { formatPrice } from "@/lib/utils";

interface WalletTransaction {
  _id: string;
  type: "credit" | "debit" | "refund" | "cashback" | "reward" | "referral";
  amountPaise: number;
  balanceAfterPaise: number;
  description: string;
  status: "pending" | "completed" | "failed";
  createdAt: string;
  reference?: string;
}

interface WalletData {
  balancePaise: number;
  transactions: WalletTransaction[];
}

interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export default function WalletPage() {
  const { t } = useLanguage();
  const { token } = useAuth();
  const { showToast } = useToast();

  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [selectedFilter, setSelectedFilter] = useState<string>("all");

  const [showAddMoney, setShowAddMoney] = useState(false);
  const [addAmount, setAddAmount] = useState("");
  const [isAddingMoney, setIsAddingMoney] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Fetch wallet data
  const fetchWalletData = useCallback(async (currentPage: number, typeFilter: string) => {
    if (!token) return;
    setIsLoading(true);
    setError(null);
    try {
      let url = `/api/wallet?page=${currentPage}&pageSize=10`;
      if (typeFilter !== "all") {
        url += `&type=${typeFilter}`;
      }
      const response = await authenticatedFetch(url);
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error?.message || "Failed to load wallet data");
      }
      setWalletData({
        balancePaise: data.data.balancePaise,
        transactions: data.data.transactions,
      });
      setMeta(data.meta);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchWalletData(page, selectedFilter);
    }
  }, [fetchWalletData, page, selectedFilter, token]);

  const handleAddMoney = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addAmount || Number(addAmount) < 10) {
      showToast(`Minimum amount is ${formatPrice(1000)}`, "error");
      return;
    }

    setIsAddingMoney(true);
    try {
      const idempotencyKey = crypto.randomUUID();
      const response = await fetch("/api/wallet/add-money", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "Idempotency-Key": idempotencyKey,
        },
        body: JSON.stringify({ amountPaise: Math.round(Number(addAmount) * 100) }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error?.message || "Failed to add money");
      }

      // Update local state without refetching immediately for better UX
      if (walletData) {
        setWalletData((prev) => prev ? {
          ...prev,
          balancePaise: data.data.balancePaise,
          transactions: [data.data.transaction, ...prev.transactions].slice(0, 10),
        } : null);
      } else {
        fetchWalletData(1, selectedFilter);
      }

      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setShowAddMoney(false);
        setAddAmount("");
      }, 2000);
      showToast("Money added successfully!", "success");
    } catch (err: any) {
      showToast(err.message || "Failed to add money", "error");
    } finally {
      setIsAddingMoney(false);
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case "credit":
      case "refund":
      case "cashback":
      case "reward":
        return "border-green-200 bg-green-50";
      case "debit":
        return "border-red-200 bg-red-50";
      default:
        return "border-gray-200 bg-gray-50";
    }
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "credit":
        return "💰";
      case "refund":
        return "↩️";
      case "cashback":
        return "🎁";
      case "reward":
        return "⭐";
      case "debit":
        return "💸";
      default:
        return "📄";
    }
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
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shrink-0">
                <Wallet className="w-8 h-8" />
              </div>
              <div>
                <p className="text-white/80 text-sm font-medium mb-1">
                  Available Balance
                </p>
                <div className="flex items-center text-4xl font-bold">
                  {walletData !== null ? formatPrice(walletData.balancePaise) : formatPrice(0)}
                </div>
              </div>
            </div>

            <Button
              onClick={() => setShowAddMoney(true)}
              className="bg-white text-dark-green font-bold px-6 py-6 rounded-xl hover:bg-white/90 transition-all hover:scale-105 w-full md:w-auto shadow-lg"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Money
            </Button>
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
            {[
              { id: "all", label: "All Transactions" },
              { id: "credit", label: "💰 Money Added" },
              { id: "debit", label: "💸 Payments" },
              { id: "cashback", label: "🎁 Cashback" },
              { id: "refund", label: "↩️ Refunds" },
            ].map((f) => (
              <Button
                key={f.id}
                onClick={() => {
                  setSelectedFilter(f.id);
                  setPage(1);
                }}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${selectedFilter === f.id
                  ? "bg-dark-green text-white shadow-md hover:bg-dark-green/90"
                  : "bg-gray-100 text-dark-green hover:bg-gray-200"
                  }`}
              >
                {f.label}
              </Button>
            ))}
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
              Transaction History {meta && `(${meta.total})`}
            </h3>
          </div>

          <div className="space-y-4">
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-dark-green" />
              </div>
            ) : error ? (
              <div className="text-center py-12 text-red-500 bg-red-50 rounded-xl">
                <p>{error}</p>
                <Button onClick={() => fetchWalletData(page, selectedFilter)} variant="outline" className="mt-4">
                  Retry
                </Button>
              </div>
            ) : !walletData?.transactions.length ? (
              <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                <Wallet className="w-16 h-16 text-dark-green/30 mx-auto mb-4" />
                <p className="text-dark-green/60 font-medium">
                  No transactions found
                </p>
              </div>
            ) : (
              walletData.transactions.map((txn, index) => (
                <motion.div
                  key={txn._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`border rounded-xl p-5 hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${getTransactionColor(txn.type)}`}
                >
                  <div className="flex items-center gap-4">
                    <div className="text-3xl shrink-0 h-12 w-12 flex items-center justify-center bg-white rounded-full shadow-sm">
                      {getTransactionIcon(txn.type)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-bold text-gray-900 leading-none">
                          {txn.description}
                        </p>
                        {txn.status === "completed" && <CheckCircle className="w-4 h-4 text-green-600 shrink-0" />}
                        {txn.status === "pending" && <Clock className="w-4 h-4 text-yellow-600 shrink-0" />}
                        {txn.status === "failed" && <XCircle className="w-4 h-4 text-red-600 shrink-0" />}
                      </div>
                      <p className="text-sm text-gray-600 font-medium">
                        {new Date(txn.createdAt).toLocaleDateString("en-US", {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-0 border-black/5 pt-3 sm:pt-0">
                    <Badge variant="outline" className="sm:hidden mb-0 text-xs bg-white/50">{txn.type.toUpperCase()}</Badge>
                    <div className="text-right">
                      <p className={`text-xl font-bold flex items-center justify-end gap-1 ${txn.type === "debit" ? "text-red-600" : "text-green-600"
                        }`}>
                        {txn.type === "debit" ? "-" : "+"}
                        {formatPrice(txn.amountPaise)}
                      </p>
                      <p className="text-xs text-gray-500 font-medium mt-1">
                        Bal: {formatPrice(txn.balanceAfterPaise)}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>

          {/* Pagination Controls */}
          {meta && meta.totalPages > 1 && (
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
              <Button
                variant="outline"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1 || isLoading}
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" /> Previous
              </Button>
              <div className="text-sm font-medium text-gray-500">
                Page <span className="text-dark-green font-bold">{page}</span> of {meta.totalPages}
              </div>
              <Button
                variant="outline"
                onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
                disabled={page === meta.totalPages || isLoading}
                className="gap-2"
              >
                Next <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </motion.div>

        {/* Add Money Modal */}
        <AnimatePresence>
          {showAddMoney && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
              onClick={() => !showSuccess && !isAddingMoney && setShowAddMoney(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
              >
                {showSuccess ? (
                  <div className="p-12 text-center bg-green-50">
                    <motion.div
                      initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}
                      className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner"
                    >
                      <CheckCircle className="w-14 h-14 text-green-600" />
                    </motion.div>
                    <h2 className="text-3xl font-bold text-green-800 mb-2">
                      Success!
                    </h2>
                    {formatPrice(Number(addAmount) * 100)} has been added to your wallet
                  </div>
                ) : (
                  <>
                    <div className="bg-gradient-to-r from-dark-green to-emerald-700 p-6 text-white shrink-0">
                      <h2 className="text-2xl font-bold mb-1">Add Money to Wallet</h2>
                      <p className="text-white/80 text-sm">Top up your Tarkari balance</p>
                    </div>

                    <form onSubmit={handleAddMoney} className="p-6 space-y-6">
                      <div>
                        <Label className="text-base text-gray-700 font-bold mb-3 block">
                          Amount to Add
                        </Label>
                        <div className="relative">
                          <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
                          <Input
                            type="number"
                            required
                            min="10"
                            max="50000"
                            value={addAmount}
                            onChange={(e) => setAddAmount(e.target.value)}
                            className="pl-12 py-7 text-2xl font-bold rounded-xl border-gray-300 focus-visible:ring-emerald-500"
                            placeholder="0"
                            disabled={isAddingMoney}
                          />
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm text-gray-600 font-medium mb-3 block">
                          Suggested Amounts
                        </Label>
                        <div className="flex flex-wrap gap-2">
                          {quickAmounts.map((amount) => (
                            <button
                              key={amount}
                              type="button"
                              disabled={isAddingMoney}
                              onClick={() => setAddAmount(amount.toString())}
                              className="flex-1 min-w-[30%] bg-gray-50 hover:bg-emerald-50 text-gray-700 hover:text-emerald-700 font-bold py-3 rounded-lg border border-gray-200 hover:border-emerald-200 transition-colors"
                            >
                              {formatPrice(amount * 100)}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-3 pt-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setShowAddMoney(false)}
                          disabled={isAddingMoney}
                          className="flex-1 py-6 rounded-xl font-bold"
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          disabled={!addAmount || Number(addAmount) < 10 || isAddingMoney}
                          className="flex-1 bg-dark-green hover:bg-dark-green/90 text-white font-bold py-6 rounded-xl shadow-md disabled:opacity-50"
                        >
                          {isAddingMoney ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                          ) : (
                            <>
                              <Plus className="w-5 h-5 mr-2" />
                              Add {formatPrice(Number(addAmount || 0) * 100)}
                            </>
                          )}
                        </Button>
                      </div>
                    </form>
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

