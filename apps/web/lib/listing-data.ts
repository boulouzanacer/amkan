import { prisma } from "@/lib/prisma";
import { listings as mockListings } from "@/lib/mock-data";

export type ListingView = {
  id: string;
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
  images: { orderBy: { position: "asc" as const } },
  reviews: true,
  amenities: { include: { amenity: true } }
};

function avg(reviews: Array<{ rating: number }>) {
  if (!reviews.length) return 0;
  return reviews.reduce((total, review) => total + review.rating, 0) / reviews.length;
}

export function toListingView(listing: { id: string; title: string; city: string; country: string; address: string; pricePerNight: unknown; guests: number; bedrooms: number; beds: number; bathrooms: number; type: string; description: string; houseRules: string; images: Array<{ url: string }>; reviews: Array<{ rating: number }>; amenities: Array<{ amenity: { name: string } }> }): ListingView {
  const gallery = listing.images.map((image) => image.url);
  return {
    id: listing.id,
    title: listing.title,
    city: listing.city,
    country: listing.country,
    address: listing.address,
    price: Number(listing.pricePerNight),
    rating: avg(listing.reviews) || 4.8,
    reviews: listing.reviews.length,
    guests: listing.guests,
    bedrooms: listing.bedrooms,
    beds: listing.beds,
    bathrooms: listing.bathrooms,
    type: listing.type.replaceAll("_", " "),
    image: gallery[0] ?? mockListings[0].image,
    gallery: gallery.length ? gallery : mockListings[0].gallery,
    description: listing.description,
    rules: listing.houseRules,
    amenities: listing.amenities.map((item) => item.amenity.name)
  };
}

function fromMock(listing: (typeof mockListings)[number]): ListingView {
  return { ...listing, amenities: ["Wi-Fi", "Parking", "Piscine", "Climatisation", "Cuisine"] };
}

export async function getListings(params?: { destination?: string; maxPrice?: string; type?: string; guests?: string }) {
  try {
    const destination = params?.destination;
    const maxPrice = params?.maxPrice;
    const guests = params?.guests;
    const type = params?.type;
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
        ...(type ? { type: type as never } : {})
      },
      include,
      orderBy: { createdAt: "desc" },
      take: 60
    });
    return data.length ? data.map(toListingView) : mockListings.map(fromMock);
  } catch {
    return mockListings.map(fromMock);
  }
}

export async function getListing(id: string) {
  try {
    const listing = await prisma.listing.findUnique({ where: { id }, include });
    if (listing) return toListingView(listing);
  } catch {
  }
  const mock = mockListings.find((item) => item.id === id);
  return mock ? fromMock(mock) : null;
}
