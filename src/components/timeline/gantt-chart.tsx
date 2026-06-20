"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  CheckCircle2,
  Circle,
  AlertCircle,
  Clock,
  Flag,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress";
import { Card, CardBody, CardHeader } from "@/components/ui/card";

// ── Types ──
export interface Milestone {
  id: string;
  name: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  status: "not-started" | "in-progress" | "completed" | "delayed";
  progress: number;
  dependencies?: string[];
  phase: string;
  assignee?: string;
}

export interface ProjectPhase {
  id: string;
  name: string;
  color: string;
  milestones: Milestone[];
}

// ── Status Badge ──
function MilestoneStatusBadge({ status }: { status: Milestone["status"] }) {
  const config = {
    "not-started": { label: "Not Started", icon: Circle, variant: "default" as const },
    "in-progress": { label: "In Progress", icon: Clock, variant: "info" as const },
    completed: { label: "Completed", icon: CheckCircle2, variant: "success" as const },
    delayed: { label: "Delayed", icon: AlertCircle, variant: "error" as const },
  };
  const { label, icon: Icon, variant } = config[status];
  return (
    <Badge variant={variant} dot>
      <Icon size={12} className="mr-1" />
      {label}
    </Badge>
  );
}

// ── Gantt Chart ──
interface GanttChartProps {
  phases: ProjectPhase[];
  className?: string;
}

