import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import type { ReactNode } from "react";

export function ButtonLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-ink px-5 py-3 text-sm font-semibold text-white transition hover:bg-palm"
    >
      {children}
      <ArrowRight className="h-4 w-4" />
    </Link>
  );
}

export function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
      <div>
        <h2 className="text-2xl font-semibold tracking-normal text-ink md:text-3xl">{title}</h2>
        {subtitle ? <p className="mt-2 max-w-2xl text-sm leading-6 text-ink/65">{subtitle}</p> : null}
      </div>
    </div>
  );
}

export function Rating({ value, count }: { value: number; count?: number }) {
  return (
    <span className="inline-flex items-center gap-1 text-sm font-medium text-ink">
      <Star className="h-4 w-4 fill-sun text-sun" />
      {value.toFixed(1)}
      {count ? <span className="text-ink/55">({count})</span> : null}
    </span>
  );
}

export function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-md border border-dashed border-ink/20 bg-white p-8 text-center">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-ink/60">{body}</p>
    </div>
  );
}
