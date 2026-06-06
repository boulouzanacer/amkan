import { NextResponse } from "next/server";
import Stripe from "stripe";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });

  const payload = z.object({ bookingId: z.string() }).safeParse(await request.json());
  if (!payload.success) return NextResponse.json({ error: "Validation failed" }, { status: 400 });

  const booking = await prisma.booking.findUnique({
    where: { id: payload.data.bookingId },
    include: { listing: true, payment: true }
  });
  if (!booking) return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  if (booking.userId !== user.id && user.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

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
          unit_amount: Math.round(Number(booking.total) * 100),
          product_data: { name: booking.listing.title }
        }
      }
    ],
    metadata: { bookingId: booking.id },
    success_url: `${process.env.NEXTAUTH_URL}/payment/success?bookingId=${booking.id}`,
    cancel_url: `${process.env.NEXTAUTH_URL}/payment/cancel?bookingId=${booking.id}`
  });

  await prisma.payment.update({
    where: { bookingId: booking.id },
    data: { providerRef: session.id }
  });

  return NextResponse.json({ url: session.url });
}
