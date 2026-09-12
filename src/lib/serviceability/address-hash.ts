/**
 * Exact port of the scraper's home identity (`leads genetation/src/reprobe_area_probe.py`:
 * normalize_address / home_key / home_hash). `map_pin.address_hash` and ffdealflow `pins.address_hash`
 * are both this value, so the same physical home hashes identically everywhere.
 * Parity is pinned by `__fixtures__/home-hash.json`, generated from the Python once.
 */

// Order matters: applied sequentially, like the Python dict iteration.
const USPS_ABBREVIATIONS: ReadonlyArray<readonly [string, string]> = [
  ["ST", "STREET"], ["AVE", "AVENUE"], ["DR", "DRIVE"], ["LN", "LANE"], ["CT", "COURT"], ["RD", "ROAD"],
  ["BLVD", "BOULEVARD"], ["PL", "PLACE"], ["CIR", "CIRCLE"], ["TRL", "TRAIL"], ["PKWY", "PARKWAY"],
  ["HWY", "HIGHWAY"], ["N", "NORTH"], ["S", "SOUTH"], ["E", "EAST"], ["W", "WEST"], ["NE", "NORTHEAST"],
  ["NW", "NORTHWEST"], ["SE", "SOUTHEAST"], ["SW", "SOUTHWEST"],
];

// Python's `\b` is Unicode-aware; JS's is ASCII-only, so word boundaries are spelled out with lookarounds.
const NOT_WORD_BEFORE = String.raw`(?<![\p{L}\p{N}_])`;
const NOT_WORD_AFTER = String.raw`(?![\p{L}\p{N}_])`;
const PUNCTUATION = /[.,#]/g;
const UNIT_SUFFIX = /\s(APT|UNIT|STE|SUITE|#)\s?\S*$/;
const WHITESPACE_RUN = /\s+/g;
const ZIP_TOKEN = new RegExp(String.raw`${NOT_WORD_BEFORE}(\d{5})(?:-\d{4})?${NOT_WORD_AFTER}`, "gu");

export function normalizeAddress(raw: string): string {
  let normalized = raw.toUpperCase().trim().replace(PUNCTUATION, "");
  for (const [abbreviation, full] of USPS_ABBREVIATIONS) {
    normalized = normalized.replace(new RegExp(`${NOT_WORD_BEFORE}${abbreviation}${NOT_WORD_AFTER}`, "gu"), full);
  }
  normalized = normalized.replace(UNIT_SUFFIX, "");
  return normalized.replace(WHITESPACE_RUN, " ").trim();
}

/** `NORMALIZED STREET|ZIP5` — city deliberately excluded (formatting drifts between sources). */
export function homeKey(address: string): string {
  const street = normalizeAddress(address.split(",")[0]);
  const zips = [...address.matchAll(ZIP_TOKEN)].map((match) => match[1]);
  return `${street}|${zips.at(-1) ?? ""}`;
}

export async function homeHash(address: string): Promise<string> {
  const bytes = new TextEncoder().encode(homeKey(address));
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}
