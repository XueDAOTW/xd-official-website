# Architecture Documentation

> System design and architectural decisions for XueDAO Official Website

## High-Level Architecture

### Tech Stack Summary
- **Framework**: Next.js 15 with App Router
- **Runtime**: Node.js with Bun package manager  
- **Database**: Supabase (PostgreSQL) with Row Level Security
- **Authentication**: Supabase Auth with Google OAuth
- **UI**: Radix UI + shadcn/ui + Tailwind CSS
- **State Management**: Zustand + TanStack Query
- **Email**: Resend service
- **Deployment**: Vercel

### Project Structure Pattern

```
xd-official-website/
├── app/                    # Next.js App Router
│   ├── (public)/          # Public pages (no auth)
│   ├── (admin)/           # Admin pages (auth required)  
│   ├── api/               # API routes
│   ├── components/        # Page-specific components
│   └── layout.tsx         # Root layout
├── components/            # Reusable UI components
├── lib/                   # Business logic & utilities
│   ├── repositories/      # Data access layer
│   ├── supabase/         # Database clients
│   ├── types/            # Type definitions
│   └── ...
├── features/             # Feature-based organization
└── docs/                 # This documentation
```

## Key Architectural Decisions

### 1. Feature-Based Organization
- Components organized by feature rather than technical type
- Clear separation between public and admin functionality
- Reusable UI components in shared `components/` directory

### 2. Database Access Patterns
- **Repository Pattern**: Data access abstracted through repository classes
- **Dual Client Strategy**: 
  - Service role for public/admin operations (bypasses RLS)
  - User client for authenticated operations (with RLS)
- **Connection Pooling**: Optimized database connections

### 3. Authentication Architecture
- **Google OAuth**: Single sign-on for admin users
- **Email-based Authorization**: Admin access controlled via environment variables
- **Page-level Protection**: Auth moved from middleware to page level for Vercel Edge compatibility

### 4. State Management Strategy
- **Zustand**: Client-side state (UI state, form state)
- **TanStack Query**: Server state (API data, caching)
- **React Hook Form + Zod**: Form state and validation

### 5. Performance Optimizations
- **LRU Cache**: Memory-efficient caching for frequently accessed data
- **Connection Pooling**: Database connection optimization
- **Static Generation**: Where possible for public pages
- **Bundle Analysis**: Regular bundle size monitoring

## Component Architecture

### UI Component Hierarchy
```
App Layout
├── Navigation (Navbar)
├── Page Components
│   ├── Public Pages
│   │   ├── Home (sections: About, Events, News, Partnership)
│   │   ├── Job Board
│   │   └── Application Form
│   └── Admin Pages
│       ├── Dashboard
│       ├── Applications Management
│       ├── Jobs Management
│       └── Settings
└── Shared UI Components (shadcn/ui)
```

### Data Flow Patterns
1. **Public Submissions**: Form → Validation → Repository → Email Service
2. **Admin Operations**: Auth Check → Repository → Database → Cache Update
3. **Real-time Updates**: TanStack Query + Optimistic Updates

## Security Architecture

### Row Level Security (RLS)
- Enforced at database level in Supabase
- Service role bypasses RLS for necessary operations
- User context preserved for audit trails

### Input Validation
- **Zod Schemas**: Runtime type validation
- **Sanitization**: Input cleaning before database operations
- **Rate Limiting**: Protection against abuse

### Environment Security
- **Admin Emails**: Controlled via environment variables
- **API Keys**: Secure handling of Supabase and Resend keys
- **CORS**: Properly configured for production

## Deployment Architecture

### Vercel Deployment
- **Edge Runtime**: Optimized for performance
- **Environment Variables**: Secure configuration management
- **Preview Deployments**: Branch-based testing

### Database Architecture
- **Supabase Cloud**: Managed PostgreSQL
- **Automatic Backups**: Built-in backup and recovery
- **Connection Pooling**: Built-in connection management

## Related Documentation

- **[API Documentation](../api/)** - Endpoint specifications
- **[Type Definitions](../types/)** - TypeScript schemas  
- **[Deployment Guide](../deployment/)** - Setup and deployment
- **[CLAUDE.md](../../CLAUDE.md)** - Development workflow