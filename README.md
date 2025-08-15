# BarkBook - The Complete Grooming Business Platform

A comprehensive SaaS platform built with Next.js, TypeScript, and Prisma for pet grooming businesses. Create branded booking pages, manage appointments, and grow your grooming business.

## Features

✅ **Multi-Role Authentication** - Admin, Groomer, and Client accounts with NextAuth.js
✅ **Multi-Payment Gateway** - Stripe, PayPal, Apple Pay, and Cash App Pay integration
✅ **Appointment Management** - Interactive calendar with drag-and-drop scheduling
✅ **Photo Management** - Before/after photo capture with camera and upload support
✅ **Product Catalog** - Inventory management with pricing, discounts, and sales tracking
✅ **Invoice System** - Automated invoice generation and payment processing
✅ **Client Surveys** - Post-appointment feedback collection with rating system
✅ **Google Reviews** - Automated Google Business review requests for satisfied clients
✅ **Admin Dashboard** - Comprehensive analytics and business reports
✅ **Email Automation** - SMTP integration for notifications and reminders

## Tech Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS
- **Database**: SQLite with Prisma ORM
- **Authentication**: NextAuth.js with Google OAuth and credentials
- **Payments**: Stripe, PayPal, Square (Cash App), Apple Pay
- **Calendar**: FullCalendar with multi-groomer support
- **Email**: Nodemailer with SMTP
- **File Upload**: Local file system with image processing

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Set up Environment Variables**
   ```bash
   cp .env.example .env
   # Edit .env with your actual values
   ```

3. **Initialize Database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. **Run Development Server**
   ```bash
   npm run dev
   ```

5. **Open in Browser**
   ```
   http://localhost:3000
   ```

## Environment Variables

```env
# Database
DATABASE_URL="file:./dev.db"

# NextAuth.js
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# OAuth Providers
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Payment Providers
STRIPE_SECRET_KEY="sk_test_your-stripe-secret-key"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_your-stripe-publishable-key"

PAYPAL_CLIENT_ID="your-paypal-client-id"
PAYPAL_CLIENT_SECRET="your-paypal-client-secret"
NEXT_PUBLIC_PAYPAL_CLIENT_ID="your-paypal-client-id"

SQUARE_APPLICATION_ID="your-square-application-id"
SQUARE_ACCESS_TOKEN="your-square-access-token"

# Email
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your-app-password"
FROM_EMAIL="your-email@gmail.com"

# Google Business
GOOGLE_BUSINESS_LOCATION_ID="your-google-business-location-id"
```

## User Roles

### Admin
- Full system access
- View dashboard with analytics
- Manage groomers, clients, and products
- Configure system settings

### Groomer
- View assigned appointments
- Upload before/after photos
- Update appointment status
- Access client information

### Client
- Book appointments
- View pet grooming history
- Submit feedback surveys
- View before/after photos

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/signin` - Sign in with credentials
- `GET /api/auth/[...nextauth]` - NextAuth.js endpoints

### Appointments
- `GET /api/appointments` - List appointments
- `POST /api/appointments` - Create appointment
- `PUT /api/appointments` - Update appointment
- `DELETE /api/appointments` - Delete appointment

### Photos
- `GET /api/photos` - List photos
- `POST /api/photos` - Create photo record
- `POST /api/upload` - Upload image file

### Payments
- `POST /api/checkout` - Create payment session
- `POST /api/google-review` - Send Google review request

### Products
- `GET /api/products` - List products
- `POST /api/products` - Create product

### Surveys
- `POST /api/surveys` - Submit feedback survey

## Deployment

1. **Build for Production**
   ```bash
   npm run build
   ```

2. **Start Production Server**
   ```bash
   npm start
   ```

## Development

The application uses:
- TypeScript for type safety
- Prisma for database management
- Tailwind CSS for styling
- ESLint for code quality

To reset the database:
```bash
npx prisma db push --force-reset
```

To view the database:
```bash
npx prisma studio
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

---

Built with ❤️ for pet grooming businesses everywhere!

---

**BarkBook** - Where grooming businesses thrive! 🐕📚