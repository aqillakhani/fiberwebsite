"use client"

import { cn } from "@/lib/utils"
import { useIntersectionObserver } from "@/hooks/use-intersection-observer"

const speeds = [
  { label: "DSL", speed: 25, unit: "Mbps", color: "bg-red-400/50", width: "0.36%", isFiber: false },
  { label: "Cable", speed: 700, unit: "Mbps", color: "bg-amber-400/50", width: "10%", isFiber: false },
  { label: "FiberFast 500", speed: 500, unit: "Mbps", color: "bg-fiber-blue", width: "7.1%", isFiber: true },
  { label: "FiberFast Gig 1", speed: 1000, unit: "Mbps", color: "bg-fiber-teal", width: "14.3%", isFiber: true },
  { label: "FiberFast Gig 7", speed: 7000, unit: "Mbps", color: "bg-gradient-to-r from-fiber-blue to-fiber-teal", width: "100%", isFiber: true, multiplier: "10x faster than cable" },
]

export default function SpeedVisualization() {
  const { ref, isVisible } = useIntersectionObserver()

  return (
    <section className="w-full py-16 md:py-24 bg-white white-section">
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
                <span className={cn(
                  "text-sm font-medium",
                  item.isFiber ? "text-foreground" : "text-muted-foreground"
                )}>
                  {item.label}
                </span>
                <div className="flex items-center gap-2">
                  {item.multiplier && isVisible && (
                    <span className="text-xs font-semibold text-fiber-teal bg-fiber-teal/10 px-2 py-0.5 rounded-full hidden sm:inline-block">
                      {item.multiplier}
                    </span>
                  )}
                  <span className={cn(
                    "text-sm font-bold tabular-nums",
                    item.isFiber ? "text-foreground" : "text-muted-foreground"
                  )}>
                    {item.speed.toLocaleString()} {item.unit}
                  </span>
                </div>
              </div>
              <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-1000 ease-out",
                    item.color,
                    item.isFiber && item.width === "100%" && "shadow-[0_0_8px_rgba(56,182,255,0.4)]",
                    isVisible ? "" : "!w-0"
                  )}
                  style={{
                    width: isVisible ? item.width : "0%",
                    height: item.isFiber ? "100%" : "66%",
                    marginTop: item.isFiber ? "0" : "2px",
                  }}
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
