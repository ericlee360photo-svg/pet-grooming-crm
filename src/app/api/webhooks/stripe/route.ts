import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import Stripe from 'stripe'

// Make this route dynamic
export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    // Check environment variables first
    if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
      return NextResponse.json(
        { error: 'Stripe configuration incomplete' },
        { status: 500 }
      )
    }

    // Create Stripe client dynamically
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-07-30.basil',
    })

    const body = await req.text()
    const headersList = await headers()
    const signature = headersList.get('stripe-signature')
    
    if (!signature) {
      return NextResponse.json(
        { error: 'Missing stripe-signature header' },
        { status: 400 }
      )
    }

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      )
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return NextResponse.json(
        { error: 'Webhook signature verification failed' },
        { status: 400 }
      )
    }

  // Handle the event
  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        console.log('Payment succeeded:', paymentIntent.id)
        
        // TODO: Update appointment/booking status in database
        // TODO: Send confirmation email to client
        // TODO: Create payment record
        
        break

      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object as Stripe.PaymentIntent
        console.log('Payment failed:', failedPayment.id)
        
        // TODO: Handle failed payment
        // TODO: Notify groomer of failed payment
        
        break

      case 'customer.subscription.created':
        const newSubscription = event.data.object as Stripe.Subscription
        console.log('New subscription:', newSubscription.id)
        
        // TODO: Activate premium features for groomer
        // TODO: Update user subscription status
        
        break

      case 'customer.subscription.updated':
        const updatedSubscription = event.data.object as Stripe.Subscription
        console.log('Subscription updated:', updatedSubscription.id)
        
        // TODO: Update subscription details
        
        break

      case 'customer.subscription.deleted':
        const cancelledSubscription = event.data.object as Stripe.Subscription
        console.log('Subscription cancelled:', cancelledSubscription.id)
        
        // TODO: Downgrade to free plan
        // TODO: Send cancellation confirmation
        
        break

      case 'invoice.payment_succeeded':
        const paidInvoice = event.data.object as Stripe.Invoice
        console.log('Invoice paid:', paidInvoice.id)
        
        // TODO: Record successful payment
        // TODO: Extend subscription period
        
        break

      case 'invoice.payment_failed':
        const failedInvoice = event.data.object as Stripe.Invoice
        console.log('Invoice payment failed:', failedInvoice.id)
        
        // TODO: Handle failed subscription payment
        // TODO: Send payment retry email
        
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
    
  } catch (error) {
    console.error('Error processing webhook:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
  
  } catch (error) {
    console.error('Webhook route error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}
