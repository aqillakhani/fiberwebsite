"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useIntersectionObserver } from "@/hooks/use-intersection-observer"

type InlineCTAProps = {
  heading?: string
  ctaText?: string
  href?: string
}

export default function InlineCTA({
  heading = "Ready to make the switch?",
  ctaText = "Check Your Address",
  href = "/check-availability",
}: InlineCTAProps) {
  const { ref, isVisible } = useIntersectionObserver()

  return (
    <section className="w-full py-12 md:py-16 bg-treatment-momentum">
      <div
        ref={ref}
        className={cn(
          "max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center transition-all duration-500",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        )}
      >
        <h3 className="heading-subsection text-foreground mb-4">
          {heading}
        </h3>
        <Link href={href}>
          <Button
            size="lg"
            className="bg-fiber-blue hover:bg-fiber-blue/90 text-white min-h-[52px] px-8 gap-2 font-semibold shadow-lg shadow-fiber-blue/30"
          >
            {ctaText}
            <ArrowRight className="w-5 h-5" />
          </Button>
        </Link>
      </div>
    </section>
  )
}
