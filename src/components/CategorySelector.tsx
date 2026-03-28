"use client";

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

export default function CategorySelector() {
  const selectedCategory = useTodoStore((s) => s.selectedCategory);
  const setCategory = useTodoStore((s) => s.setCategory);

  return (
    <div className="flex gap-2 flex-wrap px-4 mb-4" role="radiogroup" aria-label="Music category">
      {CATEGORIES.map((cat) => (
        <button
          key={cat}
          onClick={() => setCategory(cat)}
          role="radio"
          aria-checked={selectedCategory === cat}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
            selectedCategory === cat
              ? "liquid-glass-dark text-white"
              : "liquid-glass-subtle text-gray-600 hover:bg-white/25"
          }`}
        >
          <span className="relative z-10">
            {CATEGORY_LABELS[cat] ?? cat}
          </span>
        </button>
      ))}
    </div>
  );
}
