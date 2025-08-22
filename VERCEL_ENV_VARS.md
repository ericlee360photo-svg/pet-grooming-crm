# 🚀 BarkBook - Vercel Environment Variables Setup

## Quick Deployment Guide

Your BarkBook project is **ready for deployment**! ✅ The build is working successfully.

### 📋 Required Environment Variables for Vercel

Copy these environment variables to your Vercel project dashboard:
**Vercel Dashboard → Your Project → Settings → Environment Variables**

---

## 🔧 **REQUIRED - Core Configuration**

### Supabase (Database & Auth)
```bash
# Get these from: https://supabase.com/dashboard/project/YOUR_PROJECT/settings/api
NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL_HERE
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY_HERE
SUPABASE_SERVICE_ROLE_KEY=YOUR_SUPABASE_SERVICE_ROLE_KEY_HERE
SUPABASE_JWT_SECRET=YOUR_SUPABASE_JWT_SECRET_HERE
```

### Database Configuration
```bash
POSTGRES_URL=YOUR_POSTGRES_URL_HERE
POSTGRES_USER=YOUR_POSTGRES_USER_HERE
POSTGRES_HOST=YOUR_POSTGRES_HOST_HERE
POSTGRES_PASSWORD=YOUR_POSTGRES_PASSWORD_HERE
POSTGRES_DATABASE=YOUR_POSTGRES_DATABASE_HERE
POSTGRES_PRISMA_URL=YOUR_POSTGRES_PRISMA_URL_HERE
POSTGRES_URL_NON_POOLING=YOUR_POSTGRES_URL_NON_POOLING_HERE
```

### App URL
```bash
# Your Vercel deployment URL (update this to your actual Vercel URL)
NEXT_PUBLIC_APP_URL=https://your-app-name.vercel.app
```

---

## 💳 **STRIPE - Payment Processing**

```bash
# Your Stripe keys (LIVE mode)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_YOUR_PUBLISHABLE_KEY_HERE
STRIPE_SECRET_KEY=sk_live_YOUR_SECRET_KEY_HERE
STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET_HERE
```

---

## 📧 **EMAIL CAPTURE - Already Working!**

```bash
# Your Google Apps Script (already configured!)
NEXT_PUBLIC_GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/1hn8Tlc46NEDYs_oVdo8dStS1IzCRLKCisjwQ7_mc3lRQNMofy5g3BvSiD/exec
```

---

## 📱 **OPTIONAL - Additional Features**

### SMS Notifications (Twilio)
```bash
TWILIO_ACCOUNT_SID=YOUR_TWILIO_ACCOUNT_SID_HERE
TWILIO_AUTH_TOKEN=YOUR_TWILIO_AUTH_TOKEN_HERE
TWILIO_PHONE_NUMBER=YOUR_TWILIO_PHONE_NUMBER_HERE
```

### Social Login (OAuth)
```bash
NEXT_PUBLIC_GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID_HERE
```

### Calendar Sync (Cronofy)
```bash
CRONOFY_CLIENT_ID=YOUR_CRONOFY_CLIENT_ID_HERE
CRONOFY_CLIENT_SECRET=YOUR_CRONOFY_CLIENT_SECRET_HERE
```

---

## 🎯 **Deployment Steps**

### 1. **Deploy to Vercel** (5 minutes)
1. Push your code to GitHub
2. Connect your GitHub repo to Vercel
3. Add the environment variables above
4. Deploy! 🚀

### 2. **Set up Supabase** (10 minutes)
1. Create project at [supabase.com](https://supabase.com)
2. Run the SQL schema from `DEPLOYMENT.md`
3. Get your API keys and add to Vercel
4. Configure authentication providers

### 3. **Test Your Deployment**
- ✅ Landing page with email capture
- ✅ CSV migration feature
- ✅ Authentication flow
- ✅ Dashboard functionality

---

## 🔥 **What's Ready to Go**

- ✅ **Landing Page**: Professional homepage with features and pricing
- ✅ **Email Capture**: Google Apps Script integration working
- ✅ **Authentication**: Supabase auth with Google OAuth
- ✅ **Dashboard**: Full CRM with appointments, clients, payments, analytics
- ✅ **Groomer Management**: Add/delete groomers with subscription limits
- ✅ **Calendar View**: Daily appointment scheduling
- ✅ **Payment Processing**: Stripe integration ready
- ✅ **SMS Notifications**: Twilio integration ready
- ✅ **Calendar Sync**: Cronofy integration ready

---

## ⚠️ **Important Security Notes**

1. **Never commit `.env.local` to Git** - it's already in `.gitignore`
2. **Use environment variables in Vercel** - don't hardcode secrets
3. **Rotate keys regularly** - especially for production
4. **Monitor usage** - Stripe, Twilio, and Cronofy have usage limits

---

## 🚀 **Ready to Deploy!**

Your BarkBook CRM is fully configured and ready for production deployment on Vercel!
