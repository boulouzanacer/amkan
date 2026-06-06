import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  if (user.role !== "ADMIN") return NextResponse.json({ error: "Admin role required" }, { status: 403 });

  const [users, listings, bookings, revenue] = await Promise.all([
    prisma.user.count({ where: { isActive: true } }),
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
