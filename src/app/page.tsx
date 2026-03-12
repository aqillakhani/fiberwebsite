import HeroSection from "@/components/sections/hero"
import BenefitsSection from "@/components/sections/benefits"
import PlansPreviewSection from "@/components/sections/plans-preview"
import HowItWorksSection from "@/components/sections/how-it-works"
import TestimonialsSection from "@/components/sections/testimonials-section"
import TrustSection from "@/components/sections/trust-section"
import RepSection from "@/components/sections/rep-section"
import FinalCTASection from "@/components/sections/final-cta"

export default function HomePage() {
  return (
    <main>
      <section className="py-0">
        <HeroSection />
      </section>

      <section className="py-16 md:py-24">
        <BenefitsSection />
      </section>

      <section className="py-16 md:py-24">
        <PlansPreviewSection />
      </section>

      <section className="py-16 md:py-24">
        <HowItWorksSection />
      </section>

      <section className="py-16 md:py-24">
        <TestimonialsSection />
      </section>

      <section className="py-12 md:py-16">
        <TrustSection />
      </section>

      <section className="py-12 md:py-16">
        <RepSection />
      </section>

      <section className="py-0">
        <FinalCTASection />
      </section>
    </main>
  )
}
