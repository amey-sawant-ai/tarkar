"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import {
  MapPin,
  CreditCard,
  Truck,
  Store,
  StickyNote,
  ChevronRight,
  Plus,
  Check,
  Loader2,
  ShoppingBag,
  ArrowLeft,
  Wallet,
  IndianRupee,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import DashboardNavbar from "@/components/DashboardNavbar";
import PaymentButton from "@/components/PaymentButton";
import CODPaymentButton from "@/components/CODPaymentButton";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import { cn, formatPrice, calculateOrderTotal } from "@/lib/utils";
import { PRICING } from "@/lib/constants";

// Types
interface Address {
  _id: string;
  label: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

interface PaymentMethod {
  _id: string;
  type: "card" | "upi" | "netbanking" | "wallet" | "cod";
  name: string;
  isDefault: boolean;
  cardNumberMasked?: string;
  cardType?: string;
  upiId?: string;
  bankName?: string;
}

type DeliveryType = "delivery" | "pickup";

// Default payment options (always available)
const defaultPaymentOptions: PaymentMethod[] = [
  {
    _id: "cod",
    type: "cod",
    name: "Cash on Delivery",
    isDefault: false,
  },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCart();
  const { token, isAuthenticated, isLoading: authLoading } = useAuth();
  const { showToast } = useToast();

  // State
  const [deliveryType, setDeliveryType] = useState<DeliveryType>("delivery");
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null,
  );
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(
    defaultPaymentOptions,
  );
  const [selectedPaymentId, setSelectedPaymentId] = useState<string>("cod");
  const [orderNotes, setOrderNotes] = useState("");
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(true);
  const [isLoadingPayments, setIsLoadingPayments] = useState(true);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState<string | null>(null);

  // New address form state
  const [newAddress, setNewAddress] = useState({
    label: "Home",
    fullName: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    landmark: "",
    city: "",
    state: "Maharashtra",
    pincode: "",
    isDefault: false,
  });

