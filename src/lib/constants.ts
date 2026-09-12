export const COMPANY = {
  name: "FiberFastUSA",
  tagline: "Helping You Switch to Faster Fiber Internet",
  phone: "(469) 428-5942",
  phoneHref: "tel:+14694285942",
  hours: "Mon–Fri: 8am–8pm | Sat: 9am–5pm | Sun: Closed",
} as const;

/**
 * States with ≥1,000 sellable fiber homes in map_pin (fiberfast-marketing footprint roll-up, 2026-09-11).
 * Used for schema.org areaServed only — the address check decides serviceability, never this list.
 */
export const SERVICE_STATES = [
  "Texas", "Ohio", "Florida", "North Carolina", "Kentucky", "Georgia", "Iowa", "Pennsylvania",
  "Wisconsin", "New York", "Alabama", "Oklahoma", "Kansas", "Nebraska", "South Carolina", "Arkansas",
  "New Jersey", "Minnesota", "Illinois", "New Mexico", "Virginia", "Missouri",
] as const;

export type PlanTier = {
  readonly id: string;
  readonly name: string;
  readonly speed: string;
  readonly speedMbps: number;
  readonly price: number;
  readonly promoPrice: number | null;
  readonly giftCard: number;
  readonly freeMonths: number | null;
  readonly bestFor: string;
  readonly description: string;
  readonly isFeatured: boolean;
  readonly features: readonly string[];
};

export const PLANS: readonly PlanTier[] = [
  {
    id: "fast-500",
    name: "Fast 500",
    speed: "500 Mbps",
    speedMbps: 500,
    price: 34.99,
    promoPrice: null,
    giftCard: 50,
    freeMonths: 3,
    bestFor: "Streaming & browsing",
    description: "Great for streaming, browsing, and working from home.",
    isFeatured: false,
    features: [
      "Unlimited data — no caps ever",
      "500 Mbps download",
      "500 Mbps upload",
      "Stream 4K on 3+ devices",
      "Video calls & WFH ready",
      "Free installation",
      "Free router included",
      "$50 Visa Gift Card",
    ],
  },
  {
    id: "gig-1",
    name: "Gig 1",
    speed: "1 Gbps",
    speedMbps: 1000,
    price: 54.99,
    promoPrice: null,
    giftCard: 100,
    freeMonths: 3,
    bestFor: "Families & gaming",
    description: "Our most popular plan. Blazing fast speeds for the whole family.",
    isFeatured: true,
    features: [
      "Unlimited data — no caps ever",
      "1 Gbps download",
      "1 Gbps upload",
      "Stream 4K on 10+ devices",
      "Competitive gaming",
      "Large file downloads",
      "Smart home + security",
      "Free installation",
      "Free Wi-Fi 6E router",
      "$100 Visa Gift Card",
    ],
  },
  {
    id: "gig-2",
    name: "Gig 2",
    speed: "2 Gbps",
    speedMbps: 2000,
    price: 69.99,
    promoPrice: null,
    giftCard: 150,
    freeMonths: null,
    bestFor: "Power users",
    description: "Maximum performance for content creators, developers, and tech enthusiasts.",
    isFeatured: false,
    features: [
      "Unlimited data — no caps ever",
      "2 Gbps download",
      "2 Gbps upload",
      "Unlimited devices",
      "4K/8K streaming everywhere",
      "Zero lag gaming",
      "Content creation ready",
      "Free installation",
      "Free Wi-Fi 7 router",
      "$150 Visa Gift Card",
    ],
  },
  {
    id: "gig-5",
    name: "Gig 5",
    speed: "5 Gbps",
    speedMbps: 5000,
    price: 89.99,
    promoPrice: null,
    giftCard: 200,
    freeMonths: null,
    bestFor: "Ultra power users",
    description: "Insane speeds for homes that demand the absolute best.",
    isFeatured: false,
    features: [
      "Unlimited data — no caps ever",
      "5 Gbps download",
      "5 Gbps upload",
      "Unlimited devices",
      "8K streaming everywhere",
      "Pro-level gaming",
      "Content creation beast",
      "Free installation",
      "Free Wi-Fi 7 router",
      "Priority support",
      "$200 Visa Gift Card",
    ],
  },
  {
    id: "gig-7",
    name: "Gig 7",
    speed: "7 Gbps",
    speedMbps: 7000,
    price: 109.99,
    promoPrice: null,
    giftCard: 200,
    freeMonths: null,
    bestFor: "Extreme performance",
    description: "The fastest residential internet available. Period.",
    isFeatured: false,
    features: [
      "Unlimited data — no caps ever",
      "7 Gbps download",
      "7 Gbps upload",
      "Unlimited devices",
      "8K streaming everywhere",
      "Tournament-level gaming",
      "Professional content creation",
      "Free installation",
      "Free Wi-Fi 7 router",
      "Priority support",
      "Dedicated account manager",
      "$200 Visa Gift Card",
    ],
  },
] as const;

