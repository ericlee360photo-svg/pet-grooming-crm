import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";
import { sendAppointmentConfirmation, sendWelcomeEmail } from "@/lib/email";

const bookingSchema = z.object({
  clientName: z.string().min(1, "Name is required"),
  clientEmail: z.string().email("Valid email is required"),
  clientPhone: z.string().optional(),
  petName: z.string().min(1, "Pet name is required"),
  petSpecies: z.string().default("dog"),
  petBreed: z.string().optional(),
  groomerId: z.string(),
  serviceId: z.string(),
  date: z.string(),
  timeSlot: z.object({
    start: z.string(),
    end: z.string(),
    startTime: z.string(),
    endTime: z.string(),
  }),
  notes: z.string().optional(),
  businessSlug: z.string().optional(), // For tenant-specific bookings
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = bookingSchema.parse(body);

    // Parse the date and time
    const [year, month, day] = data.date.split('-').map(Number);
    const [startHour, startMinute] = data.timeSlot.startTime.split(':').map(Number);
    const [endHour, endMinute] = data.timeSlot.endTime.split(':').map(Number);

    const startDateTime = new Date(year, month - 1, day, startHour, startMinute);
    const endDateTime = new Date(year, month - 1, day, endHour, endMinute);

    // Check for conflicts
    const conflict = await prisma.appointment.findFirst({
      where: {
        groomerId: data.groomerId,
        OR: [
          {
            start: { lte: startDateTime },
            end: { gt: startDateTime },
          },
          {
            start: { lt: endDateTime },
            end: { gte: endDateTime },
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

    // Get the business from the groomer or business slug
    let groomer;
    let business;
    
    if (data.businessSlug) {
      // Tenant-specific booking
      business = await prisma.business.findUnique({
        where: { slug: data.businessSlug },
      });
      
      if (!business) {
        return NextResponse.json(
          { error: "Business not found" },
          { status: 404 }
        );
      }
      
      groomer = await prisma.groomer.findFirst({
        where: { 
          id: data.groomerId,
          businessId: business.id,
        },
        include: { business: true },
      });
    } else {
      // General booking
      groomer = await prisma.groomer.findUnique({
        where: { id: data.groomerId },
        include: { business: true },
      });
    }

    if (!groomer) {
      return NextResponse.json(
        { error: "Groomer not found" },
        { status: 404 }
      );
    }
    
    business = groomer.business;

    // Find or create client
    let client = await prisma.client.findFirst({
      where: { 
        email: data.clientEmail,
        businessId: business.id,
      },
    });

    const isNewClient = !client;

    if (!client) {
      client = await prisma.client.create({
        data: {
          name: data.clientName,
          email: data.clientEmail,
          phone: data.clientPhone || null,
          businessId: business.id,
        },
      });
    } else {
      // Update client info if provided
      client = await prisma.client.update({
        where: { id: client.id },
        data: {
          name: data.clientName,
          phone: data.clientPhone || client.phone,
        },
      });
    }

    // Find or create pet
    let pet = await prisma.pet.findFirst({
      where: {
        clientId: client.id,
        name: data.petName,
      },
    });

    if (!pet) {
      pet = await prisma.pet.create({
        data: {
          clientId: client.id,
          name: data.petName,
          species: data.petSpecies,
          breed: data.petBreed || "",
        },
      });
    }

    // Create appointment
    const appointment = await prisma.appointment.create({
      data: {
        businessId: business.id,
        clientId: client.id,
        petId: pet.id,
        groomerId: data.groomerId,
        serviceId: data.serviceId,
        start: startDateTime,
        end: endDateTime,
        notes: data.notes,
        status: "SCHEDULED",
      },
      include: {
        client: true,
        pet: true,
        groomer: { include: { user: true } },
        service: true,
      },
    });

    // Send email notifications
    try {
      // Send appointment confirmation
      await sendAppointmentConfirmation(appointment, business);

      // Send welcome email for new clients
      if (isNewClient) {
        await sendWelcomeEmail(client, business);
      }
    } catch (emailError) {
      console.error("Failed to send email notifications:", emailError);
      // Don't fail the booking if email fails
    }

    return NextResponse.json({
      success: true,
      appointment,
      message: "Appointment booked successfully! Check your email for confirmation."
    }, { status: 201 });

  } catch (error) {
    console.error("Booking error:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid data", details: error.issues },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: "Failed to book appointment" },
      { status: 500 }
    );
  }
}
