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
  /** Provider's own logo under /public/providers (trademark of its owner; shown with owner's approval 2026-09-15). */
  logo: string;
}

export const PROVIDERS: readonly Provider[] = [
  { id: "kinetic", name: ISP_LABELS.kinetic, logo: "/providers/kinetic.svg", where: "18 states across the South, Midwest and Northeast" },
  { id: "brightspeed", name: ISP_LABELS.brightspeed, logo: "/providers/brightspeed.png", where: "20 states, mostly Southeast and Midwest" },
  { id: "frontier", name: ISP_LABELS.frontier, logo: "/providers/frontier.svg", where: "25 states incl. TX, CA, FL, CT" },
  { id: "att", name: ISP_LABELS.att, logo: "/providers/att.svg", where: "21 states across the South and Midwest" },
  { id: "verizon", name: ISP_LABELS.verizon, logo: "/providers/verizon.svg", where: "Northeast and Mid-Atlantic" },
  { id: "tmobile", name: ISP_LABELS.tmobile, logo: "/providers/tmobile.svg", where: "Metronet and Lumos markets" },
  { id: "metronet", name: ISP_LABELS.metronet, logo: "/providers/metronet.svg", where: "Midwest and Southeast cities" },
  { id: "google", name: ISP_LABELS.google, logo: "/providers/google.svg", where: "Select metros" },
  { id: "ripple", name: ISP_LABELS.ripple, logo: "/providers/ripple.svg", where: "NC, SC, MI, FL and more" },
  { id: "spectrum", name: ISP_LABELS.spectrum, logo: "/providers/spectrum.svg", where: "41 states" },
  { id: "xfinity", name: ISP_LABELS.xfinity, logo: "/providers/xfinity.svg", where: "39 states" },
  { id: "optimum", name: ISP_LABELS.optimum, logo: "/providers/optimum.png", where: "NY, NJ, CT and the South" },
  { id: "cox", name: ISP_LABELS.cox, logo: "/providers/cox.svg", where: "18 states" },
];
