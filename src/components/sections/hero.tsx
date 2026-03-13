import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden py-16 md:py-32 lg:py-40">
      {/* Background with gradient and grid overlay */}
      <div className="absolute inset-0 hero-gradient bg-grid-white"></div>

      {/* Content container */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-[1fr_1fr] gap-8 lg:gap-12 items-center">
          {/* Left side - Text content */}
          <div className="flex flex-col justify-center">
            <h1 className="heading-display text-4xl md:text-5xl lg:text-7xl font-bold mb-6 leading-tight text-white">
              Fiber Internet That{" "}
              <span className="text-gradient-blue">Actually Delivers</span>
            </h1>

            <p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed max-w-xl">
              No contracts. No data caps. No surprises. Just fast. Speeds up to 7 Gbps starting at $34.99/mo.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link href="/check-availability" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-fiber-teal hover:bg-fiber-teal/90 text-white px-8 md:px-10 gap-2 glow-teal min-h-[52px] font-semibold"
                >
                  Check Availability
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>

              <Link href="/pricing" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto border-white/20 text-white hover:bg-white/5 px-8 md:px-10 min-h-[52px] font-semibold"
                >
                  View Plans
                </Button>
              </Link>
            </div>

            {/* Social proof badge */}
            <div className="inline-flex items-center gap-3 w-fit px-4 py-3 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm">
              <span className="w-2 h-2 bg-green-500 rounded-full pulse-green"></span>
              <span className="text-sm font-medium text-white/80">Now serving homes nationwide</span>
            </div>
          </div>

          {/* Right side - Speed visualization */}
          <div className="flex items-center justify-center">
            <div className="w-full max-w-sm p-6 md:p-8 rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md">
              {/* Speed indicator */}
              <div className="mb-8">
                <div className="text-center">
                  <div className="text-4xl font-bold text-white mb-2">Up to 7 Gbps</div>
                  <div className="text-sm text-white/70">Download Speed</div>
                </div>
              </div>

              {/* Speed bars */}
              <div className="space-y-4 mb-8">
                {/* Bar 1 - 30% */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-white/70 uppercase tracking-wide">Standard</span>
                    <span className="text-xs font-semibold text-white">100 Mbps</span>
                  </div>
                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-fiber-blue to-fiber-teal rounded-full"
                      style={{ width: "30%" }}
                    ></div>
                  </div>
                </div>

                {/* Bar 2 - 60% */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-white/70 uppercase tracking-wide">Premium</span>
                    <span className="text-xs font-semibold text-white">1 Gbps</span>
                  </div>
                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-fiber-blue to-fiber-teal rounded-full"
                      style={{ width: "60%" }}
                    ></div>
                  </div>
                </div>

                {/* Bar 3 - 100% */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-white/70 uppercase tracking-wide">Elite</span>
                    <span className="text-xs font-semibold text-white">7 Gbps</span>
                  </div>
                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-fiber-blue to-fiber-teal rounded-full"
                      style={{ width: "100%" }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Symmetric label */}
              <div className="border-t border-white/10 pt-4">
                <div className="text-center">
                  <div className="text-sm font-semibold text-white">Symmetric Upload & Download</div>
                  <div className="text-xs text-white/60 mt-1">Same speed both ways</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
