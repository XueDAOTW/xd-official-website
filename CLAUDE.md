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

### Project Structure

```
xd-official-website/
├── app/                          # Next.js App Router
│   ├── (public)/                 # Public pages (no auth required)
│   │   ├── job/                  # Job board viewing
│   │   └── submit-job/           # Job submission form
│   ├── (admin)/                  # Admin-only pages (auth required)
│   │   └── admin/                # Admin dashboard
│   ├── api/                      # API routes
│   │   ├── auth/                 # Authentication endpoints
│   │   ├── admin/                # Admin-only endpoints
│   │   ├── applications/         # Application management
│   │   ├── jobs/                 # Job management
│   │   └── public/               # Public endpoints
│   ├── components/               # Page-specific components
│   │   ├── about.tsx            # About section
│   │   ├── events.tsx           # Events showcase
│   │   ├── hackathon.tsx        # Hackathon information
│   │   ├── latestNews.tsx       # News and updates
│   │   ├── logo.tsx             # XueDAO branding
│   │   └── partnership.tsx      # Partnership display
│   ├── layout.tsx               # Root layout with providers
│   └── page.tsx                 # Homepage
├── components/                   # Reusable UI components
│   ├── navbar.tsx               # Navigation component
│   └── ui/                      # shadcn/ui components
├── lib/                         # Utilities and services
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
├── docs/                        # Comprehensive documentation
│   ├── API.md                   # API reference
│   ├── ARCHITECTURE.md          # System design
│   ├── TYPES.md                 # Type documentation
│   └── DEPLOYMENT.md            # Setup guide
└── middleware.ts                # Next.js middleware for auth
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

---

*This documentation is maintained by Claude Code to ensure consistent development practices and comprehensive project understanding.*