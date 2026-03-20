export const COMPANY = {
  name: "FiberFastUSA",
  tagline: "Fiber Internet That Actually Works",
  phone: "(888) 555-FAST",
  phoneHref: "tel:+18885553278",
  email: "hello@fiberfastusa.com",
  hours: "Mon–Fri: 8am–8pm | Sat: 9am–5pm | Sun: Closed",
  address: "123 Fiber Lane, Denver, CO 80202",
  socialLinks: {
    facebook: "https://facebook.com/fiberfastusa",
    twitter: "https://x.com/fiberfastusa",
    instagram: "https://instagram.com/fiberfastusa",
    linkedin: "https://linkedin.com/company/fiberfastusa",
  },
} as const;

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
  readonly email: string;
};

export const TEAM_MEMBERS: readonly TeamMember[] = [
  {
    id: "sarah-johnson",
    slug: "sarah-johnson",
    name: "Sarah Johnson",
    role: "Founder & CEO",
    bio: "Former cable executive turned fiber advocate. 15 years of telecom experience.",
    phone: "(888) 555-3278",
    email: "sarah@fiberfastusa.com",
  },
  {
    id: "mike-chen",
    slug: "mike-chen",
    name: "Mike Chen",
    role: "Head of Operations",
    bio: "Infrastructure expert dedicated to building the fastest fiber network nationwide.",
    phone: "(888) 555-3278",
    email: "mike@fiberfastusa.com",
  },
  {
    id: "james-rodriguez",
    slug: "james-rodriguez",
    name: "James Rodriguez",
    role: "Lead Technician",
    bio: "10+ years installing fiber. Every installation is handled with pride.",
    phone: "(888) 555-3278",
    email: "james@fiberfastusa.com",
  },
  {
    id: "emma-wilson",
    slug: "emma-wilson",
    name: "Emma Wilson",
    role: "Customer Success",
    bio: "24/7 support that actually answers the phone. Because you matter.",
    phone: "(888) 555-3278",
    email: "emma@fiberfastusa.com",
  },
] as const;

export const PLAN_INCLUDES = [
  "Free professional installation",
  "Free Wi-Fi router included",
  "24/7 local customer support",
  "No data caps — ever",
  "No contracts required",
  "30-day money-back guarantee",
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
    answer: "FiberFastUSA offers plans from 500 Mbps up to 7 Gbps. Unlike cable, fiber delivers symmetric speeds — your upload speed matches your download speed. This means video calls, cloud backups, and file sharing are just as fast as streaming and browsing.",
  },
  {
    question: "Is fiber available at my address?",
    answer: "We're expanding rapidly across the United States. Use our Check Availability tool to see if your address is in our service area. If we're not there yet, sign up to be notified when we arrive in your area.",
  },
  {
    question: "Is there a contract or commitment?",
    answer: "No contracts, ever. All FiberFastUSA plans are month-to-month. You can cancel anytime with no early termination fees. We also offer a 30-day money-back guarantee.",
  },
  {
    question: "Are there data caps?",
    answer: "Absolutely not. All FiberFastUSA plans include unlimited data with no throttling, no caps, and no overage charges. Use as much internet as you want.",
  },
  {
    question: "How long does installation take?",
    answer: "Professional installation typically takes 2-4 hours. Our technicians handle everything from running the fiber line to setting up your Wi-Fi router. Most customers are online the same day.",
  },
  {
    question: "What equipment do I need?",
    answer: "Nothing — we provide everything. Every plan includes a free Wi-Fi router (Wi-Fi 6E or Wi-Fi 7 depending on your plan) and an Optical Network Terminal (ONT). There are no equipment rental fees.",
  },
  {
    question: "What's the difference between fiber and cable internet?",
    answer: "Fiber uses light signals through glass strands, while cable uses electrical signals through copper wires. Fiber is faster, more reliable, has lower latency, and isn't affected by distance or network congestion the way cable is. Check out our Why Fiber page for a detailed comparison.",
  },
  {
    question: "How do I cancel or change my plan?",
    answer: "Call us or email support. Plan changes take effect on your next billing cycle. Cancellations can be done anytime — no fees, no hassle.",
  },
  {
    question: "Do you offer business internet?",
    answer: "We currently focus on residential service. Business fiber plans are coming soon. Contact us if you're interested and we'll notify you when business plans launch.",
  },
  {
    question: "What areas do you serve?",
    answer: "We currently serve communities across the United States including Denver, Dallas, Phoenix, Tampa, Nashville, and more — with new areas being added every month. Check availability at your address to see if we're in your area.",
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
    { href: "/careers", label: "Careers" },
    { href: "/verify-rep", label: "Verify a Rep" },
  ],
  services: [
    { href: "/pricing", label: "Plans & Pricing" },
    { href: "/check-availability", label: "Check Availability" },
    { href: "/get-started", label: "Get Started" },
    { href: "/why-fiber", label: "Why Fiber" },
  ],
  support: [
    { href: "/faq", label: "FAQ" },
    { href: "/contact", label: "Support" },
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms of Service" },
  ],
} as const;
