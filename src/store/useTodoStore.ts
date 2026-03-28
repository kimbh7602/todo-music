import { create } from "zustand";
import { persist } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";
import { todayStr, daysBetween } from "@/utils/date";

const COVER_IMAGES = [
  "/images/cover1.jpg",
  "/images/cover2.jpg",
  "/images/cover3.jpg",
  "/images/cover4.jpg",
  "/images/cover5.jpg",
  "/images/cover6.jpg",
  "/images/cover7.jpg",
  "/images/cover8.jpg",
];

export const AUDIO_CATEGORIES: Record<string, string[]> = {
  lofi: [
    "/audio/lofi/track1.mp3",
    "/audio/lofi/track2.mp3",
    "/audio/lofi/track3.mp3",
    "/audio/lofi/track4.mp3",
    "/audio/lofi/track5.mp3",
    "/audio/lofi/track6.mp3",
  ],
  electronic: [
    "/audio/electronic/track1.mp3",
    "/audio/electronic/track2.mp3",
    "/audio/electronic/track3.mp3",
    "/audio/electronic/track4.mp3",
  ],
  piano: [
    "/audio/piano/track1.mp3",
    "/audio/piano/track2.mp3",
    "/audio/piano/track3.mp3",
    "/audio/piano/track4.mp3",
  ],
  ambient: [
    "/audio/ambient/track1.mp3",
    "/audio/ambient/track2.mp3",
    "/audio/ambient/track3.mp3",
    "/audio/ambient/track4.mp3",
  ],
  nature: [
    "/audio/nature/track1.mp3",
    "/audio/nature/track2.mp3",
    "/audio/nature/track3.mp3",
    "/audio/nature/track4.mp3",
  ],
};

const ALL_TRACKS = Object.values(AUDIO_CATEGORIES).flat();

function getTracksForCategory(category: string): string[] {
  if (category === "all") return ALL_TRACKS;
  return AUDIO_CATEGORIES[category] ?? ALL_TRACKS;
}

const PLAYER_COLORS = [
  "#d4a0b0",
  "#a0b4d4",
  "#a0d4b4",
  "#d4cfa0",
  "#c4a0d4",
  "#d4b0a0",
  "#a0c8d4",
  "#b8d4a0",
  "#d4a0c8",
  "#a0d4d0",
];

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  active: boolean;
  coverImage: string;
  playerColor: string;
  audioTrack: string;
  completedDate: string | null;
}

interface TodoState {
  todos: Todo[];
  currentStreak: number;
  maxStreak: number;
  lastCompletedDate: string | null;
  totalCompleted: number;
  selectedCategory: string;
  addTodo: (text: string) => void;
  toggleComplete: (id: string) => void;
  activate: (id: string) => void;
  deactivate: () => void;
  deleteTodo: (id: string) => void;
  hasActive: () => boolean;
  setCategory: (category: string) => void;
}

export const useTodoStore = create<TodoState>()(
  persist(
    (set, get) => ({
      todos: [],
      currentStreak: 0,
      maxStreak: 0,
      lastCompletedDate: null,
      totalCompleted: 0,
      selectedCategory: "all",

      addTodo: (text) =>
        set((state) => ({
          todos: [
            ...state.todos,
            {
              id: uuidv4(),
              text,
              completed: false,
              active: false,
              coverImage: randomFrom(COVER_IMAGES),
              playerColor: randomFrom(PLAYER_COLORS),
              audioTrack: randomFrom(getTracksForCategory(state.selectedCategory)),
              completedDate: null,
            },
          ],
        })),

      toggleComplete: (id) => {
        const state = get();
        const todo = state.todos.find((t) => t.id === id);
        if (!todo) return;

        const wasCompleted = todo.completed;
        const today = todayStr();

        if (wasCompleted) {
          set({
            todos: state.todos.map((t) =>
              t.id === id
                ? { ...t, completed: false, active: false, completedDate: null }
                : t
            ),
            totalCompleted: Math.max(0, state.totalCompleted - 1),
          });
        } else {
          let newStreak = state.currentStreak;
          const last = state.lastCompletedDate;

          if (last === today) {
            // Same day, streak stays
          } else if (last && daysBetween(last, today) === 1) {
            newStreak = state.currentStreak + 1;
          } else {
            newStreak = 1;
          }

          set({
            todos: state.todos.map((t) =>
              t.id === id
                ? { ...t, completed: true, active: false, completedDate: today }
                : t
            ),
            currentStreak: newStreak,
            maxStreak: Math.max(state.maxStreak, newStreak),
            lastCompletedDate: today,
            totalCompleted: state.totalCompleted + 1,
          });
        }
      },

      activate: (id) => {
        const state = get();
        if (state.hasActive()) return;
        const tracks = getTracksForCategory(state.selectedCategory);
        set({
          todos: state.todos.map((t) =>
            t.id === id
              ? {
                  ...t,
                  active: true,
                  coverImage: randomFrom(COVER_IMAGES),
                  playerColor: randomFrom(PLAYER_COLORS),
                  audioTrack: randomFrom(tracks),
                }
              : t
          ),
        });
      },

      deactivate: () => {
        if (!get().hasActive()) return;
        set((state) => ({
          todos: state.todos.map((t) =>
            t.active ? { ...t, active: false } : t
          ),
        }));
      },

      deleteTodo: (id) =>
        set((state) => ({
          todos: state.todos.filter((t) => t.id !== id),
        })),

      hasActive: () => get().todos.some((t) => t.active),

      setCategory: (category) => {
        if (category !== "all" && !AUDIO_CATEGORIES[category]) return;
        set({ selectedCategory: category });
      },
    }),
    {
      name: "todo-music-storage",
      skipHydration: true,
    }
  )
);
