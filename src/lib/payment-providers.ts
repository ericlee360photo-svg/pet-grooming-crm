import Stripe from "stripe";
import { PayPalApi } from "@paypal/paypal-js";

export interface PaymentProvider {
  createPayment(amount: number, currency: string, metadata?: any): Promise<{ id: string; url?: string }>;
  verifyPayment(paymentId: string): Promise<{ status: string; amount?: number }>;
}

export class StripeProvider implements PaymentProvider {
  private stripe: Stripe;

  constructor(secretKey: string) {
    this.stripe = new Stripe(secretKey);
  }

  async createPayment(amount: number, currency: string = "usd", metadata?: any) {
    const session = await this.stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency,
            product_data: {
              name: metadata?.description || "Pet Grooming Service",
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      success_url: metadata?.successUrl || `${process.env.NEXTAUTH_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: metadata?.cancelUrl || `${process.env.NEXTAUTH_URL}/payment/cancel`,
      metadata,
    });

    return { id: session.id, url: session.url };
  }

  async verifyPayment(sessionId: string) {
    const session = await this.stripe.checkout.sessions.retrieve(sessionId);
    return {
      status: session.payment_status === "paid" ? "completed" : "pending",
      amount: session.amount_total,
    };
  }
}

export class PayPalProvider implements PaymentProvider {
  private clientId: string;
  private clientSecret: string;
  private environment: string;

  constructor(clientId: string, clientSecret: string, environment: string = "sandbox") {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.environment = environment;
  }

  async createPayment(amount: number, currency: string = "USD", metadata?: any) {
    const baseURL = this.environment === "sandbox" 
      ? "https://api-m.sandbox.paypal.com"
      : "https://api-m.paypal.com";

    // Get access token
    const authResponse = await fetch(`${baseURL}/v1/oauth2/token`, {
      method: "POST",
      headers: {
        "Authorization": `Basic ${Buffer.from(`${this.clientId}:${this.clientSecret}`).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    });

    const { access_token } = await authResponse.json();

    // Create payment
    const paymentResponse = await fetch(`${baseURL}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: currency,
              value: (amount / 100).toFixed(2), // Convert from cents
            },
            description: metadata?.description || "Pet Grooming Service",
          },
        ],
        application_context: {
          return_url: metadata?.successUrl || `${process.env.NEXTAUTH_URL}/payment/success`,
          cancel_url: metadata?.cancelUrl || `${process.env.NEXTAUTH_URL}/payment/cancel`,
        },
      }),
    });

    const order = await paymentResponse.json();
    const approvalUrl = order.links?.find((link: any) => link.rel === "approve")?.href;

    return { id: order.id, url: approvalUrl };
  }

  async verifyPayment(orderId: string) {
    // Implementation would verify the PayPal order status
    return { status: "pending" };
  }
}

export class ApplePayProvider implements PaymentProvider {
  async createPayment(amount: number, currency: string = "USD", metadata?: any) {
    // Apple Pay requires client-side implementation with Apple Pay JS
    // This would return a payment session ID that the client uses
    return {
      id: `apple_pay_${Date.now()}`,
      // Apple Pay doesn't have a redirect URL - it's handled client-side
    };
  }

  async verifyPayment(paymentId: string) {
    // Verify Apple Pay payment token
    return { status: "pending" };
  }
}

export class CashAppProvider implements PaymentProvider {
  private applicationId: string;
  private accessToken: string;
  private environment: string;

  constructor(applicationId: string, accessToken: string, environment: string = "sandbox") {
    this.applicationId = applicationId;
    this.accessToken = accessToken;
    this.environment = environment;
  }

  async createPayment(amount: number, currency: string = "USD", metadata?: any) {
    const baseURL = this.environment === "sandbox"
      ? "https://connect.squareupsandbox.com"
      : "https://connect.squareup.com";

    const response = await fetch(`${baseURL}/v2/payments`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${this.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        source_id: "CASH_APP_PAY",
        amount_money: {
          amount: amount,
          currency: currency,
        },
        autocomplete: true,
        external_details: {
          type: "OTHER",
          source: "Pawfect CRM",
        },
      }),
    });

    const payment = await response.json();
    return { id: payment.payment?.id || payment.id };
  }

  async verifyPayment(paymentId: string) {
    // Verify Square/Cash App payment
    return { status: "pending" };
  }
}

export function getPaymentProvider(provider: string): PaymentProvider {
  switch (provider) {
    case "stripe":
      return new StripeProvider(process.env.STRIPE_SECRET_KEY!);
    case "paypal":
      return new PayPalProvider(
        process.env.PAYPAL_CLIENT_ID!,
        process.env.PAYPAL_CLIENT_SECRET!,
        process.env.NODE_ENV === "production" ? "live" : "sandbox"
      );
    case "apple_pay":
      return new ApplePayProvider();
    case "cash_app":
      return new CashAppProvider(
        process.env.SQUARE_APPLICATION_ID!,
        process.env.SQUARE_ACCESS_TOKEN!,
        process.env.NODE_ENV === "production" ? "production" : "sandbox"
      );
    default:
      throw new Error(`Unsupported payment provider: ${provider}`);
  }
}
