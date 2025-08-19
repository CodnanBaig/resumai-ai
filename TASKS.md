# Project Tasks

Tracks database integration and authentication replacement.

## Completed
- Initialize Prisma and add schema: `User`, `Resume`, `CoverLetter`
- Add Prisma client singleton `lib/db.ts`
- Add JWT auth utils `lib/auth.ts` (bcrypt + jose)
- Add middleware for protected routes `middleware.ts`
- Replace mock auth endpoints with DB-backed:
  - `POST /api/auth/register`
  - `POST /api/auth/login`
  - `POST /api/auth/logout`
  - `GET  /api/auth/check`
- Replace mock resume endpoints:
  - `POST /api/resume/create` -> persists to DB
  - `POST /api/resume/upload` -> creates DB record
- Replace dashboard data with DB queries:
  - `GET /api/dashboard/stats`
  - `GET /api/dashboard/documents`
- Tailwind v3 configured and compiling
- Add list & CRUD APIs:
  - `GET /api/resume` (paginated)
  - `GET/PUT/DELETE /api/resume/[id]`
  - `GET /api/cover-letter` (paginated)
  - `GET/DELETE /api/cover-letter/[id]`
  - `PUT /api/cover-letter?id=...`
  - AI enhancement optionally persists into resume when `resumeId` provided

## In Progress
- Switch to MySQL locally (Docker) and for production
- Migrations and DB provisioning
- Wire AI endpoints to use stored resumes when applicable

## TODO
- Create `.env.local` and `.env.production` with MySQL URLs
- Data backups and migration strategy from local to live
- Add `Activity` model for recent actions
- Implement update endpoints for resumes and cover letters
- Real PDF generation using react-pdf or Puppeteer
- Secure file parsing and mapping uploaded content to fields
- Add refresh token/short-lived JWT strategy
- Role-based access (future)
- Tests: unit, API, E2E
- Deployment configuration and secrets management


