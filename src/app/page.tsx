"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useTodoStore } from "@/store/useTodoStore";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import MusicPlayer from "@/components/MusicPlayer";
import TodoList from "@/components/TodoList";
import Sidebar from "@/components/Sidebar";

export default function Home() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const todos = useTodoStore((s) => s.todos);
  const currentStreak = useTodoStore((s) => s.currentStreak);
  const storeLoading = useTodoStore((s) => s.loading);
  const fetchTodos = useTodoStore((s) => s.fetchTodos);
  const reset = useTodoStore((s) => s.reset);

  const activeTodo = todos.find((t) => t.active) ?? null;

  const [prevActiveTodo, setPrevActiveTodo] = useState(activeTodo);
  const [lastTodo, setLastTodo] = useState(activeTodo);
  const [visible, setVisible] = useState(false);
  const [showPlayer, setShowPlayer] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    if (user) {
      fetchTodos(user.id);
    } else {
      reset();
    }
  }, [user, fetchTodos, reset]);

  useEffect(() => {
    if (activeTodo && !visible) {
      requestAnimationFrame(() => setVisible(true));
    }
  }, [activeTodo, visible]);

  if (!visible && !activeTodo && showPlayer) {
    setShowPlayer(false);
    setLastTodo(null);
  }

  const handleLogout = useCallback(async () => {
    setSidebarOpen(false);
    await supabase.auth.signOut();
    reset();
    router.push("/login");
  }, [reset, router]);

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-400 text-sm">Loading...</p>
      </div>
    );
  }

  const displayTodo = activeTodo ?? lastTodo;
  const bgColor =
    visible && displayTodo ? displayTodo.playerColor : "#f9fafb";

  return (
    <div
      className="flex flex-col md:flex-row min-h-screen transition-colors duration-700 ease-in-out relative"
      style={{ backgroundColor: bgColor }}
    >
      {/* Hamburger button */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="fixed top-6 right-6 z-30 w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/40 bg-white/25 hover:bg-white/40 transition-all shadow-sm"
        aria-label="Open menu"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          className="text-gray-700 relative z-10"
        >
          <path d="M3 12h18M3 6h18M3 18h18" />
        </svg>
      </button>

      {/* Sidebar */}
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onLogout={handleLogout}
      />

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
                  🔥 {currentStreak}d
                </span>
              </motion.div>
            )}
          </div>
          <p className="text-sm text-gray-500 px-4 mb-4">
            Play your tasks like music
          </p>
          {storeLoading ? (
            <p className="text-center text-sm text-gray-400 py-12">
              Loading todos...
            </p>
          ) : (
            <TodoList />
          )}
        </div>
      </div>
    </div>
  );
}
