import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-07-30.basil',
});

// Stripe Price IDs for different plans (you'll need to create these in your Stripe dashboard)
const STRIPE_PRICE_IDS = {
  BASIC: {
    monthly: process.env.STRIPE_PRICE_BASIC_MONTHLY || 'price_basic_monthly',
    yearly: process.env.STRIPE_PRICE_BASIC_YEARLY || 'price_basic_yearly',
  },
  PRO: {
    monthly: process.env.STRIPE_PRICE_PRO_MONTHLY || 'price_pro_monthly',
    yearly: process.env.STRIPE_PRICE_PRO_YEARLY || 'price_pro_yearly',
  },
  GROWTH: {
    monthly: process.env.STRIPE_PRICE_GROWTH_MONTHLY || 'price_growth_monthly',
    yearly: process.env.STRIPE_PRICE_GROWTH_YEARLY || 'price_growth_yearly',
  },
} as const;

export { stripe, STRIPE_PRICE_IDS };

export async function createStripeCustomer(email: string, name?: string, metadata?: Record<string, string>) {
  return await stripe.customers.create({
    email,
    name,
    metadata: metadata || {},
  });
}

export async function createStripeSubscription(
  customerId: string,
  priceId: string,
  trialPeriodDays?: number,
  metadata?: Record<string, string>
) {
  return await stripe.subscriptions.create({
    customer: customerId,
    items: [{ price: priceId }],
    trial_period_days: trialPeriodDays,
    metadata: metadata || {},
    payment_behavior: "default_incomplete",
    payment_settings: { save_default_payment_method: "on_subscription" },
    expand: ["latest_invoice.payment_intent"],
  });
}

export async function cancelStripeSubscription(subscriptionId: string, immediately = false) {
  return await stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: !immediately,
    ...(immediately && { cancel_at: Math.floor(Date.now() / 1000) }),
  });
}

export async function updateStripeSubscription(
  subscriptionId: string,
  newPriceId: string,
  prorationBehavior: 'create_prorations' | 'none' = 'create_prorations'
) {
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  
  return await stripe.subscriptions.update(subscriptionId, {
    items: [
      {
        id: subscription.items.data[0].id,
        price: newPriceId,
      },
    ],
    proration_behavior: prorationBehavior,
  });
}

export async function getStripeSubscription(subscriptionId: string) {
  return await stripe.subscriptions.retrieve(subscriptionId, {
    expand: ['customer', 'latest_invoice', 'latest_invoice.payment_intent'],
  });
}

export async function getStripeCustomer(customerId: string) {
  return await stripe.customers.retrieve(customerId);
}

export async function createStripeCheckoutSession(
  customerId: string,
  priceId: string,
  successUrl: string,
  cancelUrl: string,
  metadata?: Record<string, string>
) {
  return await stripe.checkout.sessions.create({
    customer: customerId,
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: metadata || {},
    allow_promotion_codes: true,
    billing_address_collection: 'required',
  });
}

export async function createStripePortalSession(
  customerId: string,
  returnUrl: string
) {
  return await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });
}

export async function getStripeInvoice(invoiceId: string) {
  return await stripe.invoices.retrieve(invoiceId);
}

export async function listStripeInvoices(customerId: string, limit = 10) {
  return await stripe.invoices.list({
    customer: customerId,
    limit,
  });
}

// Helper function to get price ID based on plan and billing cycle
export function getPriceId(planTier: string, billingCycle: 'monthly' | 'yearly'): string {
  const plan = STRIPE_PRICE_IDS[planTier as keyof typeof STRIPE_PRICE_IDS];
  if (!plan) {
    throw new Error(`Invalid plan tier: ${planTier}`);
  }
  return plan[billingCycle];
}

// Helper function to format Stripe amount to cents
export function formatAmountForStripe(amount: number): number {
  return Math.round(amount * 100);
}

// Helper function to format Stripe amount from cents
export function formatAmountFromStripe(amount: number): number {
  return amount / 100;
}

// Webhook event types for subscription management
export const WEBHOOK_EVENTS = {
  CUSTOMER_SUBSCRIPTION_CREATED: 'customer.subscription.created',
  CUSTOMER_SUBSCRIPTION_UPDATED: 'customer.subscription.updated',
  CUSTOMER_SUBSCRIPTION_DELETED: 'customer.subscription.deleted',
  INVOICE_PAYMENT_SUCCEEDED: 'invoice.payment_succeeded',
  INVOICE_PAYMENT_FAILED: 'invoice.payment_failed',
  CUSTOMER_SUBSCRIPTION_TRIAL_WILL_END: 'customer.subscription.trial_will_end',
} as const;
