import { ISP_LABELS, type LeadIsp } from "@/lib/validations/lead-schema";

/**
 * Providers we shop on the homeowner's behalf. Display only — which one actually reaches an address is
 * decided by the address check and confirmed by the specialist. Prices are never published: they depend on
 * the address and this month's promos (closer reference: fiberfast-marketing/landing/isp-rate-cards.md).
 */
export interface Provider {
  id: LeadIsp;
  name: string;
  /** Short plain-words footprint. */
  where: string;
}

export const PROVIDERS: readonly Provider[] = [
  { id: "kinetic", name: ISP_LABELS.kinetic, where: "18 states across the South, Midwest and Northeast" },
  { id: "brightspeed", name: ISP_LABELS.brightspeed, where: "20 states, mostly Southeast and Midwest" },
  { id: "frontier", name: ISP_LABELS.frontier, where: "25 states incl. TX, CA, FL, CT" },
  { id: "att", name: ISP_LABELS.att, where: "21 states across the South and Midwest" },
  { id: "verizon", name: ISP_LABELS.verizon, where: "Northeast and Mid-Atlantic" },
  { id: "tmobile", name: ISP_LABELS.tmobile, where: "Metronet and Lumos markets" },
  { id: "metronet", name: ISP_LABELS.metronet, where: "Midwest and Southeast cities" },
  { id: "google", name: ISP_LABELS.google, where: "Select metros" },
  { id: "ripple", name: ISP_LABELS.ripple, where: "NC, SC, MI, FL and more" },
  { id: "spectrum", name: ISP_LABELS.spectrum, where: "41 states" },
  { id: "xfinity", name: ISP_LABELS.xfinity, where: "39 states" },
  { id: "optimum", name: ISP_LABELS.optimum, where: "NY, NJ, CT and the South" },
  { id: "cox", name: ISP_LABELS.cox, where: "18 states" },
];
