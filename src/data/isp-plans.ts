/**
 * Rate cards by fiber network, read off each network's own order flow on 2026-09-12 (see
 * fiberfast-marketing/landing/isp-rate-cards.md for the raw capture and addresses used).
 *
 * `price` is the everyday monthly price WITH the network's AutoPay/paperless discount — the number the
 * networks themselves headline. `listPrice` is without it. Gift cards and free months are the promos that
 * were live on the check date; they change monthly and by address, so the UI always says "confirmed on your call".
 * Keys match `LEAD_ISPS` in lib/validations/lead-schema.ts and the ISP ids in map_pin. Never invent a price.
 */

export const NETWORK_IDS = ["kinetic", "brightspeed", "frontier", "att", "ripple", "tmobile"] as const;
export type NetworkId = (typeof NETWORK_IDS)[number];

export interface RatePlan {
  id: string;
  name: string;
  /** Symmetric unless stated. */
  speed: string;
  speedMbps: number;
  /** Monthly price with AutoPay/paperless discount applied. */
  price: number;
  /** Monthly price without the discount; null when the network only shows one number. */
  listPrice: number | null;
  /** Prepaid card promo live on the check date, in dollars. */
  giftCard: number | null;
  /** Years the network guarantees the price; null when not stated. */
  priceGuaranteeYears: number | null;
  perks: readonly string[];
  isFeatured: boolean;
}

export interface NetworkCatalog {
  id: NetworkId;
  name: string;
  /** Short label for chips and result cards. */
  shortName: string;
  /** Rate card we are allowed to show. `null` = pricing confirmed on the call. */
  plans: readonly RatePlan[] | null;
  /** Applies to every plan on the network. */
  includes: readonly string[];
  /** Promo live on the check date, in plain words. */
  promoNote: string | null;
  /** Where this network sells today (from the footprint roll-up; display only). */
  states: string;
  note: string;
  /** ISO date the card was read from the network's site. */
  checkedOn: string;
}

export const RATE_CARD_CHECKED_ON = "2026-09-12";

