import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

const schema = z.object({
  bookingId: z.string(),
  listingId: z.string(),
  rating: z.number().int().min(1).max(5),
  cleanliness: z.number().int().min(1).max(5).optional(),
  location: z.number().int().min(1).max(5).optional(),
  communication: z.number().int().min(1).max(5).optional(),
  value: z.number().int().min(1).max(5).optional(),
  accuracy: z.number().int().min(1).max(5).optional(),
  comment: z.string().min(3)
});

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });

  const payload = schema.safeParse(await request.json());
  if (!payload.success) return NextResponse.json({ error: "Validation failed" }, { status: 400 });

  const booking = await prisma.booking.findUnique({ where: { id: payload.data.bookingId } });
  if (!booking || booking.userId !== user.id || booking.status !== "COMPLETED") {
    return NextResponse.json({ error: "Review requires a completed booking" }, { status: 403 });
  }

  const review = await prisma.review.create({ data: { ...payload.data, userId: user.id } });
  return NextResponse.json(review, { status: 201 });
}
