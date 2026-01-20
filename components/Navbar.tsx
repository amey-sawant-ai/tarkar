"use client";

import { useState, useCallback, memo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Menu,
  X,
  User,
  LogOut,
  Settings,
  ShoppingBag,
  Heart,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

import { Button } from "@/components/ui/button";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { NAV_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { fadeInDown, staggerContainer, staggerItem } from "@/lib/animations";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";

// ============================================================================
// STYLES
// ============================================================================

const NAV_LINK_STYLES = {
  desktop: cn(
    "text-sm font-medium text-dark-green hover:text-tomato-red",
    "transition-all duration-300 hover:scale-110",
    "relative after:absolute after:bottom-0 after:left-0",
    "after:h-0.5 after:w-0 after:bg-tomato-red",
    "after:transition-all after:duration-300 hover:after:w-full",
  ),
  mobile: cn(
    "block text-base font-semibold text-dark-green",
    "hover:text-white hover:bg-gradient-to-r hover:from-tomato-red hover:to-saffron-yellow",
    "transition-all py-3 px-4 rounded-xl",
  ),
} as const;

// ============================================================================
// SUBCOMPONENTS
// ============================================================================

interface NavLinkProps {
  href: string;
  label: string;
  onClick?: () => void;
  isMobile?: boolean;
}

const NavLink = memo(function NavLink({
  href,
  label,
  onClick,
  isMobile = false,
}: NavLinkProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={isMobile ? NAV_LINK_STYLES.mobile : NAV_LINK_STYLES.desktop}
    >
      {label}
    </Link>
  );
});

const Logo = memo(function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <Image
        src="/logo.svg"
        alt="Tarkari Logo"
        width={100}
        height={100}
        priority
      />
    </Link>
  );
});

interface AuthButtonsProps {
  isMobile?: boolean;
  onNavigate?: () => void;
}

const AuthButtons = memo(function AuthButtons({
  isMobile = false,
  onNavigate,
}: AuthButtonsProps) {
  const { user, isAuthenticated, logout, isLoading } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center gap-3">
        {!isMobile && <LanguageSwitcher />}
        {!isMobile && (
          <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
        )}
      </div>
    );
  }

  if (isAuthenticated && user) {
    // Mobile authenticated menu
    if (isMobile) {
      return (
        <div className="pt-4 mt-4 border-t-2 border-dark-green/10 space-y-3">
          <div className="mb-4">
            <LanguageSwitcher />
          </div>

          {/* User Info */}
          <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-dark-green to-dark-green/80 rounded-xl text-white mb-4">
            <div className="w-12 h-12 bg-saffron-yellow rounded-full flex items-center justify-center">
              <User className="h-6 w-6 text-dark-green" />
            </div>
            <div>
              <p className="font-semibold">{user.name || "User"}</p>
              <p className="text-sm opacity-90">{user.email}</p>
            </div>
          </div>

          {/* User Menu Items */}
          {[
            { href: "/dashboard", label: "Dashboard", icon: User },
            {
              href: "/dashboard/my-orders",
              label: "My Orders",
              icon: ShoppingBag,
            },
            { href: "/dashboard/favorites", label: "Favorites", icon: Heart },
            { href: "/dashboard/settings", label: "Settings", icon: Settings },
          ].map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} onClick={onNavigate} className="block">
              <Button variant="ghost" className={NAV_LINK_STYLES.mobile}>
                <Icon className="h-4 w-4 mr-2" />
                {label}
              </Button>
            </Link>
          ))}

          {/* Logout */}
          <Button
            onClick={() => {
              logout();
              onNavigate?.();
            }}
            variant="ghost"
            className="w-full text-left justify-start text-red-600 hover:text-white hover:bg-red-600 py-3 px-4 rounded-xl"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      );
    }

    // Desktop authenticated menu
    return (
      <>
        <LanguageSwitcher />
        <div className="relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 text-dark-green hover:text-tomato-red"
          >
            <div className="w-8 h-8 bg-saffron-yellow rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-dark-green" />
            </div>
            <span className="hidden lg:inline">{user.name || user.email}</span>
          </Button>

          {/* Desktop User Dropdown */}
          <AnimatePresence>
            {showUserMenu && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50"
                onMouseLeave={() => setShowUserMenu(false)}
              >
                {/* User Info */}
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="font-medium text-gray-900">
                    {user.name || "User"}
                  </p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                  {user.walletBalancePaise !== undefined && (
                    <p className="text-xs text-primary font-medium mt-1">
                      Wallet: ₹{(user.walletBalancePaise / 100).toFixed(2)}
                    </p>
                  )}
                </div>

                {/* Menu Items */}
                <div className="py-2">
                  {[
                    { href: "/dashboard", label: "Dashboard", icon: User },
                    {
                      href: "/dashboard/my-orders",
                      label: "My Orders",
                      icon: ShoppingBag,
                    },
                    {
                      href: "/dashboard/favorites",
                      label: "Favorites",
                      icon: Heart,
                    },
                    {
                      href: "/dashboard/settings",
                      label: "Settings",
                      icon: Settings,
                    },
                  ].map(({ href, label, icon: Icon }) => (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <Icon className="h-4 w-4" />
                      {label}
                    </Link>
                  ))}
                </div>

                {/* Logout */}
                <div className="border-t border-gray-100 pt-2">
                  <button
                    onClick={() => {
                      logout();
                      setShowUserMenu(false);
                    }}
                    className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </>
    );
  }

  // Unauthenticated state
  if (isMobile) {
    return (
      <div className="pt-4 mt-4 border-t-2 border-dark-green/10 space-y-3">
        <div className="mb-4">
          <LanguageSwitcher />
        </div>
        <Link href="/login" onClick={onNavigate} className="block">
          <Button
            variant="ghost"
            className="w-full text-tomato-red hover:text-white hover:bg-tomato-red font-semibold py-6 text-base rounded-xl"
          >
            Login
          </Button>
        </Link>
        <Link href="/signup" onClick={onNavigate} className="block">
          <Button className="w-full bg-gradient-to-r from-tomato-red to-saffron-yellow text-white hover:shadow-xl font-semibold py-6 text-base rounded-xl">
            Sign Up
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      <LanguageSwitcher />
      <Link href="/login">
        <Button
          variant="ghost"
          className="hidden sm:inline-flex text-tomato-red hover:text-tomato-red hover:bg-tomato-red/10"
        >
          Login
        </Button>
      </Link>
      <Link href="/signup">
        <Button
          variant="outline"
          className="hidden sm:inline-flex border-tomato-red text-tomato-red hover:bg-tomato-red hover:text-white rounded-full"
        >
          Sign Up
        </Button>
      </Link>
    </>
  );
});

