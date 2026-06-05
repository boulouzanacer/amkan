import { DashboardShell } from "@/components/dashboard-shell";
import { stats } from "@/lib/mock-data";

const links = [["Dashboard", "/admin"], ["Utilisateurs", "/admin/users"], ["Logements", "/admin/listings"], ["Réservations", "/admin/bookings"]];

export default function AdminPage() {
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
    </DashboardShell>
  );
}
