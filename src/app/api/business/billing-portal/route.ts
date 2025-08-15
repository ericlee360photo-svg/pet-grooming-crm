import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { createStripePortalSession } from "@/lib/stripe";

export async function POST(req: NextRequest) {
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

    if (!groomer || !groomer.business.subscription?.stripeCustomerId) {
      return NextResponse.json({ error: "No billing information found" }, { status: 404 });
    }

    const { business } = groomer;

    // Create Stripe billing portal session
    const portalSession = await createStripePortalSession(
      business.subscription!.stripeCustomerId,
      `${process.env.NEXTAUTH_URL}/business/dashboard`
    );

    return NextResponse.json({
      url: portalSession.url,
    });
  } catch (error) {
    console.error("Billing portal error:", error);
    return NextResponse.json(
      { error: "Failed to create billing portal session" },
      { status: 500 }
    );
  }
}
