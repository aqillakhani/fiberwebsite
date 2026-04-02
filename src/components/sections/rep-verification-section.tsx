"use client"

import Link from "next/link"
import { ShieldCheck, UserCheck, MapPin, BadgeCheck, Clock, FileCheck } from "lucide-react"
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

const verificationSteps = [
  {
    icon: BadgeCheck,
    label: "Company-issued ID verified",
  },
  {
    icon: FileCheck,
    label: "Background screening passed",
  },
  {
    icon: Clock,
    label: "Active & in good standing",
  },
]

export default function RepVerificationSection() {
  const { ref, isVisible } = useIntersectionObserver()

  return (
    <section className="w-full py-20 md:py-28 bg-treatment-trust">
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
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-fiber-teal/10 flex items-center justify-center">
                  <point.icon className="size-5 text-fiber-teal" />
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
                className="inline-flex items-center gap-2 text-fiber-blue hover:text-fiber-blue transition-colors font-semibold text-sm"
              >
                Verify Your Rep &rarr;
              </Link>
            </div>
          </div>

          {/* Verification checklist (replaces mini rep cards) */}
          <div
            className={cn(
              "rounded-xl border border-border bg-card p-6 transition-all duration-700",
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-6"
            )}
            style={{ transitionDelay: isVisible ? "150ms" : "0ms" }}
          >
            <h3 className="font-semibold text-foreground mb-4">
              Every Rep Goes Through
            </h3>
            <div className="space-y-4">
              {verificationSteps.map((step, i) => (
                <div
                  key={step.label}
                  className={cn(
                    "flex items-center gap-3 transition-all duration-700",
                    isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
                  )}
                  style={{ transitionDelay: isVisible ? `${(i + 2) * 150}ms` : "0ms" }}
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-fiber-success/10 flex items-center justify-center">
                    <step.icon className="size-4 text-fiber-success" />
                  </div>
                  <span className="text-sm text-foreground font-medium">{step.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
