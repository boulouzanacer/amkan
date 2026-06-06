import { listings } from "@/lib/mock-data";

export default function CompareFavoritesPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold">Comparer des logements</h1>
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
                <td className="p-4 text-ink/60">À visiter hors saison.</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
