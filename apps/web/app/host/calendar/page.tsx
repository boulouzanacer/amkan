import { CalendarDays, Download, Grip, Upload } from "lucide-react";
import { DashboardShell } from "@/components/dashboard-shell";
import { calendarDays } from "@/lib/premium-data";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CalendarManager } from "@/components/calendar-manager";

const links = [["Dashboard", "/host/dashboard"], ["Mes logements", "/host/listings"], ["Ajouter", "/host/listings/new"], ["Calendrier", "/host/calendar"], ["Analytics", "/host/analytics"], ["Réservations", "/host/bookings"]];

export const dynamic = "force-dynamic";

export default async function HostCalendarPage() {
  const user = await getCurrentUser();
  const listings = user ? await prisma.listing.findMany({ where: { hostId: user.id }, select: { id: true, title: true } }) : [];
  const availability = listings.length
    ? await prisma.availability.findMany({
        where: { listingId: { in: listings.map((listing) => listing.id) } },
        include: { listing: true },
        orderBy: { date: "asc" },
        take: 30
      })
    : [];

  return (
    <DashboardShell title="Espace hôte" links={links}>
      <div className="grid gap-5">
        {listings.length ? <CalendarManager listings={listings} /> : <p className="rounded-md border border-ink/10 bg-white p-4 text-sm text-ink/60">Ajoutez un logement avant de gérer le calendrier.</p>}
        <section className="rounded-md border border-ink/10 bg-white p-5">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-xl font-semibold">Calendrier professionnel</h1>
              <p className="mt-1 text-sm text-ink/60">Vue mois avec blocage manuel, prix par date, week-end et synchronisation iCal.</p>
            </div>
            <div className="flex gap-2">
              <button className="inline-flex items-center gap-2 rounded-md border border-ink/10 px-3 py-2 text-sm font-semibold"><Upload className="h-4 w-4" />Importer</button>
              <button className="inline-flex items-center gap-2 rounded-md bg-ink px-3 py-2 text-sm font-semibold text-white"><Download className="h-4 w-4" />Exporter iCal</button>
            </div>
          </div>
          <div className="mt-5 grid grid-cols-7 gap-2">
            {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map((day) => (
              <div key={day} className="text-center text-xs font-semibold uppercase text-ink/45">{day}</div>
            ))}
            {calendarDays.map((day) => (
              <div key={day.day} className={`min-h-28 rounded-md border p-3 ${day.status === "Bloqué" ? "border-red-200 bg-red-50" : day.status === "Réservé" ? "border-palm/30 bg-mist" : "border-ink/10 bg-white"}`}>
                <div className="flex items-center justify-between">
                  <span className="font-semibold">{day.day}</span>
                  <Grip className="h-4 w-4 text-ink/35" />
                </div>
                <p className="mt-4 text-sm font-semibold">{day.price} EUR</p>
                <p className="mt-1 text-xs text-ink/55">{day.weekend ? "Weekend" : "Semaine"} · {day.status}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-md border border-ink/10 bg-white p-5">
          <h2 className="text-lg font-semibold">Disponibilités enregistrées</h2>
          <div className="mt-4 grid gap-2">
            {availability.map((item) => (
              <div key={item.id} className="flex items-center justify-between rounded-md bg-mist p-3 text-sm">
                <span>{item.listing.title} · {item.date.toLocaleDateString("fr-FR")}</span>
                <span className="font-semibold">{item.isBlocked ? "Bloqué" : "Ouvert"} {item.price ? `· ${Number(item.price)} EUR` : ""}</span>
              </div>
            ))}
            {!availability.length ? <p className="text-sm text-ink/60">Aucune règle enregistrée.</p> : null}
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {["Airbnb", "Booking", "Google Calendar"].map((provider) => (
            <div key={provider} className="rounded-md border border-ink/10 bg-white p-4">
              <CalendarDays className="mb-3 h-5 w-5 text-palm" />
              <p className="font-semibold">Synchronisation {provider}</p>
              <p className="mt-2 text-sm text-ink/60">Importer ou exporter un flux iCal pour éviter les doubles réservations.</p>
            </div>
          ))}
        </section>
      </div>
    </DashboardShell>
  );
}
