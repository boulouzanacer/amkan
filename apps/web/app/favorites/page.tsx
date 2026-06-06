import { ListingCard } from "@/components/listing-card";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { toListingView } from "@/lib/listing-data";
import { EmptyState } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function FavoritesPage() {
  const user = await getCurrentUser();
  const favorites = user
    ? await prisma.favorite.findMany({
        where: { userId: user.id },
        include: { listing: { include: { images: true, reviews: true, amenities: { include: { amenity: true } } } } },
        orderBy: { createdAt: "desc" }
      })
    : [];
  const listings = favorites.map((favorite) => toListingView(favorite.listing));

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold">Mes favoris</h1>
      <div className="mt-4 flex flex-wrap gap-3">
        {["Week-end mer", "Famille", "Télétravail"].map((collection) => (
          <button key={collection} className="rounded-md border border-ink/10 bg-white px-4 py-2 text-sm font-semibold">{collection}</button>
        ))}
        <Link href="/favorites/compare" className="rounded-md bg-ink px-4 py-2 text-sm font-semibold text-white">Comparer</Link>
      </div>
      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {listings.map((listing) => (
          <ListingCard key={listing.id} listing={listing} />
        ))}
      </div>
      {!user ? <div className="mt-6"><EmptyState title="Connexion requise" body="Connectez-vous pour enregistrer et organiser vos favoris." /></div> : null}
      {user && !listings.length ? <div className="mt-6"><EmptyState title="Aucun favori" body="Ajoutez des logements pour les retrouver ici." /></div> : null}
    </main>
  );
}
