import { EmptyState } from "@/components/ui";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function TravelerBookingsPage() {
  const user = await getCurrentUser();
  if (!user) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <EmptyState title="Connexion requise" body="Connectez-vous pour voir vos réservations." />
      </main>
    );
  }
  const bookings = await prisma.booking.findMany({
    where: { userId: user.id },
    include: { listing: true, payment: true },
    orderBy: { createdAt: "desc" }
  });

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold">Mes réservations</h1>
      <div className="mt-5 grid gap-4">
        {bookings.map((booking) => (
          <Link key={booking.id} href={`/listing/${booking.listingId}`} className="rounded-md border border-ink/10 bg-white p-5">
            <p className="font-semibold">{booking.listing.title}</p>
            <p className="mt-1 text-sm text-ink/60">
              {booking.checkIn.toLocaleDateString("fr-FR")} - {booking.checkOut.toLocaleDateString("fr-FR")} · {booking.status} · {Number(booking.total)} EUR
            </p>
          </Link>
        ))}
        {!bookings.length ? <EmptyState title="Aucune réservation" body="Vos réservations apparaîtront ici après confirmation." /> : null}
      </div>
    </main>
  );
}
