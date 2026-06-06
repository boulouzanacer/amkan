import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notifyUser } from "@/lib/notifications";

export const dynamic = "force-dynamic";

const schema = z.object({
  isActive: z.boolean()
});

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  if (user.role !== "ADMIN") return NextResponse.json({ error: "Admin role required" }, { status: 403 });
  if (user.id === params.id) return NextResponse.json({ error: "You cannot suspend your own account" }, { status: 400 });

  const payload = schema.safeParse(await request.json());
  if (!payload.success) return NextResponse.json({ error: "Validation failed", issues: payload.error.flatten() }, { status: 400 });

  const updated = await prisma.user.update({
    where: { id: params.id },
    data: { isActive: payload.data.isActive },
    select: { id: true, name: true, email: true, role: true, isActive: true }
  });
  await notifyUser({
    userId: updated.id,
    title: payload.data.isActive ? "Compte réactivé" : "Compte suspendu",
    body: payload.data.isActive ? "Votre compte Amkan est de nouveau actif." : "Votre compte Amkan a été suspendu par l'administration.",
    actionUrl: "/profile"
  });

  return NextResponse.json(updated);
}
