"use client";

import { type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export interface DashboardLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
  className?: string;
}

export function DashboardLayout({
  children,
  title,
  subtitle,
  actions,
  className,
}: DashboardLayoutProps) {
  return (
    <div className={cn("max-w-7xl mx-auto", className)}>
      {/* Page Header */}
      {(title || actions) && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            {title && (
              <motion.h1
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="text-3xl font-heading text-text-primary"
              >
                {title}
              </motion.h1>
            )}
            {subtitle && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="mt-1 text-text-tertiary"
              >
                {subtitle}
              </motion.p>
            )}
          </div>
          {actions && (
            <motion.div
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-3 flex-shrink-0"
            >
              {actions}
            </motion.div>
          )}
        </div>
      )}
      {/* Page Content */}
      {children}
    </div>
  );
}

export interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  className?: string;
  illustration?: boolean;
}

export function AuthLayout({
  children,
  title,
  subtitle,
  className,
  illustration = true,
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex bg-surface-primary">
      {/* Brand Side */}
      {illustration && (
        <div className="hidden lg:flex lg:w-1/2 bg-surface-secondary items-center justify-center p-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-gold/5 to-brand-navy/5" />
          <div className="relative z-10 max-w-md text-center">
            <div className="w-20 h-20 rounded-2xl bg-brand-navy flex items-center justify-center mx-auto mb-8 shadow-xl">
              <span className="text-3xl font-heading font-bold text-brand-champagne">
                S
              </span>
            </div>
            <h2 className="text-4xl font-heading font-semibold text-text-primary mb-4">
              Welcome to Spatial
            </h2>
            <p className="text-lg text-text-tertiary leading-relaxed">
              The all-in-one workspace for interior designers. Manage projects,
              source products, create mood boards, and connect with clients — all
              in one elegant platform.
            </p>

            {/* Decorative pattern */}
            <div className="mt-16 grid grid-cols-5 gap-3 max-w-xs mx-auto opacity-30">
              {["#F5F0EB", "#E8DDD3", "#8B6914", "#5C4033", "#C9A96E", "#1A1A2E"].map(
                (color, i) => (
                  <div
                    key={i}
                    className="w-full aspect-square rounded-lg"
                    style={{ backgroundColor: color }}
                  />
                ),
              )}
            </div>
          </div>
        </div>
      )}

      {/* Auth Form Side */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className={cn(
            "w-full max-w-md",
            !illustration && "lg:max-w-lg",
            className,
          )}
        >
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-brand-navy flex items-center justify-center">
              <span className="text-brand-champagne font-heading text-lg font-bold">
                S
              </span>
            </div>
            <span className="font-heading text-xl font-semibold text-text-primary">
              Spatial
            </span>
          </div>

          <h1 className="text-3xl font-heading font-semibold text-text-primary mb-2">
            {title}
          </h1>
          {subtitle && (
            <p className="text-text-tertiary mb-8">{subtitle}</p>
          )}
          {children}
        </motion.div>
      </div>
    </div>
  );
}