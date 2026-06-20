"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import {
  DndContext,
  DragOverlay,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
} from "@dnd-kit/core";
import { restrictToParentElement } from "@dnd-kit/modifiers";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Trash2,
  Image as ImageIcon,
  Palette,
  Type,
  GripVertical,
  Download,
  Share2,
  Undo2,
  Redo2,
  ZoomIn,
  ZoomOut,
  Grid3X3,
  Layers,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardBody } from "@/components/ui/card";

// ── Types ──
export interface BoardItem {
  id: string;
  type: "image" | "color" | "text" | "material";
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  rotation?: number;
  content: {
    src?: string;
    color?: string;
    label?: string;
    text?: string;
    fontSize?: number;
    category?: string;
  };
}

export interface MoodBoard {
  id: string;
  name: string;
  description?: string;
  projectId?: string;
  room?: string;
  items: BoardItem[];
  createdAt: Date;
  updatedAt: Date;
}

// ── Color Palette Panel ──
const COLORS = [
  "#F5F0EB", "#E8DDD3", "#D4C9BC", "#C4A886",
  "#8B6914", "#7E5E3A", "#5C4033", "#42311E",
  "#1A2335", "#2E3035", "#3A3C42", "#555860",
  "#5E835E", "#4A6A4A", "#D16A47", "#BD5736",
  "#C4AE7A", "#A8915D", "#738BB0", "#546D96",
];

interface ColorPaletteProps {
  onSelectColor: (color: string) => void;
}

function ColorPalette({ onSelectColor }: ColorPaletteProps) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
        Color Palette
      </p>
      <div className="grid grid-cols-5 gap-1.5">
        {COLORS.map((color) => (
          <button
            key={color}
            onClick={() => onSelectColor(color)}
            className="w-full aspect-square rounded-lg border border-slate-200 dark:border-slate-700 hover:scale-110 transition-transform cursor-pointer"
            style={{ backgroundColor: color }}
            title={color}
          />
        ))}
      </div>
    </div>
  );
}

// ── Toolbar ──
interface ToolbarProps {
  onAddImage: () => void;
  onAddColor: (color: string) => void;
  onAddText: () => void;
  onDelete: () => void;
  selectedItem: string | null;
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
}

function Toolbar({
  onAddImage,
  onAddColor,
  onAddText,
  onDelete,
  selectedItem,
  zoom,
  onZoomIn,
  onZoomOut,
}: ToolbarProps) {
  return (
    <div className="flex items-center gap-2 px-4 py-2 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-navy-900">
      <div className="flex items-center gap-1.5 mr-4">
        <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
          Add:
        </span>
      </div>
      <Button variant="ghost" size="sm" onClick={onAddImage}>
        <ImageIcon size={14} />
        Image
      </Button>
      <Button variant="ghost" size="sm" onClick={() => onAddColor("#E8DDD3")}>
        <Palette size={14} />
        Color
      </Button>
      <Button variant="ghost" size="sm" onClick={onAddText}>
        <Type size={14} />
        Text
      </Button>

      <div className="flex-1" />

      {selectedItem && (
        <Button variant="danger" size="sm" onClick={onDelete}>
          <Trash2 size={14} />
          Delete
        </Button>
      )}

      <div className="flex items-center gap-1 ml-2 border-l border-slate-200 dark:border-slate-700 pl-2">
        <Button variant="ghost" size="sm" onClick={onZoomOut}>
          <ZoomOut size={14} />
        </Button>
        <span className="text-xs text-slate-400 w-10 text-center">
          {Math.round(zoom * 100)}%
        </span>
        <Button variant="ghost" size="sm" onClick={onZoomIn}>
          <ZoomIn size={14} />
        </Button>
      </div>
    </div>
  );
}

