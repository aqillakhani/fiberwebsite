/**
 * Cookie names + shapes shared by middleware (writer), server actions (reader) and the
 * client AttributionProvider (reader). Keep this file free of server/client-only imports.
 */

export const REP_COOKIE = "ffusa_rep";
export const REP_MODE_COOKIE = "ffusa_mode";
export const ATTRIBUTION_COOKIE = "ffusa_attr";
export const FBC_COOKIE = "_fbc";
export const FBP_COOKIE = "_fbp";

const DAY_SECONDS = 24 * 60 * 60;
export const REP_MAX_AGE_SECONDS = 30 * DAY_SECONDS;
export const REP_MODE_MAX_AGE_SECONDS = 12 * 60 * 60; // a canvasser's shift
export const ATTRIBUTION_MAX_AGE_SECONDS = 30 * DAY_SECONDS;

export const TRACKED_QUERY_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "fbclid",
  "gclid",
] as const;

export type TrackedQueryKey = (typeof TRACKED_QUERY_KEYS)[number];

export type StoredAttribution = Partial<Record<TrackedQueryKey, string>> & {
  landing_path: string;
  referrer: string;
  first_seen: string;
  last_seen: string;
};

/** Parse a raw `document.cookie` / header string into a name → value map. */
export function parseCookieHeader(raw: string): Record<string, string> {
  return Object.fromEntries(
    raw
      .split(";")
      .map((part) => part.trim())
      .filter(Boolean)
      .map((part) => {
        const eq = part.indexOf("=");
        return eq === -1 ? [part, ""] : [part.slice(0, eq), decodeURIComponent(part.slice(eq + 1))];
      })
  );
}
