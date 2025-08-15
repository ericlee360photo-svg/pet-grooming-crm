import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const services = await prisma.service.findMany({
      where: { active: true },
      select: {
        id: true,
        name: true,
        description: true,
        priceCents: true,
      },
      orderBy: { name: "asc" },
    });

    // Convert price from cents to dollars
    const servicesWithPrice = services.map(service => ({
      ...service,
      price: service.priceCents / 100,
    }));

    return NextResponse.json(servicesWithPrice);
  } catch (error) {
    console.error("Get public services error:", error);
    return NextResponse.json(
      { error: "Failed to fetch services" },
      { status: 500 }
    );
  }
}
