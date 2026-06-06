import { Filter, MapPinned, Search, SlidersHorizontal } from "lucide-react";
import { ListingCard } from "@/components/listing-card";
import { amenities } from "@/lib/mock-data";
import { getListings } from "@/lib/listing-data";

export const dynamic = "force-dynamic";

export default async function SearchPage({ searchParams }: { searchParams: { destination?: string; maxPrice?: string; guests?: string; type?: string } }) {
  const listings = await getListings(searchParams);
  return (
    <main className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[320px_1fr] lg:px-8">
      <aside className="h-fit rounded-md border border-ink/10 bg-white p-5">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-5 w-5 text-palm" />
          <h1 className="text-xl font-semibold">Filtres</h1>
        </div>
        <div className="mt-5 grid gap-4">
          <label className="grid gap-2 text-sm font-medium">
            Recherche intelligente
            <div className="flex min-h-11 items-center gap-2 rounded-md border border-ink/10 px-3">
              <Search className="h-4 w-4 text-palm" />
              <input className="w-full outline-none" placeholder="Quartier, point d'intérêt, correction auto" />
            </div>
          </label>
          {["Ville, pays ou adresse", "Prix maximum", "Type de logement", "Chambres", "Voyageurs"].map((label) => (
            <label key={label} className="grid gap-2 text-sm font-medium">
              {label}
              <input className="min-h-11 rounded-md border border-ink/10 px-3 outline-none focus:border-palm" placeholder={label} />
            </label>
          ))}
          <div>
            <p className="mb-2 text-sm font-medium">Équipements</p>
            <div className="grid gap-2">
              {[...amenities, "Jacuzzi", "Front de mer", "Vue montagne", "Accessible PMR", "Télétravail", "Recharge voiture électrique"].map((amenity) => (
                <label key={amenity} className="flex items-center gap-2 text-sm text-ink/70">
                  <input type="checkbox" className="h-4 w-4 accent-palm" />
                  {amenity}
                </label>
              ))}
            </div>
          </div>
          <label className="grid gap-2 text-sm font-medium">
            Tri
            <select className="min-h-11 rounded-md border border-ink/10 px-3 outline-none">
              <option>Meilleures notes</option>
              <option>Prix croissant</option>
              <option>Prix décroissant</option>
              <option>Plus récent</option>
            </select>
          </label>
          <button className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-ink px-4 font-semibold text-white">
            <Filter className="h-4 w-4" />
            Appliquer
          </button>
        </div>
      </aside>

      <section className="grid gap-6">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Recherche de logements</h1>
            <p className="mt-1 text-sm text-ink/60">{listings.length} logements disponibles avec affichage liste et carte.</p>
          </div>
        </div>
        <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
          <div className="grid gap-5 sm:grid-cols-2">
            {listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
          <div className="map-placeholder sticky top-24 hidden h-[620px] rounded-md border border-ink/10 bg-mist p-5 xl:block">
            <div className="rounded-md bg-white p-4 shadow-sm">
              <MapPinned className="mb-2 h-6 w-6 text-palm" />
              <p className="font-semibold">Carte interactive</p>
              <p className="mt-1 text-sm text-ink/60">Clustering, prix sur carte, zoom intelligent et recherche dans la zone visible.</p>
              <div className="mt-4 grid gap-2">
                {listings.map((listing) => (
                  <div key={listing.id} className="flex items-center justify-between rounded-md bg-mist px-3 py-2 text-sm">
                    <span>{listing.city}</span>
                    <span className="font-semibold">{listing.price} EUR</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
