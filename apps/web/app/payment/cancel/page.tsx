import Link from "next/link";

export default function PaymentCancelPage() {
  return (
    <main className="mx-auto grid min-h-[60vh] max-w-xl place-items-center px-4 text-center">
      <div>
        <h1 className="text-3xl font-semibold">Paiement annulé</h1>
        <p className="mt-3 text-ink/65">Aucun montant n&apos;a été capturé. Vous pouvez reprendre votre réservation.</p>
        <Link href="/search" className="mt-6 inline-flex rounded-md bg-ink px-5 py-3 font-semibold text-white">Retour aux logements</Link>
      </div>
    </main>
  );
}