export type TeamMember = {
  readonly id: string;
  readonly slug: string;
  readonly name: string;
  readonly role: string;
  readonly bio: string;
  readonly phone: string;
  readonly image?: string;
};

export const TEAM_MEMBERS: readonly TeamMember[] = [
  {
    id: "oscar-salas",
    slug: "oscar-salas",
    name: "Oscar Salas",
    role: "Fiber Sales Representative",
    bio: "Helping families discover faster internet options and guiding them through the switch to fiber.",
    phone: "(469) 428-5942",
    image: "/reps/oscar-salas.jpeg",
  },
  {
    id: "obed-esparza",
    slug: "obed-esparza",
    name: "Obed Esparza",
    role: "Fiber Sales Representative",
    bio: "Dedicated to making the switch to fiber easy and stress-free for every customer.",
    phone: "(469) 428-5942",
  },
  {
    id: "victor-pineda",
    slug: "victor-pineda",
    name: "Victor Pineda",
    role: "Fiber Sales Representative",
    bio: "Passionate about connecting households with reliable, high-speed fiber internet.",
    phone: "(469) 428-5942",
    image: "/reps/victor-pineda.jpeg",
  },
  {
    id: "hector-vera",
    slug: "hector-vera",
    name: "Hector Vera",
    role: "Fiber Sales Representative",
    bio: "Focused on helping customers understand their options and find the perfect fiber plan.",
    phone: "(469) 428-5942",
    image: "/reps/hector-vera.jpeg",
  },
  {
    id: "gabriel-russa",
    slug: "gabriel-russa",
    name: "Gabriel Russa",
    role: "Fiber Sales Representative",
    bio: "Committed to providing a smooth, guided experience for customers switching to fiber.",
    phone: "(469) 428-5942",
    image: "/reps/gabriel-russa.jpeg",
  },
  {
    id: "jorge-gallardo",
    slug: "jorge-gallardo",
    name: "Jorge Gallardo",
    role: "Fiber Sales Representative",
    bio: "Helping communities get connected to better internet, one household at a time.",
    phone: "(469) 428-5942",
  },
  {
    id: "pio-carrillo",
    slug: "pio-carrillo",
    name: "Pio Carrillo",
    role: "Fiber Sales Representative",
    bio: "Dedicated to helping families discover the benefits of fast, reliable fiber internet.",
    phone: "(469) 428-5942",
    image: "/reps/pio-carrillo.jpeg",
  },
  {
    id: "amil-lakhani",
    slug: "amil-lakhani",
    name: "Amil Lakhani",
    role: "Fiber Sales Representative",
    bio: "Committed to making the fiber switch simple and seamless for every customer.",
    phone: "(469) 428-5942",
    image: "/reps/amil-lakhani.jpeg",
  },
  {
    id: "reggie-king",
    slug: "reggie-king",
    name: "Reggie King",
    role: "Fiber Sales Representative",
    bio: "Passionate about connecting neighborhoods with the fastest internet available.",
    phone: "(469) 428-5942",
    image: "/reps/reggie-king.jpeg",
  },
] as const;

