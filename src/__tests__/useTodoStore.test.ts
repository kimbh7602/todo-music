import { describe, it, expect, beforeEach } from "vitest";
import { useTodoStore } from "@/store/useTodoStore";
import { AUDIO_CATEGORIES } from "@/store/useTodoStore";

describe("useTodoStore - category", () => {
  beforeEach(() => {
    useTodoStore.setState({
      todos: [],
      currentStreak: 0,
      maxStreak: 0,
      lastCompletedDate: null,
      totalCompleted: 0,
      selectedCategory: "all",
    });
  });

  it("default category is 'all'", () => {
    expect(useTodoStore.getState().selectedCategory).toBe("all");
  });

  it("setCategory changes selected category", () => {
    useTodoStore.getState().setCategory("lofi");
    expect(useTodoStore.getState().selectedCategory).toBe("lofi");
  });

  it("setCategory to 'all' works", () => {
    useTodoStore.getState().setCategory("electronic");
    useTodoStore.getState().setCategory("all");
    expect(useTodoStore.getState().selectedCategory).toBe("all");
  });

  it("AUDIO_CATEGORIES has expected keys", () => {
    expect(Object.keys(AUDIO_CATEGORIES)).toContain("lofi");
    expect(Object.keys(AUDIO_CATEGORIES)).toContain("electronic");
    expect(Object.keys(AUDIO_CATEGORIES)).toContain("piano");
    expect(Object.keys(AUDIO_CATEGORIES)).toContain("ambient");
    expect(Object.keys(AUDIO_CATEGORIES)).toContain("nature");
  });

  it("each category has at least 1 track", () => {
    for (const [, tracks] of Object.entries(AUDIO_CATEGORIES)) {
      expect(tracks.length).toBeGreaterThanOrEqual(1);
    }
  });

  it("activate assigns track from selected category", () => {
    useTodoStore.getState().setCategory("lofi");
    useTodoStore.getState().addTodo("test");
    const todoId = useTodoStore.getState().todos[0].id;
    useTodoStore.getState().activate(todoId);
    const todo = useTodoStore.getState().todos.find((t) => t.id === todoId);
    expect(todo?.audioTrack).toMatch(/\/audio\/lofi\//);
  });

  it("activate with 'all' assigns track from any category", () => {
    useTodoStore.getState().setCategory("all");
    useTodoStore.getState().addTodo("test");
    const todoId = useTodoStore.getState().todos[0].id;
    useTodoStore.getState().activate(todoId);
    const todo = useTodoStore.getState().todos.find((t) => t.id === todoId);
    expect(todo?.audioTrack).toMatch(/\/audio\//);
  });

  it("setCategory rejects invalid category", () => {
    useTodoStore.getState().setCategory("nonexistent");
    expect(useTodoStore.getState().selectedCategory).toBe("all");
  });
});
