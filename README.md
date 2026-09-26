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
  message, filter by status or type, search, and move each one through
  clear stages: New → Quoted → Confirmed → Printing → Ready for pickup →
  Delivered (or Cancelled) — same simple one-click dropdown as before, just
  with stages that actually match how a print job moves.
- **Admin analytics** — a small panel on the admin dashboard showing which
  product categories are getting the most enquiries, so you can see demand
  at a glance without any separate reporting tool.
- **Live chat** — a chat widget on every page (bottom-left) where logged-in
  customers can message you directly and see replies appear instantly,
  no page refresh needed. The admin panel has a matching chat inbox
  (`/admin/chat`) to reply. You can configure two automatic messages from
  there: a welcome message sent the instant a new chat starts, and an
  away/auto-reply message you can toggle on when you're not actively
  answering (it only fires once per chat, before any admin has replied).
- **Instant alerts on new enquiries** — optionally get an email (and/or a
  personal WhatsApp message) the moment someone submits the enquiry or
  contact form, instead of needing to check the admin panel manually. Both
  are optional and off by default until configured — see "Alerts" below.
- **SEO basics** — a generated sitemap.xml and robots.txt, plus
  LocalBusiness structured data (name, address, phone, hours) so Google
  can show a richer result for searches like "printing press dehradun".
- **Customer accounts** (`/account`) — customers sign up / log in (email +
  password or Google) before they can submit an enquiry, and can see all
  their past enquiries and each one's status under "My Account". The
  contact page's quick message form does not require login — only the full
  enquiry form does.
- **Artwork upload** — customers can attach a design file (JPG, PNG, PDF,
  AI, EPS, PSD, CDR, SVG — up to 15MB) with their enquiry, stored privately
  in Supabase Storage. Admins get a signed download link for each file in
  the admin panel; customers see the same link under "My Account".
- **WhatsApp number required** — the enquiry form requires a WhatsApp
  number (not just any phone/email) so the team can always reach a
  customer; email stays optional as a backup contact method. The admin
  panel's phone number is a direct WhatsApp chat link.
- **Keep-alive cron** — a scheduled job pings the database twice a week so
  Supabase's free tier never auto-pauses from inactivity.

## 1. Create your Supabase project

1. Go to [supabase.com](https://supabase.com) and create a free project
   (no credit card needed).
2. Once it's created, open **SQL Editor** in the sidebar, paste the contents
   of `supabase/schema.sql` from this project, and click **Run**. This
   creates the `submissions` table, the `chat_threads` / `chat_messages` /
   `chat_settings` tables for live chat, a small `keep_alive` table, and a
   private `artwork` storage bucket for uploaded design files (with the
   access rules that let customers upload only into their own folder).
   **Already ran this before?** The file is safe to run again — re-run it
   any time this project updates `supabase/schema.sql` (for example, after
   pulling an update that adds the chat feature), so any new tables,
   columns, or the storage bucket get added without touching your existing
   data. If you ever see a database error mentioning a missing table or
   column, this is the fix — re-run this file.

   The chat widget updates live using Supabase Realtime — this file already
   enables it on the `chat_messages` table, so there's nothing extra to
   turn on. If chat replies aren't appearing instantly for some reason,
   check **Database → Replication** in the Supabase dashboard and confirm
   `chat_messages` is listed under the `supabase_realtime` publication.
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
- `NEXT_PUBLIC_SITE_URL` — your site's URL, used for SEO (see step 6). Fine
  to leave as `http://localhost:3000` for local dev.
- Alert variables (`RESEND_API_KEY`, `ADMIN_ALERT_EMAIL`,
  `WHATSAPP_ALERT_PHONE`, `WHATSAPP_ALERT_APIKEY`) are optional — see step 5.

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

## 5. Alerts on new enquiries (optional)

Without any setup here, everything still works — you just find out about
new enquiries by checking `/admin`. Either or both of these can be added:

**Email** (via [Resend](https://resend.com), free):
1. Sign up at resend.com with the email you want alerts sent to.
2. **API Keys** → create one → copy it into `RESEND_API_KEY`.
3. Set `ADMIN_ALERT_EMAIL` to that same email address. On Resend's free
   plan (no domain verified), you can only send *to* the address you
   signed up with — which is exactly what you want here.
4. Leave `RESEND_FROM_EMAIL` as the default unless you've verified your
   own domain in Resend (Domains tab) and want alerts to come from
   `you@yourdomain.com` instead.

**WhatsApp** (via [CallMeBot](https://www.callmebot.com/blog/free-api-whatsapp-messages/),
free, unofficial — sends a message to yourself, not to customers):
1. Save `+34 644 55 71 43` as a contact in the WhatsApp you want alerts on.
2. Message it exactly: `I allow callmebot to send me messages`
3. It replies with an API key. Set `WHATSAPP_ALERT_PHONE` (your number with
   country code, no `+` or spaces — e.g. `917300760078`) and
   `WHATSAPP_ALERT_APIKEY` to that key.

Add whichever of these you set up to Vercel's environment variables too,
then redeploy.

## 6. SEO

Set `NEXT_PUBLIC_SITE_URL` (in `.env.local` and in Vercel) to your real
site URL, e.g. `https://kambojpress.vercel.app` or your custom domain once
you have one. This is used to:
- Generate `/sitemap.xml` (every page, including each individual product page)
- Generate `/robots.txt` (allows the public site, blocks `/admin`, `/account`, `/api`)
- Fill in the LocalBusiness structured data Google uses for rich results

No further setup needed — both files are generated automatically from
`app/sitemap.js` and `app/robots.js`. Once live, you can submit the
sitemap URL in [Google Search Console](https://search.google.com/search-console)
to speed up indexing.

## 7. Deploy to Vercel

1. Push this project to a GitHub repo and import it into Vercel (or run
   `vercel` from this folder).
2. In **Project → Settings → Environment Variables**, add all the
   variables from your `.env.local` (`ADMIN_PASSWORD`,
   `ADMIN_SESSION_SECRET`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`,
   `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
   `CRON_SECRET`, `NEXT_PUBLIC_SITE_URL`, and the alert variables from
   step 5 if you set those up).
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

## 8. Images

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
