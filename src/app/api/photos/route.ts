import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

const createPhotoSchema = z.object({
  appointmentId: z.string(),
  type: z.enum(["BEFORE", "AFTER"]),
  url: z.string(),
});

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const appointmentId = searchParams.get("appointmentId");

    const whereClause: any = {};
    if (appointmentId) {
      whereClause.appointmentId = appointmentId;
    }

    const photos = await prisma.photo.findMany({
      where: whereClause,
      include: {
        appointment: {
          include: {
            client: true,
            pet: true,
          },
        },
        uploadedBy: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(photos);
  } catch (error) {
    console.error("Get photos error:", error);
    return NextResponse.json(
      { error: "Failed to fetch photos" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { appointmentId, type, url } = createPhotoSchema.parse(body);

    const photo = await prisma.photo.create({
      data: {
        appointmentId,
        type,
        url,
        uploadedById: session.user.id,
      },
      include: {
        appointment: {
          include: {
            client: true,
            pet: true,
          },
        },
        uploadedBy: true,
      },
    });

    return NextResponse.json(photo, { status: 201 });
  } catch (error) {
    console.error("Create photo error:", error);
    return NextResponse.json(
      { error: "Failed to create photo" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing photo ID" }, { status: 400 });
    }

    await prisma.photo.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete photo error:", error);
    return NextResponse.json(
      { error: "Failed to delete photo" },
      { status: 500 }
    );
  }
}
