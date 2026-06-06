import { ShieldCheck } from "lucide-react";

export default function SecurityPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold">Sécurité du compte</h1>
      <div className="mt-6 grid gap-5 md:grid-cols-[1fr_1fr]">
        <section className="rounded-md border border-ink/10 bg-white p-5">
          <ShieldCheck className="mb-3 h-6 w-6 text-palm" />
          <h2 className="text-lg font-semibold">Authentification 2FA</h2>
          <p className="mt-2 text-sm text-ink/60">Activez un deuxième facteur pour protéger les hôtes, voyageurs et administrateurs.</p>
          <button className="mt-4 rounded-md bg-palm px-4 py-2 text-sm font-semibold text-white">Activer 2FA</button>
        </section>
        <section className="rounded-md border border-ink/10 bg-white p-5">
          <h2 className="text-lg font-semibold">Historique connexions</h2>
          <div className="mt-4 grid gap-3">
            {["Alger · Chrome · Normal", "Paris · Safari · Nouveau pays", "Oran · Mobile · Normal"].map((event) => (
              <div key={event} className="rounded-md bg-mist p-3 text-sm">{event}</div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
