import Image from "next/image";
import { notFound } from "next/navigation";
import { Bath, BedDouble, Heart, Home, MapPinned, UsersRound, type LucideIcon } from "lucide-react";
import { amenities, listings } from "@/lib/mock-data";
import { Rating } from "@/components/ui";

export default function ListingDetailPage({ params }: { params: { id: string } }) {
  const listing = listings.find((item) => item.id === params.id);
  if (!listing) notFound();

  const nights = 4;
  const subtotal = nights * listing.price;
  const serviceFee = 38;
  const taxes = 24;

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold">{listing.title}</h1>
          <p className="mt-2 text-ink/65">{listing.address}, {listing.city}, {listing.country}</p>
          <div className="mt-2"><Rating value={listing.rating} count={listing.reviews} /></div>
        </div>
        <button className="inline-flex min-h-11 items-center gap-2 rounded-md border border-ink/10 px-4 font-semibold hover:bg-mist">
          <Heart className="h-4 w-4" />
          Ajouter aux favoris
        </button>
      </div>

      <div className="grid gap-3 md:grid-cols-[2fr_1fr]">
        <div className="relative min-h-[420px] overflow-hidden rounded-md bg-mist">
          <Image src={listing.gallery[0]} alt={listing.title} fill className="object-cover" priority />
        </div>
        <div className="grid gap-3">
          {listing.gallery.slice(1).map((image) => (
            <div key={image} className="relative min-h-[204px] overflow-hidden rounded-md bg-mist">
              <Image src={image} alt={listing.title} fill className="object-cover" />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
        <section className="space-y-8">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {[
              [UsersRound, `${listing.guests} voyageurs`],
              [Home, listing.type],
              [BedDouble, `${listing.bedrooms} chambres`],
              [Bath, `${listing.bathrooms} bains`]
            ].map(([Icon, label]) => {
              const DetailIcon = Icon as LucideIcon;
              return (
                <div key={String(label)} className="rounded-md border border-ink/10 bg-white p-4">
                  <DetailIcon className="mb-3 h-5 w-5 text-palm" />
                  <p className="text-sm font-medium">{String(label)}</p>
                </div>
              );
            })}
          </div>

          <div>
            <h2 className="text-2xl font-semibold">Description</h2>
            <p className="mt-3 leading-7 text-ink/70">{listing.description}</p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold">Équipements</h2>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {amenities.map((amenity) => (
                <span key={amenity} className="rounded-md border border-ink/10 bg-white px-4 py-3 text-sm">{amenity}</span>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold">Règles de la maison</h2>
            <p className="mt-3 leading-7 text-ink/70">{listing.rules}</p>
          </div>

          <div className="map-placeholder h-72 rounded-md border border-ink/10 p-5">
            <div className="w-fit rounded-md bg-white p-4 shadow-sm">
              <MapPinned className="mb-2 h-6 w-6 text-palm" />
              <p className="font-semibold">Adresse sur Google Maps</p>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold">Avis clients</h2>
            <div className="mt-3 rounded-md border border-ink/10 bg-white p-5">
              <Rating value={listing.rating} count={listing.reviews} />
              <p className="mt-3 text-ink/70">Logement très propre, arrivée simple et hôte réactif. Une base parfaite pour explorer la région.</p>
            </div>
          </div>
        </section>

        <aside className="h-fit rounded-md border border-ink/10 bg-white p-5 shadow-soft">
          <p className="text-2xl font-semibold">{listing.price} EUR <span className="text-sm font-normal text-ink/55">/ nuit</span></p>
          <form className="mt-5 grid gap-3">
            <label className="grid gap-2 text-sm font-medium">Arrivée<input type="date" className="min-h-11 rounded-md border border-ink/10 px-3" /></label>
            <label className="grid gap-2 text-sm font-medium">Départ<input type="date" className="min-h-11 rounded-md border border-ink/10 px-3" /></label>
            <label className="grid gap-2 text-sm font-medium">Voyageurs<input type="number" min="1" defaultValue="2" className="min-h-11 rounded-md border border-ink/10 px-3" /></label>
            <button className="min-h-12 rounded-md bg-clay px-4 font-semibold text-white hover:bg-palm">Réserver</button>
          </form>
          <div className="mt-5 grid gap-2 text-sm">
            <p className="flex justify-between"><span>{listing.price} x {nights} nuits</span><span>{subtotal} EUR</span></p>
            <p className="flex justify-between"><span>Frais de service</span><span>{serviceFee} EUR</span></p>
            <p className="flex justify-between"><span>Taxes</span><span>{taxes} EUR</span></p>
            <p className="flex justify-between border-t border-ink/10 pt-3 font-semibold"><span>Total</span><span>{subtotal + serviceFee + taxes} EUR</span></p>
          </div>
        </aside>
      </div>
    </main>
  );
}
