# Database setup for Kamboj Press website

I'm setting up the database for my website, which is built on Next.js and
Supabase (Postgres). I need to run one SQL script in the Supabase SQL
Editor to create all the required tables, storage bucket, security
policies, and real-time settings.

Below is the complete SQL script. Please help me understand it if needed,
or confirm it's safe to run — I'm going to paste this exact script into
my Supabase project's **SQL Editor** (Dashboard → SQL Editor → New query),
then click **Run**.

It's written to be safe to run more than once (nothing gets duplicated or
overwritten if I run it again later).

```sql
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

-- ---------------------------------------------------------------------
-- Live chat — one thread per logged-in customer, messages flow both ways.
-- Customers read/write via the anon client directly (real-time, governed
-- by the RLS policies below); the admin panel goes through the
-- service-role key in API routes, which bypasses RLS entirely.
-- ---------------------------------------------------------------------
create table if not exists chat_threads (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  customer_name text,
  customer_email text,
  status varchar(20) not null default 'open', -- 'open' | 'closed'
  unread_by_admin boolean not null default true,
  unread_by_customer boolean not null default false,
  last_message_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists chat_messages (
  id bigint generated always as identity primary key,
  thread_id bigint not null references chat_threads(id) on delete cascade,
  sender varchar(20) not null, -- 'customer' | 'admin' | 'system'
  body text not null,
  created_at timestamptz not null default now()
);

create index if not exists chat_threads_user_id_idx on chat_threads (user_id);
create index if not exists chat_messages_thread_id_idx on chat_messages (thread_id, created_at);

-- Single-row table of chat settings, editable from the admin panel:
-- an automatic welcome message sent the moment a customer starts a new
-- chat, and a separate away/auto-reply message you can turn on any time
-- (e.g. outside business hours) so customers never message into silence.
create table if not exists chat_settings (
  id boolean primary key default true, -- always exactly one row
  welcome_enabled boolean not null default true,
  welcome_message text not null default 'Thanks for reaching out! We''ll reply as soon as we can — usually within a few hours during business hours (10am–8pm).',
  auto_reply_enabled boolean not null default false,
  auto_reply_message text not null default 'We''re away right now, but we''ve got your message and will reply soon.',
  constraint chat_settings_singleton check (id)
);
insert into chat_settings (id) values (true) on conflict (id) do nothing;

alter table chat_threads enable row level security;
alter table chat_messages enable row level security;
alter table chat_settings enable row level security;

drop policy if exists "Customers manage their own thread" on chat_threads;
create policy "Customers manage their own thread"
on chat_threads for select
to authenticated
using (user_id = auth.uid());

drop policy if exists "Customers create their own thread" on chat_threads;
create policy "Customers create their own thread"
on chat_threads for insert
to authenticated
with check (user_id = auth.uid());

drop policy if exists "Customers can mark their thread read" on chat_threads;
create policy "Customers can mark their thread read"
on chat_threads for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists "Customers read their own messages" on chat_messages;
create policy "Customers read their own messages"
on chat_messages for select
to authenticated
using (
  exists (select 1 from chat_threads t where t.id = thread_id and t.user_id = auth.uid())
);

drop policy if exists "Customers send messages to their own thread" on chat_messages;
create policy "Customers send messages to their own thread"
on chat_messages for insert
to authenticated
with check (
  sender = 'customer'
  and exists (select 1 from chat_threads t where t.id = thread_id and t.user_id = auth.uid())
);

-- Realtime: make sure chat_messages changes are broadcast to subscribed
-- clients (the customer's open chat widget). Skipped if already enabled.
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and tablename = 'chat_messages'
  ) then
    alter publication supabase_realtime add table chat_messages;
  end if;
end $$;
```

## What this creates

| Table | Purpose |
|---|---|
| `submissions` | Every enquiry and contact-form message from the website |
| `keep_alive` | A tiny table a scheduled job writes to, so the free Supabase project never auto-pauses from inactivity |
| `chat_threads` | One row per customer's chat conversation |
| `chat_messages` | Every message inside a chat conversation |
| `chat_settings` | The welcome message and away auto-reply text shown in the admin panel |

Plus a private Storage bucket called `artwork` (for design files customers
upload with an enquiry), and the security rules that keep each customer's
data — chats, uploaded files — visible only to that customer and to the
site's admin panel.

## After running this

1. Confirm it ran with no errors (Supabase shows a success message).
2. No other manual setup is needed in Supabase for these tables — the
   website's own code handles everything else.
3. If anything changes about these tables in the future, I'll get an
   updated version of this same script to run again — it's always safe to
   re-run the whole thing.
