"use client";

import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface CardProps {
  className?: string;
  children: ReactNode;
  variant?: "default" | "elevated" | "bordered" | "interactive";
  padding?: "none" | "sm" | "md" | "lg";
}

const variantStyles = {
  default: "bg-surface-primary border border-border-light",
  elevated:
    "bg-surface-elevated border border-border-light shadow-md hover:shadow-lg",
  bordered: "bg-surface-primary border-2 border-brand-champagne/30",
  interactive:
    "bg-surface-primary border border-border-light shadow-sm hover:shadow-md hover:border-brand-gold/30 cursor-pointer transition-all duration-200",
};

const paddingStyles = {
  none: "",
  sm: "p-3",
  md: "p-5",
  lg: "p-7",
};

export function Card({
  className,
  children,
  variant = "default",
  padding = "md",
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-xl",
        variantStyles[variant],
        paddingStyles[padding],
        className,
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("pb-4 border-b border-border-light mb-4", className)}>
      {children}
    </div>
  );
}

export function CardBody({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return <div className={cn("", className)}>{children}</div>;
}

export function CardFooter({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "pt-4 mt-4 border-t border-border-light flex items-center gap-3",
        className,
      )}
    >
      {children}
    </div>
  );
}