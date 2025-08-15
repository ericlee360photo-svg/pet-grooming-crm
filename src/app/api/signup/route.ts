import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { 
  createStripeCustomer, 
  createStripeSubscription, 
  getPriceId,
  STRIPE_PRICE_IDS 
} from "@/lib/stripe";
import { PRICING_PLANS, getTrialDays, type PlanTier } from "@/lib/pricing";
import { hash } from "bcryptjs";
import { z } from "zod";

const signupSchema = z.object({
  // Business info
  businessName: z.string().min(1, "Business name is required"),
  businessSlug: z.string().min(1, "Business slug is required").regex(/^[a-z0-9-]+$/, "Invalid slug format"),
  businessEmail: z.string().email().optional().or(z.literal("")),
  businessPhone: z.string().optional(),
  businessAddress: z.string().optional(),
  businessCity: z.string().optional(),
  businessState: z.string().optional(),
  businessPostal: z.string().optional(),
  businessDescription: z.string().optional(),
  
  // Owner info
  ownerName: z.string().min(1, "Owner name is required"),
  ownerEmail: z.string().email("Valid email is required"),
  ownerPassword: z.string().min(6, "Password must be at least 6 characters"),
  ownerPasswordConfirm: z.string(),
  
  // Subscription
  planTier: z.enum(["BASIC", "PRO", "GROWTH"]),
  billingCycle: z.enum(["monthly", "yearly"]),
}).refine((data) => data.ownerPassword === data.ownerPasswordConfirm, {
  message: "Passwords do not match",
  path: ["ownerPasswordConfirm"],
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = signupSchema.parse(body);

    // Check if business slug is already taken
    const existingBusiness = await prisma.business.findUnique({
      where: { slug: data.businessSlug },
    });

    if (existingBusiness) {
      return NextResponse.json(
        { error: "Business URL is already taken" },
        { status: 400 }
      );
    }

    // Check if owner email is already taken
    const existingUser = await prisma.user.findUnique({
      where: { email: data.ownerEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email is already registered" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hash(data.ownerPassword, 12);

    // Get plan configuration
    const plan = PRICING_PLANS[data.planTier as PlanTier];
    const trialDays = getTrialDays();
    const trialEnd = new Date();
    trialEnd.setDate(trialEnd.getDate() + trialDays);

    // Create Stripe customer
    const stripeCustomer = await createStripeCustomer(
      data.ownerEmail,
      data.ownerName,
      {
        businessName: data.businessName,
        businessSlug: data.businessSlug,
        planTier: data.planTier,
      }
    );

    // Create database records in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create user (business owner)
      const user = await tx.user.create({
        data: {
          email: data.ownerEmail,
          name: data.ownerName,
          password: hashedPassword,
          role: "GROOMER", // Business owner is also a groomer
          emailVerified: new Date(), // Auto-verify for now
        },
      });

      // Create business
      const business = await tx.business.create({
        data: {
          name: data.businessName,
          slug: data.businessSlug,
          email: data.businessEmail || null,
          phone: data.businessPhone || null,
          address: data.businessAddress || null,
          city: data.businessCity || null,
          state: data.businessState || null,
          postal: data.businessPostal || null,
          description: data.businessDescription || null,
          stripeCustomerId: stripeCustomer.id,
          planTier: data.planTier as any,
          subscriptionStatus: "TRIALING",
          trialEndsAt: trialEnd,
        },
      });

      // Create groomer record for the owner
      const groomer = await tx.groomer.create({
        data: {
          userId: user.id,
          businessId: business.id,
          name: data.ownerName,
          email: data.ownerEmail,
          role: "OWNER",
        },
      });

      // Create subscription record
      const subscription = await tx.subscription.create({
        data: {
          businessId: business.id,
          stripeCustomerId: stripeCustomer.id,
          status: "TRIALING",
          planTier: data.planTier as any,
          trialStart: new Date(),
          trialEnd: trialEnd,
        },
      });

      return { user, business, groomer, subscription };
    });

    // Create Stripe subscription with trial
    const priceId = getPriceId(data.planTier, data.billingCycle);
    const stripeSubscription = await createStripeSubscription(
      stripeCustomer.id,
      priceId,
      trialDays,
      {
        businessId: result.business.id,
        businessSlug: result.business.slug,
        planTier: data.planTier,
        billingCycle: data.billingCycle,
      }
    );

    // Update subscription record with Stripe subscription ID
    await prisma.subscription.update({
      where: { id: result.subscription.id },
      data: {
        stripeSubscriptionId: stripeSubscription.id,
        stripePriceId: priceId,
        currentPeriodStart: new Date(stripeSubscription.current_period_start * 1000),
        currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000),
      },
    });
    
    return NextResponse.json({
      success: true,
      businessId: result.business.id,
      businessSlug: result.business.slug,
      trialEndsAt: trialEnd.toISOString(),
      subscriptionId: stripeSubscription.id,
      message: `Account created successfully! Your ${trialDays}-day free trial has started.`,
    }, { status: 201 });

  } catch (error) {
    console.error("Signup error:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid data", details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: "Failed to create account" },
      { status: 500 }
    );
  }
}

// Get signup plans for the pricing page
export async function GET() {
  try {
    // Return available plans with current pricing
    const plans = Object.entries(PRICING_PLANS).map(([tier, config]) => ({
      tier,
      ...config,
      trialDays: getTrialDays(),
    }));

    return NextResponse.json({ plans });
  } catch (error) {
    console.error("Get plans error:", error);
    return NextResponse.json(
      { error: "Failed to fetch plans" },
      { status: 500 }
    );
  }
}
