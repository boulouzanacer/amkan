export default function MessagesPage() {
  return (
    <main className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[320px_1fr] lg:px-8">
      <aside className="rounded-md border border-ink/10 bg-white p-4">
        <h1 className="text-xl font-semibold">Messagerie</h1>
        {["Nora Benali", "Hôte Cabane Atlas"].map((name) => (
          <button key={name} className="mt-3 block w-full rounded-md border border-ink/10 p-3 text-left hover:bg-mist">
            <p className="font-medium">{name}</p>
            <p className="text-sm text-ink/55">Nouveau message lié au logement.</p>
          </button>
        ))}
      </aside>
      <section className="rounded-md border border-ink/10 bg-white p-5">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Conversation temps réel</h2>
          <span className="rounded-md bg-mist px-3 py-1 text-xs font-semibold text-palm">WebSocket prêt</span>
        </div>
        <div className="mt-5 grid gap-3">
          <p className="w-fit max-w-xl rounded-md bg-mist p-3 text-sm">Bonjour, le logement est-il disponible pour une arrivée tardive ?</p>
          <p className="ml-auto w-fit max-w-xl rounded-md bg-palm p-3 text-sm text-white">Oui, nous pouvons organiser une arrivée autonome.</p>
        </div>
        <form className="mt-6 flex gap-2">
          <input placeholder="Écrire un message" className="min-h-12 flex-1 rounded-md border border-ink/10 px-4" />
          <button className="rounded-md bg-ink px-5 font-semibold text-white">Envoyer</button>
        </form>
        <div className="mt-4 flex flex-wrap gap-2">
          {["Arrivée autonome possible", "Merci pour votre réservation", "Je vérifie la disponibilité"].map((reply) => (
            <button key={reply} className="rounded-md border border-ink/10 px-3 py-2 text-sm">{reply}</button>
          ))}
          <button className="rounded-md border border-ink/10 px-3 py-2 text-sm">Ajouter image</button>
          <button className="rounded-md border border-ink/10 px-3 py-2 text-sm">Ajouter document</button>
          <button className="rounded-md border border-ink/10 px-3 py-2 text-sm">Traduire</button>
        </div>
      </section>
    </main>
  );
}
