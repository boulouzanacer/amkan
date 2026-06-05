import Link from "next/link";
import { DashboardShell } from "@/components/dashboard-shell";
import { listings } from "@/lib/mock-data";

const links = [["Dashboard", "/host/dashboard"], ["Mes logements", "/host/listings"], ["Ajouter", "/host/listings/new"], ["Réservations", "/host/bookings"]];

export default function HostListingsPage() {
  return (
    <DashboardShell title="Espace hôte" links={links}>
      <div className="rounded-md border border-ink/10 bg-white p-5">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Mes logements</h1>
          <Link href="/host/listings/new" className="rounded-md bg-ink px-4 py-2 text-sm font-semibold text-white">Ajouter</Link>
        </div>
        <div className="mt-5 grid gap-3">
          {listings.map((listing) => (
            <div key={listing.id} className="flex flex-col gap-3 rounded-md border border-ink/10 p-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="font-semibold">{listing.title}</p>
                <p className="text-sm text-ink/60">{listing.city} · {listing.price} EUR/nuit</p>
              </div>
              <div className="flex gap-2">
                <button className="rounded-md border border-ink/10 px-3 py-2 text-sm">Modifier</button>
                <button className="rounded-md border border-red-200 px-3 py-2 text-sm text-red-700">Supprimer</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}
