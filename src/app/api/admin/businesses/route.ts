import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

const createBusinessSchema = z.object({
  name: z.string().min(1, "Business name is required"),
  slug: z.string().min(1, "URL slug is required").regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  website: z.string().url().optional().or(z.literal("")),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  postal: z.string().optional(),
  description: z.string().optional(),
  primaryColor: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Primary color must be a valid hex color").default("#c19a7e"),
  accentColor: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Accent color must be a valid hex color").default("#d19670"),
  active: z.boolean().default(true),
  bookingEnabled: z.boolean().default(true),
});

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const businesses = await prisma.business.findMany({
      include: {
        _count: {
          select: {
            groomers: true,
            clients: true,
            appointments: true,
            services: true,
          },
        },
      },
      orderBy: { name: "asc" },
    });

    return NextResponse.json(businesses);
  } catch (error) {
    console.error("Get businesses error:", error);
    return NextResponse.json(
      { error: "Failed to fetch businesses" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const data = createBusinessSchema.parse(body);

    // Check if slug is already taken
    const existingBusiness = await prisma.business.findUnique({
      where: { slug: data.slug },
    });

    if (existingBusiness) {
      return NextResponse.json(
        { error: "URL slug is already taken" },
        { status: 400 }
      );
    }

    const business = await prisma.business.create({
      data,
      include: {
        _count: {
          select: {
            groomers: true,
            clients: true,
            appointments: true,
            services: true,
          },
        },
      },
    });

    return NextResponse.json(business, { status: 201 });
  } catch (error) {
    console.error("Create business error:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid data", details: error.issues },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: "Failed to create business" },
      { status: 500 }
    );
  }
}
