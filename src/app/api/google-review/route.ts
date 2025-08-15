import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    const { appointmentId } = await req.json();

    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: {
        client: true,
        pet: true,
        groomer: { include: { user: true } },
      },
    });

    if (!appointment || !appointment.client.email) {
      return NextResponse.json(
        { error: "Appointment or client email not found" },
        { status: 400 }
      );
    }

    // Check if review request already sent
    const existingRequest = await prisma.reviewRequest.findUnique({
      where: { appointmentId },
    });

    if (existingRequest) {
      return NextResponse.json(
        { error: "Review request already sent" },
        { status: 400 }
      );
    }

    // Generate Google Business review URL
    const reviewUrl = `https://search.google.com/local/writereview?placeid=${process.env.GOOGLE_BUSINESS_LOCATION_ID}`;

    // Create review request record
    await prisma.reviewRequest.create({
      data: {
        appointmentId,
        reviewUrl,
      },
    });

    // Send email
    if (process.env.SMTP_HOST) {
      const transporter = nodemailer.createTransporter({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || "587"),
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD,
        },
      });

      const emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Thank you for choosing BarkBook!</h2>
          <p>Hi ${appointment.client.name},</p>
          <p>We hope you and ${appointment.pet.name} had a wonderful grooming experience with ${appointment.groomer.user.name}!</p>
          <p>If you enjoyed our service, we'd be grateful if you could take a moment to leave us a review on Google.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${reviewUrl}" style="background-color: #4285f4; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Leave a Google Review
            </a>
          </div>
          <p>Your feedback helps us improve our services and helps other pet owners find us.</p>
          <p>Thank you!</p>
          <p>The BarkBook Team</p>
        </div>
      `;

      await transporter.sendMail({
        from: process.env.FROM_EMAIL,
        to: appointment.client.email,
        subject: "Thank you for your visit - Leave us a review!",
        html: emailHtml,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Google review request error:", error);
    return NextResponse.json(
      { error: "Failed to send review request" },
      { status: 500 }
    );
  }
}
