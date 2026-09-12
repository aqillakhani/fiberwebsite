/** Canonical rep link: /r/<slug> sets the attribution cookie and opens door mode (see middleware.ts). */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://fiberfastusa.com";

export const repShortPath = (slug: string): string => `/r/${encodeURIComponent(slug)}`;
export const repShortUrl = (slug: string): string => `${SITE_URL}${repShortPath(slug)}`;
