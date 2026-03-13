"use client"

const REP_COOKIE_NAME = "ffusa_rep"
const REP_COOKIE_MAX_AGE = 30 * 24 * 60 * 60 // 30 days in seconds

export function getRepAttribution(): string | null {
  if (typeof document === "undefined") return null
  const match = document.cookie.match(new RegExp(`(?:^|; )${REP_COOKIE_NAME}=([^;]*)`))
  return match ? decodeURIComponent(match[1]) : null
}

export function setRepAttribution(repSlug: string): void {
  if (typeof document === "undefined") return
  document.cookie = `${REP_COOKIE_NAME}=${encodeURIComponent(repSlug)}; path=/; max-age=${REP_COOKIE_MAX_AGE}; SameSite=Lax`
}

export function clearRepAttribution(): void {
  if (typeof document === "undefined") return
  document.cookie = `${REP_COOKIE_NAME}=; path=/; max-age=0`
}

/**
 * Resolve rep attribution from multiple sources.
 * Priority: explicit prop > URL param > cookie
 */
export function resolveRepAttribution(explicitRepId?: string, urlRepParam?: string | null): string | undefined {
  if (explicitRepId) return explicitRepId
  if (urlRepParam) return urlRepParam
  const cookie = getRepAttribution()
  return cookie ?? undefined
}
