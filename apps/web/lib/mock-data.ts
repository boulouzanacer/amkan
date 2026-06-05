export const categories = [
  "Maisons de plage",
  "Cabanes",
  "Villas",
  "Appartements",
  "Piscine",
  "Vue mer",
  "Montagne",
  "Luxe"
];

export const amenities = ["Wi-Fi", "Parking", "Piscine", "Climatisation", "Cuisine", "TV", "Animaux acceptés"];

export const listings = [
  {
    id: "villa-azur",
    title: "Villa Azur face mer",
    city: "Tipaza",
    country: "Algérie",
    address: "Corniche de Tipaza",
    price: 220,
    rating: 4.9,
    reviews: 38,
    guests: 6,
    bedrooms: 3,
    beds: 4,
    bathrooms: 2,
    type: "Villa",
    image: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80"
    ],
    description: "Une villa lumineuse avec terrasse panoramique, espaces ouverts, piscine privée et accès rapide aux plages.",
    rules: "Arrivée après 15h. Pas de fête. Départ avant 11h."
  },
  {
    id: "cabane-atlas",
    title: "Cabane Atlas",
    city: "Ifrane",
    country: "Maroc",
    address: "Route des cèdres",
    price: 95,
    rating: 4.8,
    reviews: 24,
    guests: 4,
    bedrooms: 2,
    beds: 3,
    bathrooms: 1,
    type: "Cabane",
    image: "https://images.unsplash.com/photo-1523217582562-09d0def993a6?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1523217582562-09d0def993a6?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=900&q=80"
    ],
    description: "Une cabane calme pour respirer l'air de montagne, travailler au coin du feu et partir en randonnée.",
    rules: "Animaux acceptés sur demande. Respect de la forêt et tri des déchets."
  },
  {
    id: "riad-jardin",
    title: "Appartement Jardin Majorelle",
    city: "Marrakech",
    country: "Maroc",
    address: "Quartier Guéliz",
    price: 130,
    rating: 4.7,
    reviews: 51,
    guests: 3,
    bedrooms: 1,
    beds: 2,
    bathrooms: 1,
    type: "Appartement",
    image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=900&q=80"
    ],
    description: "Appartement central et apaisant, parfait pour découvrir la ville avec confort et autonomie.",
    rules: "Non-fumeur. Respect du voisinage après 22h."
  }
];

export const stats = [
  ["Utilisateurs", "2 430"],
  ["Logements", "418"],
  ["Réservations", "1 287"],
  ["Chiffre d'affaires", "186 400 EUR"]
];
