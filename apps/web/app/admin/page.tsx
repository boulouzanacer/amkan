import { DashboardShell } from "@/components/dashboard-shell";
import { prisma } from "@/lib/prisma";

const links = [["Dashboard", "/admin"], ["Utilisateurs", "/admin/users"], ["Logements", "/admin/listings"], ["Réservations", "/admin/bookings"], ["Opérations", "/admin/operations"]];

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const [users, listings, bookings, revenue] = await Promise.all([
    prisma.user.count().catch(() => 0),
    prisma.listing.count().catch(() => 0),
    prisma.booking.count().catch(() => 0),
    prisma.payment.aggregate({ _sum: { amount: true } }).catch(() => ({ _sum: { amount: 0 } }))
  ]);
  const stats = [
    ["Utilisateurs", String(users)],
    ["Logements", String(listings)],
    ["Réservations", String(bookings)],
    ["Chiffre d'affaires", `${Number(revenue._sum.amount ?? 0)} EUR`]
  ];

  return (
    <DashboardShell title="Administration" links={links}>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {stats.map(([label, value]) => (
          <div key={label} className="rounded-md border border-ink/10 bg-white p-5">
            <p className="text-sm text-ink/55">{label}</p>
            <p className="mt-2 text-2xl font-semibold">{value}</p>
          </div>
        ))}
      </div>
      <div className="mt-6 rounded-md border border-ink/10 bg-white p-5">
        <h2 className="text-xl font-semibold">Modération</h2>
        <p className="mt-2 text-ink/65">Gérer comptes, logements, réservations, paiements et avis signalés depuis cet espace.</p>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-4">
        {["Vérification annonces", "KYC hôtes", "Signalements", "Litiges"].map((item) => (
          <div key={item} className="rounded-md border border-ink/10 bg-white p-4">
            <p className="font-semibold">{item}</p>
            <p className="mt-2 text-sm text-ink/60">File opérationnelle prête pour workflow admin.</p>
          </div>
        ))}
      </div>
    </DashboardShell>
  );
}
