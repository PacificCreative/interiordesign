"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Save, Eye, EyeOff } from "lucide-react";
import {
  MoodBoardCanvas,
  SAMPLE_BOARD,
  type MoodBoard,
  type BoardItem,
} from "@/components/moodboard/mood-board-canvas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function MoodBoardPage() {
  const router = useRouter();
  const [board, setBoard] = useState<MoodBoard>(SAMPLE_BOARD);
  const [boardName, setBoardName] = useState(board.name);
  const [isSaving, setIsSaving] = useState(false);

  const handleUpdateItems = (items: BoardItem[]) => {
    setBoard((prev) => ({ ...prev, items }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate save
    await new Promise((r) => setTimeout(r, 1000));
    setIsSaving(false);
  };

  return (
    <div className="h-screen flex flex-col bg-slate-50 dark:bg-navy-900">
      {/* Top Bar */}
      <header className="flex items-center gap-3 px-4 h-14 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-navy-900 shrink-0">
        <button
          onClick={() => router.push("/moodboards")}
          className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-navy-800 transition-colors"
        >
          <ArrowLeft size={18} />
        </button>

        <div className="flex items-center gap-2 flex-1">
          <Input
            value={boardName}
            onChange={(e) => setBoardName(e.target.value)}
            className="border-0 bg-transparent text-lg font-heading font-medium text-slate-800 dark:text-slate-100 px-2 py-1 w-auto min-w-[200px] max-w-md hover:bg-slate-100 dark:hover:bg-navy-800 focus:bg-slate-100 dark:focus:bg-navy-800"
          />
          <Badge variant="gold" size="sm">
            {board.room || "No Room"}
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            <Eye size={16} />
            Preview
          </Button>
          <Button
            size="sm"
            onClick={handleSave}
            loading={isSaving}
          >
            <Save size={16} />
            Save Board
          </Button>
        </div>
      </header>

      {/* Canvas */}
      <div className="flex-1 overflow-hidden">
        <MoodBoardCanvas
          board={board}
          onUpdateItems={handleUpdateItems}
        />
      </div>
    </div>
  );
}