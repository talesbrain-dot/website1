-- Run this once in your Supabase project's SQL Editor
-- (Dashboard -> SQL Editor -> New query -> paste -> Run).

create table if not exists submissions (
  id bigint generated always as identity primary key,
  type varchar(20) not null,              -- 'enquiry' | 'contact'
  user_id uuid references auth.users(id) on delete set null,
  name varchar(200) not null,
  phone varchar(40),
  email varchar(200),
  category varchar(120),
  quantity varchar(80),
  deadline varchar(80),
  message text,
  status varchar(20) not null default 'new',  -- 'new' | 'contacted' | 'closed'
  created_at timestamptz not null default now()
);

create index if not exists submissions_user_id_idx on submissions (user_id);

-- If you already ran an earlier version of this file (before user_id
-- existed), this adds the column without touching your existing data.
-- Safe to run again — it's a no-op if the column is already there.
alter table submissions add column if not exists user_id uuid references auth.users(id) on delete set null;

create index if not exists submissions_created_at_idx on submissions (created_at desc);
create index if not exists submissions_status_idx on submissions (status);

-- Lock the table down: Row Level Security is on, and no policies are
-- defined, so it's unreachable from the public/anon key. All access goes
-- through the server-side service role key used in the app's API routes,
-- which bypasses RLS by design.
alter table submissions enable row level security;

-- Tiny table the keep-alive cron writes to, so Supabase sees real
-- database activity every few days and never auto-pauses the project.
create table if not exists keep_alive (
  id bigint generated always as identity primary key,
  pinged_at timestamptz not null default now()
);
alter table keep_alive enable row level security;