  // Calculate order totals
  const totals = calculateOrderTotal(totalPrice);
  const subtotalPaise = totals.subtotal;
  const taxPaise = totals.tax;
  const deliveryFeePaise = deliveryType === "delivery" ? totals.deliveryFee : 0;
  const totalPaise = subtotalPaise + taxPaise + deliveryFeePaise;

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login?redirect=/dashboard/checkout");
    }
  }, [authLoading, isAuthenticated, router]);

  // Redirect if cart is empty
  useEffect(() => {
    if (!authLoading && items.length === 0) {
      router.push("/dashboard/order");
    }
  }, [authLoading, items.length, router]);

  // Fetch addresses
  useEffect(() => {
    async function fetchAddresses() {
      if (!token) return;

      try {
        const res = await fetch("/api/user/addresses", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success) {
          setAddresses(data.data);
          // Auto-select default address
          const defaultAddr = data.data.find((a: Address) => a.isDefault);
          if (defaultAddr) {
            setSelectedAddressId(defaultAddr._id);
          } else if (data.data.length > 0) {
            setSelectedAddressId(data.data[0]._id);
          }
        }
      } catch (error) {
        console.error("Failed to fetch addresses:", error);
      } finally {
        setIsLoadingAddresses(false);
      }
    }

    fetchAddresses();
  }, [token]);

  // Fetch payment methods
  useEffect(() => {
    async function fetchPaymentMethods() {
      if (!token) return;

      try {
        const res = await fetch("/api/payment-methods", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success && data.data.length > 0) {
          setPaymentMethods([...data.data, ...defaultPaymentOptions]);
          // Auto-select default payment
          const defaultPay = data.data.find((p: PaymentMethod) => p.isDefault);
          if (defaultPay) {
            setSelectedPaymentId(defaultPay._id);
          }
        }
      } catch (error) {
        console.error("Failed to fetch payment methods:", error);
      } finally {
        setIsLoadingPayments(false);
      }
    }

    fetchPaymentMethods();
  }, [token]);

  // Add new address
  const handleAddAddress = async () => {
    if (!token) return;

    // Validate
    if (
      !newAddress.fullName ||
      !newAddress.phone ||
      !newAddress.addressLine1 ||
      !newAddress.city ||
      !newAddress.pincode
    ) {
      showToast("Please fill all required fields", "error");
      return;
    }

    try {
      const res = await fetch("/api/user/addresses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newAddress),
      });

      const data = await res.json();
      if (data.success) {
        setAddresses((prev) => [data.data, ...prev]);
        setSelectedAddressId(data.data._id);
        setShowAddressForm(false);
        setNewAddress({
          label: "Home",
          fullName: "",
          phone: "",
          addressLine1: "",
          addressLine2: "",
          landmark: "",
          city: "",
          state: "Maharashtra",
          pincode: "",
          isDefault: false,
        });
        showToast("Address added successfully", "success");
      } else {
        showToast(data.error?.message || "Failed to add address", "error");
      }
    } catch (error) {
      console.error("Failed to add address:", error);
      showToast("Failed to add address", "error");
    }
  };

  const handlePaymentSuccess = () => {
    clearCart();
    showToast("Payment successful! Order confirmed.", "success");
    setTimeout(() => {
      router.push(`/dashboard/order-tracking?orderId=${createdOrderId}`);
    }, 1500);
  };

  const handlePaymentError = (error: string) => {
    showToast(`Payment failed: ${error}`, "error");
  };

  const handlePlaceOrder = async () => {
    if (!token) return;

    // Validations
    if (deliveryType === "delivery" && !selectedAddressId) {
      showToast("Please select a delivery address", "error");
      return;
    }

    if (!selectedPaymentId) {
      showToast("Please select a payment method", "error");
      return;
    }

    setIsPlacingOrder(true);

    try {
      const selectedAddress = addresses.find(
        (a) => a._id === selectedAddressId,
      );
      const addressString = selectedAddress
        ? `${selectedAddress.fullName}, ${selectedAddress.addressLine1}${selectedAddress.addressLine2 ? ", " + selectedAddress.addressLine2 : ""}, ${selectedAddress.city} - ${selectedAddress.pincode}`
        : undefined;

      const orderPayload = {
        items: items.map((item) => ({
          dishId: item.dishId,
          quantity: item.quantity,
        })),
        deliveryType,
        deliveryAddress: addressString,
        paymentMethod:
          selectedPaymentId === "cod"
            ? "cod"
            : paymentMethods.find((p) => p._id === selectedPaymentId)?.type ||
            "cod",
        notes: orderNotes || undefined,
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderPayload),
      });

      const data = await res.json();

      if (data.success) {
        // Store the created order ID and show payment methods
        setCreatedOrderId(data.data._id);
      } else {
        showToast(data.error?.message || "Failed to place order", "error");
      }
    } catch (error) {
      console.error("Failed to place order:", error);
      showToast("Failed to place order. Please try again.", "error");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  // Show loading while auth is checking or if not authenticated (redirect will happen)
  if (authLoading || !isAuthenticated || items.length === 0) {
    return (
      <div className="min-h-screen bg-warm-beige flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-tomato-red" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warm-beige">
      <DashboardNavbar title="Checkout" subtitle="Complete your order" />

      {/* Payment Modal */}
      {createdOrderId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full"
          >
            <h3 className="text-2xl font-bold text-dark-green mb-2">
              Complete Payment
            </h3>
            <p className="text-dark-green/70 mb-6">
              Order created! Now choose your payment method.
            </p>

            <div className="space-y-4 mb-6">
              {/* Razorpay Payment Option */}
              <div className="bg-gradient-to-r from-tomato-red/10 to-saffron-yellow/10 rounded-xl p-4 border-2 border-tomato-red/20">
                <p className="font-semibold text-dark-green mb-3">
                  Online Payment
                </p>
                <PaymentButton
                  orderId={createdOrderId}
                  amount={totalPaise}
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                  className="w-full"
                  size="lg"
                />
                <p className="text-xs text-dark-green/60 text-center mt-2">
                  Credit/Debit Card, UPI, Wallet
                </p>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-dark-green/20"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-dark-green/60">
                    OR
                  </span>
                </div>
              </div>

              {/* COD Payment Option */}
              <div className="bg-gradient-to-r from-saffron-yellow/10 to-warm-beige rounded-xl p-4 border-2 border-saffron-yellow/20">
                <p className="font-semibold text-dark-green mb-3">
                  Cash on Delivery
                </p>
                <CODPaymentButton
                  orderId={createdOrderId}
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                  className="w-full"
                  size="lg"
                />
                <p className="text-xs text-dark-green/60 text-center mt-2">
                  Pay when your order arrives
                </p>
              </div>
            </div>

            <Button
              variant="outline"
              onClick={() => setCreatedOrderId(null)}
              className="w-full"
            >
              Back to Checkout
            </Button>
          </motion.div>
        </div>
      )}

      <div className="container mx-auto px-6 py-8">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6 text-dark-green hover:text-tomato-red"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Menu
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Options */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Type Selection */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <h2 className="text-xl font-bold text-dark-green mb-4 flex items-center gap-2">
                <Truck className="w-5 h-5" />
                Delivery Type
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setDeliveryType("delivery")}
                  className={cn(
                    "p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2",
                    deliveryType === "delivery"
                      ? "border-tomato-red bg-tomato-red/5"
                      : "border-dark-green/20 hover:border-dark-green/40",
                  )}
                >
                  <Truck
                    className={cn(
                      "w-8 h-8",
                      deliveryType === "delivery"
                        ? "text-tomato-red"
                        : "text-dark-green/60",
                    )}
                  />
                  <span className="font-semibold text-dark-green">
                    Home Delivery
                  </span>
                  <span className="text-sm text-dark-green/60">
                    {formatPrice(PRICING.deliveryFee)} delivery fee
                  </span>
                </button>

                <button
                  onClick={() => setDeliveryType("pickup")}
                  className={cn(
                    "p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2",
                    deliveryType === "pickup"
                      ? "border-tomato-red bg-tomato-red/5"
                      : "border-dark-green/20 hover:border-dark-green/40",
                  )}
                >
                  <Store
                    className={cn(
                      "w-8 h-8",
                      deliveryType === "pickup"
                        ? "text-tomato-red"
                        : "text-dark-green/60",
                    )}
                  />
                  <span className="font-semibold text-dark-green">
                    Self Pickup
                  </span>
                  <span className="text-sm text-dark-green/60">Free</span>
                </button>
              </div>
            </motion.div>

            {/* Address Selection (only for delivery) */}
            {deliveryType === "delivery" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl shadow-lg p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-dark-green flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Delivery Address
                  </h2>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAddressForm(!showAddressForm)}
                    className="text-tomato-red border-tomato-red hover:bg-tomato-red hover:text-white"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add New
                  </Button>
                </div>

                {/* Add Address Form */}
                {showAddressForm && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mb-6 p-4 bg-warm-beige/30 rounded-xl"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-dark-green mb-1">
                          Label *
                        </label>
                        <select
                          value={newAddress.label}
                          onChange={(e) =>
                            setNewAddress({
                              ...newAddress,
                              label: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 rounded-lg border border-dark-green/20 focus:border-tomato-red focus:outline-none"
                        >
                          <option value="Home">Home</option>
                          <option value="Work">Work</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-dark-green mb-1">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          value={newAddress.fullName}
                          onChange={(e) =>
                            setNewAddress({
                              ...newAddress,
                              fullName: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 rounded-lg border border-dark-green/20 focus:border-tomato-red focus:outline-none"
                          placeholder="John Doe"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-dark-green mb-1">
                          Phone *
                        </label>
                        <input
                          type="tel"
                          value={newAddress.phone}
                          onChange={(e) =>
                            setNewAddress({
                              ...newAddress,
                              phone: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 rounded-lg border border-dark-green/20 focus:border-tomato-red focus:outline-none"
                          placeholder="+91 98765 43210"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-dark-green mb-1">
                          Pincode *
                        </label>
                        <input
                          type="text"
                          value={newAddress.pincode}
                          onChange={(e) =>
                            setNewAddress({
                              ...newAddress,
                              pincode: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 rounded-lg border border-dark-green/20 focus:border-tomato-red focus:outline-none"
                          placeholder="421201"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-sm font-semibold text-dark-green mb-1">
                          Address Line 1 *
                        </label>
                        <input
                          type="text"
                          value={newAddress.addressLine1}
                          onChange={(e) =>
                            setNewAddress({
                              ...newAddress,
                              addressLine1: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 rounded-lg border border-dark-green/20 focus:border-tomato-red focus:outline-none"
                          placeholder="House/Flat No., Building Name"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-sm font-semibold text-dark-green mb-1">
                          Address Line 2
                        </label>
                        <input
                          type="text"
                          value={newAddress.addressLine2}
                          onChange={(e) =>
                            setNewAddress({
                              ...newAddress,
                              addressLine2: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 rounded-lg border border-dark-green/20 focus:border-tomato-red focus:outline-none"
                          placeholder="Street, Area"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-dark-green mb-1">
                          Landmark
                        </label>
                        <input
                          type="text"
                          value={newAddress.landmark}
                          onChange={(e) =>
                            setNewAddress({
                              ...newAddress,
                              landmark: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 rounded-lg border border-dark-green/20 focus:border-tomato-red focus:outline-none"
                          placeholder="Near..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-dark-green mb-1">
                          City *
                        </label>
                        <input
                          type="text"
                          value={newAddress.city}
                          onChange={(e) =>
                            setNewAddress({
                              ...newAddress,
                              city: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 rounded-lg border border-dark-green/20 focus:border-tomato-red focus:outline-none"
                          placeholder="Dombivli"
                        />
                      </div>
                    </div>
                    <div className="flex gap-3 mt-4">
                      <Button
                        onClick={handleAddAddress}
                        className="bg-gradient-to-r from-tomato-red to-saffron-yellow text-white"
                      >
                        Save Address
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setShowAddressForm(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </motion.div>
                )}

                {/* Address List */}
                {isLoadingAddresses ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-tomato-red" />
                  </div>
                ) : addresses.length === 0 ? (
                  <div className="text-center py-8 text-dark-green/60">
                    <MapPin className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p>No addresses saved. Add one above.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {addresses.map((address) => (
                      <button
                        key={address._id}
                        onClick={() => setSelectedAddressId(address._id)}
                        className={cn(
                          "w-full p-4 rounded-xl border-2 text-left transition-all",
                          selectedAddressId === address._id
                            ? "border-tomato-red bg-tomato-red/5"
                            : "border-dark-green/20 hover:border-dark-green/40",
                        )}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-bold text-dark-green">
                                {address.label}
                              </span>
                              {address.isDefault && (
                                <span className="text-xs bg-saffron-yellow/20 text-saffron-yellow px-2 py-0.5 rounded-full">
                                  Default
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-dark-green">
                              {address.fullName}
                            </p>
                            <p className="text-sm text-dark-green/70">
                              {address.addressLine1}
                              {address.addressLine2 &&
                                `, ${address.addressLine2}`}
                            </p>
                            <p className="text-sm text-dark-green/70">
                              {address.city}, {address.state} -{" "}
                              {address.pincode}
                            </p>
                            <p className="text-sm text-dark-green/60 mt-1">
                              {address.phone}
                            </p>
                          </div>
                          {selectedAddressId === address._id && (
                            <Check className="w-5 h-5 text-tomato-red" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* Payment Method Selection */}
            {/* <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <h2 className="text-xl font-bold text-dark-green mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Payment Method
              </h2>

              {isLoadingPayments ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-tomato-red" />
                </div>
              ) : (
                <div className="space-y-3">
                  {paymentMethods.map((method) => (
                    <button
                      key={method._id}
                      onClick={() => setSelectedPaymentId(method._id)}
                      className={cn(
                        "w-full p-4 rounded-xl border-2 text-left transition-all flex items-center justify-between",
                        selectedPaymentId === method._id
                          ? "border-tomato-red bg-tomato-red/5"
                          : "border-dark-green/20 hover:border-dark-green/40",
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-warm-beige/50 flex items-center justify-center">
                          {method.type === "card" && (
                            <CreditCard className="w-5 h-5 text-dark-green" />
                          )}
                          {method.type === "upi" && (
                            <span className="text-sm font-bold text-dark-green">
                              UPI
                            </span>
                          )}
                          {method.type === "netbanking" && (
                            <span className="text-sm font-bold text-dark-green">
                              NB
                            </span>
                          )}
                          {method.type === "wallet" && (
                            <Wallet className="w-5 h-5 text-dark-green" />
                          )}
                          {method.type === "cod" && (
                            <IndianRupee className="w-5 h-5 text-dark-green" />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-dark-green">
                            {method.name}
                          </p>
                          {method.cardNumberMasked && (
                            <p className="text-sm text-dark-green/60">
                              {method.cardNumberMasked}
                            </p>
                          )}
                          {method.upiId && (
                            <p className="text-sm text-dark-green/60">
                              {method.upiId}
                            </p>
                          )}
                        </div>
                      </div>
                      {selectedPaymentId === method._id && (
                        <Check className="w-5 h-5 text-tomato-red" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </motion.div> */}

            {/* Order Notes */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <h2 className="text-xl font-bold text-dark-green mb-4 flex items-center gap-2">
                <StickyNote className="w-5 h-5" />
                Order Notes (Optional)
              </h2>
              <textarea
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
                placeholder="Any special instructions? (e.g., less spicy, no onion, ring the bell twice)"
                className="w-full px-4 py-3 rounded-xl border-2 border-dark-green/20 focus:border-tomato-red focus:outline-none resize-none h-24 text-dark-green"
              />
            </motion.div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-2xl shadow-lg p-6 sticky top-24"
            >
              <h2 className="text-xl font-bold text-dark-green mb-4 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5" />
                Order Summary
              </h2>

              {/* Cart Items */}
              <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                {items.map((item) => (
                  <div
                    key={item.dishId}
                    className="flex items-center justify-between py-2 border-b border-dark-green/10 last:border-0"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-dark-green truncate">
                        {item.name}
                      </p>
                      <p className="text-sm text-dark-green/60">
                        {formatPrice(item.price)} × {item.quantity}
                      </p>
                    </div>
                    <p className="font-bold text-dark-green ml-4">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-3 border-t border-dark-green/10 pt-4">
                <div className="flex justify-between text-dark-green/70">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotalPaise)}</span>
                </div>
                <div className="flex justify-between text-dark-green/70">
                  <span>Tax (5%)</span>
                  <span>{formatPrice(taxPaise)}</span>
                </div>
                <div className="flex justify-between text-dark-green/70">
                  <span>Delivery Fee</span>
                  <span>
                    {deliveryFeePaise === 0
                      ? "FREE"
                      : formatPrice(deliveryFeePaise)}
                  </span>
                </div>
                <div className="flex justify-between text-xl font-bold text-dark-green border-t border-dark-green/10 pt-3">
                  <span>Total</span>
                  <span className="text-tomato-red">
                    {formatPrice(totalPaise)}
                  </span>
                </div>
              </div>

              {/* Place Order Button */}
              <Button
                onClick={handlePlaceOrder}
                disabled={
                  isPlacingOrder ||
                  (deliveryType === "delivery" && !selectedAddressId) ||
                  createdOrderId !== null
                }
                className="w-full mt-6 bg-gradient-to-r from-tomato-red to-saffron-yellow text-white hover:shadow-2xl font-bold py-6 text-lg disabled:opacity-50"
              >
                {isPlacingOrder ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Placing Order...
                  </>
                ) : (
                  <>
                    Place Order
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>

              <p className="text-xs text-dark-green/50 text-center mt-4">
                By placing this order, you agree to our terms and conditions
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
