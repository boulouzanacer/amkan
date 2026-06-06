"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type ListingOption = { id: string; title: string };

export function CalendarManager({ listings }: { listings: ListingOption[] }) {
  const router = useRouter();
  const [listingId, setListingId] = useState(listings[0]?.id ?? "");
  const [date, setDate] = useState("");
  const [price, setPrice] = useState("");
  const [isBlocked, setIsBlocked] = useState(true);
  const [message, setMessage] = useState("");
  const disabled = !listingId || !date;

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    const response = await fetch("/api/calendar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ listingId, date, isBlocked, price: price ? Number(price) : undefined })
    });
    setMessage(response.ok ? "Disponibilité enregistrée." : "Impossible d'enregistrer cette date.");
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="grid gap-3 rounded-md border border-ink/10 bg-white p-4 md:grid-cols-[1fr_160px_140px_160px_auto]">
      <select value={listingId} onChange={(event) => setListingId(event.target.value)} className="min-h-11 rounded-md border border-ink/10 px-3">
        {listings.map((listing) => (
          <option key={listing.id} value={listing.id}>{listing.title}</option>
        ))}
      </select>
      <input value={date} onChange={(event) => setDate(event.target.value)} type="date" className="min-h-11 rounded-md border border-ink/10 px-3" />
      <input value={price} onChange={(event) => setPrice(event.target.value)} type="number" min="1" placeholder="Prix" className="min-h-11 rounded-md border border-ink/10 px-3" />
      <label className="flex min-h-11 items-center gap-2 rounded-md border border-ink/10 px-3 text-sm">
        <input checked={isBlocked} onChange={(event) => setIsBlocked(event.target.checked)} type="checkbox" className="accent-palm" />
        Bloquer
      </label>
      <button disabled={disabled} className="rounded-md bg-palm px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">Enregistrer</button>
      {message ? <p className="md:col-span-5 text-sm text-ink/65">{message}</p> : null}
    </form>
  );
}
