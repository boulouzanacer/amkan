import { PrismaClient, ListingType, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const images = [
  "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85",
  "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd",
  "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2",
  "https://images.unsplash.com/photo-1523217582562-09d0def993a6",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c"
];

async function main() {
  const passwordHash = await bcrypt.hash("Amkan123!", 12);
  const amenities = await Promise.all(
    ["Wi-Fi", "Parking", "Piscine", "Climatisation", "Cuisine", "TV", "Animaux acceptés"].map((name) =>
      prisma.amenity.upsert({
        where: { name },
        update: {},
        create: { name }
      })
    )
  );

  await Promise.all(
    ["Maisons de plage", "Cabanes", "Villas", "Appartements", "Piscine", "Vue mer", "Montagne", "Luxe"].map((name) =>
      prisma.category.upsert({
        where: { slug: name.toLowerCase().replaceAll(" ", "-") },
        update: {},
        create: { name, slug: name.toLowerCase().replaceAll(" ", "-") }
      })
    )
  );

  const host = await prisma.user.upsert({
    where: { email: "host@amkan.test" },
    update: { passwordHash, isActive: true, role: Role.HOST },
    create: {
      email: "host@amkan.test",
      name: "Nora Benali",
      passwordHash,
      role: Role.HOST,
      bio: "Hôte passionnée par les séjours lumineux, calmes et bien préparés."
    }
  });

  await prisma.user.upsert({
    where: { email: "admin@amkan.test" },
    update: { passwordHash, isActive: true, role: Role.ADMIN },
    create: { email: "admin@amkan.test", name: "Admin Amkan", passwordHash, isActive: true, role: Role.ADMIN }
  });

  const traveler = await prisma.user.upsert({
    where: { email: "traveler@amkan.test" },
    update: { passwordHash, isActive: true, role: Role.TRAVELER },
    create: { email: "traveler@amkan.test", name: "Voyageur Amkan", passwordHash, isActive: true, role: Role.TRAVELER }
  });

  const samples = [
    ["Villa Azur face mer", "tipaza", "Algérie", ListingType.VILLA, 220, 6, 3, 4, 2],
    ["Cabane Atlas", "ifrane", "Maroc", ListingType.CABIN, 95, 4, 2, 3, 1],
    ["Appartement Jardin Majorelle", "marrakech", "Maroc", ListingType.APARTMENT, 130, 3, 1, 2, 1],
    ["Maison de plage Safran", "bejaia", "Algérie", ListingType.BEACH_HOUSE, 180, 5, 2, 4, 2]
  ] as const;
  let firstListingId = "";

  for (const [title, city, country, type, price, guests, bedrooms, beds, bathrooms] of samples) {
    const listing = await prisma.listing.upsert({
      where: { slug: title.toLowerCase().replaceAll(" ", "-") },
      update: {},
      create: {
        hostId: host.id,
        title,
        slug: title.toLowerCase().replaceAll(" ", "-"),
        description: "Un logement soigneusement équipé pour des séjours fluides, avec espaces lumineux, literie confortable et accès simple aux expériences locales.",
        address: `Centre de ${city}`,
        city,
        country,
        latitude: 36.7538,
        longitude: 3.0588,
        pricePerNight: price,
        serviceFee: 18,
        taxes: 12,
        type,
        guests,
        bedrooms,
        beds,
        bathrooms,
        houseRules: "Arrivée après 15h, départ avant 11h, respect du calme et du voisinage.",
        images: {
          create: images.slice(0, 4).map((url, position) => ({ url, position, alt: title }))
        }
      }
    });
    if (!firstListingId) firstListingId = listing.id;

    await Promise.all(
      amenities.slice(0, 5).map((amenity) =>
        prisma.listingAmenity.upsert({
          where: { listingId_amenityId: { listingId: listing.id, amenityId: amenity.id } },
          update: {},
          create: { listingId: listing.id, amenityId: amenity.id }
        })
      )
    );
  }

  if (firstListingId) {
    const conversation =
      (await prisma.conversation.findFirst({ where: { travelerId: traveler.id, hostId: host.id, listingId: firstListingId } })) ??
      (await prisma.conversation.create({ data: { travelerId: traveler.id, hostId: host.id, listingId: firstListingId } }));
    const messagesCount = await prisma.message.count({ where: { conversationId: conversation.id } });
    if (!messagesCount) {
      await prisma.message.createMany({
        data: [
          { conversationId: conversation.id, senderId: traveler.id, body: "Bonjour, le logement est-il disponible pour une arrivée tardive ?" },
          { conversationId: conversation.id, senderId: host.id, body: "Oui, nous pouvons organiser une arrivée autonome." }
        ]
      });
    }
  }
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
