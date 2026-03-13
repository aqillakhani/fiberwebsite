import type { Metadata } from "next"

import HeroSection from "@/components/sections/hero"
import WhyFiberSection from "@/components/sections/why-fiber-section"
import SpeedVisualization from "@/components/sections/speed-visualization"
import PlansPreviewSection from "@/components/sections/plans-preview"
import HowItWorksSection from "@/components/sections/how-it-works"
import RepVerificationSection from "@/components/sections/rep-verification-section"
import ServiceAreaSection from "@/components/sections/service-area-section"
import TestimonialsSection from "@/components/sections/testimonials-section"
import HomepageFAQ from "@/components/sections/homepage-faq"
import FinalCTASection from "@/components/sections/final-cta"

export const metadata: Metadata = {
  title: "FiberFastUSA | Fiber Internet That Actually Delivers",
  description:
    "No contracts. No data caps. No surprises. Just fast. Fiber internet from 500 Mbps to 7 Gbps starting at $34.99/mo. Check availability at your address today.",
  openGraph: {
    title: "FiberFastUSA | Fiber Internet That Actually Works",
    description:
      "Gigabit fiber internet starting at $34.99/mo. No contracts, no data caps. Check availability now.",
  },
}

const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "FiberFastUSA",
  description:
    "Fiber internet that actually delivers. Symmetric speeds up to 7 Gbps. No contracts, no data caps, no hidden fees.",
  url: "https://fiberfastusa.com",
  telephone: "(888) 555-FAST",
  email: "hello@fiberfastusa.com",
  address: {
    "@type": "PostalAddress",
    streetAddress: "123 Fiber Lane",
    addressLocality: "Denver",
    addressRegion: "CO",
    postalCode: "80202",
    addressCountry: "US",
  },
  priceRange: "$34.99 - $109.99/mo",
  areaServed: {
    "@type": "Country",
    name: "United States",
  },
}

export default function HomePage() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
      />
      <HeroSection />
      <WhyFiberSection />
      <SpeedVisualization />
      <PlansPreviewSection />
      <HowItWorksSection />
      <RepVerificationSection />
      <ServiceAreaSection />
      <TestimonialsSection />
      <HomepageFAQ />
      <FinalCTASection />
    </main>
  )
}
