export default function ProfilePage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <form className="rounded-md border border-ink/10 bg-white p-5">
        <h1 className="text-2xl font-semibold">Profil utilisateur</h1>
        <div className="mt-6 grid gap-4">
          <input placeholder="Nom" className="min-h-12 rounded-md border border-ink/10 px-4" />
          <input placeholder="Email" className="min-h-12 rounded-md border border-ink/10 px-4" />
          <input placeholder="Téléphone" className="min-h-12 rounded-md border border-ink/10 px-4" />
          <textarea placeholder="Bio" rows={5} className="rounded-md border border-ink/10 p-4" />
        </div>
        <button className="mt-5 rounded-md bg-palm px-5 py-3 font-semibold text-white">Enregistrer</button>
      </form>
    </main>
  );
}
