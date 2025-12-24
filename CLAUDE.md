# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with this repository.

> 🔗 **Generated with [Claude Code](https://claude.ai/code)**
>
> This documentation is maintained to provide comprehensive guidance for development workflows and architecture understanding.

## Development Commands

- **Development server**: `bun run dev` (starts on http://localhost:3000)
- **Build**: `bun run build` (or `npm run build`)
- **Production server**: `bun run start` (or `npm run start`)
- **Linting**: `bun run lint` (or `npm run lint`)
- **Type checking**: `bun run typecheck`
- **Format code**: `bun run format`

Note: This project uses Bun as the primary package manager, but npm commands work as well.

## Documentation Structure

For comprehensive project information, see the organized documentation:

- **[API Reference](./docs/API.md)** - Complete API documentation
- **[Architecture Guide](./docs/ARCHITECTURE.md)** - System design and patterns
- **[Type System](./docs/TYPES.md)** - TypeScript type definitions
- **[Deployment Guide](./docs/DEPLOYMENT.md)** - Setup and deployment

All types are now centralized in `/types/` directory for better AI accessibility.

## Architecture Overview

This is a lightweight Next.js 15 application for XueDAO, a student-run DAO website. The project is optimized for simplicity and performance without test infrastructure.

### Tech Stack
- **Framework**: Next.js 15 with App Router
- **Runtime**: Node.js with Bun package manager
- **UI Library**: Radix UI components with shadcn/ui system
- **Styling**: Tailwind CSS with custom gradient themes
- **Database**: Supabase (PostgreSQL) with Row Level Security
- **Authentication**: Supabase Auth with Google OAuth
- **Forms**: React Hook Form with Zod validation
- **Animations**: Framer Motion for smooth transitions
- **Email**: Resend service with HTML templates
- **State Management**: Zustand for client state
- **Data Fetching**: TanStack Query for server state
- **Internationalization**: Custom bilingual support (Chinese/English)

### Project Structure (Feature-First Architecture)

```
xd-official-website/
├── app/                          # Next.js App Router (thin - routing only)
│   ├── (public)/                 # Public pages (no auth required)
│   │   ├── job/page.tsx         # Job board → imports from features/jobs
│   │   ├── submit-job/page.tsx  # Job submission → imports from features/jobs
│   │   └── apply/page.tsx       # Application → imports from features/applications
│   ├── (admin)/                  # Admin-only pages (auth required)
│   │   └── admin/               # Admin dashboard → imports from features/admin
│   ├── api/                      # API routes
│   │   ├── auth/                 # Authentication endpoints
│   │   ├── admin/                # Admin-only endpoints
│   │   ├── applications/         # Application management
│   │   ├── jobs/                 # Job management
│   │   └── public/               # Public endpoints
│   ├── events/                   # Event pages → imports from features/events
│   │   ├── xuedao-workshop-2025/
│   │   └── connect-hackathon-2024/
│   ├── layout.tsx               # Root layout with providers
│   └── page.tsx                 # Homepage → imports from features/homepage
├── features/                     # Domain-driven feature modules
│   ├── admin/                   # Admin dashboard feature
│   │   ├── components/          # Admin UI components
│   │   │   ├── applications/    # Application management components
│   │   │   ├── jobs/            # Job management components
│   │   │   └── settings/        # Settings components
│   │   ├── hooks/               # Admin-specific hooks
│   │   ├── constants/           # Admin configuration
│   │   ├── utils/               # Admin utilities
│   │   └── index.ts             # Barrel exports
│   ├── applications/            # Application form feature
│   │   ├── components/          # Form components
│   │   ├── hooks/               # Form hooks
│   │   └── index.ts
│   ├── jobs/                    # Job board feature
│   │   ├── components/          # Job UI components
│   │   ├── hooks/               # Job hooks
│   │   └── index.ts
│   ├── events/                  # Events feature
│   │   ├── components/          # Event components
│   │   ├── hooks/               # Event hooks
│   │   └── index.ts
│   └── homepage/                # Homepage feature
│       ├── components/          # Homepage sections
│       │   └── latestNews/      # News subcomponents
│       └── index.ts
├── components/                   # Shared UI components
│   ├── navbar.tsx               # Global navigation
│   └── ui/                      # shadcn/ui design system
├── lib/                         # Cross-cutting concerns
│   ├── auth/                    # Authentication logic
│   ├── contexts/                # React contexts
│   ├── email/                   # Email service
│   ├── query/                   # TanStack Query setup
│   ├── repositories/            # Data access layer
│   ├── security/                # Security utilities
│   ├── stores/                  # Zustand stores
│   ├── supabase/                # Supabase client setup
│   ├── translations/            # i18n content
│   ├── utils/                   # Utility functions
│   └── validations/             # Zod schemas
├── types/                       # Centralized TypeScript definitions
│   ├── api/                     # API request/response types
│   ├── components/              # Component-specific types
│   ├── database/                # Database schema types
│   └── forms/                   # Form and validation types
└── docs/                        # Documentation
    ├── API.md                   # API reference
    ├── ARCHITECTURE.md          # System design
    ├── TYPES.md                 # Type documentation
    └── DEPLOYMENT.md            # Setup guide
```

### Feature Organization Guidelines

**When to use `features/`:**
- Domain-specific components, hooks, and utilities
- Business logic tied to a specific feature
- Components only used within that feature

**When to use `lib/`:**
- Cross-cutting concerns (auth, email, database)
- Utilities used across multiple features
- Infrastructure code (repositories, security)

**When to use `components/ui/`:**
- Design system primitives
- Reusable UI components used globally

**Import Patterns:**
```typescript
// Components from features
import { JobList, JobCard } from '@/features/jobs'

// Hooks from features (import directly to avoid SSR issues)
import { useJobs } from '@/features/jobs/hooks'

// Shared UI components
import { Button, Card } from '@/components/ui'

// Cross-cutting utilities
import { useToast } from '@/lib/contexts/ToastContext'
```

## API Architecture

The API is organized into three main categories:

### Authentication Routes (`/api/auth/`)
- **`/signin`** - Google OAuth initialization
- **`/callback`** - OAuth callback handler
- **`/signout`** - Session termination

### Public Routes (`/api/public/` and `/api/`)
- **`/api/applications`** (POST) - Public application submission
- **`/api/jobs`** (GET) - Public job listings
- **`/api/public/applications`** - Public application endpoint

### Admin Routes (`/api/admin/`)
Protected by admin email verification:
- **`/check`** - Admin authentication verification
- **`/jobs`** - Admin job management (GET, PATCH, DELETE)
- **`/settings`** - Admin settings management
- **`/applications`** - Admin application review (GET)
- **`/applications/[id]`** - Individual application management

### API Patterns

#### Authentication Middleware
```typescript
// Admin routes use email-based authorization
const adminEmails = process.env.ADMIN_EMAILS?.split(',') || []
const isAdmin = adminEmails.includes(user.email || '')
```

#### Database Access Patterns
- **Service Role Client**: Used for public submissions and admin operations to bypass RLS
- **User Client**: Used for authenticated user operations with RLS
- **Dual Client Strategy**: Public endpoints use service role, admin endpoints verify auth then use service role

#### Error Handling
- Consistent error responses with appropriate HTTP status codes
- Detailed logging for debugging while exposing minimal error details to clients
- Graceful email failure handling (operations continue if emails fail)

## Key Features

### 1. Job Board System
- Public job viewing and submission
- Admin job approval workflow
- Status management (pending/approved/rejected)
- Email notifications for status changes

### 2. Application System
- Bilingual application forms (Chinese/English)
- Comprehensive validation with Zod
- Duplicate detection by email/telegram/personal info
- Automated email confirmations with admin notifications

### 3. Admin Dashboard
- Secure admin-only access via Google OAuth
- Application and job management interfaces
- Real-time statistics and filtering
- Bulk operations support

### 4. Internationalization
- Context-based language switching
- Translation objects in `lib/translations/`
- Dynamic content loading for Chinese and English

### 5. Email System
- Centralized service in `lib/email/service.ts`
- HTML template system with variable substitution
- Admin notifications with CC support
- Resend integration for reliable delivery

### 6. Event Management System
- Dedicated event pages with rich multimedia content
- YouTube video integration for workshop recordings
- Event history and past events showcase
- Responsive design with animation support

## Development Guidelines

### Code Organization
- Feature-based organization over technical grouping
- Consistent naming conventions across components and utilities
- Clean separation between public and admin functionality
- Type-safe database operations with Zod validation

### Security Considerations
- Row Level Security (RLS) enforced in Supabase
- Admin access controlled by environment variable email list
- Service role key used securely for necessary operations
- Input validation on all API endpoints

### Performance Optimizations
- Static generation where possible
- Optimized bundle analysis with `bun run analyze`
- Efficient database queries with proper indexing
- Client-side caching with TanStack Query

### Deployment
- Lightweight build without test infrastructure
- Environment-based configuration
- Vercel-optimized with Next.js 15 features
- CDN optimization for static assets
- CSP (Content Security Policy) configured for YouTube embeds
- Middleware optimized for Vercel Edge Runtime

---

*This documentation is maintained by Claude Code to ensure consistent development practices and comprehensive project understanding.*