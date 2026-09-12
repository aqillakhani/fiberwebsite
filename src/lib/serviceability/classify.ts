import type { MapPinCellRow, MapPinRow } from "./neon";

/**
 * Pure classification of `map_pin` rows into what we may honestly tell a homeowner.
 * Rules agreed with the scraper session (2026-09-11):
 *   sellable fiber = cust IN (customer, prospect) AND window <> 'coming soon' AND service_type <> 'dsl'
 *   (NULL service_type = fiber). Frontier rows are import-seeded "available per records", never verified-live.
 */

export const SERVICEABILITY_STATUSES = ["live", "coming_soon", "not_serviceable", "unknown"] as const;
export type ServiceabilityStatus = (typeof SERVICEABILITY_STATUSES)[number];
export type MatchConfidence = "exact" | "neighborhood";
export type DataQuality = "verified" | "available_per_records";

export interface IspMatch {
  isp: string;
  status: ServiceabilityStatus;
  confidence: MatchConfidence;
  dataQuality: DataQuality;
  /** Share of pins agreeing with `status` — 1 for an exact hit. */
  agreement: number;
  sampleSize: number;
  wentLiveWindow: string | null;
  goLiveDate: string | null;
}

export interface ServiceabilityResult {
  status: ServiceabilityStatus;
  isp: string | null;
  confidence: MatchConfidence | null;
  dataQuality: DataQuality | null;
  addressHash: string;
  h3Cell: string | null;
  matches: IspMatch[];
  checkedAt: string;
}

const CUST_SERVICEABLE = new Set(["customer", "prospect"]);
const CUST_NOT_SERVICEABLE = "not_serviceable";
const WINDOW_COMING_SOON = "coming soon";
const SERVICE_TYPE_DSL = "dsl";
const RECORDS_ONLY_ISPS = new Set(["frontier"]);

/** A neighbourhood verdict needs at least this many probed homes agreeing this strongly. */
const MIN_CELL_SAMPLE = 5;
const MIN_CELL_AGREEMENT = 0.6;

const STATUS_RANK: Record<ServiceabilityStatus, number> = { live: 0, coming_soon: 1, not_serviceable: 2, unknown: 3 };

type PinLike = Pick<MapPinRow, "cust" | "service_type" | "went_live_window">;

export function classifyPin(pin: PinLike): ServiceabilityStatus {
  if (pin.cust === CUST_NOT_SERVICEABLE) return "not_serviceable";
  if (!pin.cust || !CUST_SERVICEABLE.has(pin.cust)) return "unknown";
  if (pin.went_live_window === WINDOW_COMING_SOON) return "coming_soon";
  if (pin.service_type === SERVICE_TYPE_DSL) return "not_serviceable";
  return "live";
}

export function dataQualityFor(isp: string): DataQuality {
  return RECORDS_ONLY_ISPS.has(isp) ? "available_per_records" : "verified";
}

export function matchesFromExactRows(rows: readonly MapPinRow[]): IspMatch[] {
  return rows.map((row) => ({
    isp: row.isp,
    status: classifyPin(row),
    confidence: "exact",
    dataQuality: dataQualityFor(row.isp),
    agreement: 1,
    sampleSize: 1,
    wentLiveWindow: row.went_live_window,
    goLiveDate: row.go_live_date,
  }));
}

export function matchesFromCellRows(rows: readonly MapPinCellRow[]): IspMatch[] {
  const byIsp = new Map<string, MapPinCellRow[]>();
  for (const row of rows) byIsp.set(row.isp, [...(byIsp.get(row.isp) ?? []), row]);
  return [...byIsp].map(([isp, ispRows]) => summariseCell(isp, ispRows));
}

function summariseCell(isp: string, rows: readonly MapPinCellRow[]): IspMatch {
  const totals = new Map<ServiceabilityStatus, number>();
  for (const row of rows) {
    const status = classifyPin(row);
    totals.set(status, (totals.get(status) ?? 0) + row.pin_count);
  }
  const sampleSize = rows.reduce((sum, row) => sum + row.pin_count, 0);
  const [topStatus, topCount] = [...totals].sort((a, b) => b[1] - a[1])[0];
  const agreement = sampleSize ? topCount / sampleSize : 0;
  const isConfident = sampleSize >= MIN_CELL_SAMPLE && agreement >= MIN_CELL_AGREEMENT;
  const dominantWindow = rows.filter((row) => classifyPin(row) === topStatus).sort((a, b) => b.pin_count - a.pin_count)[0];
  return {
    isp,
    status: isConfident ? topStatus : "unknown",
    confidence: "neighborhood",
    dataQuality: dataQualityFor(isp),
    agreement,
    sampleSize,
    wentLiveWindow: dominantWindow?.went_live_window ?? null,
    goLiveDate: null,
  };
}

/** Best match first: better status, then exact over neighbourhood, verified over records, higher agreement. */
export function rankMatches(matches: readonly IspMatch[]): IspMatch[] {
  return [...matches].sort(
    (a, b) =>
      STATUS_RANK[a.status] - STATUS_RANK[b.status] ||
      Number(a.confidence !== "exact") - Number(b.confidence !== "exact") ||
      Number(a.dataQuality !== "verified") - Number(b.dataQuality !== "verified") ||
      b.agreement - a.agreement
  );
}

export function buildResult(input: {
  addressHash: string;
  h3Cell: string | null;
  matches: readonly IspMatch[];
}): ServiceabilityResult {
  const ranked = rankMatches(input.matches);
  const best = ranked[0];
  return {
    status: best?.status ?? "unknown",
    isp: best && best.status !== "unknown" ? best.isp : null,
    confidence: best?.confidence ?? null,
    dataQuality: best?.dataQuality ?? null,
    addressHash: input.addressHash,
    h3Cell: input.h3Cell,
    matches: ranked,
    checkedAt: new Date().toISOString(),
  };
}
