import { DashboardShell } from "@/components/dashboard-shell";
import { adminQueues, hostRevenue } from "@/lib/premium-data";

const links = [["Dashboard", "/admin"], ["Utilisateurs", "/admin/users"], ["Logements", "/admin/listings"], ["Réservations", "/admin/bookings"], ["Opérations", "/admin/operations"]];

export default function AdminOperationsPage() {
  return (
    <DashboardShell title="Administration" links={links}>
      <div className="grid gap-5">
        <section className="grid gap-4 md:grid-cols-4">
          {hostRevenue.map(([label, value]) => (
            <div key={label} className="rounded-md border border-ink/10 bg-white p-5">
              <p className="text-sm text-ink/55">{label}</p>
              <p className="mt-2 text-2xl font-semibold">{value}</p>
            </div>
          ))}
        </section>
        <section className="rounded-md border border-ink/10 bg-white p-5">
          <h1 className="text-xl font-semibold">Files de modération</h1>
          <div className="mt-5 grid gap-3">
            {adminQueues.map(([label, count, body]) => (
              <div key={label} className="flex items-center justify-between rounded-md border border-ink/10 p-4">
                <div>
                  <p className="font-semibold">{label}</p>
                  <p className="text-sm text-ink/60">{body}</p>
                </div>
                <span className="rounded-md bg-mist px-3 py-2 font-semibold">{count}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </DashboardShell>
  );
}
