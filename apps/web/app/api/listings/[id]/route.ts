import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { listingSchema } from "@/lib/validators";

export const dynamic = "force-dynamic";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const listing = await prisma.listing.findUnique({
    where: { id: params.id },
    include: { host: true, images: true, amenities: { include: { amenity: true } }, reviews: true, availability: true }
  });

  if (!listing) {
    return NextResponse.json({ error: "Listing not found" }, { status: 404 });
  }

  return NextResponse.json(listing);
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const payload = listingSchema.partial().safeParse(await request.json());
  if (!payload.success) {
    return NextResponse.json({ error: "Validation failed", issues: payload.error.flatten() }, { status: 400 });
  }

  const userId = request.headers.get("x-user-id");
  const listing = await prisma.listing.findUnique({ where: { id: params.id } });
  if (!listing) return NextResponse.json({ error: "Listing not found" }, { status: 404 });
  if (listing.hostId !== userId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const updated = await prisma.listing.update({ where: { id: params.id }, data: payload.data });
  return NextResponse.json(updated);
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const userId = request.headers.get("x-user-id");
  const listing = await prisma.listing.findUnique({ where: { id: params.id } });
  if (!listing) return NextResponse.json({ error: "Listing not found" }, { status: 404 });
  if (listing.hostId !== userId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  await prisma.listing.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
