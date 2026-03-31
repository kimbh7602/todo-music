"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTodoStore, AUDIO_CATEGORIES } from "@/store/useTodoStore";

const CATEGORY_LABELS: Record<string, string> = {
  all: "All",
  lofi: "Lo-fi",
  electronic: "Electronic",
  piano: "Piano",
  ambient: "Ambient",
  nature: "Nature",
};

const CATEGORIES = ["all", ...Object.keys(AUDIO_CATEGORIES)];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  onLogout: () => void;
}

export default function Sidebar({ open, onClose, onLogout }: SidebarProps) {
  const selectedCategory = useTodoStore((s) => s.selectedCategory);
  const setCategory = useTodoStore((s) => s.setCategory);
  const currentStreak = useTodoStore((s) => s.currentStreak);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/20 z-40"
          />
          <motion.div
            ref={panelRef}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 350, damping: 30 }}
            className="fixed top-0 right-0 h-full w-72 z-50 liquid-glass shadow-2xl flex flex-col"
          >
            <div className="p-6 flex flex-col gap-6 flex-1 relative z-10">
              {currentStreak > 0 && (
                <div className="flex items-center gap-2 px-2 py-3 liquid-glass-subtle rounded-xl">
                  <span className="text-2xl relative z-10">🔥</span>
                  <div className="relative z-10">
                    <p className="text-sm font-semibold text-gray-900">
                      {currentStreak} day streak
                    </p>
                    <p className="text-xs text-gray-500">Keep it up!</p>
                  </div>
                </div>
              )}

              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3 px-1">
                  Music Genre
                </p>
                <div className="space-y-1">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setCategory(cat)}
                      className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                        selectedCategory === cat
                          ? "liquid-glass-dark text-white"
                          : "text-gray-700 hover:bg-white/20"
                      }`}
                    >
                      <span className="relative z-10">
                        {CATEGORY_LABELS[cat] ?? cat}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-white/20 relative z-10">
              <button
                onClick={onLogout}
                className="w-full text-left px-3 py-2.5 rounded-xl text-sm text-gray-500 hover:text-gray-800 hover:bg-white/20 transition-all"
              >
                Logout
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
