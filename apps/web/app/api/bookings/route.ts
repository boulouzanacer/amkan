import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { bookingSchema } from "@/lib/validators";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const userId = request.headers.get("x-user-id");
  const role = request.headers.get("x-user-role");

  const bookings = await prisma.booking.findMany({
    where: role === "ADMIN" ? {} : { userId: userId ?? "" },
    include: { listing: { include: { images: true } }, payment: true },
    orderBy: { createdAt: "desc" }
  });

  return NextResponse.json(bookings);
}

export async function POST(request: Request) {
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
      userId: payload.data.userId,
      listingId: payload.data.listingId,
      checkIn: payload.data.checkIn,
      checkOut: payload.data.checkOut,
      guests: payload.data.guests,
      nights,
      subtotal,
      serviceFee,
      taxes,
      total,
      status: payload.data.method === "CASH" ? "PENDING" : "CONFIRMED",
      payment: {
        create: {
          amount: total,
          method: payload.data.method,
          status: payload.data.method === "CASH" ? "CASH_DUE" : "PENDING"
        }
      }
    },
    include: { payment: true }
  });

  return NextResponse.json(booking, { status: 201 });
}
