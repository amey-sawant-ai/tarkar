"use client";

import { forwardRef, memo } from "react";
import { motion, HTMLMotionProps } from "motion/react";
import { cn } from "@/lib/utils";
import { cardVariants, cardHover, cardTap } from "@/lib/animations";

// ============================================================================
// CARD COMPONENT
// ============================================================================

export interface CardProps extends Omit<HTMLMotionProps<"div">, "ref"> {
  variant?: "default" | "elevated" | "outlined" | "gradient";
  padding?: "none" | "sm" | "md" | "lg";
  rounded?: "none" | "sm" | "md" | "lg" | "xl" | "2xl" | "full";
  hoverable?: boolean;
  animated?: boolean;
}

const paddingClasses = {
  none: "",
  sm: "p-3",
  md: "p-6",
  lg: "p-8",
} as const;

const roundedClasses = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  "2xl": "rounded-2xl",
  full: "rounded-full",
} as const;

const variantClasses = {
  default: "bg-white shadow-lg",
  elevated: "bg-white shadow-2xl",
  outlined: "bg-white border border-dark-green/10",
  gradient: "bg-gradient-to-br from-white to-warm-beige/50 shadow-lg",
} as const;

export const Card = memo(
  forwardRef<HTMLDivElement, CardProps>(
    (
      {
        variant = "default",
        padding = "md",
        rounded = "2xl",
        hoverable = false,
        animated = false,
        className,
        children,
        ...props
      },
      ref
    ) => {
      return (
        <motion.div
          ref={ref}
          variants={animated ? cardVariants : undefined}
          initial={animated ? "hidden" : undefined}
          animate={animated ? "visible" : undefined}
          whileHover={hoverable ? cardHover : undefined}
          whileTap={hoverable ? cardTap : undefined}
          className={cn(
            variantClasses[variant],
            paddingClasses[padding],
            roundedClasses[rounded],
            hoverable && "cursor-pointer transition-shadow",
            className
          )}
          {...props}
        >
          {children}
        </motion.div>
      );
    }
  )
);

Card.displayName = "Card";

// ============================================================================
// CARD HEADER
// ============================================================================

export interface CardHeaderProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export const CardHeader = memo(function CardHeader({
  title,
  subtitle,
  icon,
  action,
  className,
}: CardHeaderProps) {
  return (
    <div className={cn("flex items-center justify-between mb-6", className)}>
      <div className="flex items-center gap-3">
        {icon && (
          <div className="w-10 h-10 bg-dark-green/10 rounded-xl flex items-center justify-center text-dark-green">
            {icon}
          </div>
        )}
        <div>
          <h3 className="text-xl font-bold text-dark-green">{title}</h3>
          {subtitle && <p className="text-sm text-dark-green/60">{subtitle}</p>}
        </div>
      </div>
      {action}
    </div>
  );
});

// ============================================================================
// SECTION HEADER
// ============================================================================

export interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  badge?: string;
  centered?: boolean;
  className?: string;
}

export const SectionHeader = memo(function SectionHeader({
  title,
  subtitle,
  badge,
  centered = false,
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn(centered && "text-center", "mb-12", className)}>
      {badge && (
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-block px-4 py-1.5 bg-saffron-yellow/20 text-saffron-yellow rounded-full text-sm font-semibold mb-4"
        >
          {badge}
        </motion.span>
      )}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className="text-4xl md:text-5xl font-serif font-bold text-dark-green mb-4"
      >
        {title}
      </motion.h2>
      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-lg text-dark-green/70 max-w-2xl mx-auto"
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
});

// ============================================================================
// EMPTY STATE
// ============================================================================

export interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState = memo(function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("text-center py-16", className)}
    >
      <div className="w-20 h-20 bg-dark-green/10 rounded-full flex items-center justify-center mx-auto mb-6 text-dark-green/40">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-dark-green mb-2">{title}</h3>
      {description && (
        <p className="text-dark-green/60 mb-6 max-w-sm mx-auto">
          {description}
        </p>
      )}
      {action}
    </motion.div>
  );
});

// ============================================================================
// STAT CARD
// ============================================================================

export interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  change?: string;
  trend?: "up" | "down" | "neutral";
  className?: string;
}

export const StatCard = memo(function StatCard({
  icon,
  label,
  value,
  change,
  trend = "neutral",
  className,
}: StatCardProps) {
  const trendColors = {
    up: "text-green-600",
    down: "text-red-500",
    neutral: "text-dark-green/60",
  };

  return (
    <Card padding="md" className={className} hoverable>
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 bg-dark-green/10 rounded-2xl flex items-center justify-center text-dark-green">
          {icon}
        </div>
        <div>
          <p className="text-sm text-dark-green/60 font-medium">{label}</p>
          <p className="text-2xl font-bold text-dark-green">{value}</p>
          {change && (
            <p className={cn("text-xs font-medium", trendColors[trend])}>
              {change}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
});

// ============================================================================
// BADGE
// ============================================================================

export interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "error" | "info";
  size?: "sm" | "md" | "lg";
  className?: string;
}

const badgeVariants = {
  default: "bg-dark-green/10 text-dark-green",
  success: "bg-green-100 text-green-700",
  warning: "bg-amber-100 text-amber-700",
  error: "bg-red-100 text-red-700",
  info: "bg-blue-100 text-blue-700",
} as const;

const badgeSizes = {
  sm: "px-2 py-0.5 text-xs",
  md: "px-3 py-1 text-sm",
  lg: "px-4 py-1.5 text-base",
} as const;

export const Badge = memo(function Badge({
  children,
  variant = "default",
  size = "md",
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center font-medium rounded-full",
        badgeVariants[variant],
        badgeSizes[size],
        className
      )}
    >
      {children}
    </span>
  );
});

// ============================================================================
// LOADING SKELETON
// ============================================================================

export interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  rounded?: "none" | "sm" | "md" | "lg" | "xl" | "2xl" | "full";
  className?: string;
}

export const Skeleton = memo(function Skeleton({
  width,
  height,
  rounded = "md",
  className,
}: SkeletonProps) {
  return (
    <div
      className={cn(
        "bg-dark-green/10 animate-pulse",
        roundedClasses[rounded],
        className
      )}
      style={{ width, height }}
    />
  );
});

// ============================================================================
// PAGE CONTAINER
// ============================================================================

export interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "7xl" | "full";
}

const maxWidthClasses = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  "7xl": "max-w-7xl",
  full: "max-w-full",
} as const;

export const PageContainer = memo(function PageContainer({
  children,
  className,
  maxWidth = "7xl",
}: PageContainerProps) {
  return (
    <div
      className={cn(
        "container mx-auto px-6 py-8",
        maxWidthClasses[maxWidth],
        className
      )}
    >
      {children}
    </div>
  );
});

// ============================================================================
// DIVIDER
// ============================================================================

export interface DividerProps {
  orientation?: "horizontal" | "vertical";
  className?: string;
}

export const Divider = memo(function Divider({
  orientation = "horizontal",
  className,
}: DividerProps) {
  return (
    <div
      className={cn(
        "bg-dark-green/10",
        orientation === "horizontal" ? "h-px w-full" : "w-px h-full",
        className
      )}
    />
  );
});
