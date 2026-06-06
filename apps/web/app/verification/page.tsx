export default function VerificationPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold">Vérification hôte</h1>
      <p className="mt-2 text-ink/60">KYC complet: pièce d&apos;identité, selfie, téléphone et email.</p>
      <section className="mt-6 grid gap-4 md:grid-cols-4">
        {["Pièce d'identité", "Selfie", "Téléphone", "Email"].map((item) => (
          <div key={item} className="rounded-md border border-ink/10 bg-white p-5">
            <p className="font-semibold">{item}</p>
            <p className="mt-2 text-sm text-ink/60">Statut: En attente</p>
            <button className="mt-4 rounded-md border border-ink/10 px-3 py-2 text-sm font-semibold">Uploader</button>
          </div>
        ))}
      </section>
    </main>
  );
}
