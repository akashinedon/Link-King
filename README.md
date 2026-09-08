# MiniLink

A Linktree-style bio-link page: claim a username, add your links, customize the
look, and share a single URL. Built with Next.js 14 (App Router), Clerk auth,
Prisma/Postgres, and Cloudinary for image uploads.

## Features

- **Custom profile page** at `minilink.app/<username>` with 6 built-in themes
  and a live desktop/mobile preview while editing.
- **Drag-and-drop link management** (add, edit, hide, delete, reorder) via
  `@dnd-kit`, with auto-detected platform icons when you paste a known URL
  (Instagram, GitHub, YouTube, etc.).
- **Featured links** - pin one link with a highlighted, gradient-bordered style.
- **Scheduled links** - optionally set a start/end date so a link auto-shows
  or auto-hides (e.g. a limited-time promo).
- **Analytics dashboard** - views, clicks, CTR, and per-link performance over
  a selectable 7/30/90-day range, plus device, top-traffic-source, and
  top-country breakdowns built from the same click/view data already
  collected.
- **QR code** for your profile URL, generated client-side and downloadable
  as a PNG (Settings page).
- **Dynamic Open Graph images** - every profile gets an auto-generated social
  share card (avatar, name, bio) via `next/og`, no manual image needed.
- **Native share button** on the public profile (Web Share API with a
  copy-link fallback).
- **`sitemap.xml` / `robots.txt`** so public profiles are discoverable.

## Tech stack

- [Next.js 14](https://nextjs.org/) (App Router) + TypeScript
- [Clerk](https://clerk.com/) for authentication
- [Prisma](https://www.prisma.io/) + PostgreSQL
- [Cloudinary](https://cloudinary.com/) for avatar/icon uploads
- [Tailwind CSS](https://tailwindcss.com/), [Recharts](https://recharts.org/),
  [@dnd-kit](https://dndkit.com/), [Zod](https://zod.dev/) for validation
- [Vitest](https://vitest.dev/) for unit tests

## Getting started

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Configure environment variables** - create `.env` with:

   ```bash
   # Postgres (e.g. from Supabase/Neon/Railway)
   DATABASE_URL="postgresql://..."
   DIRECT_URL="postgresql://..."       # non-pooled connection, used by `prisma migrate`

   # Clerk (https://dashboard.clerk.com)
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_..."
   CLERK_SECRET_KEY="sk_..."

   # Cloudinary (https://cloudinary.com/console)
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="..."
   # An unsigned upload preset named `minilink_preset` must exist in your
   # Cloudinary dashboard (Settings -> Upload -> Upload presets).

   # Public base URL - used for canonical links, the sitemap, and OG images
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   ```

3. **Set up the database**

   ```bash
   npm run db:generate   # generate the Prisma client
   npm run db:push       # push the schema to your database
   ```

4. **Run the dev server**

   ```bash
   npm run dev
   ```

## Scripts

| Command             | Description                          |
| -------------------- | ------------------------------------- |
| `npm run dev`         | Start the dev server                  |
| `npm run build`       | Production build (`prisma generate && next build` on Vercel) |
| `npm run start`       | Start the production server           |
| `npm run lint`        | Lint with `next lint`                 |
| `npm test`            | Run the Vitest unit test suite        |
| `npm run db:studio`   | Open Prisma Studio                    |

## Project structure

```
src/
  app/
    (auth)/                 # sign-in / sign-up
    (dashboard)/dashboard/  # links, appearance, analytics, settings
    [username]/             # public profile page + OG image
    api/                    # links, click/view tracking, profile
  components/
    dashboard/               # dashboard-only UI (charts, icon picker, QR code)
    public-profile/           # profile page UI (link list, share button)
  lib/                        # prisma client, validation, rate limiting,
                               # geo/device/referrer parsing, platform detection
prisma/schema.prisma          # User / Link / Click / PageView models
```

## Notes on production hardening

- All API input is validated with Zod (`src/lib/validations.ts`); link URLs
  are restricted to `http(s)` to prevent stored `javascript:`-scheme links.
- The public click-tracking and page-view endpoints are rate-limited per IP
  (`src/lib/rate-limit.ts`). It's an in-memory limiter, which is fine for a
  single instance but resets on cold start and isn't shared across
  concurrent serverless instances - swap in Upstash/Redis if you need
  accurate limits under real multi-instance load.
- Country/device/referrer analytics are derived from data already recorded
  on `Click`/`PageView` (Vercel's `x-vercel-ip-country` header and the
  stored `User-Agent`/`Referer`), so no new tracking endpoints were added.
