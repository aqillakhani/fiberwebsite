"use client"

import { cn } from "@/lib/utils"
import { useIntersectionObserver } from "@/hooks/use-intersection-observer"

const speeds = [
  { label: "DSL", speed: 25, unit: "Mbps", color: "bg-red-400/70", width: "0.36%" },
  { label: "Cable", speed: 300, unit: "Mbps", color: "bg-amber-400/70", width: "4.3%" },
  { label: "FiberFast 500", speed: 500, unit: "Mbps", color: "bg-fiber-blue", width: "7.1%" },
  { label: "FiberFast Gig 1", speed: 1000, unit: "Mbps", color: "bg-fiber-teal", width: "14.3%" },
  { label: "FiberFast Gig 7", speed: 7000, unit: "Mbps", color: "bg-gradient-to-r from-fiber-blue to-fiber-teal", width: "100%" },
]

export default function SpeedVisualization() {
  const { ref, isVisible } = useIntersectionObserver()

  return (
    <section className="w-full py-16 md:py-24 bg-muted/30">
      <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={cn(
            "text-center mb-12 transition-all duration-700",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          )}
        >
          <h2 className="heading-section text-foreground mb-3">
            See the Speed Difference
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Fiber isn&apos;t just faster &mdash; it&apos;s in a completely different league.
          </p>
        </div>

        <div className="space-y-5 max-w-3xl mx-auto">
          {speeds.map((item, i) => (
            <div
              key={item.label}
              className={cn(
                "transition-all duration-700",
                isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-6"
              )}
              style={{ transitionDelay: isVisible ? `${i * 100}ms` : "0ms" }}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-medium text-foreground">
                  {item.label}
                </span>
                <span className="text-sm font-bold text-foreground tabular-nums">
                  {item.speed.toLocaleString()} {item.unit}
                </span>
              </div>
              <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-1000 ease-out",
                    item.color,
                    isVisible ? "" : "!w-0"
                  )}
                  style={{ width: isVisible ? item.width : "0%" }}
                />
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-muted-foreground mt-8">
          All FiberFast plans include symmetric upload speeds &mdash; same speed both ways.
        </p>
      </div>
    </section>
  )
}
