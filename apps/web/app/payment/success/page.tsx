import Link from "next/link";

export default function PaymentSuccessPage() {
  return (
    <main className="mx-auto grid min-h-[60vh] max-w-xl place-items-center px-4 text-center">
      <div>
        <h1 className="text-3xl font-semibold">Réservation confirmée</h1>
        <p className="mt-3 text-ink/65">Votre paiement ou demande cash a bien été enregistré.</p>
        <Link href="/traveler/bookings" className="mt-6 inline-flex rounded-md bg-palm px-5 py-3 font-semibold text-white">Voir mes réservations</Link>
      </div>
    </main>
  );
}
