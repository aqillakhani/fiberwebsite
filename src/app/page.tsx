import type { Metadata } from "next"

import HeroSection from "@/components/sections/hero"
import HowItWorksSection from "@/components/sections/how-it-works"
import WhyFiberSection from "@/components/sections/why-fiber-section"
import PlansPreviewSection from "@/components/sections/plans-preview"
import InlineCTA from "@/components/sections/inline-cta"
import TrustSection from "@/components/sections/trust-section"
import AvailabilitySection from "@/components/sections/availability-section"
import ServiceAreaSection from "@/components/sections/service-area-section"
import RepVerificationSection from "@/components/sections/rep-verification-section"
import HomepageFAQ from "@/components/sections/homepage-faq"
import FinalCTASection from "@/components/sections/final-cta"

export const metadata: Metadata = {
  title: "FiberFastUSA | Switch to Faster Fiber Internet",
  description:
    "FiberFastUSA helps you explore fiber internet options and make the switch. Plans from 500 Mbps to 7 Gbps starting at $34.99/mo. Check availability today.",
  openGraph: {
    title: "FiberFastUSA | Switch to Faster Fiber Internet",
    description:
      "Explore fiber internet plans starting at $34.99/mo. No contracts, no data caps. Check availability now.",
  },
}

const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "FiberFastUSA",
  description:
    "FiberFastUSA helps customers explore fiber internet options and switch to faster, more reliable service.",
  url: "https://fiberfastusa.com",
  telephone: "(469) 428-5942",
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
      <HowItWorksSection />
      <PlansPreviewSection />
      <WhyFiberSection />
      <InlineCTA
        heading="See if fiber is available at your address"
        ctaText="Check Your Address"
      />
      <TrustSection />
      <AvailabilitySection />
      <InlineCTA
        heading="Still have questions? We're here to help."
        ctaText="Get Started Now"
      />
      <ServiceAreaSection />
      <RepVerificationSection />
      <HomepageFAQ />
      <FinalCTASection />
    </main>
  )
}
