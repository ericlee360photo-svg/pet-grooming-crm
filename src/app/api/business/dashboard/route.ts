import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getUsageLimits, getCurrentUsage } from "@/lib/usage-limits";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find the business associated with the user
    let business;
    
    if (session.user.role === "ADMIN") {
      // For admin users, get the first business (or you could add business selection)
      business = await prisma.business.findFirst();
    } else {
      // For groomer users, get their associated business
      const groomer = await prisma.groomer.findUnique({
        where: { userId: session.user.id },
        include: { business: true },
      });
      
      if (!groomer) {
        return NextResponse.json({ error: "No business found" }, { status: 404 });
      }
      
      business = groomer.business;
    }

    if (!business) {
      return NextResponse.json({ error: "No business found" }, { status: 404 });
    }

    // Get usage limits and current usage
    const [limits, currentUsage] = await Promise.all([
      getUsageLimits(business.id),
      getCurrentUsage(business.id),
    ]);

    if (!limits) {
      return NextResponse.json({ error: "Unable to determine usage limits" }, { status: 500 });
    }

    // Get business statistics
    const [totalAppointments, totalRevenue, averageRating, activeClients] = await Promise.all([
      prisma.appointment.count({
        where: { businessId: business.id },
      }),
      prisma.payment.aggregate({
        where: { 
          status: "completed",
          invoice: {
            businessId: business.id,
          },
        },
        _sum: { amountCents: true },
      }),
      prisma.survey.aggregate({
        where: {
          business: { id: business.id },
        },
        _avg: { rating: true },
      }),
      prisma.client.count({
        where: { 
          businessId: business.id,
          appts: {
            some: {
              createdAt: {
                gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
              },
            },
          },
        },
      }),
    ]);

    const dashboardData = {
      business: {
        id: business.id,
        name: business.name,
        slug: business.slug,
        planTier: business.planTier,
        subscriptionStatus: business.subscriptionStatus,
        trialEndsAt: business.trialEndsAt,
      },
      usage: currentUsage,
      limits,
      stats: {
        totalAppointments,
        totalRevenue: totalRevenue._sum.amountCents || 0,
        averageRating: averageRating._avg.rating || 0,
        activeClients,
      },
    };

    return NextResponse.json(dashboardData);
  } catch (error) {
    console.error("Get business dashboard error:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}
