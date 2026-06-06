"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function HostBookingActions({ bookingId }: { bookingId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState("");
  const [error, setError] = useState("");

  async function update(status: "CONFIRMED" | "REFUSED" | "COMPLETED" | "CANCELLED") {
    setError("");
    setLoading(status);
    const response = await fetch(`/api/bookings/${bookingId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    });
    setLoading("");
    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      setError(body.error ?? "Action impossible.");
      return;
    }
    router.refresh();
  }

  return (
    <div className="grid gap-2">
      <div className="flex flex-wrap gap-2">
        <button type="button" disabled={Boolean(loading)} onClick={() => update("CONFIRMED")} className="rounded-md bg-palm px-3 py-2 text-sm font-semibold text-white disabled:opacity-60">Accepter</button>
        <button type="button" disabled={Boolean(loading)} onClick={() => update("REFUSED")} className="rounded-md border border-red-200 px-3 py-2 text-sm font-semibold text-red-700 disabled:opacity-60">Refuser</button>
        <button type="button" disabled={Boolean(loading)} onClick={() => update("COMPLETED")} className="rounded-md border border-ink/10 px-3 py-2 text-sm font-semibold disabled:opacity-60">Terminer</button>
        <button type="button" disabled={Boolean(loading)} onClick={() => update("CANCELLED")} className="rounded-md border border-ink/10 px-3 py-2 text-sm font-semibold disabled:opacity-60">Annuler</button>
      </div>
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
    </div>
  );
}
