import Image from "next/image";
import Link from "next/link";
import { Rating } from "@/components/ui";
import { FavoriteButton } from "@/components/marketplace-actions";

type ListingCardProps = {
  listing: {
    id: string;
    slug: string;
    title: string;
    city: string;
    country: string;
    price: number;
    rating: number;
    reviews: number;
    image: string;
    guests: number;
    bedrooms: number;
  };
};

export function ListingCard({ listing }: ListingCardProps) {
  return (
    <article className="group overflow-hidden rounded-md border border-ink/10 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-soft">
      <Link href={`/listing/${listing.slug}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-mist">
          <Image src={listing.image} alt={listing.title} fill className="object-cover transition duration-500 group-hover:scale-105" />
          <FavoriteButton listingId={listing.id} compact />
        </div>
        <div className="space-y-3 p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-semibold text-ink">{listing.title}</h3>
              <p className="mt-1 text-sm text-ink/60">
                {listing.city}, {listing.country}
              </p>
            </div>
            <Rating value={listing.rating} count={listing.reviews} />
          </div>
          <p className="text-sm text-ink/65">
            {listing.guests} voyageurs · {listing.bedrooms} chambres
          </p>
          <p className="font-semibold text-ink">
            {listing.price} EUR <span className="text-sm font-normal text-ink/55">/ nuit</span>
          </p>
        </div>
      </Link>
    </article>
  );
}
