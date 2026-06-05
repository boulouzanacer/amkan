import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { listingSchema } from "@/lib/validators";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const destination = searchParams.get("destination");
  const maxPrice = searchParams.get("maxPrice");

  const listings = await prisma.listing.findMany({
    where: {
      isPublished: true,
      ...(destination
        ? {
            OR: [
              { city: { contains: destination } },
              { country: { contains: destination } },
              { address: { contains: destination } }
            ]
          }
        : {}),
      ...(maxPrice ? { pricePerNight: { lte: Number(maxPrice) } } : {})
    },
    include: { images: true, amenities: { include: { amenity: true } }, reviews: true },
    orderBy: { createdAt: "desc" }
  });

  return NextResponse.json(listings);
}

export async function POST(request: Request) {
  const payload = listingSchema.safeParse(await request.json());
  if (!payload.success) {
    return NextResponse.json({ error: "Validation failed", issues: payload.error.flatten() }, { status: 400 });
  }

  const hostId = request.headers.get("x-user-id");
  if (!hostId) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  const slug = `${payload.data.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now()}`;
  const listing = await prisma.listing.create({
    data: {
      ...payload.data,
      slug,
      hostId,
      latitude: 36.7538,
      longitude: 3.0588,
      serviceFee: 0,
      taxes: 0,
      houseRules: "Règles à compléter par l'hôte."
    }
  });

  return NextResponse.json(listing, { status: 201 });
}