// ── Draggable Board Item ──
function BoardItem({
  item,
  isSelected,
  onSelect,
  onPositionChange,
}: {
  item: BoardItem;
  isSelected: boolean;
  onSelect: () => void;
  onPositionChange: (x: number, y: number) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={cn(
        "absolute group cursor-move rounded-xl overflow-hidden",
        "transition-shadow duration-200",
        isSelected
          ? "ring-2 ring-wood-500 shadow-lg"
          : "hover:ring-1 hover:ring-wood-300/50 shadow-md",
      )}
      style={{
        left: item.x,
        top: item.y,
        width: item.width,
        height: item.height,
        zIndex: item.zIndex,
        transform: item.rotation ? `rotate(${item.rotation}deg)` : undefined,
      }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
    >
      {/* Render based on type */}
      {item.type === "image" && item.content.src && (
        <div className="w-full h-full relative">
          <Image
            src={item.content.src}
            alt={item.content.label || "Board image"}
            fill
            className="object-cover"
          />
        </div>
      )}
      {item.type === "color" && (
        <div
          className="w-full h-full flex items-center justify-center"
          style={{ backgroundColor: item.content.color }}
        >
          <span className="text-xs font-medium opacity-50">
            {item.content.color}
          </span>
        </div>
      )}
      {item.type === "text" && (
        <div className="w-full h-full flex items-center justify-center p-3 bg-white dark:bg-navy-800">
          <p
            className="text-center font-medium text-slate-800 dark:text-slate-100 leading-tight"
            style={{ fontSize: item.content.fontSize || 16 }}
          >
            {item.content.text || "Double-click to edit"}
          </p>
        </div>
      )}
      {item.type === "material" && item.content.color && (
        <div
          className="w-full h-full flex flex-col items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700"
          style={{ backgroundColor: item.content.color }}
        >
          <div className="w-8 h-8 rounded-full bg-white/30 flex items-center justify-center">
            <span className="text-xs font-bold">{item.content.label?.[0]}</span>
          </div>
          <span className="text-xs mt-1 font-medium opacity-70">
            {item.content.label}
          </span>
        </div>
      )}

      {/* Drag Handle */}
      <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="p-1 rounded bg-white/80 backdrop-blur-sm shadow-sm">
          <GripVertical size={12} className="text-slate-400" />
        </div>
      </div>
    </motion.div>
  );
}

// ── Main Canvas Editor ──
interface MoodBoardCanvasProps {
  board: MoodBoard;
  onUpdateItems: (items: BoardItem[]) => void;
  className?: string;
}

export function MoodBoardCanvas({
  board,
  onUpdateItems,
  className,
}: MoodBoardCanvasProps) {
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(String(event.active.id));
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      setActiveId(null);
      const { active, delta } = event;
      if (!delta.x && !delta.y) return;

      onUpdateItems(
        board.items.map((item) => {
          if (item.id === String(active.id)) {
            return {
              ...item,
              x: Math.max(0, item.x + delta.x),
              y: Math.max(0, item.y + delta.y),
            };
          }
          return item;
        })
      );
    },
    [board.items, onUpdateItems]
  );

  const handleAddImage = useCallback(() => {
    const newItem: BoardItem = {
      id: `item-${Date.now()}`,
      type: "image",
      x: 50 + Math.random() * 100,
      y: 50 + Math.random() * 100,
      width: 200,
      height: 160,
      zIndex: board.items.length + 1,
      content: {
        src: "https://images.unsplash.com/photo-1618220179428-22790b461013?w=400&h=320&fit=crop",
        label: "Interior",
      },
    };
    onUpdateItems([...board.items, newItem]);
  }, [board.items, onUpdateItems]);

  const handleAddColor = useCallback(
    (color: string) => {
      const newItem: BoardItem = {
        id: `item-${Date.now()}`,
        type: "color",
        x: 50 + Math.random() * 100,
        y: 50 + Math.random() * 100,
        width: 120,
        height: 120,
        zIndex: board.items.length + 1,
        content: { color },
      };
      onUpdateItems([...board.items, newItem]);
    },
    [board.items, onUpdateItems]
  );

  const handleAddText = useCallback(() => {
    const newItem: BoardItem = {
      id: `item-${Date.now()}`,
      type: "text",
      x: 50 + Math.random() * 50,
      y: 50 + Math.random() * 50,
      width: 200,
      height: 80,
      zIndex: board.items.length + 1,
      content: { text: "New Text", fontSize: 18 },
    };
    onUpdateItems([...board.items, newItem]);
  }, [board.items, onUpdateItems]);

  const handleDelete = useCallback(() => {
    if (!selectedItem) return;
    onUpdateItems(board.items.filter((item) => item.id !== selectedItem));
    setSelectedItem(null);
  }, [selectedItem, board.items, onUpdateItems]);

  const handleCanvasClick = useCallback(() => {
    setSelectedItem(null);
  }, []);

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Toolbar */}
      <Toolbar
        onAddImage={handleAddImage}
        onAddColor={handleAddColor}
        onAddText={handleAddText}
        onDelete={handleDelete}
        selectedItem={selectedItem}
        zoom={zoom}
        onZoomIn={() => setZoom((z) => Math.min(z + 0.1, 2))}
        onZoomOut={() => setZoom((z) => Math.max(z - 0.1, 0.3))}
      />

      {/* Canvas Area */}
      <div className="flex-1 overflow-auto bg-slate-100/50 dark:bg-navy-900/50 relative">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div
            className="relative mx-auto my-8"
            style={{
              width: 1200 * zoom,
              height: 800 * zoom,
              transformOrigin: "top center",
            }}
          >
            {/* Board Background */}
            <div
              className="absolute inset-0 bg-white dark:bg-navy-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700"
              onClick={handleCanvasClick}
            >
              {/* Grid Pattern */}
              <div
                className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)",
                  backgroundSize: `${20 * zoom}px ${20 * zoom}px`,
                }}
              />
            </div>

            {/* Items */}
            <AnimatePresence>
              {board.items.map((item) => (
                <BoardItem
                  key={item.id}
                  item={item}
                  isSelected={selectedItem === item.id}
                  onSelect={() => setSelectedItem(item.id)}
                  onPositionChange={(x, y) => {
                    onUpdateItems(
                      board.items.map((i) =>
                        i.id === item.id ? { ...i, x, y } : i
                      )
                    );
                  }}
                />
              ))}
            </AnimatePresence>

            {/* Empty State */}
            {board.items.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-navy-700 flex items-center justify-center mx-auto mb-4">
                    <ImageIcon size={28} className="text-slate-300" />
                  </div>
                  <h3 className="text-lg font-medium text-slate-400 mb-2">
                    Start your mood board
                  </h3>
                  <p className="text-sm text-slate-400 mb-4">
                    Add images, colors, and text to bring your vision to life
                  </p>
                  <Button onClick={handleAddImage}>
                    <Plus size={16} />
                    Add First Image
                  </Button>
                </div>
              </div>
            )}
          </div>

          <DragOverlay>
            {activeId ? (
              <div className="w-48 h-36 rounded-xl bg-wood-100 border-2 border-wood-500 opacity-80" />
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>

      {/* Bottom Panel */}
      <div className="flex items-center gap-4 px-4 py-2 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-navy-900">
        <div className="flex items-center gap-2">
          <ColorPalette onSelectColor={handleAddColor} />
        </div>
        <div className="flex-1" />
        <div className="flex items-center gap-2">
          <Badge variant="default" size="sm">
            {board.items.length} items
          </Badge>
          <Button variant="ghost" size="sm">
            <Download size={14} />
            Export
          </Button>
          <Button variant="ghost" size="sm">
            <Share2 size={14} />
            Share
          </Button>
        </div>
      </div>
    </div>
  );
}

