import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const groomers = await prisma.groomer.findMany({
      where: { active: true },
      include: {
        user: true,
      },
      orderBy: { user: { name: "asc" } },
    });

    return NextResponse.json(groomers);
  } catch (error) {
    console.error("Get groomers error:", error);
    return NextResponse.json(
      { error: "Failed to fetch groomers" },
      { status: 500 }
    );
  }
}
