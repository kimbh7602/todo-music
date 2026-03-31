-- Todo Music Database Schema
-- Run this in Supabase SQL Editor (https://supabase.com/dashboard → SQL Editor)

-- Todos table
create table if not exists todos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  text text not null,
  completed boolean default false,
  completed_date date,
  created_at timestamptz default now()
);

-- User stats table
create table if not exists user_stats (
  user_id uuid primary key references auth.users(id) on delete cascade,
  current_streak integer default 0,
  max_streak integer default 0,
  last_completed_date date,
  total_completed integer default 0,
  selected_category text default 'all'
);

-- Row Level Security
alter table todos enable row level security;
alter table user_stats enable row level security;

-- Policies: users can only access their own data
create policy "Users can read own todos" on todos
  for select using (auth.uid() = user_id);

create policy "Users can insert own todos" on todos
  for insert with check (auth.uid() = user_id);

create policy "Users can update own todos" on todos
  for update using (auth.uid() = user_id);

create policy "Users can delete own todos" on todos
  for delete using (auth.uid() = user_id);

create policy "Users can read own stats" on user_stats
  for select using (auth.uid() = user_id);

create policy "Users can insert own stats" on user_stats
  for insert with check (auth.uid() = user_id);

create policy "Users can update own stats" on user_stats
  for update using (auth.uid() = user_id);

-- Auto-create user_stats on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.user_stats (user_id)
  values (new.id);
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
