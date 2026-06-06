import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });

  const favorite = await prisma.favorite.findUnique({ where: { id: params.id } });
  if (!favorite) return NextResponse.json({ error: "Favorite not found" }, { status: 404 });
  if (favorite.userId !== user.id && user.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  await prisma.favorite.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
