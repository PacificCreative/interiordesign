"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  showPercentage?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "success" | "warning" | "error";
  className?: string;
  animated?: boolean;
}

const sizeStyles = {
  sm: "h-1.5",
  md: "h-2.5",
  lg: "h-4",
};

const variantColors = {
  default: "bg-brand-gold",
  success: "bg-success",
  warning: "bg-warning",
  error: "bg-error",
};

export function ProgressBar({
  value,
  max = 100,
  label,
  showPercentage = false,
  size = "md",
  variant = "default",
  className,
  animated = true,
}: ProgressBarProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className={cn("w-full", className)}>
      {(label || showPercentage) && (
        <div className="flex items-center justify-between mb-1.5">
          {label && (
            <span className="text-sm font-medium text-text-secondary">
              {label}
            </span>
          )}
          {showPercentage && (
            <span className="text-sm font-medium text-text-tertiary">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}
      <div
        className={cn(
          "w-full rounded-full bg-surface-tertiary overflow-hidden",
          sizeStyles[size],
        )}
      >
        {animated ? (
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={cn(
              "h-full rounded-full",
              variantColors[variant],
              size === "lg" && "rounded-full",
            )}
          />
        ) : (
          <div
            className={cn(
              "h-full rounded-full transition-all duration-500",
              variantColors[variant],
            )}
            style={{ width: `${percentage}%` }}
          />
        )}
      </div>
    </div>
  );
}