import { describe, expect, it } from "vitest";

import { buildResult, classifyPin, matchesFromCellRows, matchesFromExactRows, rankMatches } from "./classify";

const pin = (cust: string | null, serviceType: string | null, window: string | null) => ({
  cust,
  service_type: serviceType,
  went_live_window: window,
});

describe("classifyPin", () => {
  it("treats NULL service_type as sellable fiber", () => {
    expect(classifyPin(pin("prospect", null, "post Dec 2025"))).toBe("live");
    expect(classifyPin(pin("customer", "sellable", "went live"))).toBe("live");
    expect(classifyPin(pin("prospect", "isg_partner", "coming soon live"))).toBe("live");
  });
  it("never shows dsl or coming-soon as live", () => {
    expect(classifyPin(pin("prospect", "dsl", "post Dec 2025"))).toBe("not_serviceable");
    expect(classifyPin(pin("customer", null, "coming soon"))).toBe("coming_soon");
    expect(classifyPin(pin("prospect", "dsl", "coming soon"))).toBe("coming_soon");
  });
  it("maps not_serviceable and unknown cust", () => {
    expect(classifyPin(pin("not_serviceable", null, "not serviceable"))).toBe("not_serviceable");
    expect(classifyPin(pin(null, null, null))).toBe("unknown");
  });
});

describe("neighbourhood summary", () => {
  it("needs ≥5 pins and ≥60% agreement", () => {
    const [match] = matchesFromCellRows([
      { isp: "kinetic", cust: "prospect", service_type: null, went_live_window: "post Dec 2025", pin_count: 7 },
      { isp: "kinetic", cust: "prospect", service_type: null, went_live_window: "coming soon", pin_count: 3 },
    ]);
    expect(match).toMatchObject({ isp: "kinetic", status: "live", confidence: "neighborhood", sampleSize: 10, agreement: 0.7 });
  });
  it("returns unknown on a thin or split cell", () => {
    const [thin] = matchesFromCellRows([
      { isp: "brightspeed", cust: "prospect", service_type: null, went_live_window: "went live", pin_count: 3 },
    ]);
    const [split] = matchesFromCellRows([
      { isp: "kinetic", cust: "prospect", service_type: null, went_live_window: "went live", pin_count: 5 },
      { isp: "kinetic", cust: "not_serviceable", service_type: null, went_live_window: "not serviceable", pin_count: 5 },
    ]);
    expect(thin.status).toBe("unknown");
    expect(split.status).toBe("unknown");
  });
});

describe("ranking and result", () => {
  const frontierExact = matchesFromExactRows([
    { isp: "frontier", cust: "prospect", service_type: null, went_live_window: "Jun 2024 -> Dec 2024", go_live_date: null, scraped_at: null, lat: null, lon: null },
  ]);
  const kineticExact = matchesFromExactRows([
    { isp: "kinetic", cust: "customer", service_type: "sellable", went_live_window: "went live", go_live_date: null, scraped_at: null, lat: null, lon: null },
  ]);
  it("prefers verified over available-per-records at equal status", () => {
    expect(rankMatches([...frontierExact, ...kineticExact])[0].isp).toBe("kinetic");
    expect(frontierExact[0].dataQuality).toBe("available_per_records");
  });
  it("prefers live over coming soon and names the ISP only when known", () => {
    const comingSoon = matchesFromExactRows([
      { isp: "brightspeed", cust: "prospect", service_type: null, went_live_window: "coming soon", go_live_date: null, scraped_at: null, lat: null, lon: null },
    ]);
    const result = buildResult({ addressHash: "h", h3Cell: null, matches: [...comingSoon, ...kineticExact] });
    expect(result).toMatchObject({ status: "live", isp: "kinetic", confidence: "exact" });
    expect(buildResult({ addressHash: "h", h3Cell: null, matches: [] })).toMatchObject({ status: "unknown", isp: null });
  });
});
