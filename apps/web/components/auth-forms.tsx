"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const form = new FormData(event.currentTarget);
    const result = await signIn("credentials", {
      email: String(form.get("email")),
      password: String(form.get("password")),
      redirect: false
    });
    setLoading(false);
    if (result?.error) {
      setError("Email ou mot de passe incorrect.");
      return;
    }
    router.push("/profile");
    router.refresh();
  }

  return (
    <>
      <form onSubmit={submit} className="mt-6 grid gap-4">
        <input name="email" type="email" placeholder="Email" className="min-h-12 rounded-md border border-ink/10 px-4" required />
        <input name="password" type="password" placeholder="Mot de passe" className="min-h-12 rounded-md border border-ink/10 px-4" required />
        {error ? <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
        <button disabled={loading} className="min-h-12 rounded-md bg-ink font-semibold text-white disabled:opacity-60">
          {loading ? "Connexion..." : "Se connecter"}
        </button>
      </form>
      <div className="mt-4 grid gap-2">
        <button onClick={() => signIn("google", { callbackUrl: "/profile" })} className="min-h-11 rounded-md border border-ink/10 font-semibold">Continuer avec Google</button>
        <button onClick={() => signIn("facebook", { callbackUrl: "/profile" })} className="min-h-11 rounded-md border border-ink/10 font-semibold">Continuer avec Facebook</button>
      </div>
    </>
  );
}

export function RegisterForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const form = new FormData(event.currentTarget);
    const payload = {
      name: String(form.get("name")),
      email: String(form.get("email")),
      password: String(form.get("password")),
      role: String(form.get("role"))
    };
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (!response.ok) {
      setLoading(false);
      setError("Impossible de créer le compte. Vérifiez les informations.");
      return;
    }
    await signIn("credentials", { email: payload.email, password: payload.password, redirect: false });
    setLoading(false);
    router.push("/profile");
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="mt-6 grid gap-4">
      <input name="name" placeholder="Nom complet" className="min-h-12 rounded-md border border-ink/10 px-4" required />
      <input name="email" type="email" placeholder="Email" className="min-h-12 rounded-md border border-ink/10 px-4" required />
      <input name="password" type="password" placeholder="Mot de passe" className="min-h-12 rounded-md border border-ink/10 px-4" minLength={8} required />
      <select name="role" className="min-h-12 rounded-md border border-ink/10 px-4">
        <option value="TRAVELER">Voyageur</option>
        <option value="HOST">Hôte</option>
      </select>
      {error ? <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
      <button disabled={loading} className="min-h-12 rounded-md bg-palm font-semibold text-white disabled:opacity-60">
        {loading ? "Création..." : "S'inscrire"}
      </button>
    </form>
  );
}
