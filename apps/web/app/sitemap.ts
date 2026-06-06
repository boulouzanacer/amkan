import type { MetadataRoute } from "next";
import { listings } from "@/lib/mock-data";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const staticRoutes = ["", "/search", "/favorites", "/login", "/register", "/host/dashboard"];

  return [
    ...staticRoutes.map((route) => ({
      url: `${baseUrl}${route}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: route === "" ? 1 : 0.7
    })),
    ...listings.map((listing) => ({
      url: `${baseUrl}/listing/${listing.id}`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9
    }))
  ];
}
