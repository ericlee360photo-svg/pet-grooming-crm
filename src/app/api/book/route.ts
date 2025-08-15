import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";

const publicBookingSchema = z.object({
  clientName: z.string().min(1, "Name is required"),
  clientEmail: z.string().email("Valid email is required"),
  clientPhone: z.string().min(1, "Phone is required"),
  petName: z.string().min(1, "Pet name is required"),
  petSpecies: z.string().default("dog"),
  petBreed: z.string().optional(),
  groomerId: z.string(),
  serviceId: z.string().optional(),
  start: z.string().datetime(),
  end: z.string().datetime(),
  notes: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { 
      clientName, 
      clientEmail, 
      clientPhone, 
      petName, 
      petSpecies, 
      petBreed,
      groomerId, 
      serviceId, 
      start, 
      end, 
      notes 
    } = publicBookingSchema.parse(body);

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

    // Find or create client
    let client = await prisma.client.findFirst({
      where: { email: clientEmail },
    });

    if (!client) {
      client = await prisma.client.create({
        data: {
          name: clientName,
          email: clientEmail,
          phone: clientPhone,
        },
      });
    } else {
      // Update client info if provided
      client = await prisma.client.update({
        where: { id: client.id },
        data: {
          name: clientName,
          phone: clientPhone,
        },
      });
    }

    // Find or create pet
    let pet = await prisma.pet.findFirst({
      where: {
        clientId: client.id,
        name: petName,
      },
    });

    if (!pet) {
      pet = await prisma.pet.create({
        data: {
          clientId: client.id,
          name: petName,
          species: petSpecies,
          breed: petBreed || "",
        },
      });
    }

    // Create appointment
    const appointment = await prisma.appointment.create({
      data: {
        clientId: client.id,
        petId: pet.id,
        groomerId,
        serviceId,
        start: new Date(start),
        end: new Date(end),
        notes,
        status: "SCHEDULED",
      },
      include: {
        client: true,
        pet: true,
        groomer: { include: { user: true } },
        service: true,
      },
    });

    return NextResponse.json({
      success: true,
      appointment,
      message: "Appointment booked successfully! We'll contact you to confirm details."
    }, { status: 201 });

  } catch (error) {
    console.error("Public booking error:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid data", details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: "Failed to book appointment" },
      { status: 500 }
    );
  }
}
