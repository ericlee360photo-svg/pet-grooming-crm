import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendAppointmentCancellation } from "@/lib/email";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const appointmentId = params.id;
    const { reason } = await req.json();

    // Find the appointment
    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: {
        client: true,
        pet: true,
        business: true,
      },
    });

    if (!appointment) {
      return NextResponse.json(
        { error: "Appointment not found" },
        { status: 404 }
      );
    }

    // Check if appointment is already cancelled
    if (appointment.status === "CANCELED") {
      return NextResponse.json(
        { error: "Appointment is already cancelled" },
        { status: 400 }
      );
    }

    // Update appointment status
    const updatedAppointment = await prisma.appointment.update({
      where: { id: appointmentId },
      data: {
        status: "CANCELED",
        notes: appointment.notes 
          ? `${appointment.notes}\n\nCancelled: ${reason || 'No reason provided'}`
          : `Cancelled: ${reason || 'No reason provided'}`,
      },
      include: {
        client: true,
        pet: true,
        business: true,
      },
    });

    // Send cancellation email
    try {
      await sendAppointmentCancellation(updatedAppointment, updatedAppointment.business);
    } catch (emailError) {
      console.error("Failed to send cancellation email:", emailError);
      // Don't fail the cancellation if email fails
    }

    return NextResponse.json({
      success: true,
      appointment: updatedAppointment,
      message: "Appointment cancelled successfully",
    });

  } catch (error) {
    console.error("Appointment cancellation error:", error);
    return NextResponse.json(
      { error: "Failed to cancel appointment" },
      { status: 500 }
    );
  }
}
