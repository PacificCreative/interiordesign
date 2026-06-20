"use client";

import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface AvatarProps {
  src?: string;
  alt?: string;
  name?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  fallback?: ReactNode;
  status?: "online" | "away" | "busy" | "offline";
}

const sizeStyles = {
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-12 h-12 text-base",
  xl: "w-16 h-16 text-lg",
};

const statusColors = {
  online: "bg-success",
  away: "bg-warning",
  busy: "bg-error",
  offline: "bg-stone",
};

const statusSizes = {
  sm: "w-2.5 h-2.5 right-0 bottom-0",
  md: "w-3 h-3 right-0 bottom-0",
  lg: "w-3.5 h-3.5 right-0.5 bottom-0.5",
  xl: "w-4 h-4 right-0.5 bottom-0.5",
};

/**
 * Get initials from a name string
 */
function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Generate a deterministic background color from a name
 */
function getColorFromName(name: string): string {
  const colors = [
    "bg-brand-gold/20 text-brand-gold",
    "bg-brand-champagne/20 text-brand-champagne",
    "bg-brand-walnut/20 text-brand-walnut",
    "bg-brand-navy/20 text-brand-navy",
    "bg-info/20 text-info",
    "bg-success/20 text-success",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

export function Avatar({
  src,
  alt = "",
  name,
  size = "md",
  className,
  fallback,
  status,
}: AvatarProps) {
  const initials = name ? getInitials(name) : null;
  const colorClass = name ? getColorFromName(name) : "bg-surface-tertiary text-text-tertiary";

  return (
    <div className="relative inline-flex shrink-0">
      {src ? (
        <img
          src={src}
          alt={alt || name || "Avatar"}
          className={cn(
            "rounded-full object-cover border-2 border-border-light",
            sizeStyles[size],
            className,
          )}
        />
      ) : (
        <div
          className={cn(
            "rounded-full flex items-center justify-center font-heading font-medium border-2 border-border-light",
            sizeStyles[size],
            colorClass,
            className,
          )}
        >
          {fallback || initials || "?"}
        </div>
      )}

      {status && (
        <span
          className={cn(
            "absolute rounded-full border-2 border-surface-primary",
            statusColors[status],
            statusSizes[size],
          )}
        />
      )}
    </div>
  );
}