import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { 
  updateStripeSubscription, 
  cancelStripeSubscription, 
  createStripePortalSession,
  getPriceId 
} from "@/lib/stripe";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find the business associated with the user
    const groomer = await prisma.groomer.findUnique({
      where: { userId: session.user.id },
      include: { 
        business: {
          include: {
            subscription: true,
          },
        },
      },
    });

    if (!groomer) {
      return NextResponse.json({ error: "No business found" }, { status: 404 });
    }

    const { business } = groomer;

    return NextResponse.json({
      business: {
        id: business.id,
        name: business.name,
        slug: business.slug,
        planTier: business.planTier,
        subscriptionStatus: business.subscriptionStatus,
        trialEndsAt: business.trialEndsAt,
      },
      subscription: business.subscription,
    });
  } catch (error) {
    console.error("Get subscription error:", error);
    return NextResponse.json(
      { error: "Failed to fetch subscription" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { action, planTier, billingCycle } = body;

    // Find the business associated with the user
    const groomer = await prisma.groomer.findUnique({
      where: { userId: session.user.id },
      include: { 
        business: {
          include: {
            subscription: true,
          },
        },
      },
    });

    if (!groomer || !groomer.business.subscription) {
      return NextResponse.json({ error: "No subscription found" }, { status: 404 });
    }

    const { business, subscription } = groomer.business;

    switch (action) {
      case "upgrade":
      case "downgrade":
        if (!planTier || !billingCycle) {
          return NextResponse.json(
            { error: "Plan tier and billing cycle are required" },
            { status: 400 }
          );
        }

        const newPriceId = getPriceId(planTier, billingCycle);
        
        // Update Stripe subscription
        const updatedStripeSubscription = await updateStripeSubscription(
          subscription.stripeSubscriptionId!,
          newPriceId
        );

        // Update database
        await prisma.subscription.update({
          where: { id: subscription.id },
          data: {
            planTier: planTier as any,
            stripePriceId: newPriceId,
            currentPeriodStart: new Date(updatedStripeSubscription.current_period_start * 1000),
            currentPeriodEnd: new Date(updatedStripeSubscription.current_period_end * 1000),
          },
        });

        await prisma.business.update({
          where: { id: business.id },
          data: {
            planTier: planTier as any,
          },
        });

        return NextResponse.json({
          success: true,
          message: `Successfully ${action}d to ${planTier} plan`,
        });

      case "cancel":
        // Cancel Stripe subscription at period end
        await cancelStripeSubscription(subscription.stripeSubscriptionId!, false);

        // Update database
        await prisma.subscription.update({
          where: { id: subscription.id },
          data: {
            status: "CANCELED",
            canceledAt: new Date(),
          },
        });

        await prisma.business.update({
          where: { id: business.id },
          data: {
            subscriptionStatus: "CANCELED",
          },
        });

        return NextResponse.json({
          success: true,
          message: "Subscription will be canceled at the end of the current period",
        });

      case "reactivate":
        // Reactivate Stripe subscription
        await updateStripeSubscription(
          subscription.stripeSubscriptionId!,
          subscription.stripePriceId!,
          "none"
        );

        // Update database
        await prisma.subscription.update({
          where: { id: subscription.id },
          data: {
            status: "ACTIVE",
            canceledAt: null,
          },
        });

        await prisma.business.update({
          where: { id: business.id },
          data: {
            subscriptionStatus: "ACTIVE",
          },
        });

        return NextResponse.json({
          success: true,
          message: "Subscription reactivated successfully",
        });

      default:
        return NextResponse.json(
          { error: "Invalid action" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Subscription management error:", error);
    return NextResponse.json(
      { error: "Failed to manage subscription" },
      { status: 500 }
    );
  }
}
