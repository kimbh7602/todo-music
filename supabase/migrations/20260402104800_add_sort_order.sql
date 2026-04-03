-- Add sort_order column to todos table for drag & drop reordering
ALTER TABLE todos ADD COLUMN IF NOT EXISTS sort_order integer DEFAULT 0;

-- Backfill existing rows: assign sort_order based on created_at order per user
WITH numbered AS (
  SELECT id, ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY created_at ASC) - 1 AS rn
  FROM todos
)
UPDATE todos SET sort_order = numbered.rn FROM numbered WHERE todos.id = numbered.id;
