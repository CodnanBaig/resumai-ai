# ResumeAI Project Context

## Project Overview
ResumeAI is a Next.js web application designed to help users create professional resumes and cover letters. It uses AI-powered features to enhance content and provides customizable templates. The application includes user authentication, document creation and management (resumes and cover letters), and data persistence using a database.

## Technologies Used
- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **Database**: Prisma ORM with SQLite (development) and planned migration to MySQL (production)
- **Authentication**: JWT-based session management using `jose` and password hashing with `bcryptjs`
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/ui components
- **AI Integration**: OpenRouter API (with Gemma 3 free as default model)
- **PDF Handling**: `pdf-parse` for parsing, `@react-pdf/renderer` for generation (planned)
- **Other Libraries**: Zod (validation), TipTap (rich text editor)

## Project Structure
The project follows a standard Next.js 13+ App Router structure:
- `app/`: Contains the application routes, pages, and layout files.
- `components/`: Reusable UI components.
- `lib/`: Shared utilities (e.g., database client, authentication helpers).
- `prisma/`: Prisma schema and migrations.
- `public/`: Static assets.

## Development Setup
1.  **Environment Variables**: Create a `.env.local` file based on the example in `README.md`. You will need an `OPENROUTER_API_KEY`.
2.  **Install Dependencies**: Run `pnpm install` (as specified by `packageManager` in `package.json`).
3.  **Database Setup**: 
    - Run `pnpm prisma:generate` to generate the Prisma client.
    - Run `pnpm prisma:migrate` to apply database migrations.
    - (Optional) Run `pnpm prisma:studio` to inspect the database.
4.  **Run Development Server**: Use `pnpm dev` to start the Next.js development server.

## Building and Running
- **Development**: `pnpm dev`
- **Build**: `pnpm build`
- **Start (Production)**: `pnpm start`
- **Linting**: `pnpm lint`

## Key Features and Functionality
1.  **User Authentication**:
    - Registration (`/api/auth/register`) and Login (`/api/auth/login`) endpoints with password hashing.
    - Session management using JWT cookies (`session` cookie).
    - Middleware (`middleware.ts`) protects routes, allowing access to public paths and checking for a valid session cookie.
2.  **Data Models**:
    - **User**: Stores user information (email, name, password hash).
    - **Resume**: Stores resume data (title, template, various sections like personal info, skills, experience) linked to a user.
    - **CoverLetter**: Stores cover letter content linked to a user and optionally to a specific resume.
3.  **Core Functionality**:
    - Creating and editing resumes (`/resume/new`, `/resume/[id]/edit`).
    - Uploading existing resumes for parsing (planned/implemented).
    - Generating AI-enhanced content for resumes and cover letters (via `/api/ai/...` endpoints).
    - Creating cover letters (`/cover-letter/new`).
    - Dashboard for managing documents and viewing statistics.
4.  **APIs**:
    - Authentication APIs (`/api/auth/...`).
    - Resume CRUD APIs (`/api/resume/...`).
    - Cover Letter CRUD APIs (`/api/cover-letter/...`).
    - AI enhancement APIs (`/api/ai/...`).

## Development Conventions
- **TypeScript**: Strong typing is used throughout the project.
- **Prisma**: Database schema is defined in `prisma/schema.prisma`. Use Prisma Client for database interactions.
- **API Routes**: API endpoints are located under `app/api/`.
- **Components**: UI components are built using Tailwind CSS and Shadcn/ui.
- **Authentication**: Authentication checks are performed in API route handlers and middleware. Use `getUserFromSessionCookie` from `lib/auth.ts` to get the current user in API routes.
- **Styling**: Uses Tailwind CSS with custom classes defined in `app/globals.css`. Common responsive utility classes like `container-responsive`, `heading-mobile` are used.
