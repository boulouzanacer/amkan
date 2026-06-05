import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const schema = z.object({
  bookingId: z.string(),
  userId: z.string(),
  listingId: z.string(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(3)
});

export async function POST(request: Request) {
  const payload = schema.safeParse(await request.json());
  if (!payload.success) return NextResponse.json({ error: "Validation failed" }, { status: 400 });

  const booking = await prisma.booking.findUnique({ where: { id: payload.data.bookingId } });
  if (!booking || booking.status !== "COMPLETED") {
    return NextResponse.json({ error: "Review requires a completed booking" }, { status: 403 });
  }

  const review = await prisma.review.create({ data: payload.data });
  return NextResponse.json(review, { status: 201 });
}
