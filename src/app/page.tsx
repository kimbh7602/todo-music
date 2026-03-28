"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTodoStore } from "@/store/useTodoStore";
import MusicPlayer from "@/components/MusicPlayer";
import TodoList from "@/components/TodoList";
import CategorySelector from "@/components/CategorySelector";

export default function Home() {
  const todos = useTodoStore((s) => s.todos);
  const currentStreak = useTodoStore((s) => s.currentStreak);
  const activeTodo = todos.find((t) => t.active) ?? null;

  const [prevActiveTodo, setPrevActiveTodo] = useState(activeTodo);
  const [lastTodo, setLastTodo] = useState(activeTodo);
  const [visible, setVisible] = useState(false);
  const [showPlayer, setShowPlayer] = useState(false);

  if (activeTodo !== prevActiveTodo) {
    setPrevActiveTodo(activeTodo);
    if (activeTodo) {
      setLastTodo(activeTodo);
      setShowPlayer(true);
    } else {
      setVisible(false);
    }
  }

  useEffect(() => {
    useTodoStore.persist.rehydrate();
  }, []);

  useEffect(() => {
    if (activeTodo && !visible) {
      requestAnimationFrame(() => setVisible(true));
    }
  }, [activeTodo, visible]);

  // Cleanup after exit transition (replaces unreliable onTransitionEnd)
  if (!visible && !activeTodo && showPlayer) {
    setShowPlayer(false);
    setLastTodo(null);
  }

  const displayTodo = activeTodo ?? lastTodo;
  const bgColor =
    visible && displayTodo ? displayTodo.playerColor : "#f9fafb";

  return (
    <div
      className="flex flex-col md:flex-row min-h-screen transition-colors duration-700 ease-in-out"
      style={{ backgroundColor: bgColor }}
    >
      {/* Music Player Section */}
      <div
        className={`transition-all duration-500 ease-in-out overflow-hidden ${
          visible
            ? "max-h-[700px] opacity-100 md:max-h-none md:w-1/2 md:shrink-0"
            : "max-h-0 opacity-0 md:max-h-none md:w-0"
        }`}
      >
        <AnimatePresence>
          {showPlayer && displayTodo && (
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 25,
                duration: 0.4,
              }}
              className="md:sticky md:top-0 md:h-screen flex items-center justify-center p-6"
            >
              <MusicPlayer todo={displayTodo} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Todo List Section */}
      <div
        className={`min-h-screen transition-all duration-500 ease-in-out md:flex md:items-center md:justify-center ${
          visible ? "md:w-1/2" : "md:w-full"
        }`}
      >
        <div className="max-w-lg w-full mx-auto py-8 px-4">
          {/* Header with streak */}
          <div className="flex items-center justify-between px-4 mb-2">
            <h1 className="text-2xl font-bold text-gray-900">Todo Music</h1>
            {currentStreak > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
                className="liquid-glass-subtle rounded-full px-3 py-1 text-sm font-medium text-gray-800"
              >
                <span className="relative z-10">
                  {currentStreak}d streak
                </span>
              </motion.div>
            )}
          </div>
          <p className="text-sm text-gray-500 px-4 mb-4">
            Play your tasks like music
          </p>
          <CategorySelector />
          <TodoList />
        </div>
      </div>
    </div>
  );
}
