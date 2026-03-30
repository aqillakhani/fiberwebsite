"use client"

import Link from "next/link"
import { MapPin, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useIntersectionObserver } from "@/hooks/use-intersection-observer"

const states = [
  "Texas",
  "Florida",
  "California",
  "Illinois",
  "Ohio",
  "Michigan",
  "Arizona",
  "Georgia",
  "Tennessee",
  "Colorado",
  "North Carolina",
  "Virginia",
  "New York",
  "Pennsylvania",
  "Washington",
  "Oregon",
  "Nevada",
  "Indiana",
  "Missouri",
  "Maryland",
]

export default function ServiceAreaSection() {
  const { ref, isVisible } = useIntersectionObserver()

  return (
    <section className="w-full py-16 md:py-24 bg-treatment-showcase">
      <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left — Content */}
          <div
            className={cn(
              "transition-all duration-700",
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-6"
            )}
          >
            <h2 className="heading-section text-foreground mb-4">
              Areas We Serve
            </h2>
            <p className="text-lg text-muted-foreground mb-6">
              FiberFastUSA helps customers get connected to fiber internet across the United States. Our team operates in these areas and more.
            </p>

            <div className="flex flex-wrap gap-2 mb-8">
              {states.map((state) => (
                <span
                  key={state}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-fiber-teal/10 text-fiber-teal text-sm font-medium"
                >
                  <MapPin className="size-3" />
                  {state}
                </span>
              ))}
              <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-muted text-muted-foreground text-sm font-medium">
                + 30 more states
              </span>
            </div>

            <Link href="/check-availability">
              <Button className="bg-fiber-teal text-white hover:bg-fiber-teal/90 gap-2 font-bold">
                Check Your Address
                <ArrowRight className="size-4" />
              </Button>
            </Link>
          </div>

          {/* Right — Visual */}
          <div
            className={cn(
              "flex items-center justify-center transition-all duration-700 delay-200",
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-6"
            )}
          >
            <div className="relative w-full max-w-sm aspect-square flex items-center justify-center">
              {/* Decorative rings */}
              <div className="absolute inset-0 rounded-full border border-fiber-blue/10" />
              <div className="absolute inset-6 rounded-full border border-fiber-blue/15" />
              <div className="absolute inset-12 rounded-full border border-fiber-blue/20" />

              {/* Center stat */}
              <div className="text-center relative z-10">
                <div className="text-5xl md:text-6xl font-bold text-fiber-blue mb-2">
                  50
                </div>
                <div className="text-muted-foreground font-medium">
                  States Nationwide
                </div>
                <div className="mt-2 flex items-center justify-center gap-1.5">
                  <span className="w-2 h-2 bg-fiber-success rounded-full pulse-green" />
                  <span className="text-xs text-fiber-success font-medium">Expanding regularly</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
