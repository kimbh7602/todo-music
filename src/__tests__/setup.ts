import { vi } from "vitest";

vi.mock("@/lib/supabase", () => ({
  supabase: {
    from: () => ({
      select: () => ({
        eq: () => ({
          order: () => Promise.resolve({ data: [], error: null }),
          single: () => Promise.resolve({ data: null, error: null }),
        }),
      }),
      insert: () => ({ then: () => {} }),
      update: () => ({
        eq: () => ({ then: () => {} }),
      }),
      delete: () => ({
        eq: () => ({ then: () => {} }),
      }),
      upsert: () => ({ then: () => {} }),
    }),
  },
}));
