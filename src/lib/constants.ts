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

export const FAQ_ITEMS = [
  {
    question: "How fast is fiber internet?",
    answer: "Fiber plans on the networks we sell start around 300–500 Mbps and go up to multi-gig (1–7 Gbps depending on the network). Unlike cable, fiber delivers symmetric speeds — your upload speed matches your download speed. This means video calls, cloud backups, and file sharing are just as fast as streaming and browsing.",
  },
  {
    question: "Is fiber available at my address?",
    answer: "Enter your street address on this page. We check the real fiber footprint for that exact home and tell you if it is live, coming soon, or not reachable yet. If it is coming soon we call you the day it goes live.",
  },
  {
    question: "Is there a contract or commitment?",
    answer: "The networks we sell today offer month-to-month fiber plans with no early termination fees. If a specific plan or promo carries a term, the specialist tells you before you agree to anything.",
  },
  {
    question: "Are there data caps?",
    answer: "No. Every fiber plan we sell includes unlimited data with no throttling, no caps, and no overage charges.",
  },
  {
    question: "How long does installation take?",
    answer: "Professional installation typically takes 2–4 hours. A certified technician handles everything from running the fiber line to setting up your Wi-Fi router. Most customers are online the same day.",
  },
  {
    question: "What equipment do I need?",
    answer: "Nothing to buy. The network installs an Optical Network Terminal (ONT) and provides a Wi-Fi router. Whether the router is included free or carries a small monthly fee depends on the network and plan — the specialist tells you the exact number on the call.",
  },
  {
    question: "What's the difference between fiber and cable internet?",
    answer: "Fiber uses light signals through glass strands, while cable uses electrical signals through copper wires. Fiber is faster, more reliable, has lower latency, and isn't affected by distance or network congestion the way cable is. Check out our Why Fiber page for a detailed comparison.",
  },
  {
    question: "How do I cancel or change my plan?",
    answer: "Give us a call and we'll point you to the right place. Plan changes and cancellations go through the network that serves you; month-to-month plans can be cancelled anytime without early termination fees.",
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
    answer: "We are an authorized partner for several fiber networks — Kinetic, Brightspeed, Frontier, AT&T, Ripple and T-Mobile Fiber — across 20+ states. Enter your address and we tell you which one, if any, is live at your home.",
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