function GanttChart({ phases, className }: GanttChartProps) {
  const [startOffset, setStartOffset] = useState(0);

  // Calculate date range
  const { minDate, maxDate, totalDays, dayWidth } = useMemo(() => {
    const allMilestones = phases.flatMap((p) => p.milestones);
    if (allMilestones.length === 0) return { minDate: new Date(), maxDate: new Date(), totalDays: 30, dayWidth: 24 };

    const dates = allMilestones.flatMap((m) => [m.startDate, m.endDate]);
    const min = new Date(Math.min(...dates.map((d) => d.getTime())));
    const max = new Date(Math.max(...dates.map((d) => d.getTime())));
    const days = Math.max(Math.ceil((max.getTime() - min.getTime()) / (1000 * 60 * 60 * 24)) + 7, 30);
    return { minDate: min, maxDate: max, totalDays: days, dayWidth: 24 };
  }, [phases]);

  // Generate day headers
  const dayHeaders = useMemo(() => {
    const headers = [];
    for (let i = 0; i < totalDays; i++) {
      const date = new Date(minDate);
      date.setDate(date.getDate() + i);
      headers.push(date);
    }
    return headers;
  }, [minDate, totalDays]);

  // Get position for a milestone bar
  const getMilestoneStyle = (milestone: Milestone) => {
    const start = Math.max(0, (milestone.startDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24));
    const duration = Math.max(1, (milestone.endDate.getTime() - milestone.startDate.getTime()) / (1000 * 60 * 60 * 24));
    return {
      left: `${start * dayWidth}px`,
      width: `${duration * dayWidth}px`,
    };
  };

  const totalWidth = totalDays * dayWidth;

  const statusBarColor = {
    "not-started": "bg-slate-200 dark:bg-slate-700",
    "in-progress": "bg-wood-500 dark:bg-wood-400",
    completed: "bg-sage-500 dark:bg-sage-400",
    delayed: "bg-terracotta-500",
  };

  return (
    <div className={cn("overflow-x-auto scrollbar-thin", className)}>
      <div className="min-w-[800px]">
        {/* Day Headers */}
        <div className="flex border-b border-slate-100 dark:border-slate-700 sticky top-0 bg-white dark:bg-navy-900 z-10">
          <div className="w-64 shrink-0 px-4 py-3 border-r border-slate-100 dark:border-slate-700">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              Milestone
            </span>
          </div>
          <div className="flex" style={{ width: totalWidth }}>
            {dayHeaders.map((date, i) => (
              <div
                key={i}
                className={cn(
                  "text-[10px] text-slate-400 text-center py-2 border-r border-slate-50 dark:border-slate-800",
                  date.getDay() === 0 || date.getDay() === 6
                    ? "bg-slate-50/50 dark:bg-navy-800/50"
                    : ""
                )}
                style={{ width: dayWidth }}
              >
                {date.getDate()}
                {i === 0 || date.getDate() === 1
                  ? `/${date.getMonth() + 1}`
                  : ""}
              </div>
            ))}
          </div>
        </div>

        {/* Phase Rows */}
        {phases.map((phase) => (
          <div key={phase.id}>
            {/* Phase Header */}
            <div className="flex border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-navy-800/30">
              <div className="w-64 shrink-0 px-4 py-2.5 border-r border-slate-100 dark:border-slate-700 flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: phase.color }}
                />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                  {phase.name}
                </span>
              </div>
              <div className="flex-1" />
            </div>

            {/* Milestone Rows */}
            {phase.milestones.map((milestone) => (
              <div
                key={milestone.id}
                className="flex border-b border-slate-50 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-navy-800/20 transition-colors group"
              >
                {/* Left Label */}
                <div className="w-64 shrink-0 px-4 py-3 border-r border-slate-100 dark:border-slate-700">
                  <div className="flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">
                        {milestone.name}
                      </p>
                      {milestone.assignee && (
                        <p className="text-xs text-slate-400 mt-0.5">
                          {milestone.assignee}
                        </p>
                      )}
                    </div>
                    <MilestoneStatusBadge status={milestone.status} />
                  </div>
                </div>

                {/* Gantt Bar Area */}
                <div className="relative flex-1 py-3" style={{ minHeight: 44 }}>
                  {/* Grid lines */}
                  <div className="absolute inset-0 flex">
                    {dayHeaders.map((date, i) => (
                      <div
                        key={i}
                        className={cn(
                          "border-r border-slate-50 dark:border-slate-800/50",
                          date.getDay() === 0 || date.getDay() === 6
                            ? "bg-slate-50/30 dark:bg-navy-800/20"
                            : ""
                        )}
                        style={{ width: dayWidth }}
                      />
                    ))}
                  </div>

                  {/* Today marker */}
                  {new Date() >= minDate && new Date() <= maxDate && (
                    <div
                      className="absolute top-0 bottom-0 w-0.5 bg-terracotta-500 z-10"
                      style={{
                        left: `${((new Date().getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24)) * dayWidth}px`,
                      }}
                    >
                      <div className="w-2 h-2 rounded-full bg-terracotta-500 -ml-[3px] -mt-1" />
                    </div>
                  )}

                  {/* Gantt Bar */}
                  <motion.div
                    initial={{ opacity: 0, scaleX: 0 }}
                    animate={{ opacity: 1, scaleX: 1 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className={cn(
                      "absolute top-1/2 -translate-y-1/2 h-7 rounded-md flex items-center px-2 cursor-pointer",
                      "transition-shadow hover:shadow-md",
                      statusBarColor[milestone.status],
                    )}
                    style={getMilestoneStyle(milestone)}
                  >
                    <span className="text-[11px] font-medium text-white truncate w-full">
                      {milestone.progress}%
                    </span>
                  </motion.div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Timeline Dashboard ──
export interface TimelineDashboardProps {
  phases: ProjectPhase[];
  projectName?: string;
  projectProgress?: number;
  className?: string;
}

export function TimelineDashboard({
  phases,
  projectName = "Project Timeline",
  projectProgress = 0,
  className,
}: TimelineDashboardProps) {
  const stats = useMemo(() => {
    const all = phases.flatMap((p) => p.milestones);
    return {
      total: all.length,
      completed: all.filter((m) => m.status === "completed").length,
      inProgress: all.filter((m) => m.status === "in-progress").length,
      delayed: all.filter((m) => m.status === "delayed").length,
      notStarted: all.filter((m) => m.status === "not-started").length,
    };
  }, [phases]);

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        <Card variant="interactive" padding="md">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-400 uppercase tracking-wider">Total Milestones</p>
            <Flag size={14} className="text-wood-500" />
          </div>
          <p className="text-2xl font-heading font-bold text-slate-800 dark:text-slate-100 mt-1">
            {stats.total}
          </p>
        </Card>
        <Card variant="interactive" padding="md">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-400 uppercase tracking-wider">Completed</p>
            <CheckCircle2 size={14} className="text-sage-500" />
          </div>
          <p className="text-2xl font-heading font-bold text-sage-600 dark:text-sage-400 mt-1">
            {stats.completed}
          </p>
        </Card>
        <Card variant="interactive" padding="md">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-400 uppercase tracking-wider">In Progress</p>
            <Clock size={14} className="text-wood-500" />
          </div>
          <p className="text-2xl font-heading font-bold text-wood-600 dark:text-wood-400 mt-1">
            {stats.inProgress}
          </p>
        </Card>
        <Card variant="interactive" padding="md">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-400 uppercase tracking-wider">Delayed</p>
            <AlertCircle size={14} className="text-terracotta-500" />
          </div>
          <p className="text-2xl font-heading font-bold text-terracotta-600 mt-1">
            {stats.delayed}
          </p>
        </Card>
        <Card variant="interactive" padding="md">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-400 uppercase tracking-wider">Not Started</p>
            <Circle size={14} className="text-slate-400" />
          </div>
          <p className="text-2xl font-heading font-bold text-slate-400 mt-1">
            {stats.notStarted}
          </p>
        </Card>
      </div>

      {/* Project Progress */}
      <Card>
        <CardBody>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-slate-700 dark:text-slate-200">
              {projectName} — Overall Progress
            </h3>
            <span className="text-sm text-slate-400">{projectProgress}%</span>
          </div>
          <ProgressBar value={projectProgress} variant="default" size="lg" animated />
        </CardBody>
      </Card>

      {/* Gantt Chart */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="text-base font-heading font-medium text-slate-800 dark:text-slate-100">
              Timeline View
            </h3>
            <div className="flex items-center gap-2">
              <Badge variant="success" dot>Completed</Badge>
              <Badge variant="info" dot>In Progress</Badge>
              <Badge variant="warning" dot>Not Started</Badge>
              <Badge variant="error" dot>Delayed</Badge>
            </div>
          </div>
        </CardHeader>
        <CardBody className="p-0">
          <GanttChart phases={phases} />
        </CardBody>
      </Card>
    </div>
  );
}

// ── Sample Data ──
export const SAMPLE_PHASES: ProjectPhase[] = [
  {
    id: "design",
    name: "Design Phase",
    color: "#7E5E3A",
    milestones: [
      {
        id: "m1",
        name: "Initial Consultation",
        startDate: new Date(2026, 5, 1),
        endDate: new Date(2026, 5, 7),
        status: "completed",
        progress: 100,
        phase: "design",
        assignee: "Sarah Chen",
      },
      {
        id: "m2",
        name: "Style Assessment",
        startDate: new Date(2026, 5, 5),
        endDate: new Date(2026, 5, 14),
        status: "completed",
        progress: 100,
        phase: "design",
        assignee: "Sarah Chen",
      },
      {
        id: "m3",
        name: "Mood Board Creation",
        startDate: new Date(2026, 5, 12),
        endDate: new Date(2026, 5, 25),
        status: "completed",
        progress: 100,
        phase: "design",
        assignee: "Emily Davis",
      },
      {
        id: "m4",
        name: "Design Proposal",
        startDate: new Date(2026, 5, 22),
        endDate: new Date(2026, 6, 3),
        status: "in-progress",
        progress: 65,
        phase: "design",
        assignee: "Sarah Chen",
      },
    ],
  },
  {
    id: "procurement",
    name: "Procurement",
    color: "#5E835E",
    milestones: [
      {
        id: "m5",
        name: "Product Selection",
        startDate: new Date(2026, 6, 1),
        endDate: new Date(2026, 6, 15),
        status: "in-progress",
        progress: 30,
        phase: "procurement",
        assignee: "James Wilson",
      },
      {
        id: "m6",
        name: "Vendor Quotes",
        startDate: new Date(2026, 6, 8),
        endDate: new Date(2026, 6, 20),
        status: "not-started",
        progress: 0,
        phase: "procurement",
      },
      {
        id: "m7",
        name: "Place Orders",
        startDate: new Date(2026, 6, 18),
        endDate: new Date(2026, 6, 28),
        status: "not-started",
        progress: 0,
        phase: "procurement",
      },
    ],
  },
  {
    id: "construction",
    name: "Construction & Installation",
    color: "#546D96",
    milestones: [
      {
        id: "m8",
        name: "Demo & Prep",
        startDate: new Date(2026, 6, 25),
        endDate: new Date(2026, 7, 5),
        status: "not-started",
        progress: 0,
        phase: "construction",
        assignee: "Mike Contractor",
      },
      {
        id: "m9",
        name: "Painting & Finishes",
        startDate: new Date(2026, 7, 3),
        endDate: new Date(2026, 7, 15),
        status: "not-started",
        progress: 0,
        phase: "construction",
      },
      {
        id: "m10",
        name: "Furniture Assembly",
        startDate: new Date(2026, 7, 12),
        endDate: new Date(2026, 7, 22),
        status: "not-started",
        progress: 0,
        phase: "construction",
      },
      {
        id: "m11",
        name: "Final Styling",
        startDate: new Date(2026, 7, 20),
        endDate: new Date(2026, 7, 28),
        status: "not-started",
        progress: 0,
        phase: "construction",
        assignee: "Emily Davis",
      },
    ],
  },
  {
    id: "closeout",
    name: "Project Closeout",
    color: "#C4AE7A",
    milestones: [
      {
        id: "m12",
        name: "Final Walkthrough",
        startDate: new Date(2026, 7, 28),
        endDate: new Date(2026, 8, 1),
        status: "not-started",
        progress: 0,
        phase: "closeout",
      },
      {
        id: "m13",
        name: "Client Sign-off",
        startDate: new Date(2026, 8, 1),
        endDate: new Date(2026, 8, 5),
        status: "not-started",
        progress: 0,
        phase: "closeout",
      },
      {
        id: "m14",
        name: "Final Invoice",
        startDate: new Date(2026, 8, 3),
        endDate: new Date(2026, 8, 8),
        status: "not-started",
        progress: 0,
        phase: "closeout",
      },
    ],
  },
];