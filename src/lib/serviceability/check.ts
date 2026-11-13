import "server-only";

import { unstable_cache } from "next/cache";
import { gridDisk, latLngToCell } from "h3-js";

import { homeHash } from "./address-hash";
import { buildResult, matchesFromCellRows, matchesFromExactRows, type ServiceabilityResult } from "./classify";
import { fetchCellSummary, fetchPinsByHash } from "./neon";

export interface ServiceabilityQuery {
  /** Full one-line address, e.g. "307 Central Ave, Newark OH 43055". Street must precede the first comma. */
  address: string;
  lat?: number;
  lon?: number;
}

const H3_RESOLUTION = 8;
const CACHE_SECONDS = 7 * 24 * 60 * 60;

/**
 * Rings searched around the home's own cell, narrowest first. A res-8 cell is only ~0.28 sq mi,
 * so the scraper often probed the next street over but not this one: ring 1 is ~1 sq mi and
 * ring 2 ~2-3 sq mi. Measured on the 23 unresolved instant-form leads of 2026-11-13, widening
 * took the verdict rate from 2 to 7 — the extra 5 all sat in an unprobed cell beside a probed one.
 */
const SEARCH_RINGS = [0, 1, 2] as const;

/**
 * Lookup order: exact home hash across tracked ISPs → the home's own H3 cell → the rings around it.
 * The first confident verdict wins, so the closest evidence always beats a broader, blurrier one,
 * and the result's `confidence` says which it was. Cached a week per (hash, cell); the scraper
 * refreshes far slower than that.
 */
export async function checkServiceability(query: ServiceabilityQuery): Promise<ServiceabilityResult> {
  const addressHash = await homeHash(query.address);
  const h3Cell = hasCoordinates(query) ? latLngToCell(query.lat, query.lon, H3_RESOLUTION) : null;
  return cachedLookup(addressHash, h3Cell);
}

const cachedLookup = unstable_cache(
  async (addressHash: string, h3Cell: string | null): Promise<ServiceabilityResult> => {
    const exactRows = await fetchPinsByHash(addressHash);
    if (exactRows.length > 0) {
      return buildResult({ addressHash, h3Cell, matches: matchesFromExactRows(exactRows) });
    }
    if (!h3Cell) return buildResult({ addressHash, h3Cell, matches: [] });

    let widest = buildResult({ addressHash, h3Cell, matches: [] });
    for (const ring of SEARCH_RINGS) {
      const rows = await fetchCellSummary(gridDisk(h3Cell, ring));
      const result = buildResult({
        addressHash,
        h3Cell,
        matches: matchesFromCellRows(rows, ring === 0 ? "neighborhood" : "area"),
      });
      if (result.status !== "unknown") return result;
      if (result.matches.length > 0) widest = result;
    }
    // Nothing confident anywhere: keep the widest sample so the admin can see what was nearby.
    return widest;
  },
  ["serviceability-v2"],
  { revalidate: CACHE_SECONDS }
);

function hasCoordinates(query: ServiceabilityQuery): query is ServiceabilityQuery & { lat: number; lon: number } {
  return Number.isFinite(query.lat) && Number.isFinite(query.lon);
}
