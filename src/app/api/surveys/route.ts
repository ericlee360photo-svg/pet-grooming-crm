import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";

const surveySchema = z.object({
  appointmentId: z.string(),
  rating: z.number().int().min(1).max(5),
  feedback: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { appointmentId, rating, feedback } = surveySchema.parse(body);

    // Check if survey already exists
    const existingSurvey = await prisma.survey.findUnique({
      where: { appointmentId },
    });

    if (existingSurvey) {
      return NextResponse.json(
        { error: "Survey already submitted" },
        { status: 400 }
      );
    }

    const survey = await prisma.survey.create({
      data: {
        appointmentId,
        rating,
        feedback,
      },
      include: {
        appointment: {
          include: {
            client: true,
            pet: true,
            groomer: { include: { user: true } },
          },
        },
      },
    });

    // If rating is 4 or 5, send Google review request
    if (rating >= 4) {
      try {
        await fetch(`${process.env.NEXTAUTH_URL}/api/google-review`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ appointmentId }),
        });
      } catch (error) {
        console.error("Failed to send Google review request:", error);
      }
    }

    return NextResponse.json(survey, { status: 201 });
  } catch (error) {
    console.error("Create survey error:", error);
    return NextResponse.json(
      { error: "Failed to submit survey" },
      { status: 500 }
    );
  }
}
