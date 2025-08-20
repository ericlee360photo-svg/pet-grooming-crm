# BarkBook Landing Page

A simple, elegant landing page for BarkBook - the complete CRM solution for professional pet groomers.

## Features

- **Clean Design**: Modern, responsive landing page with BarkBook branding
- **Email Capture**: Simple email signup form for early access requests
- **Legal Pages**: Complete Terms of Service, Privacy Policy, and Refund Policy
- **Mobile Responsive**: Works perfectly on all devices
- **Fast Performance**: Built with Next.js 15 and optimized for speed

## Tech Stack

- **Framework**: Next.js 15.4.7
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Deployment**: Ready for Vercel, Netlify, or any static hosting

## Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd barkbook-landing
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
barkbook-landing/
├── src/
│   └── app/
│       ├── page.tsx              # Main landing page
│       ├── terms/
│       │   └── page.tsx          # Terms of Service
│       ├── privacy/
│       │   └── page.tsx          # Privacy Policy
│       └── refund/
│           └── page.tsx          # Refund Policy
├── public/
│   └── favicon.svg              # BarkBook logo
└── tailwind.config.ts           # Tailwind configuration
```

## Customization

### Colors
The project uses a custom color palette defined in `tailwind.config.ts`:
- **Primary**: Orange/brown tones for main branding
- **Accent**: Blue tones for highlights and CTAs
- **Cream**: Warm background colors

### Content
- Update the main heading and description in `src/app/page.tsx`
- Modify legal content in the respective policy pages
- Change contact information in the footer

### Email Integration
Currently, the email form simulates submission. To integrate with a real email service:
1. Add your email service (Mailchimp, ConvertKit, etc.)
2. Update the `handleSubmit` function in `src/app/page.tsx`
3. Add environment variables for API keys

## Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically

### Netlify
1. Build the project: `npm run build`
2. Upload the `out` directory to Netlify

### Static Hosting
1. Build the project: `npm run build`
2. Upload the `out` directory to your hosting provider

## Legal Compliance

The landing page includes:
- **Terms of Service**: Comprehensive terms for the service
- **Privacy Policy**: GDPR-compliant privacy policy
- **Refund Policy**: Clear refund terms for subscriptions

All legal documents are Stripe-compliant and ready for production use.

## Support

For questions or support, contact:
- Email: hello@barkbook.app
- Website: [barkbook.app](https://barkbook.app)

---

Built with ❤️ for pet groomers everywhere.
