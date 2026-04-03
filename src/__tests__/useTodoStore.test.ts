import { describe, it, expect, beforeEach } from "vitest";
import { useTodoStore } from "@/store/useTodoStore";
import { AUDIO_CATEGORIES } from "@/store/useTodoStore";

function resetStore() {
  useTodoStore.setState({
    todos: [],
    currentStreak: 0,
    maxStreak: 0,
    lastCompletedDate: null,
    totalCompleted: 0,
    selectedCategory: "all",
  });
}

describe("useTodoStore - reorder", () => {
  beforeEach(resetStore);

  it("reorderTodos changes the order of todos", () => {
    useTodoStore.getState().addTodo("first");
    useTodoStore.getState().addTodo("second");
    useTodoStore.getState().addTodo("third");

    const todos = useTodoStore.getState().todos;
    expect(todos.map((t) => t.text)).toEqual(["first", "second", "third"]);

    const reordered = [todos[2], todos[0], todos[1]];
    useTodoStore.getState().reorderTodos(reordered);

    const result = useTodoStore.getState().todos;
    expect(result.map((t) => t.text)).toEqual(["third", "first", "second"]);
  });

  it("reorderTodos preserves completed todos at original positions", () => {
    useTodoStore.getState().addTodo("active1");
    useTodoStore.getState().addTodo("active2");
    useTodoStore.getState().addTodo("active3");

    const todos = useTodoStore.getState().todos;
    useTodoStore.getState().toggleComplete(todos[1].id);

    const activeTodos = useTodoStore
      .getState()
      .todos.filter((t) => !t.completed);
    const reordered = [activeTodos[1], activeTodos[0]];
    useTodoStore.getState().reorderTodos(reordered);

    const result = useTodoStore.getState().todos.filter((t) => !t.completed);
    expect(result.map((t) => t.text)).toEqual(["active3", "active1"]);
  });

  it("reorderTodos does not affect completed todos", () => {
    useTodoStore.getState().addTodo("a");
    useTodoStore.getState().addTodo("b");

    const todos = useTodoStore.getState().todos;
    useTodoStore.getState().toggleComplete(todos[0].id);

    const completedBefore = useTodoStore
      .getState()
      .todos.filter((t) => t.completed);

    const activeTodos = useTodoStore
      .getState()
      .todos.filter((t) => !t.completed);
    useTodoStore.getState().reorderTodos(activeTodos);

    const completedAfter = useTodoStore
      .getState()
      .todos.filter((t) => t.completed);
    expect(completedAfter).toEqual(completedBefore);
  });
});

describe("useTodoStore - category", () => {
  beforeEach(resetStore);

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
