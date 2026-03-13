import type { Metadata } from "next"

import HeroSection from "@/components/sections/hero"
import AvailabilitySection from "@/components/sections/availability-section"
import PlansPreviewSection from "@/components/sections/plans-preview"
import BenefitsSection from "@/components/sections/benefits"
import HowItWorksSection from "@/components/sections/how-it-works"
import TestimonialsSection from "@/components/sections/testimonials-section"
import MeetTheTeamSection from "@/components/sections/meet-the-team"
import FinalCTASection from "@/components/sections/final-cta"

export const metadata: Metadata = {
  title: "FiberFastUSA | Blazing Fast Fiber Internet for Your Home",
  description:
    "Experience blazing-fast fiber internet from 500 Mbps to 7 Gbps. No contracts, no data caps, no hidden fees. Check availability at your address today.",
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
    "Blazing-fast fiber internet with symmetric speeds up to 7 Gbps. No contracts, no data caps, no hidden fees.",
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
      <section className="py-0">
        <HeroSection />
      </section>

      <section className="py-0">
        <AvailabilitySection />
      </section>

      <section className="py-16 md:py-24">
        <PlansPreviewSection />
      </section>

      <section className="py-16 md:py-24">
        <BenefitsSection />
      </section>

      <section className="py-16 md:py-24">
        <HowItWorksSection />
      </section>

      <section className="py-16 md:py-24">
        <TestimonialsSection />
      </section>

      <section className="py-16 md:py-24">
        <MeetTheTeamSection />
      </section>

      <section className="py-0">
        <FinalCTASection />
      </section>
    </main>
  )
}
