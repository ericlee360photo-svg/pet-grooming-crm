import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch all subscriptions with business info
    const subscriptions = await prisma.subscription.findMany({
      include: {
        business: {
          select: {
            id: true,
            name: true,
            slug: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Calculate usage statistics for each subscription
    const subscriptionsWithUsage = await Promise.all(
      subscriptions.map(async (subscription) => {
        const [groomersCount, clientsCount, appointmentsThisMonth] = await Promise.all([
          prisma.groomer.count({
            where: { businessId: subscription.businessId },
          }),
          prisma.client.count({
            where: { businessId: subscription.businessId },
          }),
          prisma.appointment.count({
            where: {
              businessId: subscription.businessId,
              createdAt: {
                gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
              },
            },
          }),
        ]);

        return {
          ...subscription,
          groomersUsed: groomersCount,
          clientsUsed: clientsCount,
          appointmentsThisMonth,
        };
      })
    );

    // Calculate overall stats
    const stats = {
      totalSubscriptions: subscriptions.length,
      activeSubscriptions: subscriptions.filter(s => s.status === "ACTIVE").length,
      trialSubscriptions: subscriptions.filter(s => s.status === "TRIALING").length,
      overdueSubscriptions: subscriptions.filter(s => s.status === "PAST_DUE").length,
      monthlyRevenue: 0, // This would be calculated from actual payments
    };

    // Calculate monthly revenue from active subscriptions
    const activeSubscriptions = subscriptions.filter(s => s.status === "ACTIVE");
    const planPrices = {
      BASIC: 1999, // $19.99
      PRO: 4900,   // $49.00
      GROWTH: 9900, // $99.00
    };

    stats.monthlyRevenue = activeSubscriptions.reduce((total, sub) => {
      return total + (planPrices[sub.planTier as keyof typeof planPrices] || 0);
    }, 0);

    return NextResponse.json({
      subscriptions: subscriptionsWithUsage,
      stats,
    });
  } catch (error) {
    console.error("Get subscriptions error:", error);
    return NextResponse.json(
      { error: "Failed to fetch subscriptions" },
      { status: 500 }
    );
  }
}
