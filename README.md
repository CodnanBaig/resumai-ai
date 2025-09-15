# ResumeAI

> This project is a work in progress. Features and APIs may change.

A Next.js 15 application to build, enhance, and export resumes and cover letters. It features:

- AI-powered resume enhancement and keyword integration via OpenRouter
- Cover letter generation tailored to a job description
- Modern editable resume templates with rich text editing
- PDF generation for resumes and cover letters (pdf-lib and Playwright rendering)
- Email/password auth with stateless JWT sessions
- SQLite (dev) via Prisma; optional production schema for MySQL

## Tech Stack

- Next.js App Router, React 19, TypeScript
- UI: TailwindCSS + Radix UI
- Database: Prisma + SQLite (dev). Optional MySQL schema for production
- Auth: JWT (via `jose` + `bcryptjs`)
- AI: OpenRouter models (free defaults provided)
- PDF: `pdf-lib` and Playwright-based renderers

## Quick Start

```bash
# Install deps (pnpm)
pnpm install

# Setup database (dev - SQLite)
pnpm prisma:generate
pnpm prisma:migrate

# Run dev server
pnpm dev
```

Open `http://localhost:3000`.

## Environment Variables

Create `.env.local` at the repo root:

```bash
# Required for auth
JWT_SECRET=replace-with-a-strong-random-secret

# OpenRouter (AI)
OPENROUTER_API_KEY=your-openrouter-key
# Default model if unspecified by endpoints
OPENROUTER_MODEL=google/gemma-3-27b-it:free

# Public site URL used in OpenRouter headers and internal links
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Optional: Explicit base URL for internal parsing logic
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

Notes:
- `JWT_SECRET` is mandatory for auth; without it, login/register will fail.
- AI routes gracefully fallback or return errors if `OPENROUTER_API_KEY` is missing.

## Scripts

```bash
pnpm dev                # Start Next.js in dev
pnpm build              # Generate Prisma client, build Next.js
pnpm start              # Start production server (after build)
pnpm lint               # Lint

pnpm prisma:generate    # Generate Prisma client
pnpm prisma:migrate     # Run dev migration (SQLite)
pnpm prisma:deploy      # Deploy migrations (prod)
pnpm prisma:studio      # Prisma Studio

pnpm vercel-build       # Build for Vercel (no-engine generate + next build)
```

## Database

- Dev uses SQLite at `prisma/dev.db` with schema in `prisma/schema.prisma`.
- For production MySQL (e.g., PlanetScale), see `prisma/schema.production.prisma` and set `DATABASE_URL`.

Models:
- `User`: email, passwordHash; relations to `Resume` and `CoverLetter`
- `Resume`: stores template and JSON-like string fields for sections
- `CoverLetter`: linked optionally to a resume

## Authentication

- Email/password auth using `bcryptjs` for hashing and stateless JWT session cookies.
- Session cookie `session` is httpOnly and secure in production.
- Key helpers in `lib/auth.ts`.

## AI Features

- Endpoints under `app/api/ai/`:
  - `enhance-resume`: content tailoring and keyword-focused improvements
  - `integrate-keywords`: integrates selected keywords with placement tracking
  - `models`: lists recommended OpenRouter models
- Uses `OPENROUTER_API_KEY`, `OPENROUTER_MODEL`, and `NEXT_PUBLIC_SITE_URL` for headers.

## PDF Generation

- Resumes: `lib/pdf/resume-pdf-playwright.ts` and `lib/pdf/resume-pdf-lib.ts`
- Cover letters: `lib/pdf/cover-letter-pdf-playwright.ts`
- API routes: `app/api/resume/generate-pdf/route.ts`, `app/api/cover-letter/generate-pdf/route.ts`
- Playwright is included in dependencies. If running in CI or a fresh environment, ensure Playwright browsers are installed (e.g., `npx playwright install --with-deps`).

## Project Structure

- `app/`: App Router pages and API routes
- `components/`: UI components, editors, templates
- `lib/`: auth, db, utils, PDF, parsing
- `prisma/`: schema(s), migrations, and dev database

## Development Tips

- Package manager: pnpm (`packageManager` pinned in `package.json`).
- After pulling schema changes or on fresh install, run `pnpm prisma:generate`.
- If migrations are added, run `pnpm prisma:migrate` for dev.
- AI routes require authentication; ensure you are logged in before calling AI actions in the UI.

## Troubleshooting

- Missing JWT secret: server throws "JWT_SECRET not set" → add `JWT_SECRET` to `.env.local`.
- OpenRouter issues: missing key or non-200 responses will either error or fallback depending on route.
- Playwright errors: install browsers (`npx playwright install`) and ensure necessary system deps.
- Database errors: ensure `prisma/dev.db` exists or run `pnpm prisma:migrate`.

## Deployment

- Vercel: `pnpm vercel-build` used by Vercel build
- Production DB: switch to MySQL using `prisma/schema.production.prisma` and set `DATABASE_URL` before `pnpm prisma:deploy`

---

MIT License. PRs welcome.
