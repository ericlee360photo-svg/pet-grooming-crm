import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendAppointmentReminder } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    // Get tomorrow's date
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const dayAfterTomorrow = new Date(tomorrow);
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);

    // Find appointments scheduled for tomorrow
    const appointments = await prisma.appointment.findMany({
      where: {
        start: {
          gte: tomorrow,
          lt: dayAfterTomorrow,
        },
        status: "SCHEDULED",
      },
      include: {
        client: true,
        pet: true,
        groomer: { include: { user: true } },
        service: true,
        business: true,
      },
    });

    const results = [];

    for (const appointment of appointments) {
      try {
        // Check if reminder was already sent (you might want to add a field to track this)
        await sendAppointmentReminder(appointment, appointment.business);
        results.push({
          appointmentId: appointment.id,
          clientEmail: appointment.client.email,
          status: "sent",
        });
      } catch (error) {
        console.error(`Failed to send reminder for appointment ${appointment.id}:`, error);
        results.push({
          appointmentId: appointment.id,
          clientEmail: appointment.client.email,
          status: "failed",
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: `Processed ${appointments.length} appointments`,
      results,
    });

  } catch (error) {
    console.error("Appointment reminder error:", error);
    return NextResponse.json(
      { error: "Failed to send appointment reminders" },
      { status: 500 }
    );
  }
}
