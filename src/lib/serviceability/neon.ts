import "server-only";

import { neon } from "@neondatabase/serverless";

/**
 * Read-only access to the scraper's `map_pin` on Neon (env `MAP_DATABASE_URL`).
 * Every query here is parameterised and SELECT-only; the site never writes to this database.
 */

export const TRACKED_ISPS = ["kinetic", "brightspeed", "frontier"] as const;
export type TrackedIsp = (typeof TRACKED_ISPS)[number];

const QUERY_TIMEOUT_MS = 2500;

export interface MapPinRow {
  isp: string;
  cust: string | null;
  service_type: string | null;
  went_live_window: string | null;
  go_live_date: string | null;
  scraped_at: string | null;
  lat: number | null;
  lon: number | null;
}

export interface MapPinCellRow {
  isp: string;
  cust: string | null;
  service_type: string | null;
  went_live_window: string | null;
  pin_count: number;
}

function getSql() {
  const url = process.env.MAP_DATABASE_URL;
  if (!url) throw new Error("MAP_DATABASE_URL is not set; serviceability lookups are unavailable");
  return neon(url, { fetchOptions: { signal: AbortSignal.timeout(QUERY_TIMEOUT_MS) } });
}

/** Rows for one home across every tracked ISP. Hits the partial unique index (isp, address_hash). */
export async function fetchPinsByHash(addressHash: string): Promise<MapPinRow[]> {
  const sql = getSql();
  const rows = await sql`
    SELECT isp, cust, service_type, went_live_window, go_live_date, scraped_at::text, lat, lon
    FROM map_pin
    WHERE isp = ANY(${[...TRACKED_ISPS]}) AND address_hash = ${addressHash} AND cust IS NOT NULL`;
  return rows as MapPinRow[];
}

/** Status mix of the surrounding H3 res-8 cell (~0.7 km²). Hits map_pin_isp_h3_cust_idx. */
export async function fetchCellSummary(h3Cell: string): Promise<MapPinCellRow[]> {
  const sql = getSql();
  const rows = await sql`
    SELECT isp, cust, service_type, went_live_window, COUNT(*)::int AS pin_count
    FROM map_pin
    WHERE isp = ANY(${[...TRACKED_ISPS]}) AND h3_res8 = ${h3Cell} AND cust IS NOT NULL
    GROUP BY 1, 2, 3, 4`;
  return rows as MapPinCellRow[];
}
