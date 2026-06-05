import { DashboardShell } from "@/components/dashboard-shell";

const links = [["Dashboard", "/admin"], ["Utilisateurs", "/admin/users"], ["Logements", "/admin/listings"], ["Réservations", "/admin/bookings"]];

export default function AdminBookingsPage() {
  return (
    <DashboardShell title="Administration" links={links}>
      <div className="rounded-md border border-ink/10 bg-white p-5">
        <h1 className="text-xl font-semibold">Gestion réservations et paiements</h1>
        <div className="mt-5 grid gap-3">
          {["BK-1021 · Confirmée · Stripe", "BK-1022 · En attente · Cash", "BK-1023 · Annulée · Cash"].map((booking) => (
            <div key={booking} className="flex items-center justify-between rounded-md border border-ink/10 p-4">
              <span>{booking}</span>
              <button className="rounded-md border border-ink/10 px-3 py-2 text-sm">Examiner</button>
            </div>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}
