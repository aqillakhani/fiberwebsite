import Link from "next/link"
import { Button } from "@/components/ui/button"
import { COMPANY } from "@/lib/constants"

export default function FinalCTASection() {
  return (
    <section className="section-navy relative w-full py-20 md:py-28">
      {/* Grid overlay pattern */}
      <div className="absolute inset-0 bg-grid-white opacity-20" />

      <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center justify-center px-4 text-center sm:px-6 lg:px-8">
        {/* Main Heading */}
        <h2 className="heading-display mb-4 text-3xl text-white md:text-4xl lg:text-5xl">
          Ready to Experience Real Fiber Internet?
        </h2>

        {/* Subtext */}
        <p className="mb-8 text-lg text-white/80">
          Join thousands of homes enjoying blazing fast, reliable fiber internet. No contracts, no data caps, no regrets.
        </p>

        {/* Primary CTA Button */}
        <Link href="/check-availability" className="mb-6">
          <Button
            size="lg"
            className="min-h-[52px] bg-fiber-teal px-8 text-white hover:bg-fiber-teal/90 glow-teal"
          >
            Check Availability
          </Button>
        </Link>

        {/* Secondary CTA Link */}
        <Link
          href={COMPANY.phoneHref}
          className="mb-8 text-white/60 transition-colors hover:text-white/80"
        >
          Or call us: {COMPANY.phone}
        </Link>

        {/* Divider and Trust Badge */}
        <div className="divider-gradient mb-4 w-full" />
        <p className="text-sm text-white/50">
          No contracts. No data caps. 30-day money-back guarantee.
        </p>
      </div>
    </section>
  )
}
