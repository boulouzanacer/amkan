import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

const schema = z.object({
  name: z.string().min(2),
  phone: z.string().optional(),
  bio: z.string().optional()
});

export async function PATCH(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });

  const payload = schema.safeParse(await request.json());
  if (!payload.success) return NextResponse.json({ error: "Validation failed", issues: payload.error.flatten() }, { status: 400 });

  const updated = await prisma.user.update({
    where: { id: user.id },
    data: payload.data,
    select: { id: true, name: true, email: true, phone: true, bio: true, role: true }
  });
  return NextResponse.json(updated);
}
