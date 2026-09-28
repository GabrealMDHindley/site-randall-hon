import type { MetadataRoute } from "next";
import { listings } from "@/content/listings";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://site-randall-hon.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/about", "/listings", "/calculator", "/contact"].map(
    (path) => ({
      url: `${siteUrl}${path}`,
      lastModified: new Date(),
    }),
  );

  const listingRoutes = listings.map((listing) => ({
    url: `${siteUrl}/listings/${listing.slug}`,
    lastModified: new Date(),
  }));

  return [...staticRoutes, ...listingRoutes];
}
