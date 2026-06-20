"use client";

import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface Tab {
  id: string;
  label: string;
  icon?: ReactNode;
  count?: number;
  disabled?: boolean;
}

export interface TabsProps {
  tabs: Tab[];
  activeTab?: string;
  onChange?: (tabId: string) => void;
  className?: string;
  variant?: "underline" | "pills" | "segmented";
}

export function Tabs({
  tabs,
  activeTab: externalActiveTab,
  onChange,
  className,
  variant = "underline",
}: TabsProps) {
  const [internalActiveTab, setInternalActiveTab] = useState(
    tabs[0]?.id || "",
  );
  const activeTab = externalActiveTab ?? internalActiveTab;

  const handleChange = (tabId: string) => {
    setInternalActiveTab(tabId);
    onChange?.(tabId);
  };

  const variantStyles = {
    underline: {
      container: "border-b border-border-light gap-0",
      tab: "px-4 py-3 text-sm font-medium text-text-tertiary hover:text-text-primary border-b-2 border-transparent transition-all duration-200",
      active: "text-brand-walnut border-brand-gold",
      disabled: "opacity-40 cursor-not-allowed",
    },
    pills: {
      container: "gap-1.5",
      tab: "px-4 py-2 text-sm font-medium rounded-lg text-text-tertiary hover:text-text-primary hover:bg-surface-tertiary transition-all duration-200",
      active: "bg-brand-navy text-text-on-primary hover:bg-brand-navy hover:text-text-on-primary shadow-sm",
      disabled: "opacity-40 cursor-not-allowed",
    },
    segmented: {
      container: "p-1 bg-surface-tertiary rounded-xl gap-0",
      tab: "px-4 py-2 text-sm font-medium rounded-lg text-text-tertiary hover:text-text-primary transition-all duration-200",
      active: "bg-surface-primary text-text-primary shadow-sm",
      disabled: "opacity-40 cursor-not-allowed",
    },
  };

  const styles = variantStyles[variant];

  return (
    <div className={cn("flex items-center", styles.container, className)}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => !tab.disabled && handleChange(tab.id)}
          disabled={tab.disabled}
          className={cn(
            styles.tab,
            activeTab === tab.id && styles.active,
            tab.disabled && styles.disabled,
          )}
        >
          <span className="flex items-center gap-2">
            {tab.icon && <span className="w-4 h-4">{tab.icon}</span>}
            {tab.label}
            {tab.count !== undefined && (
              <span
                className={cn(
                  "ml-1 px-1.5 py-0.5 text-xs rounded-full",
                  activeTab === tab.id
                    ? "bg-brand-gold/20 text-brand-gold"
                    : "bg-surface-tertiary text-text-tertiary",
                )}
              >
                {tab.count}
              </span>
            )}
          </span>
        </button>
      ))}
    </div>
  );
}