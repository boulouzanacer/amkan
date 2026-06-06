import { EmptyState } from "@/components/ui";
import { VerificationForm, type VerificationView } from "@/components/verification-form";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function VerificationPage() {
  const user = await getCurrentUser();
  if (!user) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <EmptyState title="Connexion requise" body="Connectez-vous pour soumettre votre vérification." />
      </main>
    );
  }

  const verification = await prisma.hostVerification.findUnique({
    where: { userId: user.id },
    include: { documents: { orderBy: { createdAt: "desc" } } }
  });
  const data: VerificationView = verification
    ? {
        status: verification.status,
        notes: verification.notes,
        submittedAt: verification.submittedAt?.toISOString(),
        reviewedAt: verification.reviewedAt?.toISOString(),
        documents: verification.documents.map((document) => ({
          id: document.id,
          type: document.type,
          url: document.url,
          status: document.status,
          createdAt: document.createdAt.toISOString()
        }))
      }
    : null;

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold">Vérification hôte</h1>
      <p className="mt-2 text-ink/60">KYC complet: pièce d&apos;identité, selfie, téléphone et email.</p>
      <div className="mt-6">
        <VerificationForm verification={data} />
      </div>
    </main>
  );
}
