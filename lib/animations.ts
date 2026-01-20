/**
 * Framer Motion animation variants
 * Reusable animation presets for consistent motion throughout the app
 */

import { Variants } from "motion/react";
import { ANIMATION } from "./constants";

// ============================================================================
// FADE ANIMATIONS
// ============================================================================

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: ANIMATION.normal },
  },
  exit: { opacity: 0, transition: { duration: ANIMATION.fast } },
};

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: ANIMATION.normal },
  },
  exit: { opacity: 0, y: -10, transition: { duration: ANIMATION.fast } },
};

export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: ANIMATION.normal },
  },
  exit: { opacity: 0, y: 10, transition: { duration: ANIMATION.fast } },
};

export const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: ANIMATION.normal },
  },
  exit: { opacity: 0, x: 20, transition: { duration: ANIMATION.fast } },
};

export const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: ANIMATION.normal },
  },
  exit: { opacity: 0, x: -20, transition: { duration: ANIMATION.fast } },
};

// ============================================================================
// SCALE ANIMATIONS
// ============================================================================

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: ANIMATION.normal, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    transition: { duration: ANIMATION.fast },
  },
};

export const scaleInBounce: Variants = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20,
    },
  },
  exit: { opacity: 0, scale: 0.8 },
};

// ============================================================================
// SLIDE ANIMATIONS
// ============================================================================

export const slideInFromTop: Variants = {
  hidden: { opacity: 0, y: "-100%" },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: ANIMATION.normal, ease: "easeOut" },
  },
  exit: { opacity: 0, y: "-100%" },
};

export const slideInFromBottom: Variants = {
  hidden: { opacity: 0, y: "100%" },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: ANIMATION.normal, ease: "easeOut" },
  },
  exit: { opacity: 0, y: "100%" },
};

export const slideInFromLeft: Variants = {
  hidden: { opacity: 0, x: "-100%" },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: ANIMATION.normal, ease: "easeOut" },
  },
  exit: { opacity: 0, x: "-100%" },
};

export const slideInFromRight: Variants = {
  hidden: { opacity: 0, x: "100%" },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: ANIMATION.normal, ease: "easeOut" },
  },
  exit: { opacity: 0, x: "100%" },
};

// ============================================================================
// STAGGER ANIMATIONS (for lists)
// ============================================================================

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: ANIMATION.stagger,
      delayChildren: 0.1,
    },
  },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: ANIMATION.normal },
  },
};

export const staggerFadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: ANIMATION.normal },
  },
};

// ============================================================================
// PAGE TRANSITIONS
// ============================================================================

export const pageTransition: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: ANIMATION.page,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: ANIMATION.normal },
  },
};

export const heroTransition: Variants = {
  initial: { opacity: 0, y: 50 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

// ============================================================================
// MODAL & OVERLAY ANIMATIONS
// ============================================================================

export const modalOverlay: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: ANIMATION.fast },
  },
  exit: { opacity: 0, transition: { duration: ANIMATION.fast } },
};

export const modalContent: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: 10 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 25,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 10,
    transition: { duration: ANIMATION.fast },
  },
};

export const drawerContent: Variants = {
  hidden: { x: "100%" },
  visible: {
    x: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
    },
  },
  exit: { x: "100%", transition: { duration: ANIMATION.normal } },
};

// ============================================================================
// CARD ANIMATIONS
// ============================================================================

export const cardHover = {
  scale: 1.02,
  y: -4,
  transition: { duration: ANIMATION.fast },
};

export const cardTap = {
  scale: 0.98,
};

export const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: ANIMATION.slow },
  },
};

// ============================================================================
// BUTTON ANIMATIONS
// ============================================================================

export const buttonHover = {
  scale: 1.05,
  transition: { duration: ANIMATION.fast },
};

export const buttonTap = {
  scale: 0.95,
};

export const pulseAnimation = {
  scale: [1, 1.05, 1],
  transition: {
    duration: 1.5,
    repeat: Infinity,
    ease: "easeInOut",
  },
};

// ============================================================================
// NOTIFICATION & TOAST ANIMATIONS
// ============================================================================

export const toastVariants: Variants = {
  hidden: { opacity: 0, y: 50, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 25,
    },
  },
  exit: {
    opacity: 0,
    y: 20,
    scale: 0.9,
    transition: { duration: ANIMATION.fast },
  },
};

// ============================================================================
// TAB ANIMATIONS
// ============================================================================

export const tabIndicator: Variants = {
  inactive: { scale: 0.95, opacity: 0.7 },
  active: {
    scale: 1,
    opacity: 1,
    transition: { type: "spring", stiffness: 300, damping: 25 },
  },
};

export const tabContent: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: ANIMATION.normal },
  },
  exit: { opacity: 0, x: -20 },
};

// ============================================================================
// LOADING ANIMATIONS
// ============================================================================

export const spinAnimation = {
  rotate: 360,
  transition: {
    duration: 1,
    repeat: Infinity,
    ease: "linear",
  },
};

export const skeletonPulse = {
  opacity: [0.5, 1, 0.5],
  transition: {
    duration: 1.5,
    repeat: Infinity,
    ease: "easeInOut",
  },
};

// ============================================================================
// TIMELINE ANIMATIONS (for order tracking)
// ============================================================================

export const timelineContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

export const timelineItem: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
};

export const timelineLine: Variants = {
  hidden: { scaleY: 0, originY: 0 },
  visible: {
    scaleY: 1,
    transition: { duration: ANIMATION.slow, ease: "easeOut" },
  },
};

// ============================================================================
// VIEWPORT ANIMATIONS (for scroll-triggered animations)
// ============================================================================

export const scrollReveal: Variants = {
  hidden: { opacity: 0, y: 75 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: ANIMATION.page,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

export const scrollRevealLeft: Variants = {
  hidden: { opacity: 0, x: -75 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: ANIMATION.page,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

export const scrollRevealRight: Variants = {
  hidden: { opacity: 0, x: 75 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: ANIMATION.page,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};
