import type { MetadataRoute } from "next"

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://fiberfastusa.com"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/", "/rep/", "/r/", "/door/"] }],
    sitemap: `${BASE_URL}/sitemap.xml`,
  }
}
