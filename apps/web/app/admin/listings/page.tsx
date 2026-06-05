import { DashboardShell } from "@/components/dashboard-shell";
import { listings } from "@/lib/mock-data";

const links = [["Dashboard", "/admin"], ["Utilisateurs", "/admin/users"], ["Logements", "/admin/listings"], ["Réservations", "/admin/bookings"]];

export default function AdminListingsPage() {
  return (
    <DashboardShell title="Administration" links={links}>
      <div className="rounded-md border border-ink/10 bg-white p-5">
        <h1 className="text-xl font-semibold">Gestion logements</h1>
        <div className="mt-5 grid gap-3">
          {listings.map((listing) => (
            <div key={listing.id} className="flex items-center justify-between rounded-md border border-ink/10 p-4">
              <span>{listing.title}</span>
              <button className="rounded-md border border-ink/10 px-3 py-2 text-sm">Modérer</button>
            </div>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}
