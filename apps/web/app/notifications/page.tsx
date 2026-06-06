import { Bell, Mail, MessageSquare, Smartphone } from "lucide-react";
import { notificationCenter } from "@/lib/premium-data";

const icons = { PUSH: Smartphone, EMAIL: Mail, IN_APP: Bell, SMS: MessageSquare };

export default function NotificationsPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold">Centre de notifications</h1>
      <p className="mt-2 text-ink/60">Temps réel, email, SMS et push mobile dans une seule file d&apos;événements.</p>
      <div className="mt-6 grid gap-3">
        {notificationCenter.map(([title, body, channel]) => {
          const Icon = icons[channel as keyof typeof icons] ?? Bell;
          return (
            <article key={title} className="flex gap-4 rounded-md border border-ink/10 bg-white p-4">
              <div className="grid h-11 w-11 place-items-center rounded-md bg-mist text-palm"><Icon className="h-5 w-5" /></div>
              <div>
                <p className="font-semibold">{title}</p>
                <p className="mt-1 text-sm text-ink/60">{body}</p>
                <p className="mt-2 text-xs font-semibold text-palm">{channel}</p>
              </div>
            </article>
          );
        })}
      </div>
    </main>
  );
}
