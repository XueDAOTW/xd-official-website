# Deployment Documentation

> Deployment and environment setup for XueDAO Official Website

## Environment Setup

### Required Environment Variables

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Authentication
ADMIN_EMAILS=admin1@example.com,admin2@example.com

# Email Service (Resend)
RESEND_API_KEY=your_resend_api_key
FROM_EMAIL=noreply@yourdomain.com
ADMIN_EMAIL=admin@yourdomain.com

# Application URLs
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

### Local Development

```bash
# Install dependencies
bun install

# Start development server
bun run dev

# Build for production
bun run build

# Start production server
bun run start
```

## Vercel Deployment

### Automatic Deployment
- Connected to GitHub repository
- Automatic deployments on push to main branch
- Preview deployments for pull requests

### Configuration
- **Framework**: Next.js
- **Build Command**: `bun run build`
- **Output Directory**: `.next`
- **Install Command**: `bun install`

### Environment Variables Setup
Add all required environment variables in Vercel dashboard under Project Settings → Environment Variables.

## Database Setup (Supabase)

### Tables Structure
- **applications**: User application submissions
- **jobs**: Job postings
- **admin_settings**: Application configuration

### Row Level Security (RLS)
- Enabled on all tables
- Service role key bypasses RLS for admin operations
- User context preserved for audit trails

### Required Policies
```sql
-- Applications table
CREATE POLICY "Public can insert applications" ON applications FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view all applications" ON applications FOR SELECT USING (auth.email() IN (SELECT unnest(string_to_array(current_setting('app.admin_emails'), ','))));

-- Jobs table  
CREATE POLICY "Public can view approved jobs" ON jobs FOR SELECT USING (status = 'approved');
CREATE POLICY "Admins can manage all jobs" ON jobs FOR ALL USING (auth.email() IN (SELECT unnest(string_to_array(current_setting('app.admin_emails'), ','))));
```

## Email Configuration (Resend)

### Setup Steps
1. Create Resend account
2. Verify domain
3. Generate API key
4. Configure environment variables

### Email Templates
Located in `lib/email/templates/`:
- Application confirmation
- Admin notifications
- Status updates

## Performance Monitoring

### Bundle Analysis
```bash
# Analyze bundle size
bun run analyze
```

### Performance Metrics
- Core Web Vitals monitoring
- Database query optimization
- Cache hit rates

## Security Considerations

### Authentication
- Google OAuth integration
- Admin access controlled by email whitelist
- Session management via Supabase Auth

### Data Protection
- Input validation with Zod schemas
- SQL injection prevention via Supabase
- Rate limiting on public endpoints

## Backup and Recovery

### Database Backups
- Automatic daily backups via Supabase
- Point-in-time recovery available
- Manual backup triggers available

### File Storage
- Static assets served via Vercel CDN
- No persistent file storage requirements

## Monitoring and Alerting

### Application Monitoring
- Vercel Analytics for performance
- Custom logging for errors
- Health check endpoints

### Error Tracking
- Console error monitoring
- API error logging
- Email notification failures

## Related Documentation

- **[Architecture](./ARCHITECTURE.md)** - System design overview
- **[API Documentation](./API.md)** - API endpoints and schemas  
- **[CLAUDE.md](../CLAUDE.md)** - Development workflow