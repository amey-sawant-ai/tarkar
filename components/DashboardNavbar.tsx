"use client";

import { memo } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ArrowLeft, Home } from "lucide-react";
import { motion } from "motion/react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

// ============================================================================
// TYPES
// ============================================================================

interface DashboardNavbarProps {
  /** Page title displayed in the header */
  title?: string;
  /** Subtitle or description */
  subtitle?: string;
  /** Optional className for custom styling */
  className?: string;
}

// ============================================================================
// COMPONENT
// ============================================================================

function DashboardNavbar({
  title = "Tarkari",
  subtitle = "Dashboard",
  className,
}: DashboardNavbarProps) {
  const { t } = useLanguage();
  const pathname = usePathname();
  const isMainDashboard = pathname === "/dashboard";

  return (
    <header
      className={cn(
        "bg-gradient-to-r from-dark-green to-dark-green/95",
        "text-white sticky top-0 z-40 shadow-lg",
        className
      )}
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <Link href="/" className="flex items-center gap-3 group">
            <motion.div
              whileHover={{ rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Image
                src="/logo.svg"
                alt="Tarkari Logo"
                width={80}
                height={80}
                className="brightness-0 invert"
                priority
              />
            </motion.div>
            <div>
              <h1 className="text-2xl font-serif font-bold group-hover:text-saffron-yellow transition-colors">
                {title}
              </h1>
              <p className="text-warm-beige/70 text-sm">{subtitle}</p>
            </div>
          </Link>

          {/* Navigation Buttons */}
          <nav className="flex items-center gap-4">
            {!isMainDashboard && (
              <Link href="/dashboard">
                <Button
                  variant="ghost"
                  className="text-white hover:text-saffron-yellow hover:bg-white/10 transition-all"
                >
                  <ArrowLeft className="size-4 mr-2" />
                  <span className="hidden sm:inline">
                    {t("dashboardNav.backToDashboard")}
                  </span>
                  <span className="sm:hidden">{t("dashboardNav.back")}</span>
                </Button>
              </Link>
            )}
            <Link href="/">
              <Button
                variant="ghost"
                className="text-white hover:text-saffron-yellow hover:bg-white/10 transition-all"
              >
                <Home className="size-4 mr-2 sm:mr-0 md:mr-2" />
                <span className="hidden md:inline">
                  {t("dashboardNav.homePage")}
                </span>
              </Button>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}

export default memo(DashboardNavbar);
