import { DashboardShell } from "@/components/dashboard-shell";
import { HostListingWizard } from "@/components/host-listing-wizard";

const links = [["Dashboard", "/host/dashboard"], ["Mes logements", "/host/listings"], ["Ajouter", "/host/listings/new"], ["Calendrier", "/host/calendar"], ["Analytics", "/host/analytics"], ["Réservations", "/host/bookings"]];

export default function NewListingPage() {
  return (
    <DashboardShell title="Espace hôte" links={links}>
      <HostListingWizard />
    </DashboardShell>
  );
}
