import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { z } from "zod";

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1),
  phone: z.string().optional(),
  businessSlug: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, name, phone, businessSlug } = signupSchema.parse(body);

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    // Find business if businessSlug is provided
    let business = null;
    if (businessSlug) {
      business = await prisma.business.findUnique({
        where: { slug: businessSlug },
      });
    }

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: "CLIENT", // Only allow client signups
      },
    });

    // Create associated Client record
    await prisma.client.create({
      data: {
        userId: user.id,
        name,
        email,
        phone: phone || null,
        businessId: business?.id || null, // Link to business if provided
      },
    });

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
