# OAuth Setup Guide for Pet Grooming CRM

## 🚨 Quick Fix for "Unsupported provider" Error

If you're seeing the error `"Unsupported provider: provider is not enabled"`, follow these steps:

### 1. Configure Supabase OAuth Providers

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Authentication** → **Providers**
4. Enable **Google** provider
5. Add your Google OAuth Client ID and Secret

### 2. Set Environment Variables

Create a `.env.local` file in your project root with:

```env
NEXT_PUBLIC_SUPABASE_URL=your_actual_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_actual_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_actual_supabase_service_role_key
```

### 3. Alternative: Disable OAuth Temporarily

If you want to use email-only signup for now, the Google OAuth button will automatically be hidden when Google isn't configured.

---

## Prerequisites

- A Supabase project (for authentication)
- Google Cloud Console account (for Google OAuth)

## 1. Supabase Configuration

### Step 1: Create a Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Note down your project URL and anon key

### Step 2: Configure Authentication Settings
1. In your Supabase dashboard, go to **Authentication** → **Settings**
2. Set your site URL to: `http://localhost:3000` (for development)
3. Add redirect URLs:
   - `http://localhost:3000/auth/callback`
   - `https://yourdomain.com/auth/callback` (for production)

## 2. Google OAuth Setup

### Step 1: Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the Google+ API

### Step 2: Create OAuth 2.0 Credentials
1. Go to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **OAuth 2.0 Client IDs**
3. Choose **Web application**
4. Add authorized redirect URIs:
   - `https://your-project.supabase.co/auth/v1/callback`
5. Copy the **Client ID**

### Step 3: Configure in Supabase
1. In Supabase dashboard, go to **Authentication** → **Providers**
2. Enable **Google**
3. Enter your Google Client ID and Client Secret
4. Save the configuration

## 3. Apple OAuth Setup

### Step 1: Create Apple Developer Account
1. Go to [Apple Developer](https://developer.apple.com/)
2. Sign in with your Apple ID
3. Enroll in the Apple Developer Program ($99/year)

### Step 2: Create App ID
1. Go to **Certificates, Identifiers & Profiles**
2. Click **Identifiers** → **+**
3. Select **App IDs** → **App**
4. Fill in the details:
   - Description: "Pet Grooming CRM"
   - Bundle ID: `com.yourcompany.petgroomingcrm`
5. Enable **Sign In with Apple**
6. Save the App ID

### Step 3: Create Service ID
1. Go to **Identifiers** → **+**
2. Select **Services IDs** → **Services**
3. Fill in the details:
   - Description: "Pet Grooming CRM Web"
   - Identifier: `com.yourcompany.petgroomingcrm.web`
4. Enable **Sign In with Apple**
5. Configure domains:
   - Primary App ID: Select your App ID
   - Domains and Subdomains: `yourdomain.com`
   - Return URLs: `https://your-project.supabase.co/auth/v1/callback`

### Step 4: Create Key
1. Go to **Keys** → **+**
2. Select **Sign In with Apple**
3. Configure the key:
   - Key Name: "Pet Grooming CRM Web"
   - Primary App ID: Select your App ID
4. Download the key file (.p8)
5. Note the Key ID

### Step 5: Configure in Supabase
1. In Supabase dashboard, go to **Authentication** → **Providers**
2. Enable **Apple**
3. Enter the following details:
   - Client ID: Your Service ID (e.g., `com.yourcompany.petgroomingcrm.web`)
   - Client Secret: Generate using your key (see below)
   - Key ID: From step 4
   - Team ID: Your Apple Developer Team ID
   - Private Key: Content of your .p8 file

### Step 6: Generate Apple Client Secret
Use this Node.js script to generate your Apple client secret:

```javascript
const jwt = require('jsonwebtoken');
const fs = require('fs');

const privateKey = fs.readFileSync('path/to/your/AuthKey_XXXXXXXXXX.p8');
const teamId = 'YOUR_TEAM_ID';
const clientId = 'com.yourcompany.petgroomingcrm.web';
const keyId = 'YOUR_KEY_ID';

const token = jwt.sign({}, privateKey, {
  algorithm: 'ES256',
  expiresIn: '180d',
  audience: 'https://appleid.apple.com',
  issuer: teamId,
  subject: clientId,
  keyid: keyId,
});

console.log(token);
```

## 4. Environment Variables

Create a `.env.local` file with the following variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# OAuth Configuration (optional - for additional customization)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
NEXT_PUBLIC_APPLE_CLIENT_ID=your_apple_client_id

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 5. Testing OAuth

1. Start your development server: `npm run dev`
2. Go to `http://localhost:3000/signup` or `http://localhost:3000/login`
3. Click "Continue with Google" or "Continue with Apple"
4. Complete the OAuth flow
5. You should be redirected to `/dashboard` upon successful authentication

## 6. Production Deployment

### Update Redirect URLs
1. In Supabase dashboard, add your production domain to redirect URLs
2. Update Google OAuth redirect URIs with your production domain
3. Update Apple Service ID domains with your production domain

### Environment Variables
Update your production environment variables with the correct URLs and keys.

## Troubleshooting

### Common Issues

1. **"Invalid redirect URI" error**
   - Check that your redirect URIs are correctly configured in all services
   - Ensure the domain matches exactly (including http/https)

2. **"Client ID not found" error**
   - Verify your Google/Apple client IDs are correct
   - Check that the OAuth providers are enabled in Supabase

3. **"Invalid client secret" error (Apple)**
   - Regenerate your Apple client secret
   - Ensure the key file is correctly formatted

4. **CORS errors**
   - Add your domain to Supabase CORS settings
   - Check that your domain is whitelisted in Google/Apple configurations

### Support

If you encounter issues:
1. Check the browser console for error messages
2. Verify all configuration steps were completed correctly
3. Test with a fresh browser session
4. Check Supabase logs for authentication errors
