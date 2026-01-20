"use client";

import { motion } from "motion/react";
import {
  Mail,
  Phone,
  Calendar,
  Award,
  Edit,
  Camera,
  Loader2,
  Wallet,
  Lock,
  Shield,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useCallback } from "react";
import DashboardNavbar from "@/components/DashboardNavbar";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/contexts/ToastContext";
import { formatPrice } from "@/lib/utils";

interface UserProfile {
  id: string;
  email: string;
  name: string;
  phone: string;
  avatarUrl: string;
  walletBalancePaise: number;
  preferences: {
    darkMode: boolean;
    language: string;
  };
  notifications: {
    orderUpdates: boolean;
    promotions: boolean;
    newsletter: boolean;
    sms: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

export default function ProfilePage() {
  const { t } = useLanguage();
  const { showToast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [editForm, setEditForm] = useState({
    name: "",
    phone: "",
  });

  // Fetch profile on mount
  const fetchProfile = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        setError("Please login to view your profile");
        setIsLoading(false);
        return;
      }

      const response = await fetch("/api/user/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || "Failed to load profile");
      }

      setProfile(data.data);
      setEditForm({
        name: data.data.name || "",
        phone: data.data.phone || "",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load profile");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // Handle edit toggle
  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel editing - reset form to current profile
      setEditForm({
        name: profile?.name || "",
        phone: profile?.phone || "",
      });
    }
    setIsEditing(!isEditing);
  };

  // Handle form submission
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editForm.name.trim()) {
      showToast(t("profile.nameRequired"), "error");
      return;
    }

    setIsSaving(true);

    try {
      const token = localStorage.getItem("auth_token");
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: editForm.name.trim(),
          phone: editForm.phone.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || "Failed to update profile");
      }

      // Update local profile state
      setProfile((prev) =>
        prev
          ? {
              ...prev,
              name: data.data.name,
              phone: data.data.phone,
            }
          : null,
      );

