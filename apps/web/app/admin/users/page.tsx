import { DashboardShell } from "@/components/dashboard-shell";
import { prisma } from "@/lib/prisma";

const links = [["Dashboard", "/admin"], ["Utilisateurs", "/admin/users"], ["Logements", "/admin/listings"], ["Réservations", "/admin/bookings"], ["Opérations", "/admin/operations"]];

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({ orderBy: { createdAt: "desc" }, take: 50 }).catch(() => []);

  return (
    <DashboardShell title="Administration" links={links}>
      <div className="rounded-md border border-ink/10 bg-white p-5">
        <h1 className="text-xl font-semibold">Gestion utilisateurs</h1>
        <div className="mt-5 grid gap-3">
          {users.map((user) => (
            <div key={user.id} className="flex items-center justify-between rounded-md border border-ink/10 p-4">
              <span>{user.name} · {user.role}</span>
              <button className="rounded-md border border-ink/10 px-3 py-2 text-sm">Désactiver</button>
            </div>
          ))}
          {!users.length ? <p className="rounded-md bg-mist p-4 text-sm text-ink/60">Aucun utilisateur en base.</p> : null}
        </div>
      </div>
    </DashboardShell>
  );
}
