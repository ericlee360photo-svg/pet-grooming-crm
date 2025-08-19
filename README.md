# BarkBook - Professional Pet Grooming CRM

A comprehensive CRM solution designed specifically for professional pet groomers. BarkBook streamlines appointment booking, client management, payment processing, and automated communications - all in one beautiful, mobile-first platform.

## 🎯 Features

### Core Functionality
- **Smart Scheduling**: Online booking with real-time availability and calendar sync
- **Client Management**: Complete pet profiles with vaccination tracking
- **Payment Processing**: Secure deposits and online payments via Stripe
- **Automated Communications**: SMS reminders and confirmations via Twilio
- **Vaccine Management**: Track vaccination records and set expiration alerts
- **Mobile-First Design**: PWA that works perfectly on any device

### Business Intelligence
- **Dashboard Analytics**: Revenue tracking, appointment metrics, and client insights
- **Resource Management**: Prevent overbooking with table/dryer/cage allocation
- **No-Show Controls**: Automated deposit policies and enforcement
- **Team Management**: Multi-location support and staff coordination

## 🏗️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful icons

### Backend & Services
- **Supabase** - Database, Auth, File Storage, Realtime
- **Stripe** - Payment processing and subscriptions
- **Twilio** - SMS messaging and communications
- **Cronofy** - Calendar synchronization

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **date-fns** - Date manipulation
- **Zod** - Schema validation
- **React Hook Form** - Form management

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account
- Stripe account
- Twilio account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/barkbook-crm.git
   cd barkbook-crm
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   
   Fill in your API keys in `.env.local`:
   ```env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

   # Stripe Configuration
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   STRIPE_SECRET_KEY=your_stripe_secret_key
   STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

   # Twilio Configuration
   TWILIO_ACCOUNT_SID=your_twilio_account_sid
   TWILIO_AUTH_TOKEN=your_twilio_auth_token
   TWILIO_PHONE_NUMBER=your_twilio_phone_number

   # Cronofy Configuration
   CRONOFY_CLIENT_ID=your_cronofy_client_id
   CRONOFY_CLIENT_SECRET=your_cronofy_client_secret

   # App Configuration
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📊 Database Schema

The application uses a comprehensive database schema designed for pet grooming businesses:

### Core Tables
- **organizations** - Business accounts and settings
- **users** - Staff members and roles
- **owners** - Pet owners/clients
- **pets** - Pet profiles and information
- **appointments** - Booking records
- **services** - Grooming services and pricing
- **vaccinations** - Vaccine tracking and expiration

### Supporting Tables
- **appointment_pets** - Multi-pet appointment support
- **deposits** - Payment and deposit tracking
- **messages** - Communication history
- **resources** - Equipment and capacity management

## 🎨 Design System

### Brand Colors
- **Primary**: `#19253d` (Dark Blue)
- **Accent**: `#ee8669` (Coral Orange)
- **Cream**: `#f8eee4` (Light Cream)

### Typography
- **Font**: Inter (Google Fonts)
- **Weights**: 400, 500, 600, 700

### Components
The design system includes reusable components:
- Buttons with multiple variants
- Cards for content organization
- Form inputs with validation
- Navigation and layout components

## 📱 PWA Features

BarkBook is built as a Progressive Web App (PWA) with:
- **Offline Support**: Core functionality works without internet
- **Installable**: Add to home screen on mobile devices
- **Push Notifications**: Real-time updates and reminders
- **Fast Loading**: Optimized for performance

## 🔧 Development

### Project Structure
```
src/
├── app/                 # Next.js App Router pages
│   ├── dashboard/       # Main dashboard
│   ├── login/          # Authentication
│   ├── signup/         # User registration
│   └── layout.tsx      # Root layout
├── components/         # Reusable UI components
│   └── ui/            # Base UI components
├── lib/               # Utility functions and configurations
│   ├── supabase.ts    # Database client
│   ├── stripe.ts      # Payment processing
│   ├── twilio.ts      # SMS messaging
│   ├── cronofy.ts     # Calendar sync
│   └── utils.ts       # Helper functions
└── types/             # TypeScript type definitions
```

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Check TypeScript types

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms
The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 📈 Business Model

### Subscription Tiers
- **Basic** ($29/month): Up to 100 clients, basic features
- **Pro** ($59/month): Unlimited clients, advanced features
- **Growth** ($99/month): Multi-location, team management

### Features by Plan
- **Basic**: Core CRM, 50 SMS/month, mobile app
- **Pro**: Everything in Basic + unlimited SMS, calendar sync, analytics
- **Growth**: Everything in Pro + multiple locations, team management, priority support

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [docs.barkbook.com](https://docs.barkbook.com)
- **Email**: support@barkbook.com
- **Discord**: [Join our community](https://discord.gg/barkbook)

## 🙏 Acknowledgments

- Built with ❤️ for the pet grooming community
- Inspired by real groomer feedback and needs
- Powered by modern web technologies

---

**BarkBook** - Making pet grooming businesses more efficient, one appointment at a time.
