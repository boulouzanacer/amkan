import { EmptyState } from "@/components/ui";

export default function TravelerBookingsPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold">Mes réservations</h1>
      <div className="mt-5 grid gap-4">
        <div className="rounded-md border border-ink/10 bg-white p-5">
          <p className="font-semibold">Cabane Atlas</p>
          <p className="mt-1 text-sm text-ink/60">Arrivée 18 juillet · Départ 22 juillet · Statut confirmée</p>
        </div>
        <EmptyState title="Historique complet" body="Les réservations annulées et terminées apparaîtront ici avec les avis disponibles." />
      </div>
    </main>
  );
}
