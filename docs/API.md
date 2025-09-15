# API Documentation

> Complete API reference for XueDAO Official Website

## API Structure Overview

The API is organized into three main categories with clear authentication boundaries:

### Authentication Routes (`/api/auth/`)
- **Purpose**: OAuth and session management
- **Authentication**: Public/OAuth flow
- **Routes**:
  - `POST /api/auth/signin` - Google OAuth initialization
  - `GET /api/auth/callback` - OAuth callback handler  
  - `POST /api/auth/signout` - Session termination
  - `GET /api/auth/check-admin` - Admin status verification

### Public Routes (`/api/` and `/api/public/`)
- **Purpose**: Public-facing functionality
- **Authentication**: None required
- **Routes**:
  - `GET /api/jobs` - Public job listings
  - `POST /api/applications` - Application submission
  - `POST /api/public/applications` - Alternative application endpoint
  - `GET /api/public/settings` - Public settings

### Admin Routes (`/api/admin/`)
- **Purpose**: Administrative functions
- **Authentication**: Admin email verification required
- **Routes**:
  - `GET /api/admin/check` - Admin authentication verification
  - `GET /api/admin/jobs` - Admin job management
  - `PATCH /api/admin/jobs` - Job status updates
  - `DELETE /api/admin/jobs` - Job deletion
  - `GET /api/admin/applications` - Application review
  - `PATCH /api/applications/[id]` - Application status updates
  - `GET/POST/PUT /api/admin/settings` - Settings management

## Authentication Patterns

### Admin Authorization
```typescript
const adminEmails = process.env.ADMIN_EMAILS?.split(',') || []
const isAdmin = adminEmails.includes(user.email || '')
```

### Database Access Strategy
- **Service Role Client**: Public submissions and admin operations (bypasses RLS)
- **User Client**: Authenticated user operations (with RLS)
- **Dual Client Pattern**: Public endpoints use service role, admin endpoints verify auth then use service role

## Response Formats

### Success Response
```typescript
{
  data: T,
  meta?: {
    total: number,
    page?: number,
    limit?: number
  }
}
```

### Error Response
```typescript
{
  error: {
    message: string,
    code?: string,
    details?: any
  }
}
```

## Error Handling

### HTTP Status Codes
- **200**: Success
- **201**: Created (for POST operations)
- **400**: Bad Request (validation errors)
- **401**: Unauthorized (authentication required)
- **403**: Forbidden (admin access required)
- **404**: Not Found
- **409**: Conflict (duplicate data)
- **500**: Internal Server Error

### Graceful Email Failures
Operations continue even if email notifications fail, with errors logged for debugging.

## Security Features

### Input Validation
- Zod schemas for runtime validation
- SQL injection prevention via parameterized queries
- XSS protection through input sanitization

### Rate Limiting
Implemented at Vercel level for abuse prevention.

### Content Security Policy
Configured headers for YouTube embeds and external resources.

## Related Documentation

- **[Type Definitions](./TYPES.md)** - Request/response type schemas
- **[Architecture](./ARCHITECTURE.md)** - System design patterns
- **[CLAUDE.md](../CLAUDE.md)** - Development commands and setup