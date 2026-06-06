import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { bookingSchema } from "@/lib/validators";
import { getCurrentUser } from "@/lib/auth";
import { notifyUser } from "@/lib/notifications";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });

  const bookings = await prisma.booking.findMany({
    where: user.role === "ADMIN" ? {} : { userId: user.id },
    include: { listing: { include: { images: true } }, payment: true },
    orderBy: { createdAt: "desc" }
  });

  return NextResponse.json(bookings);
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });

  const payload = bookingSchema.safeParse(await request.json());
  if (!payload.success) {
    return NextResponse.json({ error: "Validation failed", issues: payload.error.flatten() }, { status: 400 });
  }

  const listing = await prisma.listing.findUnique({ where: { id: payload.data.listingId } });
  if (!listing) return NextResponse.json({ error: "Listing not found" }, { status: 404 });

  const overlapping = await prisma.booking.findFirst({
    where: {
      listingId: payload.data.listingId,
      status: { in: ["PENDING", "CONFIRMED"] },
      checkIn: { lt: payload.data.checkOut },
      checkOut: { gt: payload.data.checkIn }
    }
  });
  if (overlapping) return NextResponse.json({ error: "Dates unavailable" }, { status: 409 });

  const nights = Math.ceil((payload.data.checkOut.getTime() - payload.data.checkIn.getTime()) / 86_400_000);
  const subtotal = Number(listing.pricePerNight) * nights;
  const serviceFee = Number(listing.serviceFee);
  const taxes = Number(listing.taxes);
  const total = subtotal + serviceFee + taxes;

  const booking = await prisma.booking.create({
    data: {
      userId: user.id,
      listingId: payload.data.listingId,
      checkIn: payload.data.checkIn,
      checkOut: payload.data.checkOut,
      guests: payload.data.guests,
      nights,
      subtotal,
      serviceFee,
      taxes,
      total,
      status: "PENDING",
      payment: {
        create: {
          amount: total,
          commission: Math.round(total * 0.12 * 100) / 100,
          hostAmount: Math.round(total * 0.88 * 100) / 100,
          method: payload.data.method,
          status: payload.data.method === "CASH" ? "CASH_DUE" : "PENDING"
        }
      }
    },
    include: { payment: true, listing: true }
  });

  await notifyUser({
    userId: booking.listing.hostId,
    title: "Nouvelle demande de réservation",
    body: `${user.name} a demandé ${booking.nights} nuit(s) pour ${booking.listing.title}.`,
    actionUrl: "/host/bookings"
  });
  await notifyUser({
    userId: user.id,
    title: "Demande de réservation envoyée",
    body: `Votre demande pour ${booking.listing.title} est en attente de confirmation.`,
    actionUrl: "/traveler/bookings"
  });

  return NextResponse.json(booking, { status: 201 });
}
