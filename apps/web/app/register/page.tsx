import Link from "next/link";

export default function RegisterPage() {
  return (
    <main className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-md place-items-center px-4 py-10">
      <section className="w-full rounded-md border border-ink/10 bg-white p-6 shadow-soft">
        <h1 className="text-2xl font-semibold">Créer un compte</h1>
        <form className="mt-6 grid gap-4">
          <input name="name" placeholder="Nom complet" className="min-h-12 rounded-md border border-ink/10 px-4" />
          <input name="email" type="email" placeholder="Email" className="min-h-12 rounded-md border border-ink/10 px-4" />
          <input name="password" type="password" placeholder="Mot de passe" className="min-h-12 rounded-md border border-ink/10 px-4" />
          <select name="role" className="min-h-12 rounded-md border border-ink/10 px-4">
            <option value="TRAVELER">Voyageur</option>
            <option value="HOST">Hôte</option>
          </select>
          <button className="min-h-12 rounded-md bg-palm font-semibold text-white">S&apos;inscrire</button>
        </form>
        <p className="mt-5 text-sm text-ink/65">
          Déjà inscrit ? <Link href="/login" className="font-semibold text-ink">Connexion</Link>
        </p>
      </section>
    </main>
  );
}
