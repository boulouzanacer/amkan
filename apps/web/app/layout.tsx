import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Amkan | Locations de vacances",
  description: "Marketplace originale de locations de vacances pour voyageurs et hôtes.",
  openGraph: {
    title: "Amkan",
    description: "Locations de vacances premium avec hôtes vérifiés, carte interactive et réservation fluide.",
    type: "website",
    locale: "fr_DZ",
    siteName: "Amkan"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}
