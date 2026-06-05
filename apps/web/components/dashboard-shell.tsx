import Link from "next/link";
import type { ReactNode } from "react";

export function DashboardShell({ title, links, children }: { title: string; links: string[][]; children: ReactNode }) {
  return (
    <main className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[240px_1fr] lg:px-8">
      <aside className="rounded-md border border-ink/10 bg-white p-4">
        <h1 className="text-xl font-semibold">{title}</h1>
        <nav className="mt-5 grid gap-1">
          {links.map(([label, href]) => (
            <Link key={href} href={href} className="rounded-md px-3 py-2 text-sm font-medium text-ink/70 hover:bg-mist hover:text-ink">
              {label}
            </Link>
          ))}
        </nav>
      </aside>
      <section>{children}</section>
    </main>
  );
}
