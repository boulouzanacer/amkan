import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { EmptyState } from "@/components/ui";
import { ProfileForm } from "@/components/profile-form";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const sessionUser = await getCurrentUser();
  if (!sessionUser) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <EmptyState title="Connexion requise" body="Connectez-vous pour modifier votre profil." />
      </main>
    );
  }
  const user = await prisma.user.findUnique({ where: { id: sessionUser.id } });
  if (!user) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <EmptyState title="Profil introuvable" body="Votre session existe mais le profil DB est introuvable." />
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <ProfileForm user={user} />
    </main>
  );
}
