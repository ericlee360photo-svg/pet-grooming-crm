# BarkBook Deployment Guide

## Prerequisites for Deployment

### 1. Vercel Project Setup
- [ ] Connect your GitHub repo to Vercel
- [ ] Configure build settings (already configured in `next.config.ts`)
- [ ] Set up custom domain (optional)

### 2. Supabase Setup
- [ ] Create Supabase project at https://supabase.com
- [ ] Set up database tables (see schema below)
- [ ] Configure authentication providers
- [ ] Get API keys and connection strings

### 3. Environment Variables Required

#### Supabase Configuration
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

#### Optional Services (for full functionality)
```
# Stripe (for payments)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...

# Twilio (for SMS)
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=+1234567890

# Google Apps Script (for email capture)
NEXT_PUBLIC_GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec

# App Configuration
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

## Database Schema (Supabase SQL)

Run these SQL commands in your Supabase SQL editor:

### 1. Organizations Table
```sql
CREATE TABLE organizations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  time_zone TEXT DEFAULT 'America/New_York',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 2. Users Table
```sql
CREATE TABLE users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  org_id UUID REFERENCES organizations(id) NOT NULL,
  role TEXT CHECK (role IN ('owner', 'manager', 'staff', 'admin')) DEFAULT 'owner',
  email TEXT,
  phone TEXT,
  name TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 3. Owners (Clients) Table
```sql
CREATE TABLE owners (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id UUID REFERENCES organizations(id) NOT NULL,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  address JSONB,
  notes TEXT,
  risk_level INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 4. Pets Table
```sql
CREATE TABLE pets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id UUID REFERENCES organizations(id) NOT NULL,
  owner_id UUID REFERENCES owners(id) NOT NULL,
  name TEXT NOT NULL,
  species TEXT DEFAULT 'dog',
  breed TEXT,
  weight_kg DECIMAL,
  coat_type TEXT,
  sex TEXT,
  birthdate DATE,
  behavior_flags TEXT[],
  notes TEXT,
  photo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 5. Services Table
```sql
CREATE TABLE services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id UUID REFERENCES organizations(id) NOT NULL,
  name TEXT NOT NULL,
  base_price_cents INTEGER NOT NULL,
  base_minutes INTEGER NOT NULL,
  active BOOLEAN DEFAULT true
);
```

### 6. Appointments Table
```sql
CREATE TABLE appointments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id UUID REFERENCES organizations(id) NOT NULL,
  owner_id UUID REFERENCES owners(id),
  start_at TIMESTAMP WITH TIME ZONE NOT NULL,
  end_at TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT CHECK (status IN ('draft', 'scheduled', 'in_progress', 'completed', 'cancelled', 'no_show')) DEFAULT 'scheduled',
  location JSONB,
  notes TEXT,
  created_by UUID REFERENCES users(id)
);
```

### 7. Enable Row Level Security (RLS)
```sql
-- Enable RLS on all tables
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE owners ENABLE ROW LEVEL SECURITY;
ALTER TABLE pets ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Create basic policies (you may want to customize these)
CREATE POLICY "Users can access their own org data" ON organizations
  FOR ALL USING (id IN (
    SELECT org_id FROM users WHERE id = auth.uid()
  ));

CREATE POLICY "Users can access their own data" ON users
  FOR ALL USING (id = auth.uid() OR org_id IN (
    SELECT org_id FROM users WHERE id = auth.uid()
  ));
```

## Deployment Steps

### 1. Vercel Deployment
1. Push your code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### 2. Post-Deployment Setup
1. Set up Supabase authentication providers
2. Configure redirect URLs in Supabase auth settings
3. Test the migration feature with sample CSV data
4. Set up monitoring and error tracking

## Common Issues & Solutions

### Build Errors
- **Missing env vars**: Make sure all required environment variables are set in Vercel
- **Supabase connection**: Verify your Supabase URL and keys are correct
- **TypeScript errors**: Run `npm run build` locally first to catch issues

### Runtime Errors
- **Auth issues**: Check Supabase auth configuration and redirect URLs
- **CORS errors**: Verify your domain is added to Supabase allowed origins
- **API failures**: Check server logs in Vercel for detailed error messages

## Testing the Deployment

### 1. Basic Functionality
- [ ] Landing page loads correctly
- [ ] Email signup works (if Google Apps Script is configured)
- [ ] Navigation works

### 2. Dashboard Access
- [ ] Authentication flow works
- [ ] Dashboard loads after login
- [ ] CSV migration feature accessible

### 3. Migration Feature
- [ ] CSV upload works
- [ ] Data preview displays correctly
- [ ] Import creates records in Supabase

## Optional Enhancements

1. **Custom Domain**: Set up a custom domain in Vercel
2. **SSL Certificate**: Automatic with Vercel
3. **Analytics**: Add Google Analytics or Vercel Analytics
4. **Error Monitoring**: Set up Sentry or similar service
5. **Email Service**: Configure transactional emails
6. **Backup Strategy**: Set up database backups

## Support

If you encounter issues during deployment:
1. Check Vercel build logs
2. Check Supabase logs
3. Verify all environment variables are set correctly
4. Test locally with production environment variables
