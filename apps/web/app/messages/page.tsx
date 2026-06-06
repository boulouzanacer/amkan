import { EmptyState } from "@/components/ui";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { MessagesClient, type ConversationView } from "@/components/messages-client";

export const dynamic = "force-dynamic";

export default async function MessagesPage() {
  const user = await getCurrentUser();
  if (!user) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <EmptyState title="Connexion requise" body="Connectez-vous pour consulter votre messagerie." />
      </main>
    );
  }

  const conversations = await prisma.conversation.findMany({
    where: { OR: [{ travelerId: user.id }, { hostId: user.id }] },
    include: {
      listing: { select: { id: true, title: true } },
      traveler: { select: { id: true, name: true, role: true } },
      host: { select: { id: true, name: true, role: true } },
      messages: {
        include: { sender: { select: { id: true, name: true, role: true } } },
        orderBy: { createdAt: "asc" }
      }
    },
    orderBy: { updatedAt: "desc" }
  });

  const data: ConversationView[] = conversations.map((conversation) => ({
    id: conversation.id,
    travelerId: conversation.travelerId,
    hostId: conversation.hostId,
    listing: conversation.listing,
    traveler: conversation.traveler,
    host: conversation.host,
    updatedAt: conversation.updatedAt.toISOString(),
    messages: conversation.messages.map((message) => ({
      id: message.id,
      senderId: message.senderId,
      body: message.body,
      createdAt: message.createdAt.toISOString(),
      sender: message.sender
    }))
  }));

  if (!data.length) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <EmptyState title="Aucune conversation" body="Contactez un hôte depuis une annonce ou attendez le premier message voyageur." />
      </main>
    );
  }

  return <MessagesClient currentUserId={user.id} conversations={data} />;
}
