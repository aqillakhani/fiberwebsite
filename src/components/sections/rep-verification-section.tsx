"use client"

import Link from "next/link"
import { ShieldCheck, UserCheck, MapPin } from "lucide-react"
import { TEAM_MEMBERS } from "@/lib/constants"
import { cn } from "@/lib/utils"
import { useIntersectionObserver } from "@/hooks/use-intersection-observer"

const trustPoints = [
  {
    icon: ShieldCheck,
    title: "Verified Identity",
    description: "Every rep carries a verified company ID and badge number.",
  },
  {
    icon: UserCheck,
    title: "Background Checked",
    description: "All representatives pass comprehensive background screening.",
  },
  {
    icon: MapPin,
    title: "Local to Your Area",
    description: "Our reps live and work in the communities they serve.",
  },
]

export default function RepVerificationSection() {
  const { ref, isVisible } = useIntersectionObserver()
  const displayReps = TEAM_MEMBERS.slice(0, 3)

  return (
    <section className="w-full py-20 md:py-28 bg-white dark:bg-background white-section">
      <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={cn(
            "text-center mb-12 transition-all duration-700",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          )}
        >
          <h2 className="heading-section text-foreground mb-3">
            Your Rep Is a Real Person
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We believe in transparency. Every FiberFastUSA representative is verified, vetted, and local.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Trust points */}
          <div className="space-y-6">
            {trustPoints.map((point, i) => (
              <div
                key={point.title}
                className={cn(
                  "flex gap-4 transition-all duration-700",
                  isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-6"
                )}
                style={{ transitionDelay: isVisible ? `${(i + 1) * 150}ms` : "0ms" }}
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-fiber-accent/10 flex items-center justify-center">
                  <point.icon className="size-5 text-fiber-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">
                    {point.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {point.description}
                  </p>
                </div>
              </div>
            ))}

            <div className="pt-2">
              <Link
                href="/verify-rep"
                className="inline-flex items-center gap-2 text-fiber-blue hover:text-fiber-teal transition-colors font-semibold text-sm"
              >
                Verify Your Rep &rarr;
              </Link>
            </div>
          </div>

          {/* Mini rep cards */}
          <div className="space-y-3">
            {displayReps.map((rep, i) => (
              <Link
                key={rep.id}
                href={`/rep/${rep.slug}`}
                className={cn(
                  "flex items-center gap-4 p-4 rounded-xl border border-border bg-card hover:border-fiber-accent/30 transition-all duration-700",
                  isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-6"
                )}
                style={{ transitionDelay: isVisible ? `${(i + 1) * 150}ms` : "0ms" }}
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-fiber-accent/10 flex items-center justify-center text-fiber-accent font-bold text-sm">
                  {rep.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-foreground text-sm">
                    {rep.name}
                  </div>
                  <div className="text-xs text-muted-foreground truncate">
                    {rep.role}
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-fiber-success rounded-full" />
                  <span className="text-xs text-fiber-success font-medium">Verified</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
