import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

const createAppointmentSchema = z.object({
  clientId: z.string(),
  petId: z.string(),
  groomerId: z.string(),
  serviceId: z.string().optional(),
  start: z.string().datetime(),
  end: z.string().datetime(),
  notes: z.string().optional(),
});

const updateAppointmentSchema = createAppointmentSchema.partial().extend({
  id: z.string(),
  status: z.enum(["SCHEDULED", "COMPLETED", "CANCELED", "NO_SHOW"]).optional(),
});

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const groomerId = searchParams.get("groomerId");
    const clientId = searchParams.get("clientId");
    const start = searchParams.get("start");
    const end = searchParams.get("end");

    const whereClause: any = {};
    
    if (groomerId) whereClause.groomerId = groomerId;
    if (clientId) whereClause.clientId = clientId;
    if (start && end) {
      whereClause.start = {
        gte: new Date(start),
        lte: new Date(end),
      };
    }

    const appointments = await prisma.appointment.findMany({
      where: whereClause,
      include: {
        client: { include: { user: true } },
        pet: true,
        groomer: { include: { user: true } },
        service: true,
        photos: true,
        invoice: true,
      },
      orderBy: { start: "asc" },
    });

    return NextResponse.json(appointments);
  } catch (error) {
    console.error("Get appointments error:", error);
    return NextResponse.json(
      { error: "Failed to fetch appointments" },
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
    const { clientId, petId, groomerId, serviceId, start, end, notes } = createAppointmentSchema.parse(body);

    // Check for conflicts
    const conflict = await prisma.appointment.findFirst({
      where: {
        groomerId,
        OR: [
          {
            start: { lte: new Date(start) },
            end: { gt: new Date(start) },
          },
          {
            start: { lt: new Date(end) },
            end: { gte: new Date(end) },
          },
        ],
        status: { not: "CANCELED" },
      },
    });

    if (conflict) {
      return NextResponse.json(
        { error: "Time slot conflict with existing appointment" },
        { status: 400 }
      );
    }

    const appointment = await prisma.appointment.create({
      data: {
        clientId,
        petId,
        groomerId,
        serviceId,
        start: new Date(start),
        end: new Date(end),
        notes,
      },
      include: {
        client: { include: { user: true } },
        pet: true,
        groomer: { include: { user: true } },
        service: true,
      },
    });

    return NextResponse.json(appointment, { status: 201 });
  } catch (error) {
    console.error("Create appointment error:", error);
    return NextResponse.json(
      { error: "Failed to create appointment" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { id, ...updateData } = updateAppointmentSchema.parse(body);

    // Convert date strings to Date objects
    if (updateData.start) updateData.start = new Date(updateData.start);
    if (updateData.end) updateData.end = new Date(updateData.end);

    const appointment = await prisma.appointment.update({
      where: { id },
      data: updateData,
      include: {
        client: { include: { user: true } },
        pet: true,
        groomer: { include: { user: true } },
        service: true,
      },
    });

    return NextResponse.json(appointment);
  } catch (error) {
    console.error("Update appointment error:", error);
    return NextResponse.json(
      { error: "Failed to update appointment" },
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
      return NextResponse.json({ error: "Missing appointment ID" }, { status: 400 });
    }

    await prisma.appointment.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete appointment error:", error);
    return NextResponse.json(
      { error: "Failed to delete appointment" },
      { status: 500 }
    );
  }
}