export const PLAN_INCLUDES = [
  "Free professional installation",
  "Free Wi-Fi router included",
  "24/7 local customer support",
  "No data caps — ever",
  "No contracts required",
] as const;

export const USE_CASES = [
  { id: "streaming", label: "Streaming (Netflix, YouTube, etc.)" },
  { id: "gaming", label: "Online Gaming" },
  { id: "wfh", label: "Work From Home" },
  { id: "smart-home", label: "Smart Home Devices" },
  { id: "family", label: "Family Use (5+ people)" },
  { id: "content", label: "Content Creation / Uploads" },
] as const;

export const FAQ_ITEMS = [
  {
    question: "How fast is fiber internet?",
    answer: "Fiber internet plans range from 500 Mbps up to 7 Gbps. Unlike cable, fiber delivers symmetric speeds — your upload speed matches your download speed. This means video calls, cloud backups, and file sharing are just as fast as streaming and browsing.",
  },
  {
    question: "Is fiber available at my address?",
    answer: "Enter your street address on this page. We check the real fiber footprint for that exact home and tell you if it is live, coming soon, or not reachable yet. If it is coming soon we call you the day it goes live.",
  },
  {
    question: "Is there a contract or commitment?",
    answer: "No contracts, ever. Fiber plans are month-to-month. You can cancel anytime with no early termination fees.",
  },
  {
    question: "Are there data caps?",
    answer: "Absolutely not. All fiber plans include unlimited data with no throttling, no caps, and no overage charges. Use as much internet as you want.",
  },
  {
    question: "How long does installation take?",
    answer: "Professional installation typically takes 2–4 hours. A certified technician handles everything from running the fiber line to setting up your Wi-Fi router. Most customers are online the same day.",
  },
  {
    question: "What equipment do I need?",
    answer: "Nothing — everything is provided. Every plan includes a free Wi-Fi router (Wi-Fi 6E or Wi-Fi 7 depending on your plan) and an Optical Network Terminal (ONT). There are no equipment rental fees.",
  },
  {
    question: "What's the difference between fiber and cable internet?",
    answer: "Fiber uses light signals through glass strands, while cable uses electrical signals through copper wires. Fiber is faster, more reliable, has lower latency, and isn't affected by distance or network congestion the way cable is. Check out our Why Fiber page for a detailed comparison.",
  },
  {
    question: "How do I cancel or change my plan?",
    answer: "Give us a call and we'll help you out. Plan changes take effect on your next billing cycle. Cancellations can be done anytime — no fees, no hassle.",
  },
  {
    question: "Do you record calls?",
    answer: "Yes. Our specialists tell you at the start of every call that it is recorded, and we keep the recording so there is always a clear record of what was agreed.",
  },
  {
    question: "Do you offer business internet?",
    answer: "We currently focus on residential service. Business fiber plans are coming soon. Contact us if you're interested and we'll notify you when business plans launch.",
  },
  {
    question: "What areas do you serve?",
    answer: "We are an authorized partner for several fiber networks (Kinetic, Brightspeed and Frontier today) across 20+ states. Enter your address and we tell you which one — if any — is live at your home.",
  },
] as const;

export const NAV_LINKS = [
  { href: "/pricing", label: "Pricing" },
  { href: "/why-fiber", label: "Why Fiber" },
  { href: "/about", label: "About" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
] as const;

export const FOOTER_LINKS = {
  company: [
    { href: "/about", label: "About Us" },
    { href: "/contact", label: "Contact" },
  ],
  services: [
    { href: "/pricing", label: "Plans & Pricing" },
    { href: "/check-availability", label: "Check Availability" },
    { href: "/why-fiber", label: "Why Fiber" },
  ],
  support: [
    { href: "/faq", label: "FAQ" },
    { href: "/contact", label: "Support" },
    { href: "/privacy", label: "Privacy Policy" },
  ],
} as const;
