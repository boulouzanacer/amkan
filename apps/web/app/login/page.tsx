import Link from "next/link";
import { LoginForm } from "@/components/auth-forms";

export default function LoginPage() {
  return (
    <main className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-md place-items-center px-4 py-10">
      <section className="w-full rounded-md border border-ink/10 bg-white p-6 shadow-soft">
        <h1 className="text-2xl font-semibold">Connexion</h1>
        <LoginForm />
        <div className="mt-5 flex justify-between text-sm">
          <span className="text-palm">Mot de passe oublié</span>
          <Link href="/register" className="font-medium">Créer un compte</Link>
        </div>
      </section>
    </main>
  );
}
