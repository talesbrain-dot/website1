# Kamboj Press — website

A Next.js site with a working backend: enquiry and contact forms save to
Supabase (Postgres), and a password-protected admin panel lets you view and
manage every submission. A scheduled ping keeps the free Supabase project
from auto-pausing.

## What's included

- **Pages**: Home, Services (full catalogue — 80+ products across 8
  categories, expanded with product types from Printers Club India and
  Printo), About, Portfolio, Contact, Enquiry.
- **Enquiry & contact forms** — validated client + server side, saved to
  Supabase.
- **Admin panel** (`/admin`) — password-protected. View every enquiry/contact
  message, filter by status or type, search, mark items as
  new / contacted / closed.
- **Customer accounts** (`/account`) — customers sign up / log in (Supabase
  Auth) before they can submit an enquiry, and can see all their past
  enquiries and each one's status under "My Account". The contact page's
  quick message form does not require login — only the full enquiry form
  does.
- **Keep-alive cron** — a scheduled job pings the database twice a week so
  Supabase's free tier never auto-pauses from inactivity.

## 1. Create your Supabase project

1. Go to [supabase.com](https://supabase.com) and create a free project
   (no credit card needed).
2. Once it's created, open **SQL Editor** in the sidebar, paste the contents
   of `supabase/schema.sql` from this project, and click **Run**. This
   creates the `submissions` table and a small `keep_alive` table, once.
3. Go to **Project Settings → API**. You'll need three values from here:
   - **Project URL** → used for both `SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_URL`
   - **service_role key** (not the `anon` key) → `SUPABASE_SERVICE_ROLE_KEY`
   - **anon / public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Keep the service_role key secret — it has full database access. It's only
ever used inside server-side API routes in this project, never sent to the
browser. The anon key is different — it's *meant* to be public and is what
powers customer login/signup in the browser.

4. Customer sign-up sends a confirmation email by default. For local testing
   this is extra friction — you can turn it off in **Authentication →
   Providers → Email → "Confirm email"** (toggle off) so new accounts can log
   in immediately. Turn it back on before going live if you want verified
   emails.

## 2. Local setup

```bash
npm install
cp .env.example .env.local
```

Fill in `.env.local`:

- `ADMIN_PASSWORD` — the password you'll use to log into `/admin`.
- `ADMIN_SESSION_SECRET` — any long random string (`openssl rand -hex 32`).
- `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` — from step 1.
- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` — from step 1 (powers customer login).
- `CRON_SECRET` — any long random string; protects the keep-alive endpoint.

```bash
npm run dev
```

Visit `http://localhost:3000`.

## 3. Google login (optional but recommended)

The login page has a "Continue with Google" button already built. To make
it work, you need to enable Google as a provider in Supabase — a few steps,
one-time setup:

1. **Google Cloud Console** → [console.cloud.google.com](https://console.cloud.google.com) →
   create a project (or use an existing one) → **APIs & Services →
   Credentials → Create Credentials → OAuth client ID**.
   - Application type: **Web application**
   - Under **Authorized redirect URIs**, add:
     `https://<your-project-ref>.supabase.co/auth/v1/callback`
     (find your exact project ref in the Supabase dashboard URL, or under
     Project Settings → API)
   - Save — you'll get a **Client ID** and **Client Secret**.

2. **Supabase dashboard** → **Authentication → Providers → Google** →
   toggle it on → paste the **Client ID** and **Client Secret** from step 1
   → Save.

3. That's it — no code changes or env vars needed on your end for this
   part, it's all configured inside Supabase. Once both steps above are
   saved, the "Continue with Google" button on `/account/login` will work
   immediately (next deploy isn't even required, since it's a Supabase-side
   setting, not an env var).

4. For production, also add your live domain (e.g. `https://kambojpress.com`)
   under Google Cloud Console → your OAuth client → **Authorized JavaScript
   origins**, so Google doesn't block the redirect from your real domain.

## 4. Admin login

Go to `yoursite.com/admin/login` (also linked at the bottom of every page
footer as "Staff login") and sign in with `ADMIN_PASSWORD`.

To change the password later, update `ADMIN_PASSWORD` in Vercel and
redeploy — no code changes needed.

## 5. Deploy to Vercel

1. Push this project to a GitHub repo and import it into Vercel (or run
   `vercel` from this folder).
2. In **Project → Settings → Environment Variables**, add all the
   variables from your `.env.local` (`ADMIN_PASSWORD`,
   `ADMIN_SESSION_SECRET`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`,
   `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
   `CRON_SECRET`).
3. Redeploy.

The Cron job in `vercel.json` is picked up automatically on deploy — no
extra setup needed. It runs at 3am UTC every Sunday and Wednesday, hitting
`/api/cron/keep-alive`, which writes and prunes a row in the `keep_alive`
table. That counts as real database activity, so Supabase's 7-day
inactivity pause never triggers as long as the site stays deployed on
Vercel. (Vercel's own free Hobby plan cron jobs run reliably at most once a
day per schedule, which is why this uses two fixed weekdays rather than a
tighter interval — well under the 7-day window either way.)

If you ever move off Vercel, you'd need another way to trigger that same
endpoint on a schedule (a free service like cron-job.org works fine — just
point it at `https://yoursite.com/api/cron/keep-alive` with an
`Authorization: Bearer <CRON_SECRET>` header).

## 6. Images

The current build uses a designed color/shape motif instead of photos, since
no product photography was provided. To add real photos:

- Business/product photos → drop them in `public/assets/` and reference them
  in `lib/content.js` and the portfolio/services pages.
- Logo → replace the "K" mark in `components/Header.jsx` and
  `components/Footer.jsx` with an `<Image>` of your actual logo file placed
  in `public/`.

## Project structure

```
app/
  (site)/            Public pages — home, services, about, portfolio, contact, enquiry
  admin/              Admin login + dashboard (password protected)
  api/                Form submission, admin, and cron API routes
components/           Header, Footer, forms
lib/                  content.js (catalogue/copy), db.js (Supabase queries),
                       supabaseClient.js, auth.js (admin sessions)
middleware.js          Protects /admin and its API routes
supabase/schema.sql     Run once in the Supabase SQL Editor
vercel.json             Keep-alive cron schedule
```
