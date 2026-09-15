import type { Metadata } from "next"

import { SERVICE_STATES } from "@/lib/constants"

import HeroSection from "@/components/sections/hero"
import HowItWorksSection from "@/components/sections/how-it-works"
import WhyFiberSection from "@/components/sections/why-fiber-section"
import ProvidersSection from "@/components/sections/providers-section"
import HomepageFAQ from "@/components/sections/homepage-faq"
import FinalCTASection from "@/components/sections/final-cta"

export const metadata: Metadata = {
  title: "FiberFastUSA | Is fiber live at your address?",
  description:
    "Type your address and get a real answer about fiber internet at your home. A fiber specialist calls within minutes. No contracts, no data caps, free installation.",
  openGraph: {
    title: "FiberFastUSA | Is fiber live at your address?",
    description: "Check your address for fiber internet and get a call from a specialist within minutes.",
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
  areaServed: SERVICE_STATES.map((name) => ({ "@type": "State", name })),
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
      <ProvidersSection />
      <WhyFiberSection />
      <HomepageFAQ />
      <FinalCTASection />
    </main>
  )
}
