import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { notifyUser } from "@/lib/notifications";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) return NextResponse.json({ error: "Stripe is not configured" }, { status: 501 });

  const stripe = new Stripe(secretKey);
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event: Stripe.Event;
  try {
    event = webhookSecret && signature ? stripe.webhooks.constructEvent(body, signature, webhookSecret) : JSON.parse(body);
  } catch {
    return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const bookingId = session.metadata?.bookingId;
    if (bookingId) {
      const booking = await prisma.booking.update({
        where: { id: bookingId },
        data: {
          status: "CONFIRMED",
          payment: { update: { status: "PAID", providerRef: session.id } }
        },
        include: { listing: true }
      });
      await notifyUser({
        userId: booking.userId,
        title: "Paiement confirmé",
        body: `Votre réservation pour ${booking.listing.title} est confirmée.`,
        actionUrl: "/traveler/bookings"
      });
      await notifyUser({
        userId: booking.listing.hostId,
        title: "Réservation payée",
        body: `${booking.listing.title}: paiement reçu.`,
        actionUrl: "/host/bookings"
      });
    }
  }

  return NextResponse.json({ received: true });
}
