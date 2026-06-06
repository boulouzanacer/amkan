import Image from "next/image";
import { getListings } from "@/lib/listing-data";
import { ListingCard } from "@/components/listing-card";
import { SearchBar } from "@/components/search-bar";
import { ButtonLink, EmptyState, SectionHeader } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const listings = await getListings();
  const categoryLinks = [
    ["Maisons de plage", "/search?type=BEACH_HOUSE"],
    ["Cabanes", "/search?type=CABIN"],
    ["Villas", "/search?type=VILLA"],
    ["Appartements", "/search?type=APARTMENT"],
    ["Piscine", "/search?amenity=Piscine"],
    ["Vue mer", "/search?amenity=Vue%20mer"],
    ["Montagne", "/search?type=CHALET"],
    ["Luxe", "/search?maxPrice=300"]
  ];
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Amkan",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://amkan.example/search?destination={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <section className="relative min-h-[620px] overflow-hidden bg-ink">
        <Image
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1800&q=85"
          alt="Maison de vacances au bord de la mer"
          fill
          priority
          className="object-cover opacity-75"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/35 via-ink/30 to-ink/80" />
        <div className="relative mx-auto flex min-h-[620px] max-w-7xl flex-col justify-end px-4 pb-10 sm:px-6 lg:px-8">
          <div className="max-w-3xl pb-8 text-white">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-white/80">Séjours choisis, hôtes engagés</p>
            <h1 className="text-4xl font-semibold tracking-normal md:text-6xl">Amkan</h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-white/86">
              Trouvez une villa face mer, une cabane en montagne ou un appartement élégant pour votre prochain séjour.
            </p>
          </div>
          <SearchBar />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex gap-3 overflow-x-auto pb-2">
          {categoryLinks.map(([label, href]) => (
            <a key={label} href={href} className="whitespace-nowrap rounded-md border border-ink/10 bg-white px-4 py-3 text-sm font-medium hover:border-palm hover:text-palm">
              {label}
            </a>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
        <SectionHeader title="Logements à découvrir" subtitle="Une sélection éditoriale pensée pour les familles, couples, télétravailleurs et voyages entre amis." />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
        {!listings.length ? <EmptyState title="Aucun logement publié" body="Les logements apparaîtront ici dès que les hôtes auront publié leurs annonces." /> : null}
      </section>

      <section className="bg-mist py-14">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 md:grid-cols-2 lg:px-8">
          <div>
            <h2 className="text-3xl font-semibold">Publiez votre logement avec maîtrise.</h2>
            <p className="mt-4 leading-7 text-ink/68">
              Gérez photos, disponibilités, tarifs, réservations reçues, messagerie et revenus depuis un tableau de bord hôte clair.
            </p>
          </div>
          <div className="flex items-center md:justify-end">
            <ButtonLink href="/host/listings/new">Ajouter un logement</ButtonLink>
          </div>
        </div>
      </section>
    </main>
  );
}
