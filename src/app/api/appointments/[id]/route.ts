import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";

const appointmentUpdateSchema = z.object({
  clientId: z.string(),
  petId: z.string(),
  groomerId: z.string(),
  serviceId: z.string().optional(),
  start: z.string().datetime(),
  end: z.string().datetime(),
  notes: z.string().optional(),
  status: z.enum(["SCHEDULED", "COMPLETED", "CANCELED", "NO_SHOW"]),
});

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const appointment = await prisma.appointment.findUnique({
      where: { id: params.id },
      include: {
        client: true,
        pet: true,
        groomer: { include: { user: true } },
        service: true,
        business: true,
      },
    });

    if (!appointment) {
      return NextResponse.json(
        { error: "Appointment not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(appointment);
  } catch (error) {
    console.error("Get appointment error:", error);
    return NextResponse.json(
      { error: "Failed to get appointment" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const data = appointmentUpdateSchema.parse(body);

    // Check for conflicts
    const conflict = await prisma.appointment.findFirst({
      where: {
        groomerId: data.groomerId,
        id: { not: params.id },
        OR: [
          {
            start: { lte: new Date(data.start) },
            end: { gt: new Date(data.start) },
          },
          {
            start: { lt: new Date(data.end) },
            end: { gte: new Date(data.end) },
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

    const appointment = await prisma.appointment.update({
      where: { id: params.id },
      data: {
        clientId: data.clientId,
        petId: data.petId,
        groomerId: data.groomerId,
        serviceId: data.serviceId,
        start: new Date(data.start),
        end: new Date(data.end),
        notes: data.notes,
        status: data.status,
      },
      include: {
        client: true,
        pet: true,
        groomer: { include: { user: true } },
        service: true,
        business: true,
      },
    });

    return NextResponse.json(appointment);
  } catch (error) {
    console.error("Update appointment error:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid data", details: error.issues },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: "Failed to update appointment" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.appointment.delete({
      where: { id: params.id },
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
