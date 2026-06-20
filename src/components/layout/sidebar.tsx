"use client";

import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  LayoutDashboard,
  ClipboardList,
  Palette,
  ShoppingBag,
  MessageSquare,
  Settings,
  ChevronLeft,
} from "lucide-react";

export interface NavItem {
  id: string;
  label: string;
  icon?: ReactNode;
  href?: string;
  badge?: number;
  children?: NavItem[];
}

export interface SidebarProps {
  items: NavItem[];
  activeItem?: string;
  onNavigate?: (itemId: string) => void;
  className?: string;
  collapsed?: boolean;
  onToggle?: () => void;
}

export function Sidebar({
  items,
  activeItem,
  onNavigate,
  className,
  collapsed = false,
  onToggle,
}: SidebarProps) {
  return (
    <aside
      className={cn(
        "flex flex-col h-full bg-surface-secondary border-r border-border-light transition-all duration-300",
        collapsed ? "w-16" : "w-64",
        className,
      )}
    >
      {/* Sidebar Header */}
      <div className="flex items-center h-16 px-4 border-b border-border-light">
        {!collapsed && (
          <div className="flex items-center gap-2.5 flex-1">
            <div className="w-8 h-8 rounded-lg bg-brand-navy flex items-center justify-center">
              <span className="text-brand-champagne font-heading text-sm font-bold">
                S
              </span>
            </div>
            <span className="font-heading text-lg font-semibold text-text-primary">
              Spatial
            </span>
          </div>
        )}
        {collapsed && (
          <div className="w-full flex justify-center">
            <div className="w-8 h-8 rounded-lg bg-brand-navy flex items-center justify-center">
              <span className="text-brand-champagne font-heading text-sm font-bold">
                S
              </span>
            </div>
          </div>
        )}
        <button
          onClick={onToggle}
          className="p-1.5 rounded-lg text-text-tertiary hover:text-text-primary hover:bg-surface-tertiary transition-colors"
        >
          <ChevronLeft
            size={16}
            className={cn("transition-transform", collapsed && "rotate-180")}
          />
        </button>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto scrollbar-thin">
        {items.map((item) => (
          <SidebarItem
            key={item.id}
            item={item}
            active={activeItem === item.id}
            collapsed={collapsed}
            onClick={() => onNavigate?.(item.id)}
          />
        ))}
      </nav>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-border-light">
        {!collapsed ? (
          <button
            onClick={() => onNavigate?.("settings")}
            className="flex items-center gap-3 w-full p-2 rounded-lg text-text-tertiary hover:text-text-primary hover:bg-surface-tertiary transition-colors"
          >
            <Settings size={18} />
            <span className="text-sm font-medium">Settings</span>
          </button>
        ) : (
          <button
            onClick={() => onNavigate?.("settings")}
            className="flex justify-center w-full p-2 rounded-lg text-text-tertiary hover:text-text-primary hover:bg-surface-tertiary transition-colors"
          >
            <Settings size={18} />
          </button>
        )}
      </div>
    </aside>
  );
}

function SidebarItem({
  item,
  active,
  collapsed,
  onClick,
}: {
  item: NavItem;
  active: boolean;
  collapsed: boolean;
  onClick: () => void;
}) {
  return (
    <div>
      <button
        onClick={onClick}
        className={cn(
          "flex items-center gap-3 w-full p-2.5 rounded-lg transition-all duration-200 group",
          active
            ? "bg-brand-gold/15 text-brand-gold font-medium"
            : "text-text-tertiary hover:text-text-primary hover:bg-surface-tertiary",
          collapsed && "justify-center",
        )}
      >
        <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
          {item.icon || <LayoutDashboard size={18} />}
        </span>
        {!collapsed && (
          <>
            <span className="text-sm flex-1 text-left">{item.label}</span>
            {item.badge !== undefined && (
              <span className="px-1.5 py-0.5 text-xs rounded-full bg-brand-gold/20 text-brand-gold">
                {item.badge}
              </span>
            )}
          </>
        )}
      </button>
    </div>
  );
}

export interface AppShellProps {
  sidebarItems: NavItem[];
  activeItem?: string;
  onNavigate?: (itemId: string) => void;
  children: ReactNode;
  className?: string;
  headerContent?: ReactNode;
}

export function AppShell({
  sidebarItems,
  activeItem,
  onNavigate,
  children,
  className,
  headerContent,
}: AppShellProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen bg-surface-primary overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex">
        <Sidebar
          items={sidebarItems}
          activeItem={activeItem}
          onNavigate={onNavigate}
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-surface-overlay z-40 md:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 bottom-0 z-50 md:hidden"
            >
              <Sidebar
                items={sidebarItems}
                activeItem={activeItem}
                onNavigate={(id) => {
                  onNavigate?.(id);
                  setMobileMenuOpen(false);
                }}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="flex items-center h-16 px-4 md:px-6 border-b border-border-light bg-surface-primary/80 backdrop-blur-md sticky top-0 z-30">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden p-2 rounded-lg text-text-tertiary hover:text-text-primary hover:bg-surface-tertiary mr-3"
          >
            <Menu size={20} />
          </button>

          <div className="flex-1">{headerContent}</div>
        </header>

        {/* Page Content */}
        <main
          className={cn(
            "flex-1 overflow-y-auto p-4 md:p-6 lg:p-8",
            className,
          )}
        >
          {children}
        </main>
      </div>
    </div>
  );
}