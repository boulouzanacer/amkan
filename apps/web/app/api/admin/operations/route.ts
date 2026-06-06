import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  if (user.role !== "ADMIN") return NextResponse.json({ error: "Admin role required" }, { status: 403 });

  const [payments, verifications, reportsOpen, disputesOpen, pendingPayouts] = await Promise.all([
    prisma.payment.aggregate({ _sum: { amount: true, commission: true }, where: { status: { in: ["PAID", "CASH_DUE"] } } }),
    prisma.hostVerification.count({ where: { status: "PENDING" } }),
    prisma.report.count({ where: { status: "OPEN" } }),
    prisma.dispute.count({ where: { status: "OPEN" } }),
    prisma.payout.count({ where: { status: "PENDING" } })
  ]);

  return NextResponse.json({
    revenue: {
      amount: payments._sum.amount ?? 0,
      commission: payments._sum.commission ?? 0
    },
    queues: {
      verifications,
      reportsOpen,
      disputesOpen,
      pendingPayouts
    },
    commissionRate: 12,
    activeHosts: await prisma.user.count({ where: { role: "HOST", isActive: true } })
  });
}
