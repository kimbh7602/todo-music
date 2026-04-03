"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence, Reorder, useDragControls } from "framer-motion";
import { useTodoStore } from "@/store/useTodoStore";
import type { Todo } from "@/store/useTodoStore";
import { fireConfetti } from "@/utils/confetti";
import StatsCard from "@/components/StatsCard";

type Tab = "active" | "completed";

const itemVariants = {
  initial: { opacity: 0, y: 20, scale: 0.95 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, x: 80, scale: 0.95 },
};

const itemTransition = { duration: 0.2, ease: "easeOut" as const };

function DraggableItem({
  todo,
  isActive,
  onComplete,
  onActivate,
  onDelete,
}: {
  todo: Todo;
  isActive: boolean;
  onComplete: (id: string) => void;
  onActivate: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const controls = useDragControls();

  return (
    <Reorder.Item
      value={todo}
      dragListener={false}
      dragControls={controls}
      variants={itemVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={itemTransition}
      className={`flex items-center gap-3 p-4 rounded-xl ${
        todo.active
          ? "liquid-glass-dark text-white shadow-lg"
          : "liquid-glass-subtle hover:bg-white/25"
      }`}
    >
      <button
        className="shrink-0 cursor-grab active:cursor-grabbing touch-none text-gray-400 hover:text-gray-600 relative z-10"
        onPointerDown={(e) => controls.start(e)}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <circle cx="9" cy="6" r="1.5" />
          <circle cx="15" cy="6" r="1.5" />
          <circle cx="9" cy="12" r="1.5" />
          <circle cx="15" cy="12" r="1.5" />
          <circle cx="9" cy="18" r="1.5" />
          <circle cx="15" cy="18" r="1.5" />
        </svg>
      </button>

      <span className="flex-1 text-sm truncate relative z-10">
        {todo.text}
      </span>

      {todo.active ? (
        <span className="text-xs opacity-60 shrink-0 animate-pulse relative z-10">
          Playing
        </span>
      ) : (
        <div className="flex gap-1 shrink-0 relative z-10">
          <button
            onClick={() => onComplete(todo.id)}
            className="liquid-glass-btn px-3 py-1.5 rounded-lg text-xs font-medium text-gray-700"
          >
            <span className="relative z-10">Done</span>
          </button>
          <button
            onClick={() => onActivate(todo.id)}
            disabled={isActive}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              isActive
                ? "bg-white/10 text-gray-400 cursor-not-allowed"
                : "liquid-glass-btn text-gray-700"
            }`}
          >
            <span className="relative z-10">Play</span>
          </button>
          <button
            onClick={() => onDelete(todo.id)}
            className="px-2 py-1.5 rounded-lg text-xs text-gray-400 hover:text-red-500 hover:bg-red-100/30 transition-colors"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
    </Reorder.Item>
  );
}

export default function TodoList() {
  const todos = useTodoStore((s) => s.todos);
  const addTodo = useTodoStore((s) => s.addTodo);
  const activate = useTodoStore((s) => s.activate);
  const toggleComplete = useTodoStore((s) => s.toggleComplete);
  const deleteTodo = useTodoStore((s) => s.deleteTodo);
  const hasActive = useTodoStore((s) => s.hasActive);
  const reorderTodos = useTodoStore((s) => s.reorderTodos);

  const [input, setInput] = useState("");
  const [tab, setTab] = useState<Tab>("active");

  const activeTodos = useMemo(
    () => todos.filter((t) => !t.completed),
    [todos]
  );
  const completedTodos = useMemo(
    () => todos.filter((t) => t.completed),
    [todos]
  );
  const isActive = hasActive();

  const handleAdd = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    addTodo(trimmed);
    setInput("");
  };

  const handleComplete = (id: string) => {
    const todo = todos.find((t) => t.id === id);
    if (todo && !todo.completed) {
      fireConfetti();
    }
    toggleComplete(id);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.nativeEvent.isComposing) handleAdd();
  };

  return (
    <div className="flex flex-col h-full w-full max-w-lg mx-auto">
      <div className="flex gap-2 p-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add a new todo..."
          className="flex-1 px-4 py-3 rounded-xl liquid-glass-input text-sm text-gray-800 placeholder-gray-400 focus:outline-none"
        />
        <button
          onClick={handleAdd}
          className="liquid-glass-dark rounded-xl px-5 py-3 text-white text-sm font-medium hover:bg-black/30 transition-all shrink-0"
        >
          <span className="relative z-10">Add</span>
        </button>
      </div>

      <div className="flex border-b border-white/25 mx-4">
        <button
          onClick={() => setTab("active")}
          className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
            tab === "active"
              ? "border-b-2 border-gray-800 text-gray-800"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Active ({activeTodos.length})
        </button>
        <button
          onClick={() => setTab("completed")}
          className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
            tab === "completed"
              ? "border-b-2 border-gray-800 text-gray-800"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Completed ({completedTodos.length})
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {tab === "completed" && <StatsCard />}

        {tab === "active" && (
          <Reorder.Group
            axis="y"
            values={activeTodos}
            onReorder={reorderTodos}
            className="space-y-2"
          >
            <AnimatePresence mode="popLayout">
              {activeTodos.map((todo) => (
                <DraggableItem
                  key={todo.id}
                  todo={todo}
                  isActive={isActive}
                  onComplete={handleComplete}
                  onActivate={activate}
                  onDelete={deleteTodo}
                />
              ))}
            </AnimatePresence>
          </Reorder.Group>
        )}

        <AnimatePresence mode="popLayout" key={tab}>
          {tab === "completed" &&
            completedTodos.map((todo) => (
              <motion.div
                key={todo.id}
                variants={itemVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={itemTransition}
                layout
                className="flex items-center gap-3 p-4 rounded-xl liquid-glass-subtle"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-green-600 shrink-0 relative z-10"
                >
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                </svg>
                <span className="flex-1 text-sm text-gray-500 line-through truncate relative z-10">
                  {todo.text}
                </span>
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="px-2 py-1.5 rounded-lg text-xs text-gray-400 hover:text-red-500 hover:bg-red-100/30 transition-colors shrink-0 relative z-10"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </motion.div>
            ))}
        </AnimatePresence>

        {tab === "active" && activeTodos.length === 0 && (
          <p className="text-center text-sm text-gray-400 py-12">
            No active todos
          </p>
        )}
        {tab === "completed" && completedTodos.length === 0 && (
          <p className="text-center text-sm text-gray-400 py-12">
            No completed todos
          </p>
        )}
      </div>
    </div>
  );
}
