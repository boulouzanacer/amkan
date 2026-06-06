import Link from "next/link";
import { Bell, Heart, Menu, MessageCircle, ShieldCheck, UserRound } from "lucide-react";

const nav = [
  ["Explorer", "/search"],
  ["Devenir hôte", "/host/dashboard"],
  ["Admin", "/admin"]
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-white/92 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 font-semibold text-ink">
          <span className="grid h-9 w-9 place-items-center rounded-md bg-palm text-white">A</span>
          <span className="text-xl">Amkan</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium text-ink/70 md:flex">
          {nav.map(([label, href]) => (
            <Link key={href} href={href} className="hover:text-ink">
              {label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/notifications" aria-label="Notifications" className="grid h-10 w-10 place-items-center rounded-md hover:bg-mist">
            <Bell className="h-5 w-5" />
          </Link>
          <Link href="/favorites" aria-label="Favoris" className="grid h-10 w-10 place-items-center rounded-md hover:bg-mist">
            <Heart className="h-5 w-5" />
          </Link>
          <Link href="/messages" aria-label="Messages" className="grid h-10 w-10 place-items-center rounded-md hover:bg-mist">
            <MessageCircle className="h-5 w-5" />
          </Link>
          <Link href="/profile" aria-label="Profil" className="grid h-10 w-10 place-items-center rounded-md hover:bg-mist">
            <UserRound className="h-5 w-5" />
          </Link>
          <Link href="/security" aria-label="Sécurité" className="hidden h-10 w-10 place-items-center rounded-md hover:bg-mist sm:grid">
            <ShieldCheck className="h-5 w-5" />
          </Link>
          <button aria-label="Menu" className="grid h-10 w-10 place-items-center rounded-md border border-ink/10 md:hidden">
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
