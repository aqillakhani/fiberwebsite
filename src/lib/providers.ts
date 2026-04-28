export type ProviderType = "fiber" | "cable" | "5g-home" | "satellite";

export type Provider = {
  readonly id: string;
  readonly name: string;
  readonly type: ProviderType;
  readonly maxSpeedMbps: number;
  readonly tagline: string;
  readonly isFrontierFiber?: boolean;
};

const PROVIDERS = {
  frontierFiber: {
    id: "frontier-fiber",
    name: "Frontier Fiber",
    type: "fiber" as const,
    maxSpeedMbps: 7000,
    tagline: "Symmetric multi-gig fiber. No data caps, no contracts.",
    isFrontierFiber: true,
  },
  attFiber: {
    id: "att-fiber",
    name: "AT&T Fiber",
    type: "fiber" as const,
    maxSpeedMbps: 5000,
    tagline: "Fiber-to-the-home where available.",
  },
  verizonFios: {
    id: "verizon-fios",
    name: "Verizon Fios",
    type: "fiber" as const,
    maxSpeedMbps: 2300,
    tagline: "Fiber service in the Northeast.",
  },
  googleFiber: {
    id: "google-fiber",
    name: "Google Fiber",
    type: "fiber" as const,
    maxSpeedMbps: 8000,
    tagline: "Fiber in select metro areas only.",
  },
  centurylinkFiber: {
    id: "centurylink-fiber",
    name: "CenturyLink / Quantum Fiber",
    type: "fiber" as const,
    maxSpeedMbps: 940,
    tagline: "Fiber in select neighborhoods.",
  },
  spectrum: {
    id: "spectrum",
    name: "Spectrum",
    type: "cable" as const,
    maxSpeedMbps: 1000,
    tagline: "Cable broadband. Asymmetric speeds.",
  },
  xfinity: {
    id: "xfinity",
    name: "Xfinity (Comcast)",
    type: "cable" as const,
    maxSpeedMbps: 1200,
    tagline: "Cable broadband with data thresholds.",
  },
  cox: {
    id: "cox",
    name: "Cox Communications",
    type: "cable" as const,
    maxSpeedMbps: 1000,
    tagline: "Cable broadband.",
  },
  optimum: {
    id: "optimum",
    name: "Optimum",
    type: "cable" as const,
    maxSpeedMbps: 1000,
    tagline: "Cable broadband, fiber expanding.",
  },
  tmobile5g: {
    id: "tmobile-5g",
    name: "T-Mobile 5G Home Internet",
    type: "5g-home" as const,
    maxSpeedMbps: 415,
    tagline: "Wireless home internet over 5G.",
  },
} as const;

const FRONTIER_FIBER_STATES = new Set([
  "CA", "CT", "FL", "IL", "IN", "MI", "NY", "OH", "PA", "TX", "WV",
]);

const ATT_FIBER_STATES = new Set([
  "AL", "AR", "CA", "FL", "GA", "IL", "IN", "KS", "KY", "LA", "MI",
  "MS", "MO", "NV", "NC", "OH", "OK", "SC", "TN", "TX", "WI",
]);

const VERIZON_FIOS_STATES = new Set([
  "CT", "DE", "MA", "MD", "NJ", "NY", "PA", "RI", "VA", "DC",
]);

const GOOGLE_FIBER_STATES = new Set([
  "AL", "AZ", "CA", "CO", "GA", "IA", "KS", "MO", "NV", "NC", "TN", "TX", "UT",
]);

const CENTURYLINK_FIBER_STATES = new Set([
  "AZ", "CO", "FL", "IA", "ID", "MN", "MO", "NE", "NV", "NM", "OR", "TX", "UT", "WA",
]);

const SPECTRUM_STATES = new Set([
  "AL", "AZ", "AR", "CA", "CO", "CT", "FL", "GA", "HI", "ID", "IL", "IN", "KS",
  "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH",
  "NJ", "NM", "NY", "NC", "OH", "OK", "OR", "PA", "RI", "SC", "TN", "TX", "UT",
  "VT", "VA", "WA", "WV", "WI", "WY",
]);

const XFINITY_STATES = new Set([
  "AL", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "ID", "IL", "IN", "KS",
  "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "NH", "NJ", "NM", "NY",
  "NC", "OH", "OR", "PA", "SC", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "DC",
]);

const COX_STATES = new Set([
  "AZ", "AR", "CA", "CT", "FL", "GA", "IA", "ID", "KS", "LA", "MA", "NC", "NE",
  "NV", "OH", "OK", "RI", "VA",
]);

const OPTIMUM_STATES = new Set([
  "AR", "AZ", "CA", "CO", "CT", "ID", "KY", "LA", "MS", "MT", "NJ", "NV", "NY",
  "NC", "OK", "PA", "TN", "TX", "WV", "WY",
]);

const TMOBILE_5G_STATES = new Set([
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL",
  "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT",
  "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI",
  "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY", "DC",
]);

export type ProviderResult = {
  readonly provider: Provider;
  readonly recommended: boolean;
  readonly reason?: string;
};

export type ProviderLookupResult = {
  readonly results: readonly ProviderResult[];
  readonly hasFrontierFiber: boolean;
  readonly state: string;
};

export function getProvidersForState(stateAbbr: string): ProviderLookupResult {
  const state = stateAbbr.trim().toUpperCase();
  const candidates: Provider[] = [];

  if (FRONTIER_FIBER_STATES.has(state)) candidates.push(PROVIDERS.frontierFiber);
  if (ATT_FIBER_STATES.has(state)) candidates.push(PROVIDERS.attFiber);
  if (VERIZON_FIOS_STATES.has(state)) candidates.push(PROVIDERS.verizonFios);
  if (GOOGLE_FIBER_STATES.has(state)) candidates.push(PROVIDERS.googleFiber);
  if (CENTURYLINK_FIBER_STATES.has(state)) candidates.push(PROVIDERS.centurylinkFiber);
  if (XFINITY_STATES.has(state)) candidates.push(PROVIDERS.xfinity);
  if (SPECTRUM_STATES.has(state)) candidates.push(PROVIDERS.spectrum);
  if (COX_STATES.has(state)) candidates.push(PROVIDERS.cox);
  if (OPTIMUM_STATES.has(state)) candidates.push(PROVIDERS.optimum);
  if (TMOBILE_5G_STATES.has(state)) candidates.push(PROVIDERS.tmobile5g);

  const hasFrontierFiber = candidates.some((p) => p.isFrontierFiber);

  const sorted = [...candidates].sort((a, b) => {
    if (a.isFrontierFiber) return -1;
    if (b.isFrontierFiber) return 1;
    if (a.type === "fiber" && b.type !== "fiber") return -1;
    if (b.type === "fiber" && a.type !== "fiber") return 1;
    return b.maxSpeedMbps - a.maxSpeedMbps;
  });

  const results: ProviderResult[] = sorted.map((provider) => ({
    provider,
    recommended: provider.isFrontierFiber === true,
    reason: provider.isFrontierFiber
      ? "Recommended Fiber Option"
      : undefined,
  }));

  return { results, hasFrontierFiber, state };
}
