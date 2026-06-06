import { DashboardShell } from "@/components/dashboard-shell";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { HostBookingActions } from "@/components/booking-actions";

const links = [["Dashboard", "/host/dashboard"], ["Mes logements", "/host/listings"], ["Ajouter", "/host/listings/new"], ["Calendrier", "/host/calendar"], ["Analytics", "/host/analytics"], ["Réservations", "/host/bookings"]];

export const dynamic = "force-dynamic";

export default async function HostBookingsPage() {
  const user = await getCurrentUser();
  const bookings = user
    ? await prisma.booking.findMany({
        where: { listing: { hostId: user.id } },
        include: { listing: true, user: true, payment: true },
        orderBy: { createdAt: "desc" }
      })
    : [];

  return (
    <DashboardShell title="Espace hôte" links={links}>
      <div className="rounded-md border border-ink/10 bg-white p-5">
        <h1 className="text-xl font-semibold">Réservations reçues</h1>
        <div className="mt-5 grid gap-3">
          {bookings.map((booking) => (
            <div key={booking.id} className="flex flex-col gap-4 rounded-md border border-ink/10 p-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="font-semibold">{booking.listing.title}</p>
                <p className="text-sm text-ink/60">
                  {booking.user.name} · {booking.checkIn.toLocaleDateString("fr-FR")} - {booking.checkOut.toLocaleDateString("fr-FR")} · {booking.payment?.method ?? "N/A"} · {Number(booking.total)} EUR
                </p>
              </div>
              <div className="flex flex-col gap-2 md:flex-row md:items-center">
                <span className="rounded-md bg-mist px-3 py-2 text-sm font-medium">{booking.status}</span>
                <HostBookingActions bookingId={booking.id} />
              </div>
            </div>
          ))}
          {!bookings.length ? <p className="rounded-md bg-mist p-4 text-sm text-ink/60">Aucune réservation reçue.</p> : null}
        </div>
      </div>
    </DashboardShell>
  );
}
