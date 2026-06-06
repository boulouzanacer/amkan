import { prisma } from "@/lib/prisma";

const fallbackImage = "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80";

export type ListingView = {
  id: string;
  slug: string;
  hostId?: string;
  hostName?: string;
  title: string;
  city: string;
  country: string;
  address: string;
  price: number;
  rating: number;
  reviews: number;
  guests: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;
  type: string;
  image: string;
  gallery: string[];
  description: string;
  rules: string;
  amenities: string[];
};

const include = {
  host: { select: { id: true, name: true } },
  images: { orderBy: { position: "asc" as const } },
  reviews: true,
  amenities: { include: { amenity: true } }
};

function avg(reviews: Array<{ rating: number }>) {
  if (!reviews.length) return 0;
  return reviews.reduce((total, review) => total + review.rating, 0) / reviews.length;
}

export function toListingView(listing: { id: string; slug: string; hostId?: string; host?: { id: string; name: string }; title: string; city: string; country: string; address: string; pricePerNight: unknown; guests: number; bedrooms: number; beds: number; bathrooms: number; type: string; description: string; houseRules: string; images: Array<{ url: string }>; reviews: Array<{ rating: number }>; amenities: Array<{ amenity: { name: string } }> }): ListingView {
  const gallery = listing.images.map((image) => image.url);
  return {
    id: listing.id,
    slug: listing.slug,
    hostId: listing.host?.id ?? listing.hostId,
    hostName: listing.host?.name,
    title: listing.title,
    city: listing.city,
    country: listing.country,
    address: listing.address,
    price: Number(listing.pricePerNight),
    rating: avg(listing.reviews),
    reviews: listing.reviews.length,
    guests: listing.guests,
    bedrooms: listing.bedrooms,
    beds: listing.beds,
    bathrooms: listing.bathrooms,
    type: listing.type.replaceAll("_", " "),
    image: gallery[0] ?? fallbackImage,
    gallery: gallery.length ? gallery : [fallbackImage],
    description: listing.description,
    rules: listing.houseRules,
    amenities: listing.amenities.map((item) => item.amenity.name)
  };
}

export async function getListings(params?: { destination?: string; maxPrice?: string; type?: string; guests?: string; amenity?: string | string[] }) {
  try {
    const destination = params?.destination;
    const maxPrice = params?.maxPrice;
    const guests = params?.guests;
    const type = params?.type;
    const selectedAmenities = Array.isArray(params?.amenity) ? params?.amenity : params?.amenity ? [params.amenity] : [];
    const data = await prisma.listing.findMany({
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
        ...(maxPrice ? { pricePerNight: { lte: Number(maxPrice) } } : {}),
        ...(guests ? { guests: { gte: Number(guests) } } : {}),
        ...(type ? { type: type as never } : {}),
        ...(selectedAmenities.length ? { amenities: { some: { amenity: { name: { in: selectedAmenities } } } } } : {})
      },
      include,
      orderBy: { createdAt: "desc" },
      take: 60
    });
    return data.map(toListingView);
  } catch {
    return [];
  }
}

export async function getListing(id: string) {
  try {
    const listing = await prisma.listing.findFirst({ where: { OR: [{ id }, { slug: id }] }, include });
    if (listing) return toListingView(listing);
  } catch {
  }
  return null;
}
