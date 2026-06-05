import { DashboardShell } from "@/components/dashboard-shell";

const links = [["Dashboard", "/admin"], ["Utilisateurs", "/admin/users"], ["Logements", "/admin/listings"], ["Réservations", "/admin/bookings"]];

export default function AdminUsersPage() {
  return (
    <DashboardShell title="Administration" links={links}>
      <div className="rounded-md border border-ink/10 bg-white p-5">
        <h1 className="text-xl font-semibold">Gestion utilisateurs</h1>
        <div className="mt-5 grid gap-3">
          {["Nora Benali · Hôte", "Amine Haddad · Voyageur", "Admin Amkan · Administrateur"].map((user) => (
            <div key={user} className="flex items-center justify-between rounded-md border border-ink/10 p-4">
              <span>{user}</span>
              <button className="rounded-md border border-ink/10 px-3 py-2 text-sm">Désactiver</button>
            </div>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}
