import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  await prisma.favorite.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
