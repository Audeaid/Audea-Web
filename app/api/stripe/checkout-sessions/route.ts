import { NextResponse, NextRequest } from 'next/server';
import { stripeServer } from '@/utils/stripe';
import Stripe from 'stripe';

export async function POST(req: NextRequest) {
  const data = await req.json();

  const clerkUserId: string = data.clerkUserId;
  const stripeCustomerId: string = data.stripeCustomerId;
  const stripePriceId: string = data.stripePriceId;

  if (!clerkUserId || !stripeCustomerId || !stripePriceId)
    throw new Error(
      'clerkUserId or stripeCustomerId or stripePriceId is missing'
    );

  try {
    //Create Checkout Sessions from body params.
    const params: Stripe.Checkout.SessionCreateParams = {
      mode: 'payment',
      currency: 'usd',
      payment_method_types: ['card'],
      line_items: [
        {
          price: stripePriceId,
          quantity: 1,
        },
      ],
      invoice_creation: {
        enabled: true,
      },
      metadata: {
        clerkUserId,
      },
      customer: stripeCustomerId,
      success_url: `${req.url}/app/subscriptions/success/{CHECKOUT_SESSION_ID}?priceId=${stripePriceId}`,
      cancel_url: `${req.url}/app/subscriptions`,
    };

    const checkoutSession: Stripe.Checkout.Session =
      await stripeServer.checkout.sessions.create(params);

    return NextResponse.json(checkoutSession);
  } catch (err) {
    console.error(err);
    return NextResponse.error();
  }
}
