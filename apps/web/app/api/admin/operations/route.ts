import { NextResponse } from "next/server";
import { adminQueues, hostRevenue } from "@/lib/premium-data";

export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json({
    revenue: hostRevenue,
    queues: adminQueues,
    commissionRate: 12,
    disputesOpen: 3,
    activeHosts: 87
  });
}
