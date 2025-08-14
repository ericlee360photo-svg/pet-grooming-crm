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

    const [
      totalClients,
      totalAppointments,
      totalProducts,
      completedAppointments,
      surveys,
      pendingPayments,
    ] = await Promise.all([
      prisma.client.count(),
      prisma.appointment.count(),
      prisma.product.count({ where: { active: true } }),
      prisma.appointment.count({ where: { status: "COMPLETED" } }),
      prisma.survey.findMany(),
      prisma.payment.aggregate({
        where: { status: "pending" },
        _sum: { amountCents: true },
      }),
    ]);

    const revenue = await prisma.payment.aggregate({
      where: { status: "completed" },
      _sum: { amountCents: true },
    });

    const averageRating = surveys.length > 0 
      ? surveys.reduce((sum, survey) => sum + survey.rating, 0) / surveys.length 
      : 0;

    const stats = {
      totalClients,
      totalAppointments,
      totalProducts,
      completedAppointments,
      revenue: revenue._sum.amountCents || 0,
      averageRating,
      pendingPayments: pendingPayments._sum.amountCents || 0,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Get admin stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
