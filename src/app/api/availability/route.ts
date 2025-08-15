import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";

const availabilitySchema = z.object({
  groomerId: z.string().optional(),
  date: z.string(), // YYYY-MM-DD format
});

// Business hours configuration
const BUSINESS_HOURS = {
  start: 9, // 9 AM
  end: 17,  // 5 PM
  slotDuration: 90, // 90 minutes per appointment
};

const DAYS_OF_WEEK = [1, 2, 3, 4, 5, 6]; // Monday to Saturday (0 = Sunday)

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const groomerId = searchParams.get("groomerId");
    const date = searchParams.get("date");

    if (!date) {
      return NextResponse.json(
        { error: "Date parameter is required (YYYY-MM-DD)" },
        { status: 400 }
      );
    }

    const targetDate = new Date(date);
    const dayOfWeek = targetDate.getDay();

    // Check if it's a business day
    if (!DAYS_OF_WEEK.includes(dayOfWeek)) {
      return NextResponse.json({
        date,
        availableSlots: [],
        message: "We're closed on this day"
      });
    }

    // Check if date is in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (targetDate < today) {
      return NextResponse.json({
        date,
        availableSlots: [],
        message: "Cannot book appointments in the past"
      });
    }

    // Get all groomers if none specified
    let groomers;
    if (groomerId) {
      groomers = await prisma.groomer.findMany({
        where: { id: groomerId, active: true },
        include: { user: true },
      });
    } else {
      groomers = await prisma.groomer.findMany({
        where: { active: true },
        include: { user: true },
      });
    }

    if (groomers.length === 0) {
      return NextResponse.json({
        date,
        availableSlots: [],
        message: "No groomers available"
      });
    }

    // Generate time slots for the day
    const slots = [];
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(BUSINESS_HOURS.start, 0, 0, 0);
    
    const endOfDay = new Date(targetDate);
    endOfDay.setHours(BUSINESS_HOURS.end, 0, 0, 0);

    // Get existing appointments for the date
    const existingAppointments = await prisma.appointment.findMany({
      where: {
        start: {
          gte: startOfDay,
          lt: endOfDay,
        },
        status: { not: "CANCELED" },
        ...(groomerId && { groomerId }),
      },
      include: {
        groomer: { include: { user: true } },
      },
    });

    // Generate available slots
    for (let currentTime = new Date(startOfDay); currentTime < endOfDay; currentTime.setMinutes(currentTime.getMinutes() + BUSINESS_HOURS.slotDuration)) {
      const slotEnd = new Date(currentTime);
      slotEnd.setMinutes(slotEnd.getMinutes() + BUSINESS_HOURS.slotDuration);

      // Find available groomers for this slot
      const availableGroomers = groomers.filter(groomer => {
        const hasConflict = existingAppointments.some(apt => {
          return apt.groomerId === groomer.id &&
                 ((apt.start <= currentTime && apt.end > currentTime) ||
                  (apt.start < slotEnd && apt.end >= slotEnd) ||
                  (apt.start >= currentTime && apt.end <= slotEnd));
        });
        return !hasConflict;
      });

      if (availableGroomers.length > 0) {
        slots.push({
          start: currentTime.toISOString(),
          end: slotEnd.toISOString(),
          startTime: currentTime.toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit',
            hour12: true 
          }),
          endTime: slotEnd.toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit',
            hour12: true 
          }),
          availableGroomers: availableGroomers.map(g => ({
            id: g.id,
            name: g.user.name,
          })),
        });
      }
    }

    return NextResponse.json({
      date,
      availableSlots: slots,
      groomers: groomers.map(g => ({
        id: g.id,
        name: g.user.name,
      })),
    });

  } catch (error) {
    console.error("Availability check error:", error);
    return NextResponse.json(
      { error: "Failed to check availability" },
      { status: 500 }
    );
  }
}
