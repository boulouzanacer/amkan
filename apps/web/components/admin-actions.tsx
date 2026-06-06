"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

function useAdminMutation() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function run(url: string, body: unknown) {
    setLoading(true);
    setError("");
    const response = await fetch(url, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    setLoading(false);
    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      setError(payload.error ?? "Action impossible.");
      return false;
    }
    router.refresh();
    return true;
  }

  return { loading, error, run };
}

export function AdminUserActions({ userId, isActive }: { userId: string; isActive: boolean }) {
  const { loading, error, run } = useAdminMutation();
  return (
    <div className="grid gap-2 justify-items-end">
      <button type="button" disabled={loading} onClick={() => void run(`/api/admin/users/${userId}`, { isActive: !isActive })} className="rounded-md border border-ink/10 px-3 py-2 text-sm disabled:opacity-60">
        {isActive ? "Désactiver" : "Réactiver"}
      </button>
      {error ? <p className="text-xs text-red-700">{error}</p> : null}
    </div>
  );
}

export function AdminListingActions({ listingId, isPublished }: { listingId: string; isPublished: boolean }) {
  const { loading, error, run } = useAdminMutation();
  return (
    <div className="grid gap-2 justify-items-end">
      <button type="button" disabled={loading} onClick={() => void run(`/api/admin/listings/${listingId}`, { isPublished: !isPublished })} className="rounded-md border border-ink/10 px-3 py-2 text-sm disabled:opacity-60">
        {isPublished ? "Suspendre" : "Publier"}
      </button>
      {error ? <p className="text-xs text-red-700">{error}</p> : null}
    </div>
  );
}

export function VerificationReviewActions({ userId }: { userId: string }) {
  const { loading, error, run } = useAdminMutation();
  return (
    <div className="flex flex-wrap justify-end gap-2">
      <button type="button" disabled={loading} onClick={() => void run("/api/verification", { userId, status: "VERIFIED", notes: "Dossier vérifié." })} className="rounded-md bg-palm px-3 py-2 text-sm font-semibold text-white disabled:opacity-60">
        Valider
      </button>
      <button type="button" disabled={loading} onClick={() => void run("/api/verification", { userId, status: "REJECTED", notes: "Documents à corriger." })} className="rounded-md border border-red-200 px-3 py-2 text-sm font-semibold text-red-700 disabled:opacity-60">
        Rejeter
      </button>
      {error ? <p className="basis-full text-right text-xs text-red-700">{error}</p> : null}
    </div>
  );
}
