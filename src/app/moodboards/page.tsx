"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Search,
  Grid3X3,
  Layout,
  Clock,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardBody } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const SAMPLE_BOARDS = [
  {
    id: "board-1",
    name: "Modern Villa — Living Room",
    room: "Living Room",
    style: "Modern",
    items: 12,
    updatedAt: "2 hours ago",
    thumbnail:
      "https://images.unsplash.com/photo-1618220179428-22790b461013?w=400&h=300&fit=crop",
    colors: ["#1A2335", "#C4AE7A", "#E8DDD3", "#5E835E"],
  },
  {
    id: "board-2",
    name: "Coastal Bedroom Retreat",
    room: "Bedroom",
    style: "Coastal",
    items: 8,
    updatedAt: "Yesterday",
    thumbnail:
      "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=400&h=300&fit=crop",
    colors: ["#8BB8A8", "#F5F0EB", "#D4C9BC", "#FFFFFF"],
  },
  {
    id: "board-3",
    name: "Kitchen Mood Board",
    room: "Kitchen",
    style: "Modern Farmhouse",
    items: 15,
    updatedAt: "3 days ago",
    thumbnail:
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop",
    colors: ["#FFFFFF", "#5C4033", "#E8DDD3", "#8B6914"],
  },
  {
    id: "board-4",
    name: "Bohemian Office Space",
    room: "Home Office",
    style: "Bohemian",
    items: 10,
    updatedAt: "1 week ago",
    thumbnail:
      "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&h=300&fit=crop",
    colors: ["#C0693E", "#8BB8A8", "#D4A574", "#1A1A2E"],
  },
  {
    id: "board-5",
    name: "Minimalist Bathroom",
    room: "Bathroom",
    style: "Minimalist",
    items: 6,
    updatedAt: "2 weeks ago",
    thumbnail:
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&h=300&fit=crop",
    colors: ["#FFFFFF", "#E8DDD3", "#A8988A", "#2C2C3A"],
  },
  {
    id: "board-6",
    name: "Scandinavian Nursery",
    room: "Nursery",
    style: "Scandinavian",
    items: 9,
    updatedAt: "3 weeks ago",
    thumbnail:
      "https://images.unsplash.com/photo-1596436889106-be35e843f974?w=400&h=300&fit=crop",
    colors: ["#F5F0EB", "#8BB8A8", "#D4C9BC", "#FFFFFF"],
  },
];

export default function MoodBoardsPage() {
  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
      >
        <div>
          <h1 className="text-3xl font-heading font-semibold text-slate-800 dark:text-slate-100">
            Mood Boards
          </h1>
          <p className="text-slate-400 mt-1">
            Create and manage your design vision boards
          </p>
        </div>
        <Link href="/moodboards/new">
          <Button size="md">
            <Plus size={16} />
            New Board
          </Button>
        </Link>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <div className="max-w-md">
          <Input placeholder="Search mood boards..." leftIcon={<Search size={16} />} />
        </div>
      </motion.div>

      {/* Board Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {SAMPLE_BOARDS.map((board, i) => (
          <motion.div
            key={board.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.06 }}
          >
            <Link href={`/moodboards/${board.id}`}>
              <Card
                variant="interactive"
                padding="none"
                className="overflow-hidden group h-full"
              >
                {/* Thumbnail */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={board.thumbnail}
                    alt={board.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <div className="flex items-center gap-2">
                      <Badge variant="default" size="sm" className="bg-white/90 text-slate-700 border-0">
                        {board.room}
                      </Badge>
                      <Badge variant="default" size="sm" className="bg-white/90 text-slate-700 border-0">
                        {board.items} items
                      </Badge>
                    </div>
                  </div>
                </div>

                <CardBody className="p-4">
                  <h3 className="font-heading font-medium text-slate-800 dark:text-slate-100 mb-1">
                    {board.name}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">{board.style}</span>
                    <div className="flex items-center gap-1 text-xs text-slate-400">
                      <Clock size={12} />
                      {board.updatedAt}
                    </div>
                  </div>
                  {/* Color Dots */}
                  <div className="flex gap-1.5 mt-3">
                    {board.colors.map((color) => (
                      <div
                        key={color}
                        className="w-3.5 h-3.5 rounded-full border border-slate-200"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </CardBody>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}