import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const [users, listings, bookings, revenue] = await Promise.all([
    prisma.user.count(),
    prisma.listing.count(),
    prisma.booking.count(),
    prisma.payment.aggregate({ _sum: { amount: true }, where: { status: { in: ["PAID", "CASH_DUE"] } } })
  ]);

  return NextResponse.json({
    users,
    listings,
    bookings,
    revenue: revenue._sum.amount ?? 0
  });
}
