"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Filter,
  Plus,
  Search,
  LayoutGrid,
  List,
} from "lucide-react";
import {
  TimelineDashboard,
  SAMPLE_PHASES,
} from "@/components/timeline/gantt-chart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

export default function ProjectsPage() {
  const [viewMode, setViewMode] = useState("timeline");

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
      >
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl font-heading font-semibold text-slate-800 dark:text-slate-100">
              Projects
            </h1>
            <Badge variant="gold" size="sm">Modern Villa</Badge>
          </div>
          <p className="text-slate-400">
            Track milestones, timelines, and project progress
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
            <button
              onClick={() => setViewMode("timeline")}
              className={`p-2 transition-colors ${
                viewMode === "timeline"
                  ? "bg-wood-50 text-wood-700 dark:bg-navy-700 dark:text-wood-300"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              <Calendar size={16} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 transition-colors ${
                viewMode === "list"
                  ? "bg-wood-50 text-wood-700 dark:bg-navy-700 dark:text-wood-300"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              <List size={16} />
            </button>
          </div>
          <Button size="md">
            <Plus size={16} />
            New Project
          </Button>
        </div>
      </motion.div>

      {/* Search & Filters */}
      <motion.div
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-4 mb-6"
      >
        <div className="flex-1">
          <Input
            placeholder="Search projects, milestones, or team members..."
            leftIcon={<Search size={16} />}
          />
        </div>
        <Button variant="secondary">
          <Filter size={16} />
          Filters
        </Button>
      </motion.div>

      {/* Timeline Dashboard */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <TimelineDashboard
          phases={SAMPLE_PHASES}
          projectName="Modern Villa Project — Pacific Heights"
          projectProgress={34}
        />
      </motion.div>
    </div>
  );
}