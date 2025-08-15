import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe, WEBHOOK_EVENTS } from "@/lib/stripe";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = headers().get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case WEBHOOK_EVENTS.CUSTOMER_SUBSCRIPTION_CREATED:
        await handleSubscriptionCreated(event.data.object);
        break;

      case WEBHOOK_EVENTS.CUSTOMER_SUBSCRIPTION_UPDATED:
        await handleSubscriptionUpdated(event.data.object);
        break;

      case WEBHOOK_EVENTS.CUSTOMER_SUBSCRIPTION_DELETED:
        await handleSubscriptionDeleted(event.data.object);
        break;

      case WEBHOOK_EVENTS.INVOICE_PAYMENT_SUCCEEDED:
        await handleInvoicePaymentSucceeded(event.data.object);
        break;

      case WEBHOOK_EVENTS.INVOICE_PAYMENT_FAILED:
        await handleInvoicePaymentFailed(event.data.object);
        break;

      case WEBHOOK_EVENTS.CUSTOMER_SUBSCRIPTION_TRIAL_WILL_END:
        await handleTrialWillEnd(event.data.object);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook handler error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}

async function handleSubscriptionCreated(subscription: any) {
  const businessId = subscription.metadata.businessId;
  if (!businessId) return;

  await prisma.subscription.upsert({
    where: { businessId },
    update: {
      stripeSubscriptionId: subscription.id,
      stripePriceId: subscription.items.data[0].price.id,
      stripeCustomerId: subscription.customer as string,
      status: subscription.status.toUpperCase(),
      planTier: getPlanTierFromPriceId(subscription.items.data[0].price.id),
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      trialStart: subscription.trial_start ? new Date(subscription.trial_start * 1000) : null,
      trialEnd: subscription.trial_end ? new Date(subscription.trial_end * 1000) : null,
    },
    create: {
      businessId,
      stripeSubscriptionId: subscription.id,
      stripePriceId: subscription.items.data[0].price.id,
      stripeCustomerId: subscription.customer as string,
      status: subscription.status.toUpperCase(),
      planTier: getPlanTierFromPriceId(subscription.items.data[0].price.id),
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      trialStart: subscription.trial_start ? new Date(subscription.trial_start * 1000) : null,
      trialEnd: subscription.trial_end ? new Date(subscription.trial_end * 1000) : null,
    },
  });

  // Update business subscription status
  await prisma.business.update({
    where: { id: businessId },
    data: {
      subscriptionStatus: subscription.status.toUpperCase(),
      trialEndsAt: subscription.trial_end ? new Date(subscription.trial_end * 1000) : null,
    },
  });
}

async function handleSubscriptionUpdated(subscription: any) {
  const businessId = subscription.metadata.businessId;
  if (!businessId) return;

  await prisma.subscription.updateMany({
    where: { businessId },
    data: {
      stripePriceId: subscription.items.data[0].price.id,
      status: subscription.status.toUpperCase(),
      planTier: getPlanTierFromPriceId(subscription.items.data[0].price.id),
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      trialStart: subscription.trial_start ? new Date(subscription.trial_start * 1000) : null,
      trialEnd: subscription.trial_end ? new Date(subscription.trial_end * 1000) : null,
      canceledAt: subscription.canceled_at ? new Date(subscription.canceled_at * 1000) : null,
    },
  });

  // Update business subscription status
  await prisma.business.update({
    where: { id: businessId },
    data: {
      subscriptionStatus: subscription.status.toUpperCase(),
      trialEndsAt: subscription.trial_end ? new Date(subscription.trial_end * 1000) : null,
    },
  });
}

async function handleSubscriptionDeleted(subscription: any) {
  const businessId = subscription.metadata.businessId;
  if (!businessId) return;

  await prisma.subscription.updateMany({
    where: { businessId },
    data: {
      status: "CANCELED",
      canceledAt: new Date(),
    },
  });

  // Update business subscription status
  await prisma.business.update({
    where: { id: businessId },
    data: {
      subscriptionStatus: "CANCELED",
    },
  });
}

async function handleInvoicePaymentSucceeded(invoice: any) {
  if (invoice.subscription) {
    const subscription = await prisma.subscription.findFirst({
      where: { stripeSubscriptionId: invoice.subscription as string },
    });

    if (subscription) {
      // Create subscription invoice record
      await prisma.subscriptionInvoice.create({
        data: {
          subscriptionId: subscription.id,
          stripeInvoiceId: invoice.id,
          amountPaid: invoice.amount_paid,
          currency: invoice.currency,
          status: invoice.status,
          billingPeriodStart: new Date(invoice.period_start * 1000),
          billingPeriodEnd: new Date(invoice.period_end * 1000),
          paidAt: new Date(invoice.status_transitions.paid_at * 1000),
        },
      });
    }
  }
}

async function handleInvoicePaymentFailed(invoice: any) {
  if (invoice.subscription) {
    const subscription = await prisma.subscription.findFirst({
      where: { stripeSubscriptionId: invoice.subscription as string },
    });

    if (subscription) {
      await prisma.subscription.update({
        where: { id: subscription.id },
        data: {
          status: "PAST_DUE",
        },
      });

      await prisma.business.update({
        where: { id: subscription.businessId },
        data: {
          subscriptionStatus: "PAST_DUE",
        },
      });
    }
  }
}

async function handleTrialWillEnd(subscription: any) {
  const businessId = subscription.metadata.businessId;
  if (!businessId) return;

  // Send notification to business owner about trial ending
  console.log(`Trial ending soon for business: ${businessId}`);
  
  // You could send an email notification here
  // await sendTrialEndingEmail(businessId);
}

function getPlanTierFromPriceId(priceId: string): string {
  // This is a simplified mapping - you should implement this based on your actual Stripe price IDs
  if (priceId.includes('basic')) return 'BASIC';
  if (priceId.includes('pro')) return 'PRO';
  if (priceId.includes('growth')) return 'GROWTH';
  return 'BASIC'; // default
}
