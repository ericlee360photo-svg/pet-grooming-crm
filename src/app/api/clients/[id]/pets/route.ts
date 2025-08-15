import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const pets = await prisma.pet.findMany({
      where: {
        clientId: params.id,
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json(pets);
  } catch (error) {
    console.error("Get pets error:", error);
    return NextResponse.json(
      { error: "Failed to get pets" },
      { status: 500 }
    );
  }
}
