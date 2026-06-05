import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(request: Request) {
  const { bookingId, amount, title } = await request.json();
  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!secretKey) {
    return NextResponse.json({ error: "Stripe is not configured" }, { status: 501 });
  }

  const stripe = new Stripe(secretKey);
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "eur",
          unit_amount: Math.round(Number(amount) * 100),
          product_data: { name: title ?? "Réservation Amkan" }
        }
      }
    ],
    metadata: { bookingId },
    success_url: `${process.env.NEXTAUTH_URL}/payment/success`,
    cancel_url: `${process.env.NEXTAUTH_URL}/payment/cancel`
  });

  return NextResponse.json({ url: session.url });
}
