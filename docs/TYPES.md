# Type Definitions Documentation

> Centralized TypeScript type system for XueDAO Official Website

## Overview

All type definitions have been consolidated into the `/types` directory for better organization and AI accessibility:

```
types/
├── database/          # Database schema types
├── api/              # API request/response types  
├── components/       # Component-specific types
│   ├── jobs.ts       # Job-related types
│   └── applications.ts # Application-related types
└── forms/            # Form and validation types
```

## Database Types (`/types/database/`)

Contains the complete database schema and table types:

- **Database**: Main Supabase database schema
- **Application**: Application table row/insert/update types
- **Job**: Job table row/insert/update types
- **AdminSettings**: Settings table row/insert/update types

## API Types (`/types/api/`)

Common API patterns and shared types:

- **ApiResponse<T>**: Standard API response format
- **ApiError**: Error response structure
- **StatusType**: Common status enumeration
- **Counts**: Statistics counting interface
- **PaginationOptions**: Pagination parameters

## Component Types

### Jobs (`/types/components/jobs.ts`)
- **JobItem**: Public job board display
- **AdminJobItem**: Admin job management
- **JobFilters**: Search and filtering options
- **JobCounts**: Job statistics

### Applications (`/types/components/applications.ts`)
- **ApplicationItem**: Application data structure
- **AppCounts**: Application statistics
- **ApplicationStatus**: Application status types

## Form Types (`/types/forms/`)

Form-related types and validation:

- **FormErrors**: Validation error structure
- **FormFieldProps**: Common form field properties
- **SelectOption**: Dropdown option format
- **CheckboxOption**: Checkbox group option format

## Usage in Code

Import types from the centralized location:

```typescript
// Database types
import type { Application, Job } from '@/types/database'

// API types  
import type { ApiResponse, StatusType } from '@/types/api'

// Component types
import type { JobItem, JobFilters } from '@/types/components/jobs'
import type { ApplicationItem } from '@/types/components/applications'

// Form types
import type { FormErrors, SelectOption } from '@/types/forms'
```

## Type System Architecture

**Centralized at `/types/`** - All TypeScript type definitions are stored in the root `/types/` directory, configured via `tsconfig.json` path alias:

```json
"@/types/*": ["./types/*"]
```

This approach provides:
- Single source of truth for all types
- Easy AI accessibility and code exploration
- Clear import patterns across the codebase
- Separation from implementation code in `/features/` and `/lib/`

## Related Documentation

- **[API Documentation](./API.md)** - API schemas and endpoints
- **[Architecture](./ARCHITECTURE.md)** - System architecture overview
- **[CLAUDE.md](../CLAUDE.md)** - Development workflow