"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type Message = {
  id: string;
  senderId: string;
  body: string;
  createdAt: string;
  sender?: { id: string; name: string; role: string };
};

export type ConversationView = {
  id: string;
  travelerId: string;
  hostId: string;
  listing?: { id: string; title: string } | null;
  traveler: { id: string; name: string; role: string };
  host: { id: string; name: string; role: string };
  messages: Message[];
  updatedAt: string;
};

export function MessagesClient({ currentUserId, conversations: initialConversations }: { currentUserId: string; conversations: ConversationView[] }) {
  const router = useRouter();
  const [conversations, setConversations] = useState(initialConversations);
  const [selectedId, setSelectedId] = useState(initialConversations[0]?.id ?? "");
  const [body, setBody] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const selected = useMemo(() => conversations.find((conversation) => conversation.id === selectedId) ?? conversations[0], [conversations, selectedId]);

  async function sendMessage(messageBody = body) {
    const trimmed = messageBody.trim();
    if (!selected || !trimmed) return;
    setLoading(true);
    setError("");
    const response = await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ conversationId: selected.id, body: trimmed })
    });
    setLoading(false);
    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      setError(payload.error ?? "Message non envoyé.");
      return;
    }
    const message = (await response.json()) as Message;
    setBody("");
    setConversations((items) =>
      items.map((conversation) =>
        conversation.id === selected.id
          ? { ...conversation, messages: [...conversation.messages, { ...message, createdAt: message.createdAt ?? new Date().toISOString() }] }
          : conversation
      )
    );
    router.refresh();
  }

  if (!selected) {
    return (
      <section className="rounded-md border border-dashed border-ink/20 bg-white p-8 text-center">
        <h2 className="text-lg font-semibold">Aucune conversation</h2>
        <p className="mt-2 text-sm text-ink/60">Les échanges avec voyageurs et hôtes apparaîtront ici.</p>
      </section>
    );
  }

  return (
    <main className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[320px_1fr] lg:px-8">
      <aside className="rounded-md border border-ink/10 bg-white p-4">
        <h1 className="text-xl font-semibold">Messagerie</h1>
        <div className="mt-4 grid gap-2">
          {conversations.map((conversation) => {
            const other = conversation.hostId === currentUserId ? conversation.traveler : conversation.host;
            const last = conversation.messages[conversation.messages.length - 1];
            return (
              <button
                key={conversation.id}
                type="button"
                onClick={() => setSelectedId(conversation.id)}
                className={`block w-full rounded-md border p-3 text-left hover:bg-mist ${conversation.id === selected.id ? "border-palm bg-mist" : "border-ink/10"}`}
              >
                <p className="font-medium">{other.name}</p>
                <p className="mt-1 text-xs text-ink/55">{conversation.listing?.title ?? "Conversation générale"}</p>
                <p className="mt-2 line-clamp-2 text-sm text-ink/65">{last?.body ?? "Aucun message."}</p>
              </button>
            );
          })}
        </div>
      </aside>

      <section className="rounded-md border border-ink/10 bg-white p-5">
        <div className="flex flex-col gap-2 border-b border-ink/10 pb-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-semibold">{selected.hostId === currentUserId ? selected.traveler.name : selected.host.name}</h2>
            <p className="text-sm text-ink/55">{selected.listing?.title ?? "Support voyageur/hôte"}</p>
          </div>
          <span className="w-fit rounded-md bg-mist px-3 py-1 text-xs font-semibold text-palm">Conversation active</span>
        </div>

        <div className="mt-5 grid max-h-[520px] gap-3 overflow-y-auto pr-2">
          {selected.messages.map((message) => {
            const mine = message.senderId === currentUserId;
            return (
              <div key={message.id} className={`w-fit max-w-xl rounded-md p-3 text-sm ${mine ? "ml-auto bg-palm text-white" : "bg-mist text-ink"}`}>
                <p>{message.body}</p>
                <p className={`mt-2 text-xs ${mine ? "text-white/70" : "text-ink/45"}`}>
                  {new Date(message.createdAt).toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" })}
                </p>
              </div>
            );
          })}
        </div>

        <form
          className="mt-6 flex flex-col gap-2 sm:flex-row"
          onSubmit={(event) => {
            event.preventDefault();
            void sendMessage();
          }}
        >
          <input value={body} onChange={(event) => setBody(event.target.value)} placeholder="Écrire un message" className="min-h-12 flex-1 rounded-md border border-ink/10 px-4" />
          <button disabled={loading || !body.trim()} className="rounded-md bg-ink px-5 font-semibold text-white disabled:opacity-60">
            {loading ? "Envoi..." : "Envoyer"}
          </button>
        </form>
        {error ? <p className="mt-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}

        <div className="mt-4 flex flex-wrap gap-2">
          {["Arrivée autonome possible", "Merci pour votre réservation", "Je vérifie la disponibilité"].map((reply) => (
            <button key={reply} type="button" onClick={() => setBody(reply)} className="rounded-md border border-ink/10 px-3 py-2 text-sm">
              {reply}
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}
