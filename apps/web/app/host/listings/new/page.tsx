import { DashboardShell } from "@/components/dashboard-shell";
import { amenities } from "@/lib/mock-data";

const links = [["Dashboard", "/host/dashboard"], ["Mes logements", "/host/listings"], ["Ajouter", "/host/listings/new"], ["Réservations", "/host/bookings"]];

export default function NewListingPage() {
  return (
    <DashboardShell title="Espace hôte" links={links}>
      <form className="grid gap-5 rounded-md border border-ink/10 bg-white p-5">
        <h1 className="text-xl font-semibold">Ajouter un logement</h1>
        <div className="grid gap-4 md:grid-cols-2">
          {["Titre", "Adresse", "Ville", "Pays", "Prix par nuit", "Voyageurs", "Chambres", "Lits", "Salles de bain"].map((field) => (
            <label key={field} className="grid gap-2 text-sm font-medium">
              {field}
              <input className="min-h-11 rounded-md border border-ink/10 px-3" />
            </label>
          ))}
        </div>
        <label className="grid gap-2 text-sm font-medium">
          Description complète
          <textarea rows={5} className="rounded-md border border-ink/10 p-3" />
        </label>
        <div>
          <p className="mb-2 text-sm font-medium">Équipements</p>
          <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
            {amenities.map((amenity) => (
              <label key={amenity} className="flex items-center gap-2 text-sm">
                <input type="checkbox" className="accent-palm" />
                {amenity}
              </label>
            ))}
          </div>
        </div>
        <button className="w-fit rounded-md bg-palm px-5 py-3 font-semibold text-white">Publier</button>
      </form>
    </DashboardShell>
  );
}
