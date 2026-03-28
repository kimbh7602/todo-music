"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { useTodoStore } from "@/store/useTodoStore";
import { todayStr } from "@/utils/date";

function AnimatedNumber({ value }: { value: number }) {
  return (
    <motion.span
      key={value}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="text-2xl font-bold text-gray-900"
    >
      {value}
    </motion.span>
  );
}

export default function StatsCard() {
  const todos = useTodoStore((s) => s.todos);
  const currentStreak = useTodoStore((s) => s.currentStreak);
  const maxStreak = useTodoStore((s) => s.maxStreak);
  const totalCompleted = useTodoStore((s) => s.totalCompleted);

  const today = todayStr();
  const todayCompleted = useMemo(
    () => todos.filter((t) => t.completed && t.completedDate === today).length,
    [todos, today]
  );

  if (totalCompleted === 0) {
    return (
      <p className="text-center text-sm text-gray-400 py-4 mb-2">
        Complete your first todo!
      </p>
    );
  }

  const stats = [
    { label: "Today", value: todayCompleted },
    { label: "Streak", value: currentStreak, suffix: "d" },
    { label: "Total", value: totalCompleted },
    { label: "Best", value: maxStreak, suffix: "d" },
  ];

  return (
    <div className="grid grid-cols-4 gap-2 mb-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="liquid-glass-subtle rounded-xl p-3 text-center"
        >
          <AnimatedNumber value={stat.value} />
          {stat.suffix && (
            <span className="text-xs text-gray-500 ml-0.5">{stat.suffix}</span>
          )}
          <p className="text-xs text-gray-500 mt-1 relative z-10">
            {stat.label}
          </p>
        </div>
      ))}
    </div>
  );
}
