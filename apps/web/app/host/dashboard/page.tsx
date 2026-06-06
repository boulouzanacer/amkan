import { DashboardShell } from "@/components/dashboard-shell";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const hostLinks = [["Dashboard", "/host/dashboard"], ["Mes logements", "/host/listings"], ["Ajouter", "/host/listings/new"], ["Calendrier", "/host/calendar"], ["Analytics", "/host/analytics"], ["Réservations", "/host/bookings"]];

export const dynamic = "force-dynamic";

export default async function HostDashboardPage() {
  const user = await getCurrentUser();
  const [listings, bookings, payments] = user
    ? await Promise.all([
        prisma.listing.count({ where: { hostId: user.id } }),
        prisma.booking.count({ where: { listing: { hostId: user.id } } }),
        prisma.payment.findMany({ where: { booking: { listing: { hostId: user.id } } }, select: { amount: true } })
      ])
    : [0, 0, [] as Array<{ amount: unknown }>];
  const revenue = payments.reduce((total, payment) => total + Number(payment.amount), 0);
  const stats = [
    ["Logements", String(listings)],
    ["Réservations", String(bookings)],
    ["Revenus estimés", `${revenue} EUR`],
    ["Taux occupation", bookings ? "76%" : "0%"]
  ];

  return (
    <DashboardShell title="Espace hôte" links={hostLinks}>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {stats.map(([label, value]) => (
          <div key={label} className="rounded-md border border-ink/10 bg-white p-5">
            <p className="text-sm text-ink/55">{label}</p>
            <p className="mt-2 text-2xl font-semibold">{value}</p>
          </div>
        ))}
      </div>
      <div className="mt-6 rounded-md border border-ink/10 bg-white p-5">
        <h2 className="text-xl font-semibold">Revenus estimés</h2>
        <p className="mt-2 text-ink/65">Suivi des réservations confirmées, paiements cash à percevoir et séjours terminés.</p>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {["Calendrier synchronisé", "Guide voyageur", "Vérification hôte"].map((item) => (
          <div key={item} className="rounded-md border border-ink/10 bg-white p-5">
            <p className="font-semibold">{item}</p>
            <p className="mt-2 text-sm text-ink/60">Module premium activé pour améliorer conversion et confiance.</p>
          </div>
        ))}
      </div>
    </DashboardShell>
  );
}
