"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";

export function FavoriteButton({ listingId, compact = false }: { listingId: string; compact?: boolean }) {
  const router = useRouter();
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  async function toggle(event?: React.MouseEvent) {
    event?.preventDefault();
    event?.stopPropagation();
    setLoading(true);
    const response = await fetch("/api/favorites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ listingId })
    });
    setLoading(false);
    if (response.status === 401) {
      router.push("/login");
      return;
    }
    if (response.ok) setSaved(true);
  }

  if (compact) {
    return (
      <button
        type="button"
        aria-label="Ajouter aux favoris"
        onClick={toggle}
        disabled={loading}
        className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-md bg-white/90 text-ink shadow-sm disabled:opacity-60"
      >
        <Heart className={`h-4 w-4 ${saved ? "fill-clay text-clay" : ""}`} />
      </button>
    );
  }

  return (
    <button type="button" onClick={toggle} disabled={loading} className="inline-flex min-h-11 items-center gap-2 rounded-md border border-ink/10 px-4 font-semibold hover:bg-mist disabled:opacity-60">
      <Heart className={`h-4 w-4 ${saved ? "fill-clay text-clay" : ""}`} />
      {saved ? "Ajouté aux favoris" : "Ajouter aux favoris"}
    </button>
  );
}

export function BookingForm({ listingId, price, serviceFee = 18, taxes = 12 }: { listingId: string; price: number; serviceFee?: number; taxes?: number }) {
  const router = useRouter();
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("2");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return 0;
    return Math.max(0, Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86_400_000));
  }, [checkIn, checkOut]);
  const subtotal = nights * price;
  const total = subtotal + serviceFee + taxes;

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (!nights) {
      setError("Choisissez des dates valides.");
      return;
    }
    setLoading(true);
    const response = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ listingId, checkIn, checkOut, guests: Number(guests), method: "CASH" })
    });
    setLoading(false);
    if (response.status === 401) {
      router.push("/login");
      return;
    }
    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      setError(body.error ?? "Réservation impossible.");
      return;
    }
    router.push("/traveler/bookings");
    router.refresh();
  }

  return (
    <>
      <form onSubmit={submit} className="mt-5 grid gap-3">
        <label className="grid gap-2 text-sm font-medium">Arrivée<input value={checkIn} onChange={(event) => setCheckIn(event.target.value)} type="date" className="min-h-11 rounded-md border border-ink/10 px-3" required /></label>
        <label className="grid gap-2 text-sm font-medium">Départ<input value={checkOut} onChange={(event) => setCheckOut(event.target.value)} type="date" className="min-h-11 rounded-md border border-ink/10 px-3" required /></label>
        <label className="grid gap-2 text-sm font-medium">Voyageurs<input value={guests} onChange={(event) => setGuests(event.target.value)} type="number" min="1" className="min-h-11 rounded-md border border-ink/10 px-3" /></label>
        {error ? <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
        <button disabled={loading} className="min-h-12 rounded-md bg-clay px-4 font-semibold text-white hover:bg-palm disabled:opacity-60">
          {loading ? "Réservation..." : "Réserver en cash"}
        </button>
      </form>
      <div className="mt-5 grid gap-2 text-sm">
        <p className="flex justify-between"><span>{price} x {nights || 0} nuits</span><span>{subtotal} EUR</span></p>
        <p className="flex justify-between"><span>Frais de service</span><span>{serviceFee} EUR</span></p>
        <p className="flex justify-between"><span>Taxes</span><span>{taxes} EUR</span></p>
        <p className="flex justify-between border-t border-ink/10 pt-3 font-semibold"><span>Total</span><span>{total} EUR</span></p>
      </div>
    </>
  );
}
