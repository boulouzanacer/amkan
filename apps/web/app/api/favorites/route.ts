import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

const schema = z.object({ listingId: z.string() });

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });

  const payload = schema.safeParse(await request.json());
  if (!payload.success) return NextResponse.json({ error: "Validation failed" }, { status: 400 });

  const favorite = await prisma.favorite.upsert({
    where: { userId_listingId: { userId: user.id, listingId: payload.data.listingId } },
    update: {},
    create: { userId: user.id, listingId: payload.data.listingId }
  });
  return NextResponse.json(favorite, { status: 201 });
}
