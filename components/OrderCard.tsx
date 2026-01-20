"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Clock, CheckCircle, XCircle, Package, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface OrderCardProps {
  id: string;
  date: string;
  status: "Delivered" | "In Transit" | "Cancelled" | "Processing";
  items: OrderItem[];
  total: number;
  deliveryFee: number;
  image: string;
  index?: number;
}

export default function OrderCard({
  id,
  date,
  status,
  items,
  total,
  deliveryFee,
  image,
  index = 0,
}: OrderCardProps) {
  const { t } = useLanguage();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Delivered":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "In Transit":
        return <Clock className="w-5 h-5 text-saffron-yellow" />;
      case "Cancelled":
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Package className="w-5 h-5 text-dark-green" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-700";
      case "In Transit":
        return "bg-yellow-100 text-yellow-700";
      case "Cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-warm-beige text-dark-green";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all"
    >
      <div className="p-6">
        {/* Order Header */}
        <div className="flex items-start justify-between mb-4 pb-4 border-b-2 border-warm-beige/30">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-xl font-bold text-dark-green">{id}</h3>
              <div
                className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                  status
                )}`}
              >
                {getStatusIcon(status)}
                {status}
              </div>
            </div>
            <p className="text-dark-green/60 text-sm">{date}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-tomato-red">₹{total}</p>
            <p className="text-dark-green/60 text-sm">
              {items.length}{" "}
              {items.length > 1 ? t("order.items") : t("order.item")}
            </p>
          </div>
        </div>

        {/* Order Items */}
        <div className="space-y-3 mb-4">
          {items.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-warm-beige/30 rounded-lg flex items-center justify-center">
                  <Image
                    src={image}
                    alt={item.name}
                    width={40}
                    height={40}
                    className="rounded"
                  />
                </div>
                <div>
                  <p className="font-semibold text-dark-green">{item.name}</p>
                  <p className="text-dark-green/60 text-sm">
                    {t("order.qty")}: {item.quantity}
                  </p>
                </div>
              </div>
              <p className="font-bold text-dark-green">
                ₹{item.price * item.quantity}
              </p>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="bg-warm-beige/20 rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-dark-green/70">{t("order.subtotal")}</span>
            <span className="font-semibold text-dark-green">
              ₹{total - deliveryFee}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-dark-green/70">{t("order.deliveryFee")}</span>
            <span className="font-semibold text-dark-green">
              ₹{deliveryFee}
            </span>
          </div>
          <div className="flex items-center justify-between text-lg pt-2 border-t border-dark-green/10">
            <span className="font-bold text-dark-green">
              {t("order.total")}
            </span>
            <span className="font-bold text-tomato-red">₹{total}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-4">
          {status === "Delivered" && (
            <>
              <Link href="/dashboard/order" className="flex-1">
                <Button className="w-full bg-gradient-to-r from-tomato-red to-saffron-yellow text-white hover:shadow-xl">
                  {t("order.reorder")}
                </Button>
              </Link>
              <Button
                variant="outline"
                className="flex-1 border-dark-green text-dark-green hover:bg-dark-green hover:text-white"
              >
                <Star className="w-4 h-4 mr-2" />
                {t("order.rateOrder")}
              </Button>
            </>
          )}
          {status === "In Transit" && (
            <Button className="w-full bg-gradient-to-r from-tomato-red to-saffron-yellow text-white hover:shadow-xl">
              {t("order.trackOrder")}
            </Button>
          )}
          {status === "Cancelled" && (
            <Link href="/dashboard/order" className="w-full">
              <Button className="w-full bg-gradient-to-r from-tomato-red to-saffron-yellow text-white hover:shadow-xl">
                {t("order.orderAgain")}
              </Button>
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  );
}
