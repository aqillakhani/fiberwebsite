import "server-only";

import { unstable_cache } from "next/cache";
import { latLngToCell } from "h3-js";

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
 * Lookup order: exact home hash across tracked ISPs → surrounding H3 res-8 cell when the home itself
 * was never probed. Cached a week per (hash, cell); the scraper refreshes far slower than that.
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
    const cellRows = h3Cell ? await fetchCellSummary(h3Cell) : [];
    return buildResult({ addressHash, h3Cell, matches: matchesFromCellRows(cellRows) });
  },
  ["serviceability-v1"],
  { revalidate: CACHE_SECONDS }
);

function hasCoordinates(query: ServiceabilityQuery): query is ServiceabilityQuery & { lat: number; lon: number } {
  return Number.isFinite(query.lat) && Number.isFinite(query.lon);
}
