# Unsolved

Unsolved is a polished MVP for discovering unresolved SaaS problems from public customer signals. It implements the first product slice from `plan.docx`: discovery feed, problem detail analysis, founder dashboard, B2B report preview, admin pipeline view, mock API routes, seed data, and AI-generated homepage imagery.

## Stack

- Next.js App Router, TypeScript, Tailwind CSS
- shadcn/ui with Radix primitives and Geist typography
- lucide-react icons, motion animations, Recharts visualizations
- Seed/mock data for the first MVP phase

## Commands

```bash
npm run dev
npm run lint
npm run build
```

## Routes

- `/` - animated landing page
- `/explora` - Discovery Feed
- `/explore` - Discovery Feed alias
- `/problems/[slug]` - problem detail, evidence, Pain Score, validation
- `/dashboard` - founder watchlist
- `/reports` - B2B weekly report preview
- `/login` - email/password sign in
- `/register` - account creation
- `/admin` - pipeline and scoring controls

## Mock APIs

- `GET /api/ingest` - fetches and normalizes live public signals
- `GET /api/auth/me` - current session user
- `POST /api/auth/login`
- `POST /api/auth/register`
- `POST /api/auth/logout`
- `GET /api/problems?q=&sector=&sort=` - live public data with seed fallback
- `GET /api/problems/[id]`
- `POST /api/problems/[id]/analysis` - on-demand Turkish AI analysis and solution suggestions
- `POST /api/problems/[id]/validate`
- `GET /api/reports/weekly`

## Live ingestion

The Explore feed now pulls real public data server-side from:

- Reddit public listing/search JSON for `r/SaaS`, `r/startups`, and `r/ProductManagement`
- Apple iTunes/App Store customer review RSS JSON for configured app IDs

Live source fetches are cached for 15 minutes and fall back to the seed dataset if every provider fails. Optional environment variables:

- `REDDIT_USER_AGENT`
- `APPLE_RSS_COUNTRY`

## Turkish problem analysis

Problem detail pages include an on-demand `Analiz Et` button. It calls BytePlus Ark only when the user asks for analysis, then returns a compact Turkish summary, pain drivers, solution ideas, MVP steps, and risks. Required environment variables:

- `BYTEPLUS_ARK_API_KEY`
- `BYTEPLUS_ARK_API_URL` (defaults to the BytePlus Ark chat completions endpoint)
- `BYTEPLUS_ARK_MODEL` (defaults to `deepseek-v3-2-251201`)

Live auth, payment, Supabase, Pinecone, OAuth-based Reddit API access, and FastAPI LLM pipeline are intentionally left as integration boundaries for the next phase.

## Supabase + Prisma auth

Fill `.env` with the required Supabase and auth values, then run:

```bash
npm run db:generate
npm run db:push
```

Use the Supabase transaction pooler URL for `DATABASE_URL` on Vercel and the direct Supabase URL for `DIRECT_URL` when running migrations locally.
