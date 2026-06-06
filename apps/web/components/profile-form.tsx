"use client";

import { useState } from "react";

export function ProfileForm({ user }: { user: { name: string; email: string; phone?: string | null; bio?: string | null } }) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setLoading(true);
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: String(form.get("name")),
        phone: String(form.get("phone")),
        bio: String(form.get("bio"))
      })
    });
    setLoading(false);
    setMessage(response.ok ? "Profil enregistré." : "Impossible d'enregistrer le profil.");
  }

  return (
    <form onSubmit={submit} className="rounded-md border border-ink/10 bg-white p-5">
      <h1 className="text-2xl font-semibold">Profil utilisateur</h1>
      <div className="mt-6 grid gap-4">
        <input name="name" defaultValue={user.name} placeholder="Nom" className="min-h-12 rounded-md border border-ink/10 px-4" required />
        <input value={user.email} readOnly className="min-h-12 rounded-md border border-ink/10 bg-mist px-4" />
        <input name="phone" defaultValue={user.phone ?? ""} placeholder="Téléphone" className="min-h-12 rounded-md border border-ink/10 px-4" />
        <textarea name="bio" defaultValue={user.bio ?? ""} placeholder="Bio" rows={5} className="rounded-md border border-ink/10 p-4" />
      </div>
      {message ? <p className="mt-4 rounded-md bg-mist px-3 py-2 text-sm">{message}</p> : null}
      <button disabled={loading} className="mt-5 rounded-md bg-palm px-5 py-3 font-semibold text-white disabled:opacity-60">
        {loading ? "Enregistrement..." : "Enregistrer"}
      </button>
    </form>
  );
}
