import { EmptyState } from "@/components/ui";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { toListingView } from "@/lib/listing-data";

export const dynamic = "force-dynamic";

export default async function CompareFavoritesPage() {
  const user = await getCurrentUser();
  if (!user) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <EmptyState title="Connexion requise" body="Connectez-vous pour comparer vos logements favoris." />
      </main>
    );
  }
  const favorites = await prisma.favorite.findMany({
    where: { userId: user.id },
    include: { listing: { include: { host: { select: { id: true, name: true } }, images: true, reviews: true, amenities: { include: { amenity: true } } } } },
    orderBy: { createdAt: "desc" },
    take: 8
  });
  const listings = favorites.map((favorite) => toListingView(favorite.listing));

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold">Comparer des logements</h1>
      {!listings.length ? <div className="mt-6"><EmptyState title="Aucun favori à comparer" body="Ajoutez des logements à vos favoris pour construire votre tableau comparatif." /></div> : null}
      <div className="mt-6 overflow-x-auto rounded-md border border-ink/10 bg-white">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-mist">
            <tr>
              <th className="p-4">Logement</th>
              <th className="p-4">Prix</th>
              <th className="p-4">Note</th>
              <th className="p-4">Capacité</th>
              <th className="p-4">Note privée</th>
            </tr>
          </thead>
          <tbody>
            {listings.map((listing) => (
              <tr key={listing.id} className="border-t border-ink/10">
                <td className="p-4 font-semibold">{listing.title}</td>
                <td className="p-4">{listing.price} EUR</td>
                <td className="p-4">{listing.rating}</td>
                <td className="p-4">{listing.guests} voyageurs</td>
                <td className="p-4 text-ink/60">{listing.city}, {listing.country}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
