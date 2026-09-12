import { PLANS as FRONTIER_PLANS, type PlanTier } from "@/lib/constants";

/**
 * Plans by fiber network. The site was originally built around Frontier's rate card; every other network's
 * pricing is confirmed by the closer on the call until the owner supplies its rate card (never invent prices).
 * Keys match `LEAD_ISPS` in lib/validations/lead-schema.ts and the ISP ids in map_pin.
 */

export const NETWORK_IDS = ["kinetic", "brightspeed", "frontier", "att", "ripple", "tmobile"] as const;
export type NetworkId = (typeof NETWORK_IDS)[number];

export interface NetworkCatalog {
  id: NetworkId;
  name: string;
  /** Short label for chips and result cards. */
  shortName: string;
  /** Rate card we are allowed to show. `null` = pricing confirmed on the call. */
  plans: readonly PlanTier[] | null;
  /** Where this network sells today (from the footprint roll-up; display only). */
  states: string;
  note: string;
}

export const NETWORKS: readonly NetworkCatalog[] = [
  {
    id: "kinetic",
    name: "Kinetic Fiber",
    shortName: "Kinetic",
    plans: null,
    states: "TX, OH, GA, KY, NC, PA, IA, FL and 11 more",
    note: "Symmetric fiber up to multi-gig. Current promos and pricing are confirmed on your call.",
  },
  {
    id: "brightspeed",
    name: "Brightspeed Fiber",
    shortName: "Brightspeed",
    plans: null,
    states: "NC, OH, MO, TX, PA, TN, AL and 12 more",
    note: "Fiber plans with no annual contract. Current promos and pricing are confirmed on your call.",
  },
  {
    id: "frontier",
    name: "Frontier Fiber",
    shortName: "Frontier",
    plans: FRONTIER_PLANS,
    states: "CA, FL, TX, CT, IN, WV, OH, NY and 13 more",
    note: "Rate card shown below; promos change monthly and are confirmed on your call.",
  },
  {
    id: "att",
    name: "AT&T Fiber",
    shortName: "AT&T",
    plans: null,
    states: "select metros",
    note: "Available at some addresses we serve. Pricing confirmed on your call.",
  },
  {
    id: "ripple",
    name: "Ripple Fiber",
    shortName: "Ripple",
    plans: null,
    states: "select communities",
    note: "Local fiber builder. Pricing confirmed on your call.",
  },
  {
    id: "tmobile",
    name: "T-Mobile Fiber (Metronet, Lumos)",
    shortName: "T-Mobile Fiber",
    plans: null,
    states: "select metros",
    note: "Pricing confirmed on your call.",
  },
];

export function getNetwork(id: string | null | undefined): NetworkCatalog | undefined {
  return NETWORKS.find((network) => network.id === id);
}

export function networksWithRateCards(): NetworkCatalog[] {
  return NETWORKS.filter((network) => network.plans !== null);
}
