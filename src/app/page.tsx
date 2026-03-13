import HeroSection from "@/components/sections/hero"
import AvailabilitySection from "@/components/sections/availability-section"
import PlansPreviewSection from "@/components/sections/plans-preview"
import BenefitsSection from "@/components/sections/benefits"
import HowItWorksSection from "@/components/sections/how-it-works"
import TestimonialsSection from "@/components/sections/testimonials-section"
import MeetTheTeamSection from "@/components/sections/meet-the-team"
import FinalCTASection from "@/components/sections/final-cta"

export default function HomePage() {
  return (
    <main>
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
