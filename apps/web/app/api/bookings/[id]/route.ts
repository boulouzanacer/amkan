import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { notifyUser } from "@/lib/notifications";

export const dynamic = "force-dynamic";

const schema = z.object({
  status: z.enum(["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED", "REFUSED"])
});

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });

  const payload = schema.safeParse(await request.json());
  if (!payload.success) return NextResponse.json({ error: "Validation failed" }, { status: 400 });

  const booking = await prisma.booking.findUnique({
    where: { id: params.id },
    include: { listing: true, payment: true }
  });
  if (!booking) return NextResponse.json({ error: "Booking not found" }, { status: 404 });

  const isHost = booking.listing.hostId === user.id;
  const isTraveler = booking.userId === user.id;
  const isAdmin = user.role === "ADMIN";
  if (!isHost && !isTraveler && !isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  if (isTraveler && !["CANCELLED"].includes(payload.data.status)) return NextResponse.json({ error: "Traveler can only cancel" }, { status: 403 });

  const updated = await prisma.booking.update({
    where: { id: params.id },
    data: {
      status: payload.data.status,
      payment:
        payload.data.status === "CONFIRMED" && booking.payment?.method === "CASH"
          ? { update: { status: "CASH_DUE" } }
          : undefined
    },
    include: { listing: true, payment: true }
  });

  await notifyUser({
    userId: updated.userId,
    title: "Statut de réservation mis à jour",
    body: `${updated.listing.title}: ${updated.status}`,
    actionUrl: "/traveler/bookings"
  });

  return NextResponse.json(updated);
}
