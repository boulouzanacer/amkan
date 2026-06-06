import { Bell, Mail, MessageSquare, Smartphone } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { EmptyState } from "@/components/ui";

const icons = { PUSH: Smartphone, EMAIL: Mail, IN_APP: Bell, SMS: MessageSquare };

export const dynamic = "force-dynamic";

export default async function NotificationsPage() {
  const user = await getCurrentUser();
  const notifications = user
    ? await prisma.notification.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" }, take: 40 })
    : [];

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold">Centre de notifications</h1>
      <p className="mt-2 text-ink/60">Temps réel, email, SMS et push mobile dans une seule file d&apos;événements.</p>
      <div className="mt-6 grid gap-3">
        {notifications.map((notification) => {
          const Icon = icons[notification.channel] ?? Bell;
          return (
            <article key={notification.id} className="flex gap-4 rounded-md border border-ink/10 bg-white p-4">
              <div className="grid h-11 w-11 place-items-center rounded-md bg-mist text-palm"><Icon className="h-5 w-5" /></div>
              <div>
                <p className="font-semibold">{notification.title}</p>
                <p className="mt-1 text-sm text-ink/60">{notification.body}</p>
                <p className="mt-2 text-xs font-semibold text-palm">{notification.channel}</p>
              </div>
            </article>
          );
        })}
        {!user ? <EmptyState title="Connexion requise" body="Connectez-vous pour voir vos notifications." /> : null}
        {user && !notifications.length ? <EmptyState title="Aucune notification" body="Les réservations, paiements et messages généreront des notifications ici." /> : null}
      </div>
    </main>
  );
}
