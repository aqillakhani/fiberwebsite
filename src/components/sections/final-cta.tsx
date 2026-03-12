import Link from "next/link"
import { Button } from "@/components/ui/button"
import { COMPANY } from "@/lib/constants"

export default function FinalCTASection() {
  return (
    <section className="w-full bg-gradient-to-r from-fiber-blue to-fiber-blue-dark py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            Ready to Switch to Fiber?
          </h2>

          <p className="text-lg text-white/90 mb-8 max-w-2xl">
            Join thousands of homes enjoying faster, more reliable internet.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/check-availability">
              <Button
                size="lg"
                className="bg-white text-fiber-blue hover:bg-gray-100 font-semibold px-6 md:px-8"
              >
                Check Availability
              </Button>
            </Link>

            <Link href={COMPANY.phoneHref}>
              <Button
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white/10 font-semibold px-6 md:px-8"
              >
                Call Us: {COMPANY.phone}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
