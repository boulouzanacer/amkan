import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { calendarBlockSchema } from "@/lib/validators";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const payload = calendarBlockSchema.safeParse(await request.json());
  if (!payload.success) {
    return NextResponse.json({ error: "Validation failed", issues: payload.error.flatten() }, { status: 400 });
  }

  const availability = await prisma.availability.upsert({
    where: { listingId_date: { listingId: payload.data.listingId, date: payload.data.date } },
    update: { isBlocked: payload.data.isBlocked, price: payload.data.price },
    create: payload.data
  });
  return NextResponse.json(availability);
}