interface MobileMenuButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

const MobileMenuButton = memo(function MobileMenuButton({
  isOpen,
  onClick,
}: MobileMenuButtonProps) {
  return (
    <Button
      size="icon"
      variant="ghost"
      className="md:hidden text-dark-green hover:text-tomato-red"
      onClick={onClick}
      aria-label={isOpen ? "Close menu" : "Open menu"}
      aria-expanded={isOpen}
    >
      {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
    </Button>
  );
});

// ============================================================================
// MAIN COMPONENT
// ============================================================================

function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useLanguage();

  const closeMobileMenu = useCallback(() => {
    setMobileMenuOpen(false);
  }, []);

  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen((prev) => !prev);
  }, []);

  return (
    <header className="flex flex-col justify-center items-center sticky top-0 z-50 w-full border-b border-warm-beige/20 bg-warm-beige/95 backdrop-blur supports-[backdrop-filter]:bg-warm-beige/80">
      <nav className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <Logo />

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.href}
              href={link.href}
              label={t(link.translationKey)}
            />
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="flex items-center gap-3">
          <AuthButtons />
          <MobileMenuButton
            isOpen={mobileMenuOpen}
            onClick={toggleMobileMenu}
          />
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            variants={fadeInDown}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="md:hidden absolute top-16 left-0 right-0 bg-warm-beige/98 backdrop-blur-lg border-t border-dark-green/10 shadow-2xl"
          >
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="container mx-auto px-6 py-6 space-y-2"
            >
              {NAV_LINKS.map((link) => (
                <motion.div key={link.href} variants={staggerItem}>
                  <NavLink
                    href={link.href}
                    label={t(link.translationKey)}
                    onClick={closeMobileMenu}
                    isMobile
                  />
                </motion.div>
              ))}
              <AuthButtons isMobile onNavigate={closeMobileMenu} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom border line */}
      <div className="container mx-auto px-4 md:px-6">
        <div className="w-full h-px bg-dark-green/10" />
      </div>
    </header>
  );
}

export default memo(Navbar);
