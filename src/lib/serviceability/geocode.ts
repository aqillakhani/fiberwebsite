import "server-only";

/**
 * Forward-geocodes an instant-form address so `checkServiceability` can fall back to the
 * surrounding H3 cells.
 *
 * Meta's lead form collects street/city/state/zip as separate fields but never sends
 * coordinates. Without them `checkServiceability` can only match a home the scraper already
 * probed by name, so everything else returned `unknown` — 23 of 31 instant-form leads as of
 * 2026-11-13, against 9 of 26 on the website (which geocodes in the browser).
 *
 * Nominatim is the same provider `/api/address-autocomplete` already calls. Its usage policy
 * caps clients at one request per second and requires an identifying User-Agent.
 */

const NOMINATIM_SEARCH = "https://nominatim.openstreetmap.org/search";
const USER_AGENT = "FiberFastUSA/1.0 (https://fiberfastusa.com)";
const REQUEST_TIMEOUT_MS = 5_000;
const MIN_REQUEST_INTERVAL_MS = 1_100;
const HAS_DIGIT = /\d/;

/**
 * People type whatever they like into Meta's street box: "150 Autumn Ln Apt 7-D",
 * "4603 Refugee Road Apt 1B Columbus Ohio 43232", "4346 Hornyak Drive, Monroe, NC, USA".
 * Nominatim matches none of those, so the street is reduced to its mailable part first.
 */
