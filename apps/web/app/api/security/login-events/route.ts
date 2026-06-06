import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  if (!userId) return NextResponse.json({ error: "userId is required" }, { status: 400 });

  const events = await prisma.loginEvent.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 20
  });
  return NextResponse.json(events);
}
