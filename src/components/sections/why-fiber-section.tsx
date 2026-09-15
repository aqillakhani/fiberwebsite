"use client"

import Link from "next/link"
import { Wifi, Cable, Radio, Zap, Clock, Upload, Shield } from "lucide-react"
import { cn } from "@/lib/utils"
import { useIntersectionObserver } from "@/hooks/use-intersection-observer"

const comparisons = [
  {
    type: "DSL",
    icon: Radio,
    speed: "Up to 25 Mbps",
    latency: "30-60ms",
    upload: "3 Mbps",
    reliability: "Poor",
    reliabilityColor: "text-red-400",
    barWidth: "w-[8%]",
    barColor: "bg-red-400/60",
    cardClass: "border-border",
  },
  {
    type: "Cable",
    icon: Cable,
    speed: "Up to 700 Mbps",
    latency: "15-30ms",
    upload: "20 Mbps",
    reliability: "Fair",
    reliabilityColor: "text-amber-400",
    barWidth: "w-[25%]",
    barColor: "bg-amber-400/60",
    cardClass: "border-border",
  },
  {
    type: "Fiber",
    icon: Wifi,
    speed: "1–7 Gbps by network",
    latency: "<5ms",
    upload: "Same as download",
    reliability: "Excellent",
    reliabilityColor: "text-fiber-success",
    barWidth: "w-full",
    barColor: "bg-gradient-to-r from-fiber-blue to-fiber-teal",
    cardClass: "gradient-border border-2 scale-[1.02] shadow-lg",
  },
]

const stats = [
  { icon: Zap, label: "Speed", value: "Multi-gig" },
  { icon: Clock, label: "Latency", value: "<5ms" },
  { icon: Upload, label: "Upload", value: "Symmetric" },
  { icon: Shield, label: "Reliability", value: "99.9% uptime" },
]

export default function WhyFiberSection() {
  const { ref, isVisible } = useIntersectionObserver()

  return (
    <section className="w-full py-16 md:py-24 bg-treatment-rhythm">
      <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={cn(
            "text-center mb-12 transition-all duration-700",
            "opacity-100 translate-y-0"
          )}
        >
          <h2 className="heading-section text-foreground mb-3">
            Why Fiber Beats Everything Else
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Not all internet is created equal. See how fiber compares to cable and DSL.
          </p>
        </div>

        {/* Comparison Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {comparisons.map((item, i) => (
            <div
              key={item.type}
              className={cn(
                "rounded-xl p-6 bg-card transition-all duration-700",
                item.cardClass,
                "opacity-100 translate-y-0"
              )}
              style={{ transitionDelay: isVisible ? `${i * 150}ms` : "0ms" }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className={cn(
                    "flex items-center justify-center w-10 h-10 rounded-lg",
                    item.type === "Fiber"
                      ? "bg-fiber-blue/10 text-fiber-blue"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  <item.icon className="size-5" />
                </div>
                <h3 className="text-xl font-bold text-foreground">
                  {item.type}
                </h3>
                {item.type === "Fiber" && (
                  <span className="ml-auto text-xs font-semibold bg-fiber-yellow/10 text-fiber-yellow px-2 py-1 rounded-full">
                    Best
                  </span>
                )}
              </div>

              {/* Speed bar */}
              <div className="mb-4">
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className={cn("h-full rounded-full transition-all duration-1000", item.barColor, isVisible ? item.barWidth : "w-0")}
                  />
                </div>
                <p className="text-sm font-semibold text-foreground mt-2">
                  {item.speed}
                </p>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Latency</span>
                  <span className="font-medium text-foreground">{item.latency}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Upload</span>
                  <span className="font-medium text-foreground">{item.upload}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Reliability</span>
                  <span className={cn("font-medium", item.reliabilityColor)}>
                    {item.reliability}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="text-center p-4 rounded-lg bg-muted/50"
            >
              <stat.icon className="size-5 text-fiber-blue mx-auto mb-2" />
              <div className="text-sm text-muted-foreground">{stat.label}</div>
              <div className="text-lg font-bold text-foreground">{stat.value}</div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/check-availability"
            className="inline-flex items-center gap-2 text-fiber-blue hover:text-fiber-blue transition-colors font-semibold"
          >
            Find my best offer &rarr;
          </Link>
        </div>
      </div>
    </section>
  )
}
