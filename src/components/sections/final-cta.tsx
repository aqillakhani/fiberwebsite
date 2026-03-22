import Link from "next/link"
import { ArrowRight } from "lucide-react"
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
          Stop Settling for Slow Internet
        </h2>

        {/* Subtext */}
        <p className="mb-8 text-lg text-white/80">
          Switch to blazing fast, reliable fiber internet. No contracts, no data caps — just speed you can count on.
        </p>

        {/* Primary CTA Button */}
        <Link href="/check-availability" className="mb-4">
          <Button
            size="lg"
            className="min-h-[56px] bg-fiber-teal px-10 text-lg text-white hover:bg-fiber-teal/90 shadow-lg shadow-fiber-teal/30 cta-pulse gap-2"
          >
            Check Availability
            <ArrowRight className="w-5 h-5" />
          </Button>
        </Link>

        <p className="text-sm text-white/50 mb-6">
          Takes less than 30 seconds
        </p>

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
          No contracts. No data caps. No hidden fees.
        </p>
      </div>
    </section>
  )
}
