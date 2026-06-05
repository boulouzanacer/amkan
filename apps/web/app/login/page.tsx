import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-md place-items-center px-4 py-10">
      <section className="w-full rounded-md border border-ink/10 bg-white p-6 shadow-soft">
        <h1 className="text-2xl font-semibold">Connexion</h1>
        <form className="mt-6 grid gap-4">
          <input type="email" placeholder="Email" className="min-h-12 rounded-md border border-ink/10 px-4" />
          <input type="password" placeholder="Mot de passe" className="min-h-12 rounded-md border border-ink/10 px-4" />
          <button className="min-h-12 rounded-md bg-ink font-semibold text-white">Se connecter</button>
        </form>
        <div className="mt-4 grid gap-2">
          <button className="min-h-11 rounded-md border border-ink/10 font-semibold">Continuer avec Google</button>
          <button className="min-h-11 rounded-md border border-ink/10 font-semibold">Continuer avec Facebook</button>
        </div>
        <div className="mt-5 flex justify-between text-sm">
          <a href="#" className="text-palm">Mot de passe oublié</a>
          <Link href="/register" className="font-medium">Créer un compte</Link>
        </div>
      </section>
    </main>
  );
}
