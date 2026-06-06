import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const schema = z.object({ userId: z.string(), enabled: z.boolean() });

export async function POST(request: Request) {
  const payload = schema.safeParse(await request.json());
  if (!payload.success) return NextResponse.json({ error: "Validation failed" }, { status: 400 });

  const credential = await prisma.twoFactorCredential.upsert({
    where: { userId: payload.data.userId },
    update: { enabled: payload.data.enabled },
    create: {
      userId: payload.data.userId,
      enabled: payload.data.enabled,
      secret: crypto.randomUUID()
    }
  });
  return NextResponse.json({ enabled: credential.enabled });
}
