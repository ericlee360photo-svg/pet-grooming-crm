export const PRICING_PLANS = {
  BASIC: {
    name: "Basic",
    description: "Perfect for solo groomers just getting started",
    priceMonthly: 1999, // $19.99 in cents
    priceYearly: 19990, // $199.90 in cents (2 months free)
    maxGroomers: 1,
    maxClients: 50,
    maxAppointmentsPerMonth: 100,
    features: [
      "1 groomer account",
      "Up to 50 clients",
      "Basic booking calendar",
      "Email notifications",
      "Standard support",
      "Client photo gallery",
      "Basic reporting"
    ],
    popular: false,
  },
  PRO: {
    name: "Pro",
    description: "For growing grooming businesses with multiple staff",
    priceMonthly: 4900, // $49.00 in cents
    priceYearly: 49000, // $490.00 in cents (2 months free)
    maxGroomers: 3,
    maxClients: 200,
    maxAppointmentsPerMonth: 500,
    features: [
      "Up to 3 groomers",
      "Up to 200 clients",
      "Advanced scheduling",
      "SMS & email notifications",
      "Photo gallery with before/after",
      "Basic analytics",
      "Priority support",
      "Client surveys",
      "Invoice management"
    ],
    popular: true,
  },
  GROWTH: {
    name: "Growth",
    description: "For busy shops ready to scale up",
    priceMonthly: 9900, // $99.00 in cents
    priceYearly: 99000, // $990.00 in cents (2 months free)
    maxGroomers: 10,
    maxClients: -1, // unlimited
    maxAppointmentsPerMonth: -1, // unlimited
    features: [
      "Up to 10 groomers",
      "Unlimited clients",
      "Multi-location support",
      "Advanced analytics",
      "Custom branding",
      "API access",
      "Dedicated support",
      "Advanced reporting",
      "Product sales tracking",
      "Google Reviews integration"
    ],
    popular: false,
  },
} as const;

export type PlanTier = keyof typeof PRICING_PLANS;

export function getPlanConfig(tier: PlanTier) {
  return PRICING_PLANS[tier];
}

export function formatPrice(priceInCents: number): string {
  return `$${(priceInCents / 100).toFixed(0)}`;
}

export function calculateYearlySavings(tier: PlanTier): number {
  const plan = PRICING_PLANS[tier];
  const monthlyTotal = plan.priceMonthly * 12;
  const yearlyPrice = plan.priceYearly;
  return monthlyTotal - yearlyPrice;
}

export function getTrialDays(): number {
  return 14; // 14-day free trial
}

// Usage limit checking functions
export function canAddGroomer(currentCount: number, tier: PlanTier): boolean {
  const plan = PRICING_PLANS[tier];
  if (plan.maxGroomers === -1) return true; // unlimited
  return currentCount < plan.maxGroomers;
}

export function canAddClient(currentCount: number, tier: PlanTier): boolean {
  const plan = PRICING_PLANS[tier];
  if (plan.maxClients === -1) return true; // unlimited
  return currentCount < plan.maxClients;
}

export function canBookAppointment(currentCount: number, tier: PlanTier): boolean {
  const plan = PRICING_PLANS[tier];
  if (plan.maxAppointmentsPerMonth === -1) return true; // unlimited
  return currentCount < plan.maxAppointmentsPerMonth;
}
