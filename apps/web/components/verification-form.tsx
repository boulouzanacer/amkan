"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type VerificationDocument = {
  id: string;
  type: "ID_CARD" | "PASSPORT" | "SELFIE" | "PHONE" | "EMAIL";
  url: string;
  status: string;
  createdAt: string;
};

export type VerificationView = {
  status: string;
  notes?: string | null;
  submittedAt?: string | null;
  reviewedAt?: string | null;
  documents: VerificationDocument[];
} | null;

const labels: Record<VerificationDocument["type"], string> = {
  ID_CARD: "Carte d'identité",
  PASSPORT: "Passeport",
  SELFIE: "Selfie",
  PHONE: "Téléphone",
  EMAIL: "Email"
};

export function VerificationForm({ verification }: { verification: VerificationView }) {
  const router = useRouter();
  const [type, setType] = useState<VerificationDocument["type"]>("ID_CARD");
  const [url, setUrl] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    const response = await fetch("/api/verification", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ documents: [{ type, url }] })
    });
    setLoading(false);
    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      setMessage(payload.error ?? "Document non envoyé.");
      return;
    }
    setUrl("");
    setMessage("Document envoyé pour vérification.");
    router.refresh();
  }

  return (
    <div className="grid gap-6">
      <section className="rounded-md border border-ink/10 bg-white p-5">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-semibold">Statut du dossier</h2>
            <p className="mt-1 text-sm text-ink/60">{verification?.notes ?? "Ajoutez les documents nécessaires pour soumettre votre dossier."}</p>
          </div>
          <span className="w-fit rounded-md bg-mist px-3 py-2 text-sm font-semibold text-palm">{verification?.status ?? "UNVERIFIED"}</span>
        </div>
      </section>

      <form onSubmit={submit} className="grid gap-3 rounded-md border border-ink/10 bg-white p-5 md:grid-cols-[220px_1fr_auto]">
        <select value={type} onChange={(event) => setType(event.target.value as VerificationDocument["type"])} className="min-h-12 rounded-md border border-ink/10 px-3">
          {Object.entries(labels).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
        <input value={url} onChange={(event) => setUrl(event.target.value)} type="url" placeholder="Lien sécurisé du document" className="min-h-12 rounded-md border border-ink/10 px-4" required />
        <button disabled={loading} className="rounded-md bg-palm px-5 font-semibold text-white disabled:opacity-60">{loading ? "Envoi..." : "Soumettre"}</button>
        {message ? <p className="md:col-span-3 text-sm text-ink/65">{message}</p> : null}
      </form>

      <section className="grid gap-4 md:grid-cols-4">
        {Object.entries(labels).map(([value, label]) => {
          const doc = verification?.documents.find((item) => item.type === value);
          return (
            <div key={value} className="rounded-md border border-ink/10 bg-white p-5">
              <p className="font-semibold">{label}</p>
              <p className="mt-2 text-sm text-ink/60">Statut: {doc?.status ?? "À envoyer"}</p>
              {doc ? <a href={doc.url} target="_blank" className="mt-4 inline-block rounded-md border border-ink/10 px-3 py-2 text-sm font-semibold" rel="noreferrer">Voir</a> : null}
            </div>
          );
        })}
      </section>
    </div>
  );
}
