import { NextRequest, NextResponse } from "next/server";
import { getPaymentProvider } from "@/lib/payment-providers";
import { prisma } from "@/lib/db";
import { z } from "zod";

const checkoutSchema = z.object({
  provider: z.enum(["stripe", "paypal", "apple_pay", "cash_app"]),
  amount: z.number().positive(),
  currency: z.string().default("USD"),
  orderId: z.string().optional(),
  invoiceId: z.string().optional(),
  successUrl: z.string().optional(),
  cancelUrl: z.string().optional(),
  description: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { provider, amount, currency, orderId, invoiceId, successUrl, cancelUrl, description } = checkoutSchema.parse(body);

    const paymentProvider = getPaymentProvider(provider);
    
    const paymentSession = await paymentProvider.createPayment(amount, currency, {
      description,
      successUrl,
      cancelUrl,
      orderId,
      invoiceId,
    });

    // Create payment record in database
    const payment = await prisma.payment.create({
      data: {
        provider,
        providerId: paymentSession.id,
        amountCents: amount,
        currency: currency.toLowerCase(),
        status: "pending",
        orderId,
        invoiceId,
        metadata: JSON.stringify({ description }),
      },
    });

    return NextResponse.json({
      paymentId: payment.id,
      providerSessionId: paymentSession.id,
      redirectUrl: paymentSession.url,
    });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create payment session" },
      { status: 500 }
    );
  }
}

