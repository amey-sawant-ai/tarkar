"use client";

import { useEffect, useState } from "react";
import {
  Save,
  Loader2,
  Store,
  Clock,
  Truck,
  CreditCard,
  Bell,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface Settings {
  restaurant: {
    name: string;
    tagline: string;
    email: string;
    phone: string;
    address: string;
    logo: string;
  };
  operations: {
    openTime: string;
    closeTime: string;
    minOrderAmount: number;
    maxOrdersPerSlot: number;
    preparationBuffer: number;
    isAcceptingOrders: boolean;
  };
  delivery: {
    isEnabled: boolean;
    baseFee: number;
    freeDeliveryThreshold: number;
    maxDistance: number;
    estimatedTime: string;
  };
  payment: {
    cashOnDelivery: boolean;
    upiEnabled: boolean;
    cardsEnabled: boolean;
    walletEnabled: boolean;
  };
  notifications: {
    emailNewOrder: boolean;
    smsNewOrder: boolean;
    emailLowStock: boolean;
  };
}

const defaultSettings: Settings = {
  restaurant: {
    name: "Tarkari",
    tagline: "Authentic Indian Cuisine",
    email: "contact@tarkari.com",
    phone: "+91 9876543210",
    address: "123 Main Street, Mumbai, India",
    logo: "",
  },
  operations: {
    openTime: "10:00",
    closeTime: "22:00",
    minOrderAmount: 200,
    maxOrdersPerSlot: 10,
    preparationBuffer: 30,
    isAcceptingOrders: true,
  },
  delivery: {
    isEnabled: true,
    baseFee: 40,
    freeDeliveryThreshold: 500,
    maxDistance: 10,
    estimatedTime: "30-45 mins",
  },
  payment: {
    cashOnDelivery: true,
    upiEnabled: true,
    cardsEnabled: true,
    walletEnabled: true,
  },
  notifications: {
    emailNewOrder: true,
    smsNewOrder: false,
    emailLowStock: true,
  },
};

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    try {
      const token = localStorage.getItem("auth_token");
      const res = await fetch("/api/admin/settings", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (data.success && data.data) {
        setSettings({ ...defaultSettings, ...data.data });
      }
    } catch (error) {
      console.error("Failed to fetch settings:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    setSaved(false);

    try {
      const token = localStorage.getItem("auth_token");
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(settings),
      });

      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (error) {
      console.error("Failed to save settings:", error);
    } finally {
      setSaving(false);
    }
  }

  const updateSetting = <K extends keyof Settings>(
    section: K,
    key: keyof Settings[K],
    value: Settings[K][keyof Settings[K]],
  ) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-dark-green"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-500">Manage restaurant configuration</p>
        </div>
        <Button
          onClick={handleSave}
          disabled={saving}
          className="bg-dark-green hover:bg-dark-green/90 gap-2"
        >
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : saved ? (
            <>
              <Save className="h-4 w-4" />
              Saved!
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </div>

      {/* Restaurant Info */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center gap-2 mb-4">
          <Store className="h-5 w-5 text-dark-green" />
          <h2 className="text-lg font-semibold">Restaurant Information</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Restaurant Name
            </label>
            <input
              type="text"
              value={settings.restaurant.name}
              onChange={(e) =>
                updateSetting("restaurant", "name", e.target.value)
              }
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-dark-green/20"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tagline
            </label>
            <input
              type="text"
              value={settings.restaurant.tagline}
              onChange={(e) =>
                updateSetting("restaurant", "tagline", e.target.value)
              }
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-dark-green/20"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Mail className="h-4 w-4 inline mr-1" />
              Email
            </label>
            <input
              type="email"
              value={settings.restaurant.email}
              onChange={(e) =>
                updateSetting("restaurant", "email", e.target.value)
              }
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-dark-green/20"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Phone className="h-4 w-4 inline mr-1" />
              Phone
            </label>
            <input
              type="tel"
              value={settings.restaurant.phone}
              onChange={(e) =>
                updateSetting("restaurant", "phone", e.target.value)
              }
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-dark-green/20"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <MapPin className="h-4 w-4 inline mr-1" />
              Address
            </label>
            <input
              type="text"
              value={settings.restaurant.address}
              onChange={(e) =>
                updateSetting("restaurant", "address", e.target.value)
              }
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-dark-green/20"
            />
          </div>
        </div>
      </div>

      {/* Operations */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="h-5 w-5 text-dark-green" />
          <h2 className="text-lg font-semibold">Operations</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Opening Time
            </label>
            <input
              type="time"
              value={settings.operations.openTime}
              onChange={(e) =>
                updateSetting("operations", "openTime", e.target.value)
              }
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-dark-green/20"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Closing Time
            </label>
            <input
              type="time"
              value={settings.operations.closeTime}
              onChange={(e) =>
                updateSetting("operations", "closeTime", e.target.value)
              }
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-dark-green/20"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Min Order Amount (₹)
            </label>
            <input
              type="number"
              value={settings.operations.minOrderAmount}
              onChange={(e) =>
                updateSetting(
                  "operations",
                  "minOrderAmount",
                  parseInt(e.target.value) || 0,
                )
              }
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-dark-green/20"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Max Orders/Slot
            </label>
            <input
              type="number"
              value={settings.operations.maxOrdersPerSlot}
              onChange={(e) =>
                updateSetting(
                  "operations",
                  "maxOrdersPerSlot",
                  parseInt(e.target.value) || 0,
                )
              }
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-dark-green/20"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Prep Buffer (mins)
            </label>
            <input
              type="number"
              value={settings.operations.preparationBuffer}
              onChange={(e) =>
                updateSetting(
                  "operations",
                  "preparationBuffer",
                  parseInt(e.target.value) || 0,
                )
              }
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-dark-green/20"
            />
          </div>
          <div className="flex items-center">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.operations.isAcceptingOrders}
                onChange={(e) =>
                  updateSetting(
                    "operations",
                    "isAcceptingOrders",
                    e.target.checked,
                  )
                }
                className="w-5 h-5 text-dark-green rounded focus:ring-dark-green"
              />
              <span className="font-medium">Accepting Orders</span>
            </label>
          </div>
        </div>
      </div>

      {/* Delivery */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center gap-2 mb-4">
          <Truck className="h-5 w-5 text-dark-green" />
          <h2 className="text-lg font-semibold">Delivery Settings</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="flex items-center">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.delivery.isEnabled}
                onChange={(e) =>
                  updateSetting("delivery", "isEnabled", e.target.checked)
                }
                className="w-5 h-5 text-dark-green rounded focus:ring-dark-green"
              />
              <span className="font-medium">Enable Delivery</span>
            </label>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Base Delivery Fee (₹)
            </label>
            <input
              type="number"
              value={settings.delivery.baseFee}
              onChange={(e) =>
                updateSetting(
                  "delivery",
                  "baseFee",
                  parseInt(e.target.value) || 0,
                )
              }
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-dark-green/20"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Free Delivery Above (₹)
            </label>
            <input
              type="number"
              value={settings.delivery.freeDeliveryThreshold}
              onChange={(e) =>
                updateSetting(
                  "delivery",
                  "freeDeliveryThreshold",
                  parseInt(e.target.value) || 0,
                )
              }
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-dark-green/20"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Max Distance (km)
            </label>
            <input
              type="number"
              value={settings.delivery.maxDistance}
              onChange={(e) =>
                updateSetting(
                  "delivery",
                  "maxDistance",
                  parseInt(e.target.value) || 0,
                )
              }
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-dark-green/20"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Estimated Time
            </label>
            <input
              type="text"
              value={settings.delivery.estimatedTime}
              onChange={(e) =>
                updateSetting("delivery", "estimatedTime", e.target.value)
              }
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-dark-green/20"
              placeholder="e.g., 30-45 mins"
            />
          </div>
        </div>
      </div>

      {/* Payment */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center gap-2 mb-4">
          <CreditCard className="h-5 w-5 text-dark-green" />
          <h2 className="text-lg font-semibold">Payment Methods</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <label className="flex items-center gap-3 cursor-pointer p-3 border rounded-lg hover:bg-gray-50">
            <input
              type="checkbox"
              checked={settings.payment.cashOnDelivery}
              onChange={(e) =>
                updateSetting("payment", "cashOnDelivery", e.target.checked)
              }
              className="w-5 h-5 text-dark-green rounded focus:ring-dark-green"
            />
            <span>Cash on Delivery</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer p-3 border rounded-lg hover:bg-gray-50">
            <input
              type="checkbox"
              checked={settings.payment.upiEnabled}
              onChange={(e) =>
                updateSetting("payment", "upiEnabled", e.target.checked)
              }
              className="w-5 h-5 text-dark-green rounded focus:ring-dark-green"
            />
            <span>UPI</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer p-3 border rounded-lg hover:bg-gray-50">
            <input
              type="checkbox"
              checked={settings.payment.cardsEnabled}
              onChange={(e) =>
                updateSetting("payment", "cardsEnabled", e.target.checked)
              }
              className="w-5 h-5 text-dark-green rounded focus:ring-dark-green"
            />
            <span>Cards</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer p-3 border rounded-lg hover:bg-gray-50">
            <input
              type="checkbox"
              checked={settings.payment.walletEnabled}
              onChange={(e) =>
                updateSetting("payment", "walletEnabled", e.target.checked)
              }
              className="w-5 h-5 text-dark-green rounded focus:ring-dark-green"
            />
            <span>Wallet</span>
          </label>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center gap-2 mb-4">
          <Bell className="h-5 w-5 text-dark-green" />
          <h2 className="text-lg font-semibold">Notifications</h2>
        </div>
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.notifications.emailNewOrder}
              onChange={(e) =>
                updateSetting(
                  "notifications",
                  "emailNewOrder",
                  e.target.checked,
                )
              }
              className="w-5 h-5 text-dark-green rounded focus:ring-dark-green"
            />
            <span>Email notification for new orders</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.notifications.smsNewOrder}
              onChange={(e) =>
                updateSetting("notifications", "smsNewOrder", e.target.checked)
              }
              className="w-5 h-5 text-dark-green rounded focus:ring-dark-green"
            />
            <span>SMS notification for new orders</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.notifications.emailLowStock}
              onChange={(e) =>
                updateSetting(
                  "notifications",
                  "emailLowStock",
                  e.target.checked,
                )
              }
              className="w-5 h-5 text-dark-green rounded focus:ring-dark-green"
            />
            <span>Email notification for low stock items</span>
          </label>
        </div>
      </div>
    </div>
  );
}
