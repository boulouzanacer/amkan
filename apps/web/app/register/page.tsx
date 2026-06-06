import Link from "next/link";
import { RegisterForm } from "@/components/auth-forms";

export default function RegisterPage() {
  return (
    <main className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-md place-items-center px-4 py-10">
      <section className="w-full rounded-md border border-ink/10 bg-white p-6 shadow-soft">
        <h1 className="text-2xl font-semibold">Créer un compte</h1>
        <RegisterForm />
        <p className="mt-5 text-sm text-ink/65">
          Déjà inscrit ? <Link href="/login" className="font-semibold text-ink">Connexion</Link>
        </p>
      </section>
    </main>
  );
}
