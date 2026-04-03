import { create } from "zustand";
import { supabase } from "@/lib/supabase";
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
  loading: boolean;
  userId: string | null;
  fetchTodos: (userId: string) => Promise<void>;
  addTodo: (text: string) => void;
  toggleComplete: (id: string) => void;
  activate: (id: string) => void;
  deactivate: () => void;
  deleteTodo: (id: string) => void;
  reorderTodos: (reorderedActive: Todo[]) => void;
  hasActive: () => boolean;
  setCategory: (category: string) => void;
  reset: () => void;
}

let syncTimer: ReturnType<typeof setTimeout> | null = null;
function debouncedSyncOrder(todos: Todo[]) {
  if (syncTimer) clearTimeout(syncTimer);
  syncTimer = setTimeout(() => {
    todos.forEach((todo, index) => {
      supabase
        .from("todos")
        .update({ sort_order: index })
        .eq("id", todo.id)
        .then();
    });
  }, 300);
}

export const useTodoStore = create<TodoState>()((set, get) => ({
  todos: [],
  currentStreak: 0,
  maxStreak: 0,
  lastCompletedDate: null,
  totalCompleted: 0,
  selectedCategory: "all",
  loading: true,
  userId: null,

  fetchTodos: async (userId: string) => {
    set({ loading: true, userId });

    const [todosRes, statsRes] = await Promise.all([
      supabase
        .from("todos")
        .select("*")
        .eq("user_id", userId)
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: true }),
      supabase.from("user_stats").select("*").eq("user_id", userId).single(),
    ]);

    const dbTodos = (todosRes.data ?? []).map((t) => ({
      id: t.id,
      text: t.text,
      completed: t.completed,
      active: false,
      coverImage: randomFrom(COVER_IMAGES),
      playerColor: randomFrom(PLAYER_COLORS),
      audioTrack: randomFrom(ALL_TRACKS),
      completedDate: t.completed_date,
    }));

    const stats = statsRes.data;

    set({
      todos: dbTodos,
      currentStreak: stats?.current_streak ?? 0,
      maxStreak: stats?.max_streak ?? 0,
      lastCompletedDate: stats?.last_completed_date ?? null,
      totalCompleted: stats?.total_completed ?? 0,
      selectedCategory: stats?.selected_category ?? "all",
      loading: false,
    });
  },

  addTodo: (text) => {
    const state = get();
    const id = crypto.randomUUID();
    const newTodo: Todo = {
      id,
      text,
      completed: false,
      active: false,
      coverImage: randomFrom(COVER_IMAGES),
      playerColor: randomFrom(PLAYER_COLORS),
      audioTrack: randomFrom(getTracksForCategory(state.selectedCategory)),
      completedDate: null,
    };

    set({ todos: [...state.todos, newTodo] });

    if (state.userId) {
      const sortOrder = state.todos.filter((t) => !t.completed).length - 1;
      supabase
        .from("todos")
        .insert({ id, user_id: state.userId, text, sort_order: sortOrder })
        .then();
    }
  },

  toggleComplete: (id) => {
    const state = get();
    const todo = state.todos.find((t) => t.id === id);
    if (!todo) return;

    const wasCompleted = todo.completed;
    const today = todayStr();

    if (wasCompleted) {
      const newTotal = Math.max(0, state.totalCompleted - 1);
      set({
        todos: state.todos.map((t) =>
          t.id === id
            ? { ...t, completed: false, active: false, completedDate: null }
            : t
        ),
        totalCompleted: newTotal,
      });

      if (state.userId) {
        supabase
          .from("todos")
          .update({ completed: false, completed_date: null })
          .eq("id", id)
          .then();
        supabase
          .from("user_stats")
          .update({ total_completed: newTotal })
          .eq("user_id", state.userId)
          .then();
      }
    } else {
      let newStreak = state.currentStreak;
      const last = state.lastCompletedDate;

      if (last === today) {
        // Same day
      } else if (last && daysBetween(last, today) === 1) {
        newStreak = state.currentStreak + 1;
      } else {
        newStreak = 1;
      }

      const newMax = Math.max(state.maxStreak, newStreak);
      const newTotal = state.totalCompleted + 1;

      set({
        todos: state.todos.map((t) =>
          t.id === id
            ? { ...t, completed: true, active: false, completedDate: today }
            : t
        ),
        currentStreak: newStreak,
        maxStreak: newMax,
        lastCompletedDate: today,
        totalCompleted: newTotal,
      });

      if (state.userId) {
        supabase
          .from("todos")
          .update({ completed: true, completed_date: today })
          .eq("id", id)
          .then();
        supabase
          .from("user_stats")
          .update({
            current_streak: newStreak,
            max_streak: newMax,
            last_completed_date: today,
            total_completed: newTotal,
          })
          .eq("user_id", state.userId)
          .then();
      }
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

  deleteTodo: (id) => {
    const state = get();
    set({ todos: state.todos.filter((t) => t.id !== id) });

    if (state.userId) {
      supabase.from("todos").delete().eq("id", id).then();
    }
  },

  reorderTodos: (reorderedActive) => {
    const state = get();
    const completed = state.todos.filter((t) => t.completed);
    set({ todos: [...reorderedActive, ...completed] });

    if (state.userId) {
      debouncedSyncOrder(reorderedActive);
    }
  },

  hasActive: () => get().todos.some((t) => t.active),

  setCategory: (category) => {
    if (category !== "all" && !AUDIO_CATEGORIES[category]) return;
    const state = get();
    set({ selectedCategory: category });

    if (state.userId) {
      supabase
        .from("user_stats")
        .update({ selected_category: category })
        .eq("user_id", state.userId)
        .then();
    }
  },

  reset: () => {
    set({
      todos: [],
      currentStreak: 0,
      maxStreak: 0,
      lastCompletedDate: null,
      totalCompleted: 0,
      selectedCategory: "all",
      loading: true,
      userId: null,
    });
  },
}));
