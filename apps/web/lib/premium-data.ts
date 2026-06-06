export const hostRevenue = [
  ["Aujourd'hui", "420 EUR", "+12%"],
  ["Cette semaine", "2 840 EUR", "+18%"],
  ["Ce mois", "11 620 EUR", "+9%"],
  ["Cette année", "86 400 EUR", "+24%"]
];

export const hostAnalytics = [
  { label: "Réservations", value: 128, height: "72%" },
  { label: "Revenus", value: 11620, height: "88%" },
  { label: "Occupation", value: 76, height: "76%" },
  { label: "Conversion", value: 14, height: "44%" }
];

export const listingSignals = [
  ["Vues", "8 420"],
  ["Favoris", "612"],
  ["Réservations", "128"],
  ["Annulations", "7"]
];

export const calendarDays = Array.from({ length: 35 }, (_, index) => {
  const day = index + 1;
  const weekend = index % 7 === 5 || index % 7 === 6;
  return {
    day,
    price: weekend ? 240 : 190,
    status: day % 11 === 0 ? "Bloqué" : day % 5 === 0 ? "Réservé" : "Libre",
    weekend
  };
});

export const notificationCenter = [
  ["Nouvelle réservation", "Villa Azur face mer · 12-16 juin", "PUSH"],
  ["Paiement cash à confirmer", "Cabane Atlas · 380 EUR", "IN_APP"],
  ["Message reçu", "Question sur l'arrivée autonome", "EMAIL"],
  ["Document KYC en attente", "Pièce d'identité à vérifier", "IN_APP"]
];

export const adminQueues = [
  ["Vérification annonces", "18", "Relecture photos, règles et adresse"],
  ["Vérification hôtes", "7", "KYC en attente"],
  ["Signalements", "4", "Avis ou annonce signalés"],
  ["Litiges", "3", "Remboursements et médiation"]
];

export const languages = [
  ["fr", "Français"],
  ["en", "English"],
  ["ar", "العربية"]
];

export function suggestPrice({ city, season, guests, category }: { city: string; season: string; guests: number; category: string }) {
  const cityFactor = city.toLowerCase().includes("marrakech") || city.toLowerCase().includes("tipaza") ? 1.25 : 1;
  const seasonFactor = season === "high" ? 1.35 : season === "low" ? 0.82 : 1;
  const categoryFactor = category.toLowerCase().includes("villa") || category.toLowerCase().includes("luxe") ? 1.4 : 1;
  return Math.round((70 + guests * 18) * cityFactor * seasonFactor * categoryFactor);
}

export function buildSeoSuggestions(title: string, city: string) {
  return [
    `${title} à ${city}: séjour premium avec réservation simple`,
    `Location vacances ${city}: logement équipé, hôte vérifié et arrivée fluide`,
    `${city} maison de vacances: photos, avis, carte et prix transparent`
  ];
}
