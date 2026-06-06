import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const staticRoutes = ["", "/search", "/favorites", "/login", "/register", "/host/dashboard"];
  const listings = await prisma.listing.findMany({
    where: { isPublished: true },
    select: { slug: true, updatedAt: true },
    orderBy: { updatedAt: "desc" },
    take: 500
  }).catch(() => []);

  return [
    ...staticRoutes.map((route) => ({
      url: `${baseUrl}${route}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: route === "" ? 1 : 0.7
    })),
    ...listings.map((listing) => ({
      url: `${baseUrl}/listing/${listing.slug}`,
      lastModified: listing.updatedAt,
      changeFrequency: "daily" as const,
      priority: 0.9
    }))
  ];
}
