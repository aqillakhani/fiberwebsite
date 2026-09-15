import type { MetadataRoute } from "next"

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://fiberfastusa.com"

// Location pages return in Phase 2, generated from the map_pin footprint roll-up (never hand-listed cities).
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date()
  return [
    { url: BASE_URL, lastModified, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/check-availability`, lastModified, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE_URL}/why-fiber`, lastModified, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/about`, lastModified, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/faq`, lastModified, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/contact`, lastModified, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/privacy`, lastModified, changeFrequency: "yearly", priority: 0.3 },
  ]
}
