import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { calendarBlockSchema } from "@/lib/validators";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });

  const payload = calendarBlockSchema.safeParse(await request.json());
  if (!payload.success) {
    return NextResponse.json({ error: "Validation failed", issues: payload.error.flatten() }, { status: 400 });
  }

  const listing = await prisma.listing.findUnique({ where: { id: payload.data.listingId } });
  if (!listing) return NextResponse.json({ error: "Listing not found" }, { status: 404 });
  if (listing.hostId !== user.id && user.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const availability = await prisma.availability.upsert({
    where: { listingId_date: { listingId: payload.data.listingId, date: payload.data.date } },
    update: { isBlocked: payload.data.isBlocked, price: payload.data.price },
    create: payload.data
  });
  return NextResponse.json(availability);
}