const STREET_TYPES = new Set([
  "ST", "STREET", "AVE", "AVENUE", "RD", "ROAD", "DR", "DRIVE", "LN", "LANE", "CT", "COURT",
  "BLVD", "BOULEVARD", "PL", "PLACE", "CIR", "CIRCLE", "TRL", "TRAIL", "PKWY", "PARKWAY",
  "HWY", "HIGHWAY", "WAY", "TER", "TERRACE", "LOOP", "PASS", "RUN", "ROW", "PATH", "PIKE",
  "PLZ", "PLAZA", "XING", "CROSSING", "BND", "BEND", "RIDGE", "RDG", "CV", "COVE",
]);
const DIRECTIONALS = new Set([
  "N", "S", "E", "W", "NE", "NW", "SE", "SW",
  "NORTH", "SOUTH", "EAST", "WEST", "NORTHEAST", "NORTHWEST", "SOUTHEAST", "SOUTHWEST",
]);
const UNIT_SUFFIX =
  /[\s,]+(?:APT|APARTMENT|UNIT|STE|SUITE|FL|FLOOR|SPC|SPACE|LOT|RM|ROOM|BLDG|BUILDING|TRLR|SP|NO|#)\.?\s.*$/i;
const COUNTRY_SUFFIX = /[\s,]+(?:USA|UNITED STATES)\s*$/i;
const CITY_STATE_ZIP_SUFFIX = /[\s,]+[A-Za-z]{2,}\s+\d{5}(?:-\d{4})?\s*$/;

export interface GeocodeQuery {
  street: string;
  city: string | null;
  state: string | null;
  zip: string | null;
}

export interface GeocodedPoint {
  lat: number;
  lon: number;
}

interface NominatimHit {
  lat?: string;
  lon?: string;
  address?: { postcode?: string };
}

/**
 * Reduces a typed street to the part Nominatim can match. Cutting at the street type removes
 * every tail at once — unit, city, state and ZIP — which is what people actually append, while
 * keeping a quadrant like "NW" that changes which house it is. Streets with no recognisable
 * type ("120 country oaks") fall back to stripping known suffixes. Exported for tests.
 */
export function cleanStreet(raw: string): string {
  const head = raw.split(",")[0].trim();
  const tokens = head.split(/\s+/);
  const typeAt = tokens.findIndex((token) => STREET_TYPES.has(normalizeToken(token)));
  if (typeAt > 0) {
    const hasQuadrant = DIRECTIONALS.has(normalizeToken(tokens[typeAt + 1] ?? ""));
    return tokens.slice(0, typeAt + (hasQuadrant ? 2 : 1)).join(" ");
  }
  return head.replace(COUNTRY_SUFFIX, "").trim().replace(CITY_STATE_ZIP_SUFFIX, "").trim().replace(UNIT_SUFFIX, "").trim();
}

const normalizeToken = (token: string): string => token.toUpperCase().replace(/[.,]$/, "");

/**
 * Best-effort: returns `null` rather than throwing, because a geocoder outage must never cost
 * us the lead itself. A `null` leaves the lead at `unknown`, exactly as before.
 */
export async function geocodeAddress(query: GeocodeQuery): Promise<GeocodedPoint | null> {
  const street = cleanStreet(query.street);
  // A street with no house number geocodes to the town centroid, and a res-8 cell is only
  // ~0.28 sq mi — a centroid verdict would describe a neighbourhood the lead may not live in.
  // A confidently wrong answer costs the closer more than an honest `unknown`.
  if (!HAS_DIGIT.test(street)) return null;

  for (const params of buildAttempts(street, query)) {
    const point = await search(params, query.zip);
    if (point) return point;
  }
  return null;
}

/**
 * Narrowest first. "<street>, <zip>" is second because it rescues most of what structured search
 * misses: the city Meta reports is often the postal city rather than the municipality Nominatim
 * indexes (Reynoldsburg vs Columbus), and dropping it fixed 5 of 6 failures measured on real leads.
 */
function buildAttempts(street: string, query: GeocodeQuery): URLSearchParams[] {
  const attempts: URLSearchParams[] = [];
  if (query.city || query.state || query.zip) {
    const structured = new URLSearchParams({ street });
    if (query.city) structured.set("city", query.city);
    if (query.state) structured.set("state", query.state);
    if (query.zip) structured.set("postalcode", query.zip);
    attempts.push(structured);
  }
  if (query.zip) attempts.push(new URLSearchParams({ q: `${street}, ${query.zip}` }));
  const line = [street, query.city, [query.state, query.zip].filter(Boolean).join(" ")]
    .map((part) => part?.trim())
    .filter(Boolean)
    .join(", ");
  attempts.push(new URLSearchParams({ q: line }));
  return attempts;
}

async function search(params: URLSearchParams, expectedZip: string | null): Promise<GeocodedPoint | null> {
  params.set("format", "jsonv2");
  params.set("addressdetails", "1");
  params.set("countrycodes", "us");
  params.set("limit", "1");

  const hit = await fetchFirstHit(params);
  if (!hit) return null;

  // Nominatim falls back to a nearby town when it cannot place the street. Both ZIPs present
  // and disagreeing means it landed somewhere else, so discard rather than mislocate the lead.
  const resolvedZip = hit.address?.postcode?.slice(0, 5);
  if (expectedZip && resolvedZip && resolvedZip !== expectedZip) return null;

  const lat = Number(hit.lat);
  const lon = Number(hit.lon);
  return Number.isFinite(lat) && Number.isFinite(lon) ? { lat, lon } : null;
}

async function fetchFirstHit(params: URLSearchParams): Promise<NominatimHit | null> {
  try {
    const response = await rateLimited(() =>
      fetch(`${NOMINATIM_SEARCH}?${params.toString()}`, {
        headers: { "User-Agent": USER_AGENT, "Accept-Language": "en-US,en" },
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      })
    );
    if (!response.ok) {
      console.error("[geocode] nominatim returned", response.status);
      return null;
    }
    const hits = (await response.json()) as NominatimHit[];
    return hits[0] ?? null;
  } catch (error) {
    console.error("[geocode] lookup failed; lead stays unlocated", error);
    return null;
  }
}

let lastRequestAt = 0;
let queue: Promise<unknown> = Promise.resolve();

/** Serialises calls ≥1s apart — a webhook batch would otherwise burst past Nominatim's policy. */
function rateLimited<T>(task: () => Promise<T>): Promise<T> {
  const run = queue.then(async () => {
    const wait = lastRequestAt + MIN_REQUEST_INTERVAL_MS - Date.now();
    if (wait > 0) await new Promise((resolve) => setTimeout(resolve, wait));
    lastRequestAt = Date.now();
    return task();
  });
  queue = run.catch(() => undefined);
  return run;
}
