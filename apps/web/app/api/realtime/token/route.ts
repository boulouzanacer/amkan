import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST() {
  return NextResponse.json({
    token: crypto.randomUUID(),
    expiresIn: 900,
    channels: ["messages", "notifications", "bookings"]
  });
}