// ── Sample Data ──
export const SAMPLE_BOARD: MoodBoard = {
  id: "board-1",
  name: "Modern Villa — Living Room",
  description: "Contemporary meets warm minimalism",
  room: "Living Room",
  createdAt: new Date(),
  updatedAt: new Date(),
  items: [
    {
      id: "img-1",
      type: "image",
      x: 40,
      y: 40,
      width: 280,
      height: 220,
      zIndex: 1,
      content: {
        src: "https://images.unsplash.com/photo-1618220179428-22790b461013?w=600&h=400&fit=crop",
        label: "Living room inspiration",
      },
    },
    {
      id: "img-2",
      type: "image",
      x: 360,
      y: 40,
      width: 280,
      height: 220,
      zIndex: 2,
      content: {
        src: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600&h=400&fit=crop",
        label: "Sofa style",
      },
    },
    {
      id: "img-3",
      type: "image",
      x: 680,
      y: 40,
      width: 280,
      height: 220,
      zIndex: 3,
      content: {
        src: "https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=600&h=400&fit=crop",
        label: "Color palette",
      },
    },
    {
      id: "color-1",
      type: "color",
      x: 40,
      y: 290,
      width: 130,
      height: 100,
      zIndex: 4,
      content: { color: "#1A2335" },
    },
    {
      id: "color-2",
      type: "color",
      x: 180,
      y: 290,
      width: 130,
      height: 100,
      zIndex: 5,
      content: { color: "#C4AE7A" },
    },
    {
      id: "color-3",
      type: "color",
      x: 320,
      y: 290,
      width: 130,
      height: 100,
      zIndex: 6,
      content: { color: "#E8DDD3" },
    },
    {
      id: "color-4",
      type: "color",
      x: 460,
      y: 290,
      width: 130,
      height: 100,
      zIndex: 7,
      content: { color: "#5E835E" },
    },
    {
      id: "text-1",
      type: "text",
      x: 620,
      y: 290,
      width: 340,
      height: 100,
      zIndex: 8,
      content: {
        text: "Warm minimalism meets natural textures",
        fontSize: 22,
      },
    },
    {
      id: "img-4",
      type: "image",
      x: 40,
      y: 430,
      width: 460,
      height: 320,
      zIndex: 9,
      content: {
        src: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop",
        label: "Room view",
      },
    },
  ],
};