import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const schema = z.object({ userId: z.string(), listingId: z.string() });

export async function POST(request: Request) {
  const payload = schema.safeParse(await request.json());
  if (!payload.success) return NextResponse.json({ error: "Validation failed" }, { status: 400 });

  const favorite = await prisma.favorite.upsert({
    where: { userId_listingId: payload.data },
    update: {},
    create: payload.data
  });
  return NextResponse.json(favorite, { status: 201 });
}
