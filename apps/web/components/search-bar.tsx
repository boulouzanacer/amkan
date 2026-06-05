import { CalendarDays, MapPin, Search, UsersRound } from "lucide-react";

export function SearchBar() {
  return (
    <form action="/search" className="grid gap-2 rounded-md bg-white p-2 shadow-soft md:grid-cols-[1.4fr_1fr_1fr_0.8fr_auto]">
      <label className="flex min-h-14 items-center gap-3 rounded-md border border-ink/10 px-4">
        <MapPin className="h-5 w-5 text-palm" />
        <input name="destination" placeholder="Destination" className="w-full outline-none" />
      </label>
      <label className="flex min-h-14 items-center gap-3 rounded-md border border-ink/10 px-4">
        <CalendarDays className="h-5 w-5 text-palm" />
        <input name="checkIn" type="date" className="w-full outline-none" />
      </label>
      <label className="flex min-h-14 items-center gap-3 rounded-md border border-ink/10 px-4">
        <CalendarDays className="h-5 w-5 text-palm" />
        <input name="checkOut" type="date" className="w-full outline-none" />
      </label>
      <label className="flex min-h-14 items-center gap-3 rounded-md border border-ink/10 px-4">
        <UsersRound className="h-5 w-5 text-palm" />
        <input name="guests" type="number" min="1" placeholder="Voyageurs" className="w-full outline-none" />
      </label>
      <button className="inline-flex min-h-14 items-center justify-center gap-2 rounded-md bg-clay px-6 font-semibold text-white hover:bg-palm">
        <Search className="h-5 w-5" />
        <span>Rechercher</span>
      </button>
    </form>
  );
}