      setIsEditing(false);
      showToast(t("profile.updateSuccess"), "success");
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : "Failed to update profile",
        "error",
      );
    } finally {
      setIsSaving(false);
    }
  };

  // Get initials for avatar
  const getInitials = (name: string) => {
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  // Format member since date
  const formatMemberSince = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-warm-beige">
        <DashboardNavbar
          title={t("page.profile.title")}
          subtitle={t("page.profile.subtitle")}
        />
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-dark-green" />
        </div>
      </div>
    );
  }

  // Error state
  if (error || !profile) {
    return (
      <div className="min-h-screen bg-warm-beige">
        <DashboardNavbar
          title={t("page.profile.title")}
          subtitle={t("page.profile.subtitle")}
        />
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-dark-green/70 mb-4">
            {error || "Profile not found"}
          </p>
          <Button onClick={fetchProfile} className="bg-dark-green text-white">
            {t("action.tryAgain")}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warm-beige">
      <DashboardNavbar
        title={t("page.profile.title")}
        subtitle={t("page.profile.subtitle")}
      />

      <div className="container mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto space-y-6"
        >
          {/* Profile Header Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-8"
          >
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="relative">
                {profile.avatarUrl ? (
                  <img
                    src={profile.avatarUrl}
                    alt={profile.name}
                    className="w-32 h-32 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-32 h-32 bg-gradient-to-r from-tomato-red to-saffron-yellow rounded-full flex items-center justify-center text-white text-4xl font-bold">
                    {getInitials(profile.name || profile.email)}
                  </div>
                )}
                <button className="absolute bottom-0 right-0 w-10 h-10 bg-dark-green text-white rounded-full flex items-center justify-center shadow-lg hover:bg-dark-green/90 transition-all">
                  <Camera className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h2 className="text-3xl font-bold text-dark-green mb-2">
                  {profile.name || t("profile.noName")}
                </h2>
                <p className="text-dark-green/70 mb-3">{profile.email}</p>
                <div className="flex items-center justify-center sm:justify-start gap-4 text-dark-green/70">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">
                      {t("profile.memberSince")}{" "}
                      {formatMemberSince(profile.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
              <Button
                onClick={handleEditToggle}
                disabled={isSaving}
                className="bg-gradient-to-r from-tomato-red to-saffron-yellow text-white hover:shadow-xl"
              >
                <Edit className="w-4 h-4 mr-2" />
                {isEditing ? t("action.cancel") : t("profile.editProfile")}
              </Button>
            </div>
          </motion.div>

          {/* Wallet Balance Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-r from-dark-green to-dark-green/95 rounded-2xl shadow-lg p-6 text-white"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-warm-beige/70 mb-2">
                  {t("profile.walletBalance")}
                </h3>
                <p className="text-4xl font-bold">
                  {formatPrice(profile.walletBalancePaise)}
                </p>
                <p className="text-warm-beige/70 text-sm mt-2">
                  {t("profile.walletDescription")}
                </p>
              </div>
              <Wallet className="w-16 h-16 text-saffron-yellow" />
            </div>
          </motion.div>

          {/* Profile Details Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <h3 className="text-xl font-bold text-dark-green mb-6">
              {t("profile.personalInfo")}
            </h3>
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-dark-green mb-2">
                  {t("profile.fullName")}
                </label>
                <input
                  type="text"
                  value={isEditing ? editForm.name : profile.name || ""}
                  disabled={!isEditing}
                  onChange={(e) =>
                    setEditForm({ ...editForm, name: e.target.value })
                  }
                  placeholder={t("profile.enterName")}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${
                    isEditing
                      ? "border-dark-green/20 focus:border-tomato-red focus:outline-none"
                      : "border-transparent bg-warm-beige/30 cursor-not-allowed"
                  }`}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-dark-green mb-2">
                  <Mail className="w-4 h-4 inline mr-2" />
                  {t("form.email")}
                </label>
                <input
                  type="email"
                  value={profile.email}
                  disabled
                  className="w-full px-4 py-3 rounded-xl border-2 border-transparent bg-warm-beige/30 cursor-not-allowed text-dark-green/70"
                />
                <p className="text-xs text-dark-green/50 mt-1">
                  {t("profile.emailCannotChange")}
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-dark-green mb-2">
                  <Phone className="w-4 h-4 inline mr-2" />
                  {t("form.phone")}
                </label>
                <input
                  type="tel"
                  value={isEditing ? editForm.phone : profile.phone || ""}
                  disabled={!isEditing}
                  onChange={(e) =>
                    setEditForm({ ...editForm, phone: e.target.value })
                  }
                  placeholder={t("profile.enterPhone")}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${
                    isEditing
                      ? "border-dark-green/20 focus:border-tomato-red focus:outline-none"
                      : "border-transparent bg-warm-beige/30 cursor-not-allowed"
                  }`}
                />
              </div>

              {isEditing && (
                <div className="flex gap-3 pt-4">
                  <Button
                    type="submit"
                    disabled={isSaving}
                    className="flex-1 bg-gradient-to-r from-tomato-red to-saffron-yellow text-white hover:shadow-xl"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        {t("action.saving")}
                      </>
                    ) : (
                      t("profile.saveChanges")
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleEditToggle}
                    disabled={isSaving}
                    className="border-dark-green text-dark-green hover:bg-dark-green hover:text-white"
                  >
                    {t("action.cancel")}
                  </Button>
                </div>
              )}
            </form>
          </motion.div>

          {/* Security Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <h3 className="text-xl font-bold text-dark-green mb-4">
              {t("profile.security")}
            </h3>
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start border-dark-green/20 text-dark-green hover:bg-dark-green/5"
                onClick={() =>
                  showToast(t("profile.featureComingSoon"), "info")
                }
              >
                <Lock className="w-4 h-4 mr-3" />
                {t("profile.changePassword")}
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start border-dark-green/20 text-dark-green hover:bg-dark-green/5"
                onClick={() =>
                  showToast(t("profile.featureComingSoon"), "info")
                }
              >
                <Shield className="w-4 h-4 mr-3" />
                {t("profile.twoFactorAuth")}
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start border-red-500/20 text-red-600 hover:bg-red-50"
                onClick={() =>
                  showToast(t("profile.deleteAccountWarning"), "warning")
                }
              >
                <Trash2 className="w-4 h-4 mr-3" />
                {t("profile.deleteAccount")}
              </Button>
            </div>
          </motion.div>

          {/* Account Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-center text-dark-green/50 text-sm"
          >
            <p>
              {t("profile.accountCreated")}:{" "}
              {new Date(profile.createdAt).toLocaleDateString()}
            </p>
            <p>
              {t("profile.lastUpdated")}:{" "}
              {new Date(profile.updatedAt).toLocaleDateString()}
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
