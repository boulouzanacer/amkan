import { DashboardShell } from "@/components/dashboard-shell";

const links = [["Dashboard", "/host/dashboard"], ["Mes logements", "/host/listings"], ["Ajouter", "/host/listings/new"], ["Calendrier", "/host/calendar"], ["Analytics", "/host/analytics"], ["Réservations", "/host/bookings"]];

export default function HostBookingsPage() {
  return (
    <DashboardShell title="Espace hôte" links={links}>
      <div className="rounded-md border border-ink/10 bg-white p-5">
        <h1 className="text-xl font-semibold">Réservations reçues</h1>
        <div className="mt-5 grid gap-3">
          {["En attente", "Confirmée", "Annulée", "Terminée"].map((status) => (
            <div key={status} className="flex items-center justify-between rounded-md border border-ink/10 p-4">
              <div>
                <p className="font-semibold">Villa Azur face mer</p>
                <p className="text-sm text-ink/60">12 juin - 16 juin · paiement cash</p>
              </div>
              <span className="rounded-md bg-mist px-3 py-1 text-sm font-medium">{status}</span>
            </div>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}
