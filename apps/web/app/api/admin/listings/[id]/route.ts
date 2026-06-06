import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notifyUser } from "@/lib/notifications";

export const dynamic = "force-dynamic";

const schema = z.object({
  isPublished: z.boolean().optional(),
  status: z.enum(["DRAFT", "READY", "PUBLISHED"]).optional()
});

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  if (user.role !== "ADMIN") return NextResponse.json({ error: "Admin role required" }, { status: 403 });

  const payload = schema.safeParse(await request.json());
  if (!payload.success) return NextResponse.json({ error: "Validation failed", issues: payload.error.flatten() }, { status: 400 });

  const listing = await prisma.listing.update({
    where: { id: params.id },
    data: {
      ...(payload.data.isPublished !== undefined ? { isPublished: payload.data.isPublished } : {}),
      ...(payload.data.status ? { status: payload.data.status } : {})
    },
    include: { host: { select: { id: true } } }
  });

  await notifyUser({
    userId: listing.host.id,
    title: payload.data.isPublished === false ? "Annonce suspendue" : "Annonce mise à jour",
    body: `${listing.title}: publication ${listing.isPublished ? "active" : "suspendue"}.`,
    actionUrl: "/host/listings"
  });

  return NextResponse.json(listing);
}
