import Link from "next/link";
import { DashboardShell } from "@/components/dashboard-shell";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const links = [["Dashboard", "/host/dashboard"], ["Mes logements", "/host/listings"], ["Ajouter", "/host/listings/new"], ["Calendrier", "/host/calendar"], ["Analytics", "/host/analytics"], ["Réservations", "/host/bookings"]];

export const dynamic = "force-dynamic";

export default async function HostListingsPage() {
  const user = await getCurrentUser();
  const listings = user
    ? await prisma.listing.findMany({ where: { hostId: user.id }, orderBy: { createdAt: "desc" } })
    : [];

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
                <p className="text-sm text-ink/60">{listing.city} · {Number(listing.pricePerNight)} EUR/nuit · {listing.isPublished ? "Publié" : "Brouillon"}</p>
              </div>
              <div className="flex gap-2">
                <Link href={`/listing/${listing.id}`} className="rounded-md border border-ink/10 px-3 py-2 text-sm">Voir</Link>
              </div>
            </div>
          ))}
          {!listings.length ? <p className="rounded-md bg-mist p-4 text-sm text-ink/60">Aucun logement publié pour ce compte.</p> : null}
        </div>
      </div>
    </DashboardShell>
  );
}
