import { DashboardShell } from "@/components/dashboard-shell";
import { VerificationReviewActions } from "@/components/admin-actions";
import { prisma } from "@/lib/prisma";

const links = [["Dashboard", "/admin"], ["Utilisateurs", "/admin/users"], ["Logements", "/admin/listings"], ["Réservations", "/admin/bookings"], ["Opérations", "/admin/operations"]];

export const dynamic = "force-dynamic";

export default async function AdminOperationsPage() {
  const [payments, pendingVerifications, reportsOpen, disputesOpen, pendingPayouts] = await Promise.all([
    prisma.payment.aggregate({ _sum: { amount: true, commission: true }, where: { status: { in: ["PAID", "CASH_DUE"] } } }).catch(() => ({ _sum: { amount: 0, commission: 0 } })),
    prisma.hostVerification.findMany({
      where: { status: "PENDING" },
      include: { user: true, documents: { orderBy: { createdAt: "desc" } } },
      orderBy: { submittedAt: "asc" },
      take: 20
    }).catch(() => []),
    prisma.report.count({ where: { status: "OPEN" } }).catch(() => 0),
    prisma.dispute.count({ where: { status: "OPEN" } }).catch(() => 0),
    prisma.payout.count({ where: { status: "PENDING" } }).catch(() => 0)
  ]);
  const queues = [
    ["KYC hôtes", pendingVerifications.length, "Dossiers hôtes à vérifier avant mise en avant."],
    ["Signalements", reportsOpen, "Annonces ou profils signalés par les utilisateurs."],
    ["Litiges", disputesOpen, "Réservations nécessitant une médiation."],
    ["Payouts", pendingPayouts, "Paiements hôtes à préparer ou contrôler."]
  ];
  const revenue = [
    ["Volume traité", `${Number(payments._sum.amount ?? 0)} EUR`],
    ["Commission", `${Number(payments._sum.commission ?? 0)} EUR`],
    ["Taux commission", "12%"],
    ["Files ouvertes", String(queues.reduce((total, [, count]) => total + Number(count), 0))]
  ];

  return (
    <DashboardShell title="Administration" links={links}>
      <div className="grid gap-5">
        <section className="grid gap-4 md:grid-cols-4">
          {revenue.map(([label, value]) => (
            <div key={label} className="rounded-md border border-ink/10 bg-white p-5">
              <p className="text-sm text-ink/55">{label}</p>
              <p className="mt-2 text-2xl font-semibold">{value}</p>
            </div>
          ))}
        </section>
        <section className="rounded-md border border-ink/10 bg-white p-5">
          <h1 className="text-xl font-semibold">Files de modération</h1>
          <div className="mt-5 grid gap-3">
            {queues.map(([label, count, body]) => (
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
        <section className="rounded-md border border-ink/10 bg-white p-5">
          <h2 className="text-xl font-semibold">Dossiers KYC en attente</h2>
          <div className="mt-5 grid gap-3">
            {pendingVerifications.map((verification) => (
              <div key={verification.id} className="grid gap-3 rounded-md border border-ink/10 p-4 md:grid-cols-[1fr_auto] md:items-center">
                <div>
                  <p className="font-semibold">{verification.user.name}</p>
                  <p className="text-sm text-ink/60">{verification.user.email} · {verification.documents.length} document(s)</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {verification.documents.map((document) => (
                      <a key={document.id} href={document.url} target="_blank" rel="noreferrer" className="rounded-md border border-ink/10 px-3 py-1 text-xs font-semibold">
                        {document.type}
                      </a>
                    ))}
                  </div>
                </div>
                <VerificationReviewActions userId={verification.userId} />
              </div>
            ))}
            {!pendingVerifications.length ? <p className="rounded-md bg-mist p-4 text-sm text-ink/60">Aucun dossier KYC en attente.</p> : null}
          </div>
        </section>
      </div>
    </DashboardShell>
  );
}
