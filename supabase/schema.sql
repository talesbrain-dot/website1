-- Run this in your Supabase project's SQL Editor
-- (Dashboard -> SQL Editor -> New query -> paste -> Run).
-- Safe to re-run any time — every statement below is written to be a
-- no-op if it was already applied, so running the whole file again after
-- an update never breaks or duplicates anything.

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
  artwork_path text,                       -- path in the 'artwork' storage bucket, if a design file was attached
  status varchar(20) not null default 'new',  -- 'new' | 'contacted' | 'closed'
  created_at timestamptz not null default now()
);

-- If you ran an earlier version of this file, these add any columns that
-- didn't exist yet, without touching your existing data.
alter table submissions add column if not exists user_id uuid references auth.users(id) on delete set null;
alter table submissions add column if not exists artwork_path text;

create index if not exists submissions_user_id_idx on submissions (user_id);
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

-- ---------------------------------------------------------------------
-- Artwork uploads — customers can attach a design file with their enquiry.
-- Private bucket (not public): only the uploader and the admin panel
-- (via the service-role key, which bypasses these policies entirely) can
-- read files. Each file is stored under a path starting with the
-- uploader's own user id, e.g. "<user_id>/1699999999-logo.png".
-- ---------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit)
values ('artwork', 'artwork', false, 15728640) -- 15 MB per file
on conflict (id) do nothing;

drop policy if exists "Users can upload their own artwork" on storage.objects;
create policy "Users can upload their own artwork"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'artwork'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "Users can view their own artwork" on storage.objects;
create policy "Users can view their own artwork"
on storage.objects for select
to authenticated
using (
  bucket_id = 'artwork'
  and (storage.foldername(name))[1] = auth.uid()::text
);