export const NETWORKS: readonly NetworkCatalog[] = [
  {
    id: "kinetic",
    name: "Kinetic Fiber",
    shortName: "Kinetic",
    states: "TX, OH, GA, KY, NC, PA, IA, FL and 11 more",
    note: "Same price in every Kinetic market; gift cards and free months vary by address.",
    includes: ["Wi-Fi gateway included", "No annual contract", "Unlimited data", "$0 activation on online orders"],
    promoNote: "Up to $200 prepaid Mastercard, and some addresses get the first 3 months free.",
    checkedOn: RATE_CARD_CHECKED_ON,
    plans: [
      { id: "kinetic-100", name: "Fiber 100", speed: "100 Mbps", speedMbps: 100, price: 19.99, listPrice: 24.99, giftCard: null, priceGuaranteeYears: 1, perks: ["Email, browsing, video chat"], isFeatured: false },
      { id: "kinetic-300", name: "Fiber 300", speed: "300 Mbps", speedMbps: 300, price: 34.99, listPrice: 39.99, giftCard: null, priceGuaranteeYears: 1, perks: ["Streaming on several devices"], isFeatured: false },
      { id: "kinetic-1g", name: "Fiber 1 Gig", speed: "1 Gbps", speedMbps: 1000, price: 39.99, listPrice: 44.99, giftCard: 100, priceGuaranteeYears: 1, perks: ["Work from home and gaming"], isFeatured: true },
      { id: "kinetic-2g", name: "Fiber 2 Gig", speed: "2 Gbps", speedMbps: 2000, price: 59.99, listPrice: 64.99, giftCard: 200, priceGuaranteeYears: 2, perks: ["Wi-Fi 7 gateway", "Dozens of devices at once"], isFeatured: false },
      { id: "kinetic-max", name: "Fiber Max 2 Gig", speed: "2 Gbps", speedMbps: 2000, price: 79.99, listPrice: 84.99, giftCard: 200, priceGuaranteeYears: 3, perks: ["eero Pro 7 mesh + extenders", "eero Plus security", "24/7 premium support"], isFeatured: false },
    ],
  },
  {
    id: "brightspeed",
    name: "Brightspeed Fiber",
    shortName: "Brightspeed",
    states: "NC, OH, MO, TX, PA, TN, AL and 12 more",
    note: "Prices shown with the $10 AutoPay + paperless discount.",
    includes: ["Wi-Fi 7 router included", "No annual contract", "No data caps", "Installation guarantee"],
    promoNote: "Up to $150 prepaid Mastercard on 500 Mbps and faster.",
    checkedOn: RATE_CARD_CHECKED_ON,
    plans: [
      { id: "bspd-200", name: "Fiber 200", speed: "200 Mbps", speedMbps: 200, price: 29.99, listPrice: 39.99, giftCard: null, priceGuaranteeYears: null, perks: ["Everyday browsing and streaming"], isFeatured: false },
      { id: "bspd-500", name: "Fiber 500", speed: "500 Mbps", speedMbps: 500, price: 49.99, listPrice: 59.99, giftCard: 100, priceGuaranteeYears: null, perks: ["HD streaming and video calls"], isFeatured: false },
      { id: "bspd-1g", name: "Fiber 1 Gig", speed: "1 Gbps", speedMbps: 1000, price: 69.99, listPrice: 79.99, giftCard: 150, priceGuaranteeYears: null, perks: ["4K streaming", "Powers a connected home"], isFeatured: true },
      { id: "bspd-2g", name: "Fiber 2 Gig", speed: "2 Gbps", speedMbps: 2000, price: 69.99, listPrice: 79.99, giftCard: 150, priceGuaranteeYears: null, perks: ["Same price as 1 Gig right now", "Multiple 8K streams"], isFeatured: false },
    ],
  },
  {
    id: "frontier",
    name: "Frontier Fiber",
    shortName: "Frontier",
    states: "CA, FL, TX, CT, IN, WV, OH, NY and 13 more",
    note: "Prices shown with AutoPay. Verizon mobile customers save another $15/mo.",
    includes: ["Wi-Fi router included", "No annual contract", "Free expert install on 1 Gig and up", "Free Whole-Home Wi-Fi on 1 Gig and up"],
    promoNote: "First month free on Fiber 500 and 1 Gig; Visa reward cards from $100 to $300.",
    checkedOn: RATE_CARD_CHECKED_ON,
    plans: [
      { id: "frontier-200", name: "Fiber 200", speed: "200 Mbps", speedMbps: 200, price: 29.99, listPrice: 39.99, giftCard: null, priceGuaranteeYears: 3, perks: ["Free expert install"], isFeatured: false },
      { id: "frontier-500", name: "Fiber 500", speed: "500 Mbps", speedMbps: 500, price: 44.99, listPrice: 54.99, giftCard: 100, priceGuaranteeYears: 4, perks: ["First month free"], isFeatured: false },
      { id: "frontier-1g", name: "Fiber 1 Gig", speed: "1 Gbps", speedMbps: 1000, price: 64.99, listPrice: 74.99, giftCard: 150, priceGuaranteeYears: 5, perks: ["First month free", "Whole-Home Wi-Fi included"], isFeatured: true },
      { id: "frontier-2g", name: "Fiber 2 Gig", speed: "2 Gbps", speedMbps: 2000, price: 79.99, listPrice: 89.99, giftCard: 200, priceGuaranteeYears: 5, perks: ["Wi-Fi 7 coverage"], isFeatured: false },
      { id: "frontier-5g", name: "Fiber 5 Gig", speed: "5 Gbps", speedMbps: 5000, price: 104.99, listPrice: 114.99, giftCard: 300, priceGuaranteeYears: 5, perks: ["Wi-Fi 7 for heavy households"], isFeatured: false },
      { id: "frontier-7g", name: "Fiber 7 Gig", speed: "7 Gbps", speedMbps: 7000, price: 124.99, listPrice: 134.99, giftCard: 300, priceGuaranteeYears: 5, perks: ["Best Wi-Fi + 3-yr new-tech upgrade"], isFeatured: false },
    ],
  },
  {
    id: "att",
    name: "AT&T Fiber",
    shortName: "AT&T",
    states: "select metros",
    note: "New-customer prices for the first 12 months, with the $10 AutoPay + paperless discount. Plan line-up varies by address.",
    includes: ["Wi-Fi 6 gateway, no equipment fee", "No annual contract", "No data caps", "Free self-setup kit"],
    promoNote: "$25–$40/mo off for 12 months; AT&T Wireless customers save $15–$25/mo more.",
    checkedOn: RATE_CARD_CHECKED_ON,
    plans: [
      { id: "att-300", name: "Internet 300", speed: "300 Mbps", speedMbps: 300, price: 35, listPrice: 60, giftCard: null, priceGuaranteeYears: null, perks: ["$20/mo with AT&T Wireless"], isFeatured: false },
      { id: "att-500", name: "Internet 500", speed: "500 Mbps", speedMbps: 500, price: 50, listPrice: 75, giftCard: null, priceGuaranteeYears: null, perks: ["$35/mo with AT&T Wireless"], isFeatured: false },
      { id: "att-1000", name: "Internet 1000", speed: "1 Gbps", speedMbps: 1000, price: 50, listPrice: 90, giftCard: null, priceGuaranteeYears: null, perks: ["Same price as 500 right now", "$30/mo with AT&T Wireless"], isFeatured: true },
      { id: "att-5000", name: "Internet 5000", speed: "5 Gbps", speedMbps: 5000, price: 95, listPrice: 135, giftCard: null, priceGuaranteeYears: null, perks: ["$70/mo with AT&T Wireless"], isFeatured: false },
    ],
  },
  {
    id: "ripple",
    name: "Ripple Fiber",
    shortName: "Ripple",
    states: "NC, SC, MI, FL, AZ, AR, CO, IL, MA, WA communities",
    note: "All-in pricing — taxes and fees included, no promo cliff.",
    includes: ["Taxes and fees included", "No contract", "Wi-Fi router included", "Free White Glove installation", "30-day Service Promise"],
    promoNote: "First month free on every plan.",
    checkedOn: RATE_CARD_CHECKED_ON,
    plans: [
      { id: "ripple-650", name: "650 Mbps", speed: "650 Mbps", speedMbps: 650, price: 40, listPrice: null, giftCard: null, priceGuaranteeYears: null, perks: ["Wi-Fi modem/router included"], isFeatured: false },
      { id: "ripple-1g", name: "1 Gig", speed: "1 Gbps", speedMbps: 1000, price: 55, listPrice: null, giftCard: null, priceGuaranteeYears: null, perks: ["Wi-Fi 7", "Free internet backup ($20/mo value)", "Free eero Secure"], isFeatured: true },
      { id: "ripple-2g", name: "2 Gig", speed: "2 Gbps", speedMbps: 2000, price: 75, listPrice: null, giftCard: null, priceGuaranteeYears: null, perks: ["Wi-Fi 7", "Free internet backup", "Free eero Secure"], isFeatured: false },
      { id: "ripple-5g", name: "5 Gig", speed: "5 Gbps", speedMbps: 5000, price: 105, listPrice: null, giftCard: null, priceGuaranteeYears: null, perks: ["Wi-Fi 7", "Free internet backup", "Free eero Secure"], isFeatured: false },
      { id: "ripple-8g", name: "8 Gig", speed: "8 Gbps", speedMbps: 8000, price: 135, listPrice: null, giftCard: null, priceGuaranteeYears: null, perks: ["Wi-Fi 7", "Free internet backup", "Free eero Secure"], isFeatured: false },
    ],
  },
  {
    id: "tmobile",
    name: "T-Mobile Fiber (Metronet, Lumos)",
    shortName: "T-Mobile Fiber",
    states: "select metros",
    note: "Pricing confirmed on your call.",
    includes: [],
    promoNote: null,
    checkedOn: RATE_CARD_CHECKED_ON,
    plans: null,
  },
];

export function getNetwork(id: string | null | undefined): NetworkCatalog | undefined {
  return NETWORKS.find((network) => network.id === id);
}

export function networksWithRateCards(): NetworkCatalog[] {
  return NETWORKS.filter((network) => network.plans !== null);
}

export function lowestPrice(plans: readonly RatePlan[]): number {
  return Math.min(...plans.map((plan) => plan.price));
}
