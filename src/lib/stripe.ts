import Stripe from 'stripe'

// Server-side Stripe client
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-07-30.basil',
  typescript: true,
})

// Client-side Stripe (for checkout)
export const getStripe = () => {
  const stripePromise = import('@stripe/stripe-js').then(({ loadStripe }) =>
    loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
  )
  return stripePromise
}

// Stripe webhook types
export type StripeWebhookEvent = {
  id: string
  object: string
  api_version: string
  created: number
  data: {
    object: any
  }
  livemode: boolean
  pending_webhooks: number
  request: {
    id: string | null
    idempotency_key: string | null
  }
  type: string
}

// Payment intent types
export type CreatePaymentIntentData = {
  amount: number // in cents
  currency: string
  metadata?: Record<string, string>
  customer?: string
  description?: string
}

// Subscription types
export type CreateSubscriptionData = {
  customerId: string
  priceId: string
  metadata?: Record<string, string>
}

// Deposit types
export type CreateDepositData = {
  amount: number // in cents
  appointmentId: string
  ownerId: string
  orgId: string
  description?: string
}
