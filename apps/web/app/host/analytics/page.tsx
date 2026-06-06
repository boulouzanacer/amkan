import { DashboardShell } from "@/components/dashboard-shell";
import { hostAnalytics, hostRevenue, listingSignals } from "@/lib/premium-data";

const links = [["Dashboard", "/host/dashboard"], ["Mes logements", "/host/listings"], ["Ajouter", "/host/listings/new"], ["Calendrier", "/host/calendar"], ["Analytics", "/host/analytics"], ["Réservations", "/host/bookings"]];

export default function HostAnalyticsPage() {
  return (
    <DashboardShell title="Espace hôte" links={links}>
      <div className="grid gap-5">
        <section className="grid gap-4 md:grid-cols-4">
          {hostRevenue.map(([label, value, trend]) => (
            <div key={label} className="rounded-md border border-ink/10 bg-white p-5">
              <p className="text-sm text-ink/55">{label}</p>
              <p className="mt-2 text-2xl font-semibold">{value}</p>
              <p className="mt-2 text-sm font-medium text-palm">{trend}</p>
            </div>
          ))}
        </section>
        <section className="rounded-md border border-ink/10 bg-white p-5">
          <h1 className="text-xl font-semibold">Graphiques hôte</h1>
          <div className="mt-6 flex h-72 items-end gap-4">
            {hostAnalytics.map((metric) => (
              <div key={metric.label} className="flex flex-1 flex-col items-center gap-3">
                <div className="flex h-56 w-full items-end rounded-md bg-mist px-3">
                  <div className="w-full rounded-t-md bg-palm" style={{ height: metric.height }} />
                </div>
                <p className="text-sm font-medium">{metric.label}</p>
              </div>
            ))}
          </div>
        </section>
        <section className="grid gap-4 md:grid-cols-4">
          {listingSignals.map(([label, value]) => (
            <div key={label} className="rounded-md border border-ink/10 bg-white p-5">
              <p className="text-sm text-ink/55">{label}</p>
              <p className="mt-2 text-2xl font-semibold">{value}</p>
            </div>
          ))}
        </section>
      </div>
    </DashboardShell>
  );
}
